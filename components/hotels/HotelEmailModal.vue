<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
    :ui="{ content: 'sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-slate-100 p-0 rounded-2xl' }"
  >
    <template #content="{ close }">
      <div v-if="order" class="p-3 sm:p-5 md:p-6 space-y-4 text-slate-900">
        
        <!-- Header Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
          <div class="flex items-center gap-2.5">
            <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-primary" />
            <div>
              <h3 class="text-base font-bold text-slate-900 leading-tight">Email Officiel de Confirmation</h3>
              <p class="text-xs text-slate-500 font-mono">Dossier #{{ order.id }} · Modèle Email MyGO / Bouazize</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-arrow-top-right-on-square"
              variant="outline"
              color="gray"
              size="sm"
              @click="openInNewTab"
            >
              Nouvel Onglet
            </UButton>
            <UButton
              icon="i-heroicons-printer"
              color="primary"
              size="sm"
              @click="triggerPrint"
            >
              Imprimer Email
            </UButton>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="gray"
              size="sm"
              @click="isOpen = false"
            />
          </div>
        </div>

        <!-- Email Body Preview Container -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div v-if="loadingEmail" class="p-12 text-center text-slate-400">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
            <p class="text-xs font-semibold">Chargement du modèle d'email officiel...</p>
          </div>

          <div
            v-else
            id="official-hotel-email-printable"
            ref="emailContainerRef"
            class="p-4 sm:p-6"
            v-html="emailHtml"
          />
        </div>

      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  open:       { type: Boolean, default: false },
  order:      { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'update:open'])

const isOpen = computed({
  get: () => props.modelValue || props.open,
  set: (val) => {
    emit('update:modelValue', val)
    emit('update:open', val)
  },
})

const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://127.0.0.1:8000/api'
const emailHtml = ref('')
const loadingEmail = ref(false)
const emailContainerRef = ref(null)

watch(() => [isOpen.value, props.order?.id], async ([openVal, orderId]) => {
  if (openVal && orderId) {
    await fetchEmailPreview(orderId)
  }
})

async function fetchEmailPreview(orderId) {
  loadingEmail.value = true
  try {
    const res = await $fetch(`${apiBase}/hotels/orders/${orderId}/email-preview`, {
      headers: {
        Accept: 'text/html, application/json'
      }
    })
    emailHtml.value = typeof res === 'string' ? res : (res?.data || '')
  } catch (err) {
    console.error('Failed to load email preview:', err)
    emailHtml.value = '<div class="p-8 text-center text-rose-600 font-bold">Impossible de charger l\'aperçu de l\'email.</div>'
  } finally {
    loadingEmail.value = false
  }
}

function openInNewTab() {
  if (!props.order?.id) return
  window.open(`${apiBase}/hotels/orders/${props.order.id}/email-preview`, '_blank')
}

function triggerPrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #official-hotel-email-printable, #official-hotel-email-printable * {
    visibility: visible;
  }
  #official-hotel-email-printable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    border: none !important;
    background: white !important;
  }
}
</style>
