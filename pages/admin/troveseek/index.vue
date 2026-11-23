<template>
  <div class="w-full space-y-6 pb-10">
    <!-- ─── Header Banner: TroveSeek Production ──────────────────────────── -->
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
              TroveSeek Production — Média &amp; Commissions
            </h1>
            <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-primary/20 text-primary border border-primary/40">
              Suivi En Direct
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

      <!-- Strictly aligned 3-column row: single-line labels + identical h-10 (40px) controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div class="flex flex-col">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 truncate">
            1. Page de destination
          </label>
          <select
            v-model="linkBuilder.path"
            class="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-slate-900 dark:text-white focus:border-primary outline-none !rounded-none"
          >
            <option value="/">Accueil Générale (/)</option>
            <option value="/services/hotels">Réservation d'Hôtels (/services/hotels)</option>
            <option value="/services/omra">Offres Omra (/services/omra)</option>
            <option value="/services/voyage_organise">Voyages Organisés (/services/voyage_organise)</option>
            <option value="/services/visa">Demandes de Visa (/services/visa)</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 truncate">
            2. Nom de la Campagne (ts)
          </label>
          <input
            v-model="linkBuilder.campaign"
            type="text"
            placeholder="Ex: fb_omra_novembre"
            class="w-full h-10 px-3 text-xs font-mono bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-slate-900 dark:text-white focus:border-primary outline-none !rounded-none"
          />
        </div>

        <div class="flex flex-col">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 truncate">
            3. Code Promo / Code Média
          </label>
          <input
            v-model="linkBuilder.code"
            type="text"
            placeholder="Ex: TS2026 ou TROVESEEK"
            class="w-full h-10 px-3 text-xs font-mono uppercase bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-slate-900 dark:text-white focus:border-primary outline-none !rounded-none"
          />
        </div>
      </div>

      <div class="p-3.5 bg-slate-50 dark:bg-[#071124] border border-slate-200 dark:border-[#1e3a6d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="min-w-0 flex-1">
          <span class="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Lien Sponsorisé prêt à partager :</span>
          <code class="text-xs font-mono text-primary break-all">{{ generatedTrackingUrl }}</code>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UButton
            size="sm"
            color="primary"
            icon="i-heroicons-clipboard-document"
            class="!rounded-none font-bold"
            @click="copyText(generatedTrackingUrl, 'Lien sponsorisé copié !')"
          >
            Copier le Lien
          </UButton>
          <UButton
            size="sm"
            variant="soft"
            color="gray"
            icon="i-heroicons-tag"
            class="!rounded-none font-bold"
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
            class="h-9 px-3 text-xs font-bold border cursor-pointer transition-colors"
            :class="filterMode === 'all' ? 'bg-primary text-[#0C1C39] border-primary' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'"
          >
            Toutes les réservations
          </button>
          <button
            type="button"
            @click="filterMode = 'troveseek'; fetchTroveSeekDashboard()"
            class="h-9 px-3 text-xs font-bold border cursor-pointer transition-colors"
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
                    class="w-24 h-8 px-2 text-xs font-mono font-bold bg-slate-50 dark:bg-[#071124] border border-slate-300 dark:border-[#1e3a6d] text-primary !rounded-none"
                  />
                  <UButton
                    size="xs"
                    color="primary"
                    icon="i-heroicons-check"
                    class="h-8 !rounded-none"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { sendApi } from '~/composables/api'

definePageMeta({
  layout: 'admin',
})

const toast = useToast()

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

onMounted(() => {
  fetchTroveSeekDashboard()
})
</script>
