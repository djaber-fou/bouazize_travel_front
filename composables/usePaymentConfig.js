import { ref, computed } from 'vue';
import { sendApi } from '~/composables/api';

const state = ref({
  loaded: false,
  loading: false,
  online_enabled: false,
  mode: 'sandbox',
  is_sandbox: true,
  gateway: 'satim',
  session_ttl_minutes: 30,
  allowed_methods: ['ccp', 'baridimob'],
});

let inflight = null;

export function usePaymentConfig() {
  async function loadPaymentConfig(force = false) {
    if (state.value.loaded && !force) return state.value;
    if (inflight && !force) return inflight;

    state.value.loading = true;
    inflight = sendApi('/payment/config', null, 'GET', { silent: true })
      .then((res) => {
        const data = res?.data || res;
        if (data && typeof data.online_enabled === 'boolean') {
          state.value = {
            loaded: true,
            loading: false,
            online_enabled: Boolean(data.online_enabled),
            mode: data.mode || 'sandbox',
            is_sandbox: data.is_sandbox !== false,
            gateway: data.gateway || 'satim',
            session_ttl_minutes: Number(data.session_ttl_minutes || 30),
            allowed_methods: Array.isArray(data.allowed_methods) ? data.allowed_methods : ['ccp', 'baridimob'],
          };
        } else {
          state.value.loaded = true;
          state.value.loading = false;
        }
        return state.value;
      })
      .catch(() => {
        // Fail closed: keep online payment hidden when config cannot be fetched
        state.value.online_enabled = false;
        state.value.loaded = true;
        state.value.loading = false;
        return state.value;
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  }

  const onlinePaymentEnabled = computed(() => Boolean(state.value.online_enabled));
  const isSandboxMode = computed(() => Boolean(state.value.is_sandbox));
  const paymentMode = computed(() => state.value.mode || 'sandbox');

  return {
    paymentConfig: state,
    onlinePaymentEnabled,
    isSandboxMode,
    paymentMode,
    loadPaymentConfig,
  };
}
