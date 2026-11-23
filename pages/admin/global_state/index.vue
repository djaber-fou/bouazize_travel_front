<template>
  <div class="w-full space-y-6 pb-10">
    <!-- ─── Header Banner: TroveSeek Production & État Global ─────────────── -->
    <div class="p-5 sm:p-6 bg-[#0C1C39] text-white border border-[#1e3a6d] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src="/images/logo/troveseek-logo-dark.png"
          alt="TroveSeek Production"
          class="h-8 sm:h-9 w-auto object-contain self-start sm:self-center shrink-0"
        />
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-lg sm:text-xl font-black tracking-tight text-white">
              Tableau de Bord TroveSeek Production &amp; État Global
            </h1>
            <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-primary/20 text-primary border border-primary/40">
              Suivi Média &amp; Commissions
            </span>
          </div>
          <p class="text-xs text-slate-300">
            Suivez en temps réel les réservations issues des campagnes digitales TroveSeek, générez vos liens sponsorisés / codes promo et gérez vos commissions (DZD).
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start lg:self-center">
        <UButton
          icon="i-heroicons-arrow-path"
          color="primary"
          size="sm"
          :loading="loadingTs"
          @click="fetchTroveSeekDashboard"
        >
          Actualiser
        </UButton>
      </div>
    </div>

    <!-- ─── 1. KPIs TroveSeek Production ──────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 bg-white dark:bg-[#0C1C39] border border-slate-200 dark:border-[#1e3a6d] space-y-1">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
          <span>Dossiers TroveSeek</span>
          <UIcon name="i-heroicons-megaphone" class="w-5 h-5 text-primary" />
        </div>
        <p class="text-2xl font-black text-slate-900 dark:text-white">
          {{ tsKpis.total_troveseek_orders || 0 }}
        </p>
        <p class="text-[11px] text-slate-400">
          {{ tsKpis.confirmed_troveseek_orders || 0 }} confirmé(s) · {{ tsKpis.pending_troveseek_orders || 0 }} en attente
        </p>
      </div>

      <div class="p-4 bg-white dark:bg-[#0C1C39] border border-emerald-500/40 space-y-1">
        <div class="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">
          <span>Part TroveSeek Confirmée</span>
          <UIcon name="i-heroicons-check-badge" class="w-5 h-5" />
        </div>
        <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {{ formatMoney(tsKpis.confirmed_commission_dzd) }} <span class="text-xs">DZD</span>
        </p>
        <p class="text-[11px] text-slate-400">
          Sur les dossiers validés / payés
        </p>
      </div>

      <div class="p-4 bg-white dark:bg-[#0C1C39] border border-amber-500/40 space-y-1">
        <div class="flex items-center justify-between text-xs text-amber-500 font-bold uppercase">
          <span>Part TroveSeek En Attente</span>
          <UIcon name="i-heroicons-clock" class="w-5 h-5" />
        </div>
        <p class="text-2xl font-black text-amber-500">
          {{ formatMoney(tsKpis.pending_commission_dzd) }} <span class="text-xs">DZD</span>
        </p>
        <p class="text-[11px] text-slate-400">
          Dossiers en cours de confirmation
        </p>
      </div>

      <div class="p-4 bg-white dark:bg-[#0C1C39] border border-primary/40 space-y-1">
        <div class="flex items-center justify-between text-xs text-primary font-bold uppercase">
          <span>Cumul Total TroveSeek</span>
          <UIcon name="i-heroicons-banknotes" class="w-5 h-5" />
        </div>
        <p class="text-2xl font-black text-primary">
          {{ formatMoney(tsKpis.total_commission_dzd) }} <span class="text-xs">DZD</span>
        </p>
        <p class="text-[11px] text-slate-400">
          Hôtels: {{ formatMoney(tsKpis.by_service?.hotel) }} · Omra: {{ formatMoney(tsKpis.by_service?.omra) }} · Voy/Visa: {{ formatMoney((tsKpis.by_service?.voyage_organise || 0) + (tsKpis.by_service?.visa || 0)) }}
        </p>
      </div>
    </div>

    <!-- ─── 2. Générateur de Liens Sponsorisés & Codes Promo TroveSeek ────── -->
    <div class="p-5 bg-white dark:bg-[#0C1C39] border border-slate-200 dark:border-[#1e3a6d] space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-link" class="w-5 h-5 text-primary" />
          <h2 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Générateur de Liens Sponsorisés &amp; Codes Promo TroveSeek
          </h2>
        </div>
        <span class="text-[11px] text-slate-400">
          Utilisez ces liens dans vos publicités Facebook, Instagram, TikTok ou WhatsApp
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            1. Page de destination
          </label>
          <select
            v-model="linkBuilder.path"
            class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-slate-900 dark:text-white"
          >
            <option value="/">Accueil Générale (/)</option>
            <option value="/services/hotels">Réservation d'Hôtels (/services/hotels)</option>
            <option value="/services/omra">Offres Omra (/services/omra)</option>
            <option value="/services/voyage_organise">Voyages Organisés (/services/voyage_organise)</option>
            <option value="/services/visa">Demandes de Visa (/services/visa)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            2. Nom de la Campagne (ts)
          </label>
          <input
            v-model="linkBuilder.campaign"
            type="text"
            placeholder="Ex: fb_omra_novembre"
            class="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            3. Code Promo / Code Média (affiché dans la vidéo/post)
          </label>
          <input
            v-model="linkBuilder.code"
            type="text"
            placeholder="Ex: TS2026 ou TROVESEEK"
            class="w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div class="p-3 bg-slate-50 dark:bg-[#071124] border border-slate-200 dark:border-[#1e3a6d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="min-w-0 flex-1">
          <span class="text-[10px] font-bold uppercase text-slate-400 block">Lien Sponsorisé prêt à partager :</span>
          <code class="text-xs font-mono text-primary break-all">{{ generatedTrackingUrl }}</code>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UButton
            size="xs"
            color="primary"
            icon="i-heroicons-clipboard-document"
            @click="copyText(generatedTrackingUrl, 'Lien sponsorisé copié !')"
          >
            Copier le Lien
          </UButton>
          <UButton
            size="xs"
            variant="soft"
            color="gray"
            icon="i-heroicons-tag"
            @click="copyText((linkBuilder.code || 'TS2026').toUpperCase(), 'Code Promo copié !')"
          >
            Copier Code ({{ (linkBuilder.code || 'TS2026').toUpperCase() }})
          </UButton>
        </div>
      </div>
    </div>

    <!-- ─── 3. Tableau des Réservations & Commissions TroveSeek ───────────── -->
    <div class="bg-white dark:bg-[#0C1C39] border border-slate-200 dark:border-[#1e3a6d] overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-primary" />
            <span>Journal des Réservations &amp; Attribution TroveSeek Production</span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Consultez la preuve d'origine de chaque client et saisissez ou modifiez directement la part TroveSeek (DZD).
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="filterMode = 'all'; fetchTroveSeekDashboard()"
            class="px-3 py-1.5 text-xs font-bold border cursor-pointer transition-colors"
            :class="filterMode === 'all' ? 'bg-primary text-[#0C1C39] border-primary' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'"
          >
            Toutes les réservations
          </button>
          <button
            type="button"
            @click="filterMode = 'troveseek'; fetchTroveSeekDashboard()"
            class="px-3 py-1.5 text-xs font-bold border cursor-pointer transition-colors"
            :class="filterMode === 'troveseek' ? 'bg-primary text-[#0C1C39] border-primary' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'"
          >
            Clients TroveSeek uniquement
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071124] text-slate-500 dark:text-slate-400 uppercase text-[11px]">
              <th class="py-3 px-4">Service &amp; Réf</th>
              <th class="py-3 px-4">Client</th>
              <th class="py-3 px-4">Offre / Hôtel</th>
              <th class="py-3 px-4">Preuve Attribution</th>
              <th class="py-3 px-4">Statut</th>
              <th class="py-3 px-4">Total Commande</th>
              <th class="py-3 px-4">Part TroveSeek (DZD)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="loadingTs && !tsOrders.length">
              <td colspan="7" class="py-10 text-center text-slate-400">
                Chargement des données TroveSeek Production...
              </td>
            </tr>
            <tr v-else-if="!tsOrders.length">
              <td colspan="7" class="py-10 text-center text-slate-400">
                Aucune réservation trouvée pour ce filtre.
              </td>
            </tr>
            <tr
              v-for="item in tsOrders"
              :key="item.uid"
              class="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
            >
              <td class="py-3 px-4 font-mono">
                <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-primary/15 text-primary border border-primary/30 mr-1.5">
                  {{ item.service_label }}
                </span>
                <span class="font-bold text-slate-900 dark:text-white">{{ item.reference }}</span>
              </td>

              <td class="py-3 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ item.client_name }}</div>
                <div class="text-[11px] text-slate-400">{{ item.client_contact || '-' }}</div>
              </td>

              <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate" :title="item.offer_title">
                {{ item.offer_title }}
              </td>

              <td class="py-3 px-4">
                <div v-if="item.attributed_to === 'troveseek'" class="space-y-1">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <UIcon name="i-heroicons-check-badge" class="w-3.5 h-3.5" />
                    <span>TroveSeek Confirmé</span>
                  </span>
                  <div v-if="item.attribution_source" class="text-[11px] text-slate-500 dark:text-slate-300">
                    {{ item.attribution_source }}
                  </div>
                  <div v-if="item.attribution_code" class="text-[11px] font-mono text-primary font-bold">
                    Code: {{ item.attribution_code }}
                  </div>
                  <div v-if="item.attribution_survey" class="text-[11px] text-slate-400">
                    Réponse: {{ item.attribution_proof?.survey_label || item.attribution_survey }}
                  </div>
                </div>
                <div v-else class="text-[11px] text-slate-400">
                  {{ item.attribution_source || 'Direct / Agence' }}
                </div>
              </td>

              <td class="py-3 px-4">
                <span
                  class="px-2 py-0.5 text-[10px] font-bold uppercase"
                  :class="item.is_confirmed
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'"
                >
                  {{ item.is_confirmed ? 'Confirmé' : item.status }}
                </span>
              </td>

              <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                {{ formatMoney(item.total_price_dzd) }} DZD
              </td>

              <td class="py-3 px-4">
                <div class="flex items-center gap-1.5">
                  <input
                    v-model.number="item.troveseek_commission_dzd"
                    type="number"
                    min="0"
                    step="100"
                    class="w-24 px-2 py-1 text-xs font-mono font-bold bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-primary"
                  />
                  <UButton
                    size="xs"
                    color="primary"
                    icon="i-heroicons-check"
                    :loading="savingUid === item.uid"
                    title="Enregistrer la part TroveSeek"
                    @click="saveItemCommission(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── 4. État Global des Transactions par Période ───────────────────── -->
    <div class="p-5 bg-white dark:bg-[#0C1C39] border border-slate-200 dark:border-[#1e3a6d] space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-3">
        <h2 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary" />
          <span>Filtre des Transactions par Période</span>
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold text-xs">De:</span>
            <UPopover>
              <UButton size="xs" class="font-bold" color="primary" variant="subtle" icon="i-lucide-calendar">
                {{ startDate ? df.format(startDate.toDate(getLocalTimeZone())) : 'Sélectionner' }}
              </UButton>
              <template #content>
                <UCalendar v-model="startDate" class="p-2" />
              </template>
            </UPopover>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold text-xs">À:</span>
            <UPopover>
              <UButton size="xs" class="font-bold" color="primary" variant="subtle" icon="i-lucide-calendar">
                {{ endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Sélectionner' }}
              </UButton>
              <template #content>
                <UCalendar v-model="endDate" class="p-2" />
              </template>
            </UPopover>
          </div>
        </div>
      </div>

      <UTable
        sticky
        ref="table"
        :data="data"
        :columns="columns"
        :loading="loading && !data.length"
        :empty="loading ? 'chargement en cours...' : 'Données non trouvées'"
        class="w-full"
      />

      <div v-if="total" class="w-full flex justify-end">
        <div class="flex items-center justify-between gap-6 px-4 h-10 border font-bold border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#071124]">
          <span class="text-xs uppercase text-slate-500">Total Commission Période :</span>
          <span class="text-primary font-black">{{ formatMoney(total) }} DZD</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, watch, onMounted } from 'vue'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { sendApi } from '~/composables/api'

definePageMeta({
  layout: 'admin',
})

const toast = useToast()
const df = new DateFormatter('fr-FR', { dateStyle: 'medium' })

// ─── TroveSeek Dashboard State ─────────────────────────────────────────────
const loadingTs = ref(false)
const savingUid = ref(null)
const filterMode = ref('all')
const tsKpis = ref({})
const tsOrders = ref([])

const linkBuilder = ref({
  path: '/services/omra',
  campaign: 'fb_sponsor',
  code: 'TS2026',
})

const generatedTrackingUrl = computed(() => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bouazize-travel.com'
  const cleanPath = linkBuilder.value.path || '/'
  const params = new URLSearchParams()
  if (linkBuilder.value.campaign?.trim()) {
    params.set('ts', linkBuilder.value.campaign.trim())
  } else {
    params.set('ts', 'troveseek')
  }
  if (linkBuilder.value.code?.trim()) {
    params.set('code', linkBuilder.value.code.trim().toUpperCase())
  }
  return `${origin}${cleanPath}?${params.toString()}`
})

async function copyText(text, msg) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    toast.add({ title: msg, color: 'green' })
  }
}

async function fetchTroveSeekDashboard() {
  loadingTs.value = true
  try {
    const res = await sendApi(`/admin/states/troveseek?filter=${filterMode.value}`, null, 'GET')
    if (res?.data) {
      tsKpis.value = res.data.kpis || {}
      tsOrders.value = res.data.orders || []
    }
  } finally {
    loadingTs.value = false
  }
}

async function saveItemCommission(item) {
  savingUid.value = item.uid
  try {
    await sendApi(
      `/admin/states/troveseek/${item.service}/${item.id}/commission`,
      {
        troveseek_commission_dzd: Number(item.troveseek_commission_dzd || 0),
        attributed_to: 'troveseek',
      },
      'PUT'
    )
    item.attributed_to = 'troveseek'
    await fetchTroveSeekDashboard()
  } finally {
    savingUid.value = null
  }
}

function formatMoney(val) {
  return Number(val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

// ─── Period Transactions Table ─────────────────────────────────────────────
const now = new Date()
const startDate = shallowRef(new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()))
const endDate = shallowRef(new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()))

const columns = [
  { accessorKey: 'offer', header: 'Titre' },
  { accessorKey: 'purchase_price', header: "Prix d'Achat" },
  { accessorKey: 'quantity', header: 'Quantité' },
  { accessorKey: 'unit_price', header: 'Prix Unitaire' },
  { accessorKey: 'selling_price', header: 'Prix de Vente' },
  { accessorKey: 'commission', header: 'Commission' },
]

const data = ref([])
const total = ref(null)
const loading = ref(false)

const getStates = async () => {
  total.value = null
  const start_date = `${startDate.value.year}-${startDate.value.month}-${startDate.value.day}`
  const end_date = `${endDate.value.year}-${endDate.value.month}-${endDate.value.day}`
  loading.value = true
  sendApi(`/admin/states?start_date=${start_date}&end_date=${end_date}`, null, 'GET').then((response) => {
    data.value = response?.data || []
    ;(response?.data || []).forEach((row) => {
      total.value += Number(row.commission || 0)
    })
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

watch(startDate, () => getStates())
watch(endDate, () => getStates())

onMounted(() => {
  fetchTroveSeekDashboard()
  getStates()
})
</script>
