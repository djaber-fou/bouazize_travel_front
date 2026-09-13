<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-12 max-w-md w-full text-center">

      <!-- Loading State -->
      <div v-if="state === 'loading'" class="space-y-5">
        <div class="w-20 h-20 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-primary animate-spin" />
        </div>
        <div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">Verification du paiement...</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Nous confirmons votre transaction aupres de la passerelle SATIM.<br>
            Veuillez patienter quelques secondes.
          </p>
        </div>
        <div class="flex items-center justify-center gap-1.5">
          <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full bg-primary animate-bounce" :style="`animation-delay: ${(i-1)*0.15}s`"></div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="state === 'success'" class="space-y-5">
        <div class="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/30">
          <Icon name="heroicons:check-badge" class="w-11 h-11 text-emerald-500" />
        </div>
        <div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">Paiement Confirme !</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Votre paiement a ete valide avec succes par SATIM.<br>
            Redirection vers votre reservation...
          </p>
        </div>
        <div v-if="receiptNumber" class="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 text-xs font-mono text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          N Approbation: <strong>{{ receiptNumber }}</strong>
        </div>
      </div>

      <!-- Failed State -->
      <div v-else-if="state === 'failed'" class="space-y-5">
        <div class="w-20 h-20 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center ring-8 ring-rose-50 dark:ring-rose-900/30">
          <Icon name="heroicons:x-circle" class="w-11 h-11 text-rose-500" />
        </div>
        <div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">Paiement Refuse</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {{ failedMessage || "Votre paiement n a pas pu etre traite. Veuillez verifier les informations de votre carte et reessayer." }}
          </p>
        </div>
        <button type="button" @click="goBack" class="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm shadow-lg shadow-primary/20 transition-all">
          Reessayer le paiement
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="state === 'error'" class="space-y-5">
        <div class="w-20 h-20 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center ring-8 ring-amber-50 dark:ring-amber-900/30">
          <Icon name="heroicons:exclamation-triangle" class="w-11 h-11 text-amber-500" />
        </div>
        <div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">Erreur de verification</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Une erreur s est produite lors de la verification du statut de votre paiement. Contactez le support si le probleme persiste.
          </p>
        </div>
        <button type="button" @click="goBack" class="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm shadow-lg shadow-primary/20 transition-all">
          Retour
        </button>
      </div>

      <!-- Footer branding -->
      <div class="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5 text-emerald-500" />
        <span>Transaction securisee via SATIM - GIE Monetique Algerie</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { sendApi } from '@/composables/api';

definePageMeta({ layout: 'default' });

useHead({
  title: 'Verification du paiement - Bouazize Travel',
  meta: [{ name: 'robots', content: 'noindex' }]
});

const route = useRoute();
const router = useRouter();

const state = ref('loading');
const receiptNumber = ref('');
const failedMessage = ref('');

const cibId = route.query.cib_id;
const orderType = route.query.order_type;
const orderId = route.query.order_id;
const status = route.query.status;

const goBack = () => {
  if (orderId && orderType) {
    router.push(`/payment/confirm?order_id=${orderId}&type=${orderType}&status=failed`);
  } else {
    router.push('/');
  }
};

const redirectToConfirm = (paymentStatus, extra = '') => {
  const base = `/payment/confirm?order_id=${orderId}&type=${orderType}&cib_id=${cibId}&status=${paymentStatus}`;
  router.replace(base + extra);
};

onMounted(async () => {
  if (status === 'failed') {
    state.value = 'failed';
    failedMessage.value = decodeURIComponent(route.query.msg || '');
    setTimeout(() => redirectToConfirm('failed'), 3000);
    return;
  }

  if (!cibId) {
    state.value = 'error';
    return;
  }

  try {
    const res = await sendApi('/payment/cib/acknowledge', {
      payment_id: Number(cibId)
    }, 'POST');

    const data = res?.data || res;

    if (data?.success) {
      state.value = 'success';
      receiptNumber.value = data.receipt_number || '';
      setTimeout(() => redirectToConfirm('paid'), 2500);
    } else {
      state.value = 'failed';
      failedMessage.value = data?.message || 'Paiement refuse.';
      setTimeout(() => redirectToConfirm('failed', `&msg=${encodeURIComponent(data?.message || '')}`), 4000);
    }
  } catch (err) {
    console.error('SATIM acknowledge error:', err);
    state.value = 'error';
    setTimeout(() => redirectToConfirm('error'), 5000);
  }
});
</script>
