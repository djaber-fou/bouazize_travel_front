<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
    :ui="{ content: 'sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-slate-100 p-0 rounded-2xl' }"
  >
    <template #content="{ close }">
      <div v-if="order" class="p-3 sm:p-5 md:p-6 space-y-4 text-slate-900">
      
      <!-- Top Action Bar (Hidden during print) -->
      <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div class="flex items-center gap-2.5">
          <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary" />
          <div>
            <h3 class="text-base font-bold text-slate-900 leading-tight">Relevé de Compte Hôtelier Officiel</h3>
            <p class="text-xs text-slate-500 font-mono">Dossier #{{ order.id }} · REL-HTL-{{ String(order.id).padStart(5, '0') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-heroicons-arrow-down-tray"
            variant="outline"
            color="gray"
            size="sm"
            :loading="downloadingPdf"
            @click="downloadPdf"
          >
            Télécharger PDF
          </UButton>
          <UButton
            icon="i-heroicons-printer"
            color="primary"
            size="sm"
            @click="triggerPrint"
          >
            Imprimer
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

      <!-- Printable Document (A4 format: Relevé de compte) -->
      <div
        id="official-hotel-invoice-printable"
        ref="invoiceCardRef"
        class="bg-white p-6 sm:p-8 md:p-10 border border-slate-200 rounded-xl shadow-sm text-slate-800 font-sans space-y-6"
        style="max-width: 820px; margin: 0 auto;"
      >
        
        <!-- Header: Agency Information & Fiscal IDs with Official Logo -->
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-primary/20 pb-5">
          <div class="flex items-start gap-4">
            <!-- Circular Agency Golden Logo -->
            <img
              src="/images/logo/bouazize-logo.png"
              alt="Bouazize Travel"
              class="w-16 h-16 object-contain rounded-full shadow-xs shrink-0"
            />
            <div>
              <h2 class="text-2xl font-black text-primary tracking-wide">BOUAZIZE TRAVEL</h2>
              <p class="text-xs text-slate-700 font-bold">Agence de Tourisme et de Voyages · N° d'Agrément 4484</p>
              <p class="text-xs text-slate-500 mt-1">Cité Elhidhab 35 Logts Dradra, Bt N°1 Local N°9, Sétif, Algérie</p>
              <p class="text-[11px] text-slate-500">Tél : +213 (0) 770 20 20 84 / +213 (0) 699 00 47 63</p>
              <p class="text-[11px] text-slate-500">Email : contact@bouazizetravel.com · Web : bouazize-travel.com</p>
              
              <div class="mt-1.5 text-[10px] text-slate-500 font-mono space-y-0.5">
                <span>RC N° : 19/00-5345775 A 23 · Agrément : 4484</span>
              </div>
            </div>
          </div>

          <div class="text-left sm:text-right flex flex-col items-start sm:items-end">
            <span
              class="px-3 py-1 rounded text-xs font-black uppercase tracking-wider border"
              :class="isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
            >
              {{ isPaid ? 'RELEVÉ DE COMPTE ACQUITTÉ' : 'RELEVÉ DE COMPTE PROFORMA' }}
            </span>
            <p class="text-sm font-mono font-black text-slate-900 mt-2">
              RELEVÉ N° REL-HTL-{{ String(order.id).padStart(5, '0') }}-{{ new Date().getFullYear() }}
            </p>
            <p class="text-xs text-slate-500 mt-0.5">
              Date d'émission : {{ formatDate(order.created_at || new Date()) }}
            </p>
            <p class="text-xs font-mono text-primary font-bold mt-0.5">
              Dossier Fournisseur : {{ order.ns_booking_reference || ('BZZ-' + order.id) }}
            </p>
          </div>
        </div>

        <!-- Client / B2B Agency Information -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Délivré à (Client / Bénéficiaire)</span>
            <h4 class="text-sm font-bold text-slate-900 mt-0.5">{{ clientName }}</h4>
            <p v-if="clientEmail" class="text-slate-600 mt-0.5">Email : {{ clientEmail }}</p>
            <p v-if="clientPhone" class="text-slate-600 mt-0.5">Tél : {{ clientPhone }}</p>
            <p v-if="clientRole === 'client_b2b' || clientRole === 'business'" class="text-primary font-bold mt-1">
              Partenaire B2B Agréé
            </p>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Modalités de Paiement</span>
            <p class="text-slate-700 font-semibold mt-0.5">
              Mode de règlement : 
              <span class="text-slate-900 font-bold uppercase">{{ formatPaymentMethod(order.payment_method) }}</span>
            </p>
            <p class="text-slate-600 mt-0.5">
              Statut du dossier : 
              <span class="font-bold" :class="isPaid ? 'text-emerald-700' : 'text-amber-600'">
                {{ isPaid ? 'Réglé intégralement' : 'En attente de paiement' }}
              </span>
            </p>
            <p v-if="order.booked_at" class="text-[11px] text-slate-500 mt-0.5 font-mono">
              Date de confirmation : {{ formatDate(order.booked_at) }}
            </p>
          </div>
        </div>

        <!-- Statement Items Table -->
        <div class="relative overflow-x-auto border border-slate-200 rounded-xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th scope="col" class="px-4 py-3">Désignation de la Prestation Hôtelière</th>
                <th scope="col" class="px-4 py-3 text-center">Période &amp; Nuits</th>
                <th scope="col" class="px-4 py-3 text-center">Occupants</th>
                <th scope="col" class="px-4 py-3 text-right">Prix Unitaire (DZD)</th>
                <th scope="col" class="px-4 py-3 text-right">Total Net (DZD)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr>
                <td class="px-4 py-3.5">
                  <div class="font-bold text-slate-900 text-sm">{{ order.hotel_name }}</div>
                  <div class="text-slate-500 mt-0.5">{{ order.hotel_city }} · {{ order.hotel_category || 3 }}★</div>
                  <div class="text-slate-600 font-medium text-[11px] mt-1">
                    Chambre : <strong>{{ order.room_basis_name || order.room_code || 'Chambre Standard' }}</strong>
                  </div>
                  <div class="text-slate-500 text-[11px]">
                    Régime : <strong>{{ order.meal_basis_name || 'Hébergement seul' }}</strong>
                  </div>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <div class="font-semibold">{{ formatDateShort(order.check_in) }} → {{ formatDateShort(order.check_out) }}</div>
                  <div class="text-slate-400 mt-0.5">{{ order.nights }} nuit(s)</div>
                </td>
                <td class="px-4 py-3.5 text-center font-semibold">
                  {{ order.adults }} Adulte(s)
                  <span v-if="order.children"> + {{ order.children }} Enfant(s)</span>
                </td>
                <td class="px-4 py-3.5 text-right font-mono font-semibold">
                  {{ formatPrice(order.final_price_dzd) }}
                </td>
                <td class="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                  {{ formatPrice(order.final_price_dzd) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals & Legal Notes -->
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs pt-1">
          <div class="text-slate-400 text-[11px] space-y-1 max-w-sm">
            <p>• Prestations touristiques et hôtelières gérées conformément à la réglementation des agences de tourisme et de voyages en Algérie.</p>
            <p>• Tout litige relève de la compétence exclusive du tribunal de commerce de Sétif.</p>
          </div>

          <div class="w-full sm:w-72 space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div class="flex justify-between text-slate-600">
              <span>Montant des prestations :</span>
              <span class="font-mono font-semibold">{{ formatPrice(order.final_price_dzd) }} DZD</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>TVA (0% Franchise fiscale) :</span>
              <span class="font-mono font-semibold">0,00 DZD</span>
            </div>
            <div class="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-primary">
              <span>Total Relevé de Compte :</span>
              <span>{{ formatPrice(order.final_price_dzd) }} DZD</span>
            </div>
          </div>
        </div>

        <!-- Legal Statement & Official Cachet / Signature -->
        <div class="flex flex-col sm:flex-row justify-between items-end gap-4 pt-5 border-t border-slate-200 text-xs">
          <div class="text-[11px] text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">
              Arrêté le présent relevé de compte à la somme de :
            </p>
            <p class="font-black text-slate-900 uppercase tracking-wide text-xs">
              {{ formatPrice(order.final_price_dzd) }} Dinars Algériens
            </p>
            <p class="text-[10px] text-slate-400 mt-2">
              Délivré pour servir et valoir ce que de droit.
            </p>
          </div>

          <!-- Official Stamp & Signature Area -->
          <div class="text-center sm:text-right flex flex-col items-center sm:items-end">
            <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Cachet &amp; Signature de l'Agence
            </span>
            <div class="relative">
              <img
                src="/images/cachet-bouazize.png"
                alt="Cachet Officiel Bouazize Travel"
                class="h-28 sm:h-32 w-auto object-contain select-none pointer-events-none drop-shadow-xs"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  open:       { type: Boolean, default: false },
  order:      { type: Object, default: null },
  user:       { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'update:open'])

const isOpen = computed({
  get: () => props.modelValue || props.open,
  set: (val) => {
    emit('update:modelValue', val)
    emit('update:open', val)
  },
})

const invoiceCardRef = ref(null)
const downloadingPdf = ref(false)

const isPaid = computed(() => {
  if (!props.order) return false
  return props.order.payment_status === 'paid' || props.order.payment_status === 'confirmed'
})

const clientName = computed(() => {
  return props.user?.name || props.order?.user?.name || 'Client Particulier'
})

const clientEmail = computed(() => {
  return props.user?.email || props.order?.user?.email || ''
})

const clientPhone = computed(() => {
  return props.user?.phone || props.order?.user?.phone || ''
})

const clientRole = computed(() => {
  return props.user?.role || props.order?.user?.role || ''
})

function formatPaymentMethod(method) {
  const map = {
    cib: 'Carte CIB / Edahabia (SATIM)',
    edahabia: 'Carte Edahabia (Algérie Poste)',
    ccp: 'Virement CCP / BaridiMob',
    account_balance: 'Compte Portefeuille Agence (B2B Wallet)',
    credit: 'Compte Portefeuille Agence (B2B Wallet)',
  }
  return map[method] || method || 'Paiement Sécurisé'
}

function formatPrice(val) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(val ?? 0))
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateShort(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function triggerPrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

async function downloadPdf() {
  if (!invoiceCardRef.value || typeof window === 'undefined') return
  downloadingPdf.value = true

  try {
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(invoiceCardRef.value, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`RELEVE_DE_COMPTE_HTL_${props.order?.id}.pdf`)
  } catch (err) {
    console.error('Failed to generate PDF:', err)
    triggerPrint()
  } finally {
    downloadingPdf.value = false
  }
}
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #official-hotel-invoice-printable, #official-hotel-invoice-printable * {
    visibility: visible;
  }
  #official-hotel-invoice-printable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
  }
}
</style>
