<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
    :ui="{ content: 'sm:max-w-6xl max-h-[94vh] overflow-y-auto bg-white dark:bg-slate-900 p-0 rounded-2xl shadow-2xl' }"
  >
    <template #content="{ close }">
      <div class="p-6 md:p-8 space-y-5 bg-white dark:bg-slate-900 rounded-2xl max-h-[92vh] flex flex-col">
      
        <!-- ─── Modal Header ──────────────────────────────────────────────── -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div class="flex items-center gap-3">
            <span class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xs">
              <UIcon name="i-heroicons-scale" class="w-6 h-6" />
            </span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-black text-slate-900 dark:text-white">
                  Audit Comptable &amp; Rapprochement Netstorming
                </h3>
                <UBadge color="primary" variant="subtle" size="xs" class="font-mono">Section 43 &amp; Ch. 11 PUSH</UBadge>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rapprochement financier des marges, réconciliation XML périodique (list_services) et écoute Webhook en direct.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              v-if="activeTab === 'financial'"
              icon="i-heroicons-arrow-down-tray"
              variant="outline"
              color="gray"
              size="sm"
              :loading="exporting"
              @click="exportCsv"
            >
              Exporter CSV
            </UButton>
            <UButton
              icon="i-heroicons-arrow-path"
              variant="ghost"
              color="gray"
              size="sm"
              :loading="loading || xmlRunning || webhooksLoading"
              @click="refreshCurrentTab"
            />
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="gray"
              size="sm"
              @click="isOpen = false"
            />
          </div>
        </div>

        <!-- ─── Navigation Tabs ─────────────────────────────────────────────── -->
        <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 shrink-0 overflow-x-auto">
          <button
            type="button"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
            :class="activeTab === 'financial'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'"
            @click="switchTab('financial')"
          >
            <UIcon name="i-heroicons-chart-pie" class="w-4 h-4" />
            <span>Rapprochement Financier &amp; Marges</span>
            <span class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full" :class="activeTab === 'financial' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'">
              {{ items.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
            :class="activeTab === 'xml_sync'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'"
            @click="switchTab('xml_sync')"
          >
            <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4" />
            <span>Réconciliation XML list_services</span>
            <UBadge color="emerald" variant="subtle" size="xs" class="text-[9px]">Spec §43</UBadge>
          </button>

          <button
            type="button"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
            :class="activeTab === 'webhooks'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'"
            @click="switchTab('webhooks')"
          >
            <UIcon name="i-heroicons-bolt" class="w-4 h-4 text-amber-500" />
            <span>Journal Webhooks Temps Réel</span>
            <span class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full" :class="activeTab === 'webhooks' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'">
              {{ webhookTotal }}
            </span>
          </button>
        </div>

        <!-- ═════════════════════════════════════════════════════════════════ -->
        <!-- TAB 1 : RAPPROCHEMENT FINANCIER & MARGES                          -->
        <!-- ═════════════════════════════════════════════════════════════════ -->
        <div v-show="activeTab === 'financial'" class="space-y-5 flex-1 flex flex-col min-h-0">
          <!-- Financial KPI Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">
            <!-- Chiffre d'Affaires TTC -->
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chiffre d'Affaires Encaissé</span>
              <p class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ formatCurrency(metrics.total_turnover_dzd) }} DZD</p>
              <span class="text-[11px] text-slate-400 mt-0.5">{{ metrics.paid_orders }} réservations payées</span>
            </div>

            <!-- Coût Net Netstorming -->
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Coût Achat Net (Fournisseur)</span>
              <p class="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{{ formatCurrency(metrics.total_cost_dzd) }} DZD</p>
              <span class="text-[11px] text-slate-400 mt-0.5">Env. {{ formatCurrency(metrics.total_cost_eur) }} EUR</span>
            </div>

            <!-- Marge Brute Agence -->
            <div class="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col justify-between">
              <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Bénéfice Net Agence</span>
              <p class="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{{ formatCurrency(metrics.total_profit_dzd) }} DZD</p>
              <span class="text-[11px] text-emerald-600 font-semibold mt-0.5">Marge moyenne : +{{ metrics.average_margin_percent }}%</span>
            </div>

            <!-- Anomalies / Écarts détectés -->
            <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 flex flex-col justify-between">
              <span class="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Écarts / À Régulariser</span>
              <p class="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{{ metrics.discrepancies_count }} dossiers</p>
              <span class="text-[11px] text-amber-600 font-semibold mt-0.5">Marge négative ou impayé</span>
            </div>
          </div>

          <!-- Filters & Period Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 shrink-0">
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Date de début :</label>
              <UInput v-model="filters.date_from" type="date" size="xs" class="w-full" @change="fetchReconciliation" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Date de fin :</label>
              <UInput v-model="filters.date_to" type="date" size="xs" class="w-full" @change="fetchReconciliation" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Statut Réservation :</label>
              <USelect
                v-model="filters.status"
                :items="statusOptions"
                value-key="value"
                size="xs"
                class="w-full"
                @change="fetchReconciliation"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Statut Paiement :</label>
              <USelect
                v-model="filters.payment_status"
                :items="paymentOptions"
                value-key="value"
                size="xs"
                class="w-full"
                @change="fetchReconciliation"
              />
            </div>
          </div>

          <!-- Audit Items Table (Scrollable) -->
          <div class="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl min-h-[220px]">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] tracking-wider z-10">
                <tr>
                  <th class="py-3 px-3">Dossier</th>
                  <th class="py-3 px-3">Hôtel &amp; Destination</th>
                  <th class="py-3 px-3">Client / Agence</th>
                  <th class="py-3 px-3 text-right">Achat Net (NS)</th>
                  <th class="py-3 px-3 text-right">Taux</th>
                  <th class="py-3 px-3 text-right">Coût Achat (DZD)</th>
                  <th class="py-3 px-3 text-right">Vente TTC (DZD)</th>
                  <th class="py-3 px-3 text-right">Marge Agence</th>
                  <th class="py-3 px-3 text-center">Statuts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-if="loading">
                  <td colspan="9" class="py-12 text-center text-slate-400">
                    <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    Calcul du rapprochement financier...
                  </td>
                </tr>
                <tr v-else-if="!items.length">
                  <td colspan="9" class="py-12 text-center text-slate-400 italic">
                    Aucun dossier ne correspond aux critères de rapprochement sélectionnés.
                  </td>
                </tr>
                <tr
                  v-for="row in items"
                  :key="row.id"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  :class="row.is_discrepancy ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''"
                >
                  <td class="py-2.5 px-3">
                    <span class="font-mono font-bold text-slate-900 dark:text-white">#{{ row.id }}</span>
                    <span v-if="row.ns_booking_reference" class="block font-mono text-[10px] text-primary">
                      {{ row.ns_booking_reference }}
                    </span>
                  </td>
                  <td class="py-2.5 px-3 max-w-[160px]">
                    <div class="font-bold text-slate-900 dark:text-white truncate" :title="row.hotel_name">
                      {{ row.hotel_name }}
                    </div>
                    <div class="text-[10px] text-slate-400 uppercase">{{ row.hotel_city }}</div>
                  </td>
                  <td class="py-2.5 px-3">
                    <div class="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">{{ row.client_name }}</div>
                    <UBadge v-if="row.client_role === 'client_b2b' || row.client_role === 'business'" color="primary" variant="subtle" size="xs" class="text-[9px]">
                      B2B
                    </UBadge>
                  </td>
                  <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {{ formatCurrency(row.ns_price) }} {{ row.ns_currency }}
                  </td>
                  <td class="py-2.5 px-3 text-right font-mono text-[11px] text-slate-400">
                    {{ row.exchange_rate }}
                  </td>
                  <td class="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    {{ formatCurrency(row.cost_dzd) }}
                  </td>
                  <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {{ formatCurrency(row.client_price_dzd) }}
                  </td>
                  <td class="py-2.5 px-3 text-right">
                    <span
                      class="font-mono font-bold"
                      :class="row.margin_dzd >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 font-black'"
                    >
                      {{ row.margin_dzd >= 0 ? '+' : '' }}{{ formatCurrency(row.margin_dzd) }}
                    </span>
                    <span class="block text-[10px] text-slate-400">({{ row.margin_percent }}%)</span>
                  </td>
                  <td class="py-2.5 px-3 text-center space-y-1">
                    <UBadge :color="row.status === 'confirmed' ? 'emerald' : 'amber'" variant="subtle" size="xs" class="capitalize">
                      {{ row.status }}
                    </UBadge>
                    <UBadge :color="row.payment_status === 'paid' ? 'emerald' : 'gray'" variant="subtle" size="xs" class="capitalize block">
                      {{ row.payment_status }}
                    </UBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════════════ -->
        <!-- TAB 2 : RÉCONCILIATION XML LIST_SERVICES (SPEC SECTION 43)        -->
        <!-- ═════════════════════════════════════════════════════════════════ -->
        <div v-show="activeTab === 'xml_sync'" class="space-y-5 flex-1 flex flex-col min-h-0 overflow-y-auto">
          
          <!-- Launch XML Query Controls -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3 shrink-0">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <UIcon name="i-heroicons-command-line" class="w-4 h-4 text-primary" />
                  Requête XML &lt;query type="list_services" product="hotel"&gt; (Section 43)
                </h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Interroge directement le Webservice Netstorming sur une fenêtre maximale de 7 jours pour auditer les écritures comptables.
                </p>
              </div>

              <!-- Quick Presets -->
              <div class="flex items-center gap-1.5 text-xs">
                <span class="text-[11px] text-slate-400 mr-1">Raccourcis :</span>
                <UButton size="2xs" variant="soft" color="gray" @click="setXmlWindow(1)">1 jour</UButton>
                <UButton size="2xs" variant="soft" color="gray" @click="setXmlWindow(3)">3 jours</UButton>
                <UButton size="2xs" variant="soft" color="primary" @click="setXmlWindow(7)">7 jours (Max)</UButton>
              </div>
            </div>

            <!-- Parameters Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Filtre Date :</label>
                <USelect
                  v-model="xmlForm.filter_type"
                  :items="filterTypeOptions"
                  value-key="value"
                  size="xs"
                  class="w-full"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Période du :</label>
                <UInput v-model="xmlForm.from" type="date" size="xs" class="w-full" />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Au :</label>
                <UInput v-model="xmlForm.to" type="date" size="xs" class="w-full" />
              </div>

              <div class="flex flex-col justify-end">
                <div class="flex items-center gap-2 mb-1.5">
                  <input
                    id="auto-sync-checkbox"
                    v-model="xmlForm.auto_sync"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                  <label for="auto-sync-checkbox" class="text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                    Auto-Sync (Statuts &amp; HCN)
                  </label>
                </div>
                <UButton
                  color="primary"
                  size="xs"
                  icon="i-heroicons-play"
                  :loading="xmlRunning"
                  class="w-full justify-center font-bold"
                  @click="runXmlReconciliation"
                >
                  Lancer la Réconciliation XML
                </UButton>
              </div>
            </div>
          </div>

          <!-- Latest Execution Result (if available) -->
          <div v-if="latestReconciliation" class="p-4 rounded-xl border space-y-4 shrink-0 transition-all"
            :class="latestReconciliation.discrepancy_count > 0 
              ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' 
              : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3"
              :class="latestReconciliation.discrepancy_count > 0 ? 'border-amber-200/80 dark:border-amber-800/60' : 'border-emerald-200/80 dark:border-emerald-800/60'"
            >
              <div class="flex items-center gap-2.5">
                <UIcon
                  :name="latestReconciliation.discrepancy_count > 0 ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-check-circle'"
                  class="w-6 h-6"
                  :class="latestReconciliation.discrepancy_count > 0 ? 'text-amber-500' : 'text-emerald-500'"
                />
                <div>
                  <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Rapport de Réconciliation XML #{{ latestReconciliation.log_id || latestReconciliation.id }}
                  </h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    Période auditée : {{ latestReconciliation.range_from }} → {{ latestReconciliation.range_to }}
                    <span v-if="latestReconciliation.auto_synced" class="ml-2 font-semibold text-primary">(Auto-Sync activé)</span>
                  </p>
                </div>
              </div>

              <UBadge
                :color="latestReconciliation.status === 'SUCCESS' ? 'emerald' : (latestReconciliation.status === 'NO_RECORDS' ? 'blue' : 'amber')"
                variant="subtle"
                size="sm"
                class="font-mono font-bold uppercase"
              >
                {{ latestReconciliation.status }}
              </UBadge>
            </div>

            <!-- Mini KPI Grid for this run -->
            <div class="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center">
              <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <span class="block text-[10px] uppercase font-bold text-slate-400">Distant (NS)</span>
                <span class="text-base font-black text-slate-900 dark:text-white">{{ latestReconciliation.total_remote }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <span class="block text-[10px] uppercase font-bold text-slate-400">Local (ERP)</span>
                <span class="text-base font-black text-slate-900 dark:text-white">{{ latestReconciliation.total_local }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <span class="block text-[10px] uppercase font-bold text-emerald-600">Concordances</span>
                <span class="text-base font-black text-emerald-600">{{ latestReconciliation.matched_count }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <span class="block text-[10px] uppercase font-bold text-amber-600">Écarts</span>
                <span class="text-base font-black text-amber-600">{{ latestReconciliation.discrepancy_count }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <span class="block text-[10px] uppercase font-bold text-blue-600">Mis à jour</span>
                <span class="text-base font-black text-blue-600">{{ latestReconciliation.updated_count }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <span class="block text-[10px] uppercase font-bold text-slate-400">Net Distant</span>
                <span class="text-xs font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {{ formatCurrency(latestReconciliation.total_net_remote) }} {{ latestReconciliation.currency || 'EUR' }}
                </span>
              </div>
            </div>

            <!-- Discrepancy Breakdown Table (if discrepancies exist) -->
            <div v-if="latestReconciliation.report_data?.discrepancies?.length" class="space-y-2">
              <h5 class="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-heroicons-shield-exclamation" class="w-4 h-4 text-amber-500" />
                Détail des Écarts Comptables &amp; Anomalies Détectées
              </h5>
              <div class="overflow-x-auto rounded-lg border border-amber-200 dark:border-amber-900/50 bg-white/90 dark:bg-slate-900/90">
                <table class="w-full text-left text-xs">
                  <thead class="bg-amber-100/50 dark:bg-amber-950/40 text-[10px] uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    <tr>
                      <th class="py-2 px-3">Dossier</th>
                      <th class="py-2 px-3">Réf Fournisseur</th>
                      <th class="py-2 px-3">Hôtel</th>
                      <th class="py-2 px-3">Statut Local</th>
                      <th class="py-2 px-3">Statut NS</th>
                      <th class="py-2 px-3">Description de l'Écart</th>
                      <th class="py-2 px-3">Action Exécutée</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-amber-100/60 dark:divide-amber-950/50 text-[11px]">
                    <tr v-for="(disc, dIdx) in latestReconciliation.report_data.discrepancies" :key="dIdx">
                      <td class="py-2 px-3 font-mono font-bold">#{{ disc.order_id }}</td>
                      <td class="py-2 px-3 font-mono text-primary font-semibold">{{ disc.ns_booking_reference }}</td>
                      <td class="py-2 px-3 truncate max-w-[150px]">{{ disc.hotel_name }}</td>
                      <td class="py-2 px-3 capitalize">
                        <UBadge size="2xs" color="gray" variant="subtle">{{ disc.local_status }}</UBadge>
                      </td>
                      <td class="py-2 px-3 capitalize font-semibold">
                        <UBadge size="2xs" :color="disc.ns_status === 'ABSENT_DE_LA_LISTE' ? 'red' : 'amber'" variant="subtle">
                          {{ disc.ns_status }}
                        </UBadge>
                      </td>
                      <td class="py-2 px-3 text-slate-700 dark:text-slate-300">{{ disc.description }}</td>
                      <td class="py-2 px-3 font-medium text-slate-900 dark:text-white">{{ disc.action }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2 py-1">
              <UIcon name="i-heroicons-check-badge" class="w-4 h-4 text-emerald-500" />
              Toutes les réservations vérifiées concordent parfaitement avec les données du fournisseur Netstorming.
            </div>
          </div>

          <!-- Historical Reconciliations Table -->
          <div class="space-y-2 flex-1 flex flex-col min-h-0">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary" />
                Historique des Réconciliations Périodiques (Scheduler 6h &amp; Manuelles)
              </h4>
              <UButton size="2xs" variant="ghost" color="gray" icon="i-heroicons-arrow-path" :loading="historyLoading" @click="fetchReconciliationHistory" />
            </div>

            <div class="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl min-h-[160px]">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] tracking-wider z-10">
                  <tr>
                    <th class="py-2.5 px-3">ID Log</th>
                    <th class="py-2.5 px-3">Date Exécution</th>
                    <th class="py-2.5 px-3">Période Vérifiée</th>
                    <th class="py-2.5 px-3">Type</th>
                    <th class="py-2.5 px-3 text-center">Distant / Local</th>
                    <th class="py-2.5 px-3 text-center">Concordances</th>
                    <th class="py-2.5 px-3 text-center">Écarts</th>
                    <th class="py-2.5 px-3 text-center">Auto-Sync</th>
                    <th class="py-2.5 px-3 text-center">Statut</th>
                    <th class="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  <tr v-if="historyLoading">
                    <td colspan="10" class="py-8 text-center text-slate-400">
                      <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin mx-auto text-primary mb-1" />
                      Chargement de l'historique...
                    </td>
                  </tr>
                  <tr v-else-if="!reconciliationHistory.length">
                    <td colspan="10" class="py-8 text-center text-slate-400 italic">
                      Aucun historique de réconciliation enregistré pour le moment.
                    </td>
                  </tr>
                  <tr
                    v-for="log in reconciliationHistory"
                    :key="log.id"
                    class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td class="py-2 px-3 font-mono font-bold">#{{ log.id }}</td>
                    <td class="py-2 px-3 text-slate-500">{{ formatDate(log.created_at) }}</td>
                    <td class="py-2 px-3 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                      {{ formatShortDate(log.range_from) }} → {{ formatShortDate(log.range_to) }}
                    </td>
                    <td class="py-2 px-3 capitalize font-semibold">{{ log.filter_type }}</td>
                    <td class="py-2 px-3 text-center font-mono">
                      <span class="text-blue-600 font-bold">{{ log.total_remote }}</span> / 
                      <span class="text-slate-700 dark:text-slate-300">{{ log.total_local }}</span>
                    </td>
                    <td class="py-2 px-3 text-center font-bold text-emerald-600">{{ log.matched_count }}</td>
                    <td class="py-2 px-3 text-center font-bold" :class="log.discrepancy_count > 0 ? 'text-amber-600' : 'text-slate-400'">
                      {{ log.discrepancy_count }}
                    </td>
                    <td class="py-2 px-3 text-center">
                      <UBadge :color="log.auto_synced ? 'primary' : 'gray'" variant="subtle" size="2xs">
                        {{ log.auto_synced ? 'OUI' : 'NON' }}
                      </UBadge>
                    </td>
                    <td class="py-2 px-3 text-center">
                      <UBadge
                        :color="log.status === 'SUCCESS' ? 'emerald' : (log.status === 'NO_RECORDS' ? 'blue' : 'amber')"
                        variant="subtle"
                        size="2xs"
                        class="uppercase font-mono"
                      >
                        {{ log.status }}
                      </UBadge>
                    </td>
                    <td class="py-2 px-3 text-right">
                      <UButton size="2xs" variant="ghost" color="primary" @click="selectHistoricalReport(log)">
                        Détails
                      </UButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ═════════════════════════════════════════════════════════════════ -->
        <!-- TAB 3 : JOURNAL DES WEBHOOKS EN TEMPS RÉEL (SPEC CH. 11 PUSH)     -->
        <!-- ═════════════════════════════════════════════════════════════════ -->
        <div v-show="activeTab === 'webhooks'" class="space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
          
          <!-- Webhook Receiver Endpoint Status Banner -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <UIcon name="i-heroicons-radio" class="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Récepteur Webhook Netstorming Actif</span>
                  <UBadge color="emerald" variant="subtle" size="xs">Écoute 24/7</UBadge>
                </h4>
                <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  <span class="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">POST /api/webhooks/netstorming/booking</span>
                  <span class="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">POST /manager/hotel_bookings</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <UButton size="xs" variant="outline" color="gray" icon="i-heroicons-arrow-path" :loading="webhooksLoading" @click="fetchWebhookLogs">
                Actualiser
              </UButton>
            </div>
          </div>

          <!-- Webhook Logs Table -->
          <div class="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl min-h-[260px]">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] tracking-wider z-10">
                <tr>
                  <th class="py-2.5 px-3">Date &amp; Heure</th>
                  <th class="py-2.5 px-3">Événement</th>
                  <th class="py-2.5 px-3">Dossier / Réf NS</th>
                  <th class="py-2.5 px-3 text-center">Statut Reçu</th>
                  <th class="py-2.5 px-3">Source &amp; IP</th>
                  <th class="py-2.5 px-3">Action Effectuée</th>
                  <th class="py-2.5 px-3 text-center">Résultat</th>
                  <th class="py-2.5 px-3 text-right">Payload</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                <tr v-if="webhooksLoading">
                  <td colspan="8" class="py-12 text-center text-slate-400">
                    <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    Chargement des événements Webhooks...
                  </td>
                </tr>
                <tr v-else-if="!webhookLogs.length">
                  <td colspan="8" class="py-12 text-center text-slate-400 italic">
                    Aucun événement Webhook reçu pour le moment.
                  </td>
                </tr>
                <tr
                  v-for="hook in webhookLogs"
                  :key="hook.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td class="py-2.5 px-3 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                    {{ formatDate(hook.created_at) }}
                  </td>
                  <td class="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    <span class="font-mono text-primary text-[10px]">{{ hook.event_type }}</span>
                  </td>
                  <td class="py-2.5 px-3">
                    <div v-if="hook.hotel_order" class="font-bold text-slate-900 dark:text-white">
                      Dossier #{{ hook.hotel_order_id }}
                    </div>
                    <div class="font-mono text-[10px] text-slate-500">
                      {{ hook.ns_booking_reference || hook.customer_reference || 'N/A' }}
                    </div>
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <UBadge
                      :color="getWebhookStatusColor(hook.new_status || hook.event_type)"
                      variant="subtle"
                      size="xs"
                      class="uppercase font-mono font-bold"
                    >
                      {{ hook.new_status || 'REÇU' }}
                    </UBadge>
                  </td>
                  <td class="py-2.5 px-3">
                    <div class="text-[10px] font-mono text-slate-600 dark:text-slate-300">{{ hook.ip_address }}</div>
                    <span class="uppercase text-[9px] font-bold text-slate-400 font-mono">Format: {{ hook.payload_format }}</span>
                  </td>
                  <td class="py-2.5 px-3 max-w-[240px]">
                    <p class="text-[11px] text-slate-700 dark:text-slate-300 truncate" :title="hook.action_taken || hook.error_message">
                      {{ hook.action_taken || hook.error_message || 'Événement consigné' }}
                    </p>
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <UBadge
                      :color="hook.processed_successfully ? 'emerald' : 'amber'"
                      variant="subtle"
                      size="2xs"
                    >
                      {{ hook.processed_successfully ? 'Traité' : 'Non traité' }}
                    </UBadge>
                  </td>
                  <td class="py-2.5 px-3 text-right">
                    <UButton
                      size="2xs"
                      variant="ghost"
                      color="gray"
                      icon="i-heroicons-code-bracket"
                      @click="inspectPayload(hook)"
                    >
                      Brut
                    </UButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- ─── Modal Footer ──────────────────────────────────────────────── -->
        <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 shrink-0">
          <div class="flex items-center gap-3 text-xs text-slate-400">
            <span v-if="activeTab === 'financial'">Total : {{ items.length }} dossier(s) audité(s)</span>
            <span v-else-if="activeTab === 'xml_sync'">
              Dernière synchro : {{ latestReconciliation ? formatDate(latestReconciliation.created_at) : 'Aucune' }}
            </span>
            <span v-else-if="activeTab === 'webhooks'">Total événements : {{ webhookTotal }}</span>
          </div>

          <UButton color="primary" @click="isOpen = false">
            Fermer
          </UButton>
        </div>

      </div>
    </template>
  </UModal>

  <!-- ─── Raw Webhook Payload Inspector Modal ─────────────────────────────── -->
  <UModal
    v-model:open="showPayloadModal"
    :ui="{ content: 'sm:max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-4' }"
  >
    <template #content>
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-code-bracket" class="w-5 h-5 text-primary" />
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">
              Inspection du Payload Brut Webhook #{{ inspectingHook?.id }}
            </h4>
          </div>
          <UButton icon="i-heroicons-x-mark" size="2xs" variant="ghost" color="gray" @click="showPayloadModal = false" />
        </div>

        <div class="text-xs space-y-1">
          <div class="flex justify-between text-slate-500">
            <span>Événement : <strong class="text-slate-900 dark:text-white font-mono">{{ inspectingHook?.event_type }}</strong></span>
            <span>IP : <strong class="text-slate-900 dark:text-white font-mono">{{ inspectingHook?.ip_address }}</strong></span>
          </div>
          <div class="text-slate-500">
            Action : <span class="text-slate-900 dark:text-white">{{ inspectingHook?.action_taken || 'Aucune' }}</span>
          </div>
        </div>

        <div class="relative">
          <pre class="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[350px] leading-relaxed select-all">{{ formattedPayload }}</pre>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <UButton size="xs" variant="outline" color="gray" @click="copyPayload">
            Copier Payload
          </UButton>
          <UButton size="xs" color="primary" @click="showPayloadModal = false">
            Fermer
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { sendApi } from '@/composables/api'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  open:       { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'update:open'])

const isOpen = computed({
  get: () => props.modelValue || props.open,
  set: (val) => {
    emit('update:modelValue', val)
    emit('update:open', val)
  },
})

// ─── Tabs ───────────────────────────────────────────────────────────────────
const activeTab = ref('financial') // 'financial' | 'xml_sync' | 'webhooks'

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'financial' && !items.value.length) {
    fetchReconciliation()
  } else if (tab === 'xml_sync' && !reconciliationHistory.value.length) {
    fetchReconciliationHistory()
  } else if (tab === 'webhooks' && !webhookLogs.value.length) {
    fetchWebhookLogs()
  }
}

function refreshCurrentTab() {
  if (activeTab.value === 'financial') fetchReconciliation()
  else if (activeTab.value === 'xml_sync') fetchReconciliationHistory()
  else if (activeTab.value === 'webhooks') fetchWebhookLogs()
}

// ─── Tab 1 : Financial Margin Audit State ───────────────────────────────────
const loading = ref(false)
const exporting = ref(false)
const metrics = ref({
  total_orders: 0,
  confirmed_orders: 0,
  paid_orders: 0,
  discrepancies_count: 0,
  total_turnover_dzd: 0,
  total_cost_dzd: 0,
  total_cost_eur: 0,
  total_cost_usd: 0,
  total_profit_dzd: 0,
  average_margin_percent: 0,
})
const items = ref([])

const filters = ref({
  date_from: '',
  date_to: '',
  status: 'all',
  payment_status: 'all',
})

const statusOptions = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'Confirmé', value: 'confirmed' },
  { label: 'En Attente', value: 'pending' },
  { label: 'Annulé', value: 'cancelled' },
]

const paymentOptions = [
  { label: 'Tous les paiements', value: 'all' },
  { label: 'Payé', value: 'paid' },
  { label: 'Non Payé', value: 'unpaid' },
  { label: 'En Vérification CCP', value: 'verification_pending' },
]

// ─── Tab 2 : XML list_services Reconciliation State ─────────────────────────
const xmlRunning = ref(false)
const historyLoading = ref(false)
const latestReconciliation = ref(null)
const reconciliationHistory = ref([])

const xmlForm = ref({
  filter_type: 'creation',
  from: '',
  to: '',
  auto_sync: true,
})

const filterTypeOptions = [
  { label: 'Date de Création (creation)', value: 'creation' },
  { label: 'Dernière Modification (lastmodified)', value: 'lastmodified' },
  { label: "Date d'Arrivée (checkin)", value: 'checkin' },
]

function setXmlWindow(days) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - Math.max(0, days - 1))
  xmlForm.value.from = start.toISOString().slice(0, 10)
  xmlForm.value.to = end.toISOString().slice(0, 10)
}

// Pre-fill XML window to last 7 days by default
setXmlWindow(7)

async function runXmlReconciliation() {
  xmlRunning.value = true
  try {
    const payload = {
      filter_type: xmlForm.value.filter_type,
      from: xmlForm.value.from ? `${xmlForm.value.from} 00:00:00` : null,
      to: xmlForm.value.to ? `${xmlForm.value.to} 23:59:59` : null,
      auto_sync: xmlForm.value.auto_sync,
    }

    const res = await sendApi('/admin/hotels/reconciliation/run', payload, 'POST')
    if (res?.data) {
      latestReconciliation.value = res.data
      await fetchReconciliationHistory()
      // Refresh financial tab as orders might have synced
      fetchReconciliation()
    }
  } catch (err) {
    console.error('Failed to run XML reconciliation:', err)
  } finally {
    xmlRunning.value = false
  }
}

async function fetchReconciliationHistory() {
  historyLoading.value = true
  try {
    const res = await sendApi('/admin/hotels/reconciliation/history', null, 'GET')
    const list = res?.data?.data || res?.data || []
    reconciliationHistory.value = Array.isArray(list) ? list : []
    if (!latestReconciliation.value && reconciliationHistory.value.length > 0) {
      latestReconciliation.value = reconciliationHistory.value[0]
    }
  } catch (err) {
    console.error('Failed to load reconciliation history:', err)
  } finally {
    historyLoading.value = false
  }
}

function selectHistoricalReport(log) {
  latestReconciliation.value = log
}

// ─── Tab 3 : Webhook Logs State ─────────────────────────────────────────────
const webhooksLoading = ref(false)
const webhookLogs = ref([])
const webhookTotal = ref(0)
const inspectingHook = ref(null)
const showPayloadModal = ref(false)

async function fetchWebhookLogs() {
  webhooksLoading.value = true
  try {
    const res = await sendApi('/admin/hotels/webhooks', null, 'GET')
    const data = res?.data?.data || res?.data || []
    webhookLogs.value = Array.isArray(data) ? data : []
    webhookTotal.value = res?.data?.total || webhookLogs.value.length
  } catch (err) {
    console.error('Failed to load webhook logs:', err)
  } finally {
    webhooksLoading.value = false
  }
}

function getWebhookStatusColor(status) {
  const s = String(status || '').toUpperCase()
  if (s.includes('CNF') || s.includes('CONFIRMED')) return 'emerald'
  if (s.includes('CXL') || s.includes('CAN') || s.includes('CANCELLED')) return 'red'
  if (s.includes('MOD') || s.includes('UPDATE')) return 'blue'
  if (s.includes('REJ')) return 'amber'
  return 'gray'
}

function inspectPayload(hook) {
  inspectingHook.value = hook
  showPayloadModal.value = true
}

const formattedPayload = computed(() => {
  if (!inspectingHook.value) return ''
  const raw = inspectingHook.value.raw_payload
  if (!raw) return 'Aucun payload enregistré.'
  try {
    const parsed = JSON.parse(raw)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return raw
  }
})

function copyPayload() {
  if (formattedPayload.value && navigator?.clipboard) {
    navigator.clipboard.writeText(formattedPayload.value)
  }
}

// ─── Lifecycle & Watchers ───────────────────────────────────────────────────
watch(() => props.modelValue || props.open, (newVal) => {
  if (newVal) {
    fetchReconciliation()
    fetchReconciliationHistory()
    fetchWebhookLogs()
  }
})

async function fetchReconciliation() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.date_from) params.append('date_from', filters.value.date_from)
    if (filters.value.date_to) params.append('date_to', filters.value.date_to)
    if (filters.value.status && filters.value.status !== 'all') params.append('status', filters.value.status)
    if (filters.value.payment_status && filters.value.payment_status !== 'all') params.append('payment_status', filters.value.payment_status)

    const res = await sendApi(`/admin/hotels/reconciliation?${params.toString()}`, null, 'GET')
    if (res?.data) {
      metrics.value = res.data.metrics || {}
      items.value = res.data.items || []
    }
  } catch (err) {
    console.error('Failed to load hotel reconciliation:', err)
  } finally {
    loading.value = false
  }
}

function exportCsv() {
  if (!items.value.length) return
  exporting.value = true

  try {
    const headers = [
      'ID Dossier',
      'Date Creation',
      'Reference Netstorming',
      'Hotel',
      'Ville',
      'Client',
      'Prix Net Fournisseur',
      'Devise Fournisseur',
      'Taux de Change',
      'Cout Net DZD',
      'Prix Releve Client DZD',
      'Marge Agence DZD',
      'Marge %',
      'Statut Dossier',
      'Statut Paiement',
    ]

    const rows = items.value.map(row => [
      row.id,
      row.created_at || '',
      row.ns_booking_reference || '',
      `"${(row.hotel_name || '').replace(/"/g, '""')}"`,
      `"${(row.hotel_city || '').replace(/"/g, '""')}"`,
      `"${(row.client_name || '').replace(/"/g, '""')}"`,
      row.ns_price,
      row.ns_currency,
      row.exchange_rate,
      row.cost_dzd,
      row.client_price_dzd,
      row.margin_dzd,
      row.margin_percent,
      row.status,
      row.payment_status,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Reconciliation_Hotels_Bouazize_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    exporting.value = false
  }
}

function formatCurrency(val) {
  return Number(val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(val) {
  if (!val) return '-'
  try {
    return new Date(val).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    return val
  }
}

function formatShortDate(val) {
  if (!val) return '-'
  try {
    return new Date(val).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    })
  } catch (e) {
    return val
  }
}
</script>
