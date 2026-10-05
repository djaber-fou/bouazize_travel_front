<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
    :ui="{ content: 'sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-slate-100 p-0 rounded-2xl' }"
  >
    <template #content="{ close }">
      <div v-if="order" class="p-3 sm:p-5 md:p-6 space-y-4 text-slate-900">
      
      <!-- Top Action Bar (Hidden during print) -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-emerald-600" />
          <div>
            <h3 class="text-base font-bold text-slate-900 leading-tight">Bon de Réservation Officiel (Voucher)</h3>
            <p class="text-xs text-slate-500 font-mono">Dossier #{{ order.id }} · {{ supplierReference }}</p>
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

      <!-- Printable Voucher Core Document (A4 format matching official myGO voucher) -->
      <div
        id="official-hotel-voucher-printable"
        ref="voucherCardRef"
        class="bg-white p-6 sm:p-8 md:p-10 border border-slate-200 rounded-xl shadow-sm text-slate-800 font-sans space-y-5"
        style="max-width: 820px; margin: 0 auto;"
      >
        
        <!-- ─── TOP SECTION: myGO Group Logo & SUPPLIER REFERENCE ──────────── -->
        <div class="flex justify-between items-start border-b border-slate-200 pb-3">
          <!-- Left: Official myGO Group Logo -->
          <div>
            <img
              src="/images/logo/mygo-logo.png"
              alt="myGO Group"
              class="h-10 sm:h-12 w-auto object-contain select-none"
            />
            <p class="text-[11px] text-slate-600 mt-1 font-medium">Please present this voucher upon arrival</p>
          </div>

          <!-- Right: Supplier Reference & Hotel QR Code Check -->
          <div class="text-right flex flex-col items-end">
            <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              ▼ FOR HOTEL: RESERVATION CODE AND QR CODE CHECK
            </span>
            <div class="flex items-center gap-3 mt-1">
              <div class="text-right">
                <span class="text-[10px] text-slate-500 uppercase font-bold block">SUPPLIER REFERENCE</span>
                <span class="text-lg sm:text-xl font-black text-[#15803d] tracking-wide font-mono">
                  {{ supplierReference }}
                </span>
                <p class="text-[10px] text-slate-400 mt-0.5">Hotel confirmation number: -</p>
              </div>

              <!-- Top Right Hotel Verification QR (Instant client-side generated) -->
              <div class="w-14 h-14 bg-white p-0.5 border border-slate-300 rounded shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  v-if="hotelCheckQrDataUrl"
                  :src="hotelCheckQrDataUrl"
                  alt="QR Hotel"
                  class="w-full h-full object-contain"
                />
                <img
                  v-else
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(qrCodePayload)}`"
                  alt="QR Hotel"
                  class="w-full h-full object-contain"
                  crossorigin="anonymous"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ─── SUBHEADER: Customer Reference & Bouazize Travel Info ────────── -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-2 border-b border-slate-200 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">CUSTOMER'S REFERENCE</span>
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-black text-slate-900 font-mono">{{ customerReference }}</span>
              <span class="text-[11px] text-slate-500">creation date: {{ formatFullDateTime(order.created_at) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-left sm:text-right">
              <p class="font-black text-slate-900 tracking-wide">BOUAZIZE TRAVEL</p>
              <p class="text-[11px] text-slate-600 font-semibold">Telephone: 0770202084</p>
            </div>
            <!-- Agency Round Gold Logo -->
            <img
              src="/images/logo/bouazize-logo.png"
              alt="Bouazize Travel"
              class="w-11 h-11 object-contain rounded-full shadow-2xs"
            />
          </div>
        </div>

        <!-- ─── RESERVATION DATA (FOR CLIENT) ──────────────────────────────── -->
        <div class="space-y-3">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            ▼ FOR CLIENT: RESERVATION DATA
          </div>

          <div class="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <!-- Hotel Name & Address -->
            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Hotel name</span>
              <p class="font-black text-slate-900 text-sm tracking-tight">{{ order.hotel_name }}</p>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Address</span>
                <p class="font-semibold text-slate-700">{{ order.hotel_address || (order.hotel_city + ', ' + (order.destination_name || 'Algérie')) }}</p>
              </div>
              <!-- Small Map QR -->
              <div class="text-center pl-2 shrink-0">
                <span class="text-[9px] text-slate-400 block font-medium">Get the Hotel Map</span>
                <img
                  v-if="hotelMapQrDataUrl"
                  :src="hotelMapQrDataUrl"
                  alt="Hotel Map QR"
                  class="w-10 h-10 mx-auto mt-0.5 border border-slate-200 rounded bg-white p-0.5"
                />
                <img
                  v-else
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(order.hotel_name + ' ' + order.hotel_city))}`"
                  alt="Hotel Map QR"
                  class="w-10 h-10 mx-auto mt-0.5 border border-slate-200 rounded bg-white p-0.5"
                  crossorigin="anonymous"
                />
              </div>
            </div>

            <!-- Telephone & City -->
            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Telephone</span>
              <p class="font-semibold text-slate-700">{{ order.hotel_phone || '+213 (0) 770 20 20 84' }}</p>
            </div>
            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">City</span>
              <p class="font-bold text-slate-900 uppercase">{{ order.hotel_city }} - {{ order.destination_name || 'DESTINATION' }}</p>
            </div>

            <!-- Dates -->
            <div class="pt-2 border-t border-slate-200/80">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Arrival</span>
              <p class="font-black text-slate-900 text-xs">
                {{ formatSlashDate(order.check_in) }} <span class="text-slate-500 font-normal">[ Nights: {{ order.nights || 1 }} ]</span>
              </p>
            </div>
            <div class="pt-2 border-t border-slate-200/80">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Departure</span>
              <p class="font-black text-slate-900 text-xs">{{ formatSlashDate(order.check_out) }}</p>
            </div>

            <!-- Treatment & Breakfast -->
            <div class="pt-2 border-t border-slate-200/80">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Room Category</span>
              <p class="font-bold text-slate-900 uppercase">{{ order.room_basis_name || order.room_code || 'SINGLE STANDARD ROOM' }}</p>
            </div>
            <div class="pt-2 border-t border-slate-200/80">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Treatment</span>
              <p class="font-bold text-slate-900">{{ order.meal_basis_name || 'Hébergement et Petit Déjeuner' }}</p>
            </div>

            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Room type</span>
              <p class="font-semibold text-slate-800 uppercase">{{ order.room_type || 'SINGLE' }}</p>
            </div>
            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Breakfast Type</span>
              <p class="font-semibold text-slate-800">{{ order.breakfast_type || 'Continental' }}</p>
            </div>

            <!-- Passenger list -->
            <div class="md:col-span-2 pt-2 border-t border-slate-200/80">
              <span class="text-slate-400 text-[10px] uppercase font-bold block">Passenger</span>
              <p class="font-bold text-slate-900 text-xs mt-0.5">
                {{ passengersString }}
              </p>
            </div>
          </div>
        </div>

        <!-- ─── EMERGENCY NUMBER BOX (Exact Red Layout from myGO Voucher) ─────── -->
        <div class="border-2 border-rose-600 rounded-lg p-3 sm:p-4 bg-rose-50/40 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
          <!-- Big Phone Callout -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <UIcon name="i-heroicons-phone-arrow-up-right" class="w-6 h-6" />
            </div>
            <div>
              <span class="text-[10px] uppercase font-black tracking-wider text-rose-700 block">EMERGENCY NUMBER</span>
              <span class="text-xl sm:text-2xl font-black text-rose-800 tracking-tight font-mono">
                +213 699 00 47 63
              </span>
            </div>
          </div>

          <!-- Disclaimer Text -->
          <div class="text-[11px] text-slate-700 leading-snug border-l-0 sm:border-l sm:border-rose-200 sm:pl-4 space-y-1">
            <p class="font-semibold">
              In case of Emergency, or if you have problem at the hotel/transfer/activity, please call us.
            </p>
            <p class="text-rose-900 font-bold">
              Please take note we will NOT CONSIDER any complain/refund if you do not call the number above in case of problems with our services.
            </p>
          </div>
        </div>

        <!-- ─── REMARKS AND NOTES ─────────────────────────────────────────── -->
        <div class="space-y-2 text-xs">
          <div class="bg-slate-200/80 px-3 py-1 font-bold text-slate-700 text-[11px] uppercase tracking-wider rounded">
            Remarks and notes
          </div>
          <div class="p-3 text-[11px] text-slate-600 space-y-1.5 leading-relaxed bg-slate-50/50 rounded border border-slate-200">
            <p>
              <strong class="text-slate-800">SPECIAL INSTRUCTIONS:</strong> All special requests are subject to availability, please contact our Operations Department for confirmation.
            </p>
            <p>
              <strong class="text-slate-800">ADDITIONAL INFO:</strong> Car park YES (without additional debit notes). Electric vehicle charging station. Key Collection at reception. Check-in hour 14:00 - 00:00, Check-out hour 04:00 - 11:00. Valid identification card/passport required at arrival.
            </p>
            <p class="font-semibold text-slate-700">
              {{ order.room_basis_name || 'SINGLE STANDARD ROOM' }}
            </p>
            <p v-if="order.admin_notes" class="text-slate-500 italic">
              {{ order.admin_notes }}
            </p>
          </div>
        </div>

        <!-- ─── EXTRAS & CITY TAX WARNING ──────────────────────────────────── -->
        <div class="text-[11px] text-slate-600 space-y-1 pt-1">
          <p>All extras should be paid directly by the clients at hotel check-out.</p>
          <p class="font-black text-slate-900 tracking-wide">
            PLEASE NOTE THIS CITY HAS A CITY TAX TO BE PAID ON SPOT.
          </p>
        </div>

        <!-- ─── BOTTOM VOUCHER BAR & OFFICIAL CACHET + SIGNATURE ────────────── -->
        <div class="flex flex-col sm:flex-row justify-between items-end gap-4 pt-4 border-t border-slate-300">
          <!-- Left: Voucher Title & Date -->
          <div>
            <p class="text-xs text-slate-500 font-medium">{{ currentFormattedDate }}</p>
            <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-widest uppercase">
              VOUCHER
            </h1>
          </div>

          <!-- Right: Authorized Stamp & Signature -->
          <div class="text-center sm:text-right flex flex-col items-center sm:items-end">
            <span class="text-[11px] text-slate-500 font-medium block mb-1">Authorized stamp and signature</span>
            <!-- Official Stamp + Signature extracted with 100% clean transparent background -->
            <div class="relative inline-block">
              <img
                src="/images/cachet-bouazize.png"
                alt="Cachet Officiel & Signature Bouazize Travel"
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
import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'

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

const voucherCardRef = ref(null)
const downloadingPdf = ref(false)

const hotelCheckQrDataUrl = ref('')
const hotelMapQrDataUrl = ref('')

const supplierReference = computed(() => {
  if (!props.order) return '8048573819/17740164'
  return props.order.ns_booking_reference || `8048573819/${props.order.id}`
})

const customerReference = computed(() => {
  if (!props.order) return 'B0626SHHBP'
  if (props.order.customer_reference) return props.order.customer_reference
  const code = String(props.order.id).padStart(5, '0')
  return `B0626${code}`
})

const passengersString = computed(() => {
  if (!props.order) return 'MR Client Bouazize Travel *'
  if (props.order.pax_details && props.order.pax_details.length > 0) {
    return props.order.pax_details
      .map(p => `${p.title || 'MR'} ${p.name || ''} ${p.surname || ''}`.trim())
      .filter(Boolean)
      .join(', ') + ' *'
  }
  const u = props.user || props.order.user
  return u?.name ? `MR ${u.name} *` : 'MR Client Bouazize Travel *'
})

const currentFormattedDate = computed(() => {
  const d = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${days[d.getDay()]}`
})

// Scannable QR Payload
const qrCodePayload = computed(() => {
  if (!props.order) return 'https://bouazizetravel.com'
  const refCode = supplierReference.value
  return `https://bouazizetravel.com/verify?ref=${encodeURIComponent(refCode)}&hotel=${encodeURIComponent(props.order.hotel_name || '')}&checkin=${props.order.check_in || ''}`
})

// Generate crisp instant QR Codes locally via QRCode
watch(() => [props.order, isOpen.value], async () => {
  if (!props.order || !isOpen.value) return
  try {
    hotelCheckQrDataUrl.value = await QRCode.toDataURL(qrCodePayload.value, {
      width: 140,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })

    const mapSearchQuery = encodeURIComponent(`${props.order.hotel_name || ''} ${props.order.hotel_city || ''}`.trim())
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`
    hotelMapQrDataUrl.value = await QRCode.toDataURL(mapUrl, {
      width: 100,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
  } catch (err) {
    console.error('Failed to generate local QR codes:', err)
  }
}, { immediate: true })

function formatSlashDate(val) {
  if (!val) return '—'
  const d = new Date(val)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}

function formatFullDateTime(val) {
  if (!val) return '2026-06-21 14:27:10'
  const d = new Date(val)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

function triggerPrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

async function downloadPdf() {
  if (!voucherCardRef.value || typeof window === 'undefined') return
  downloadingPdf.value = true

  try {
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(voucherCardRef.value, {
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
    const refCode = props.order?.ns_booking_reference || ('BZZ-' + props.order?.id)
    pdf.save(`VOUCHER_${refCode}.pdf`)
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
  #official-hotel-voucher-printable, #official-hotel-voucher-printable * {
    visibility: visible;
  }
  #official-hotel-voucher-printable {
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
