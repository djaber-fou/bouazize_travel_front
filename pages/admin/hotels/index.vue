<template>
  <div class="w-full space-y-6 pb-12">

    <!-- ─── Top Header & Quick Actions ───────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <span class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <UIcon name="i-heroicons-building-office-2" class="w-6 h-6" />
          </span>
          Réservations Hôtelières
        </h1>
        <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestion des réservations d'hôtels, synchronisation Netstorming et suivi des paiements.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UButton
          icon="i-heroicons-arrow-path"
          variant="outline"
          color="gray"
          size="sm"
          :loading="loading"
          @click="fetchData"
        >
          Actualiser
        </UButton>

        <UButton
          icon="i-heroicons-arrow-path-rounded-square"
          variant="outline"
          color="blue"
          size="sm"
          :loading="syncingPending"
          @click="triggerSyncPending"
        >
          Tracker &amp; Sync En Direct
        </UButton>

        <UButton
          icon="i-heroicons-scale"
          variant="outline"
          color="emerald"
          size="sm"
          @click="openReconciliation = true"
        >
          Rapprochement Financier
        </UButton>

        <UButton
          icon="i-heroicons-cog-6-tooth"
          color="primary"
          size="sm"
          @click="openSettingsModal"
        >
          Configuration Netstorming
        </UButton>
      </div>
    </div>

    <!-- ─── KPI Stats Grid ───────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
      <!-- Total Orders -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Total Dossiers</span>
          <UIcon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-primary" />
        </div>
        <p class="text-2xl font-black text-slate-900 dark:text-white">{{ stats.total_orders || 0 }}</p>
        <span class="text-[11px] text-slate-400 mt-1">Toutes réservations</span>
      </div>

      <!-- Confirmed Orders -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
        <div class="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Confirmées</span>
          <UIcon name="i-heroicons-check-badge" class="w-5 h-5" />
        </div>
        <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ stats.confirmed_orders || 0 }}</p>
        <span class="text-[11px] text-slate-400 mt-1">Confirmées Netstorming</span>
      </div>

      <!-- Pending Orders -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
        <div class="flex items-center justify-between text-amber-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">En Attente</span>
          <UIcon name="i-heroicons-clock" class="w-5 h-5" />
        </div>
        <p class="text-2xl font-black text-amber-500">{{ stats.pending_orders || 0 }}</p>
        <span class="text-[11px] text-slate-400 mt-1">À traiter / en attente</span>
      </div>

      <!-- Revenue (DZD) -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
        <div class="flex items-center justify-between text-primary mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Chiffre d'Affaires</span>
          <UIcon name="i-heroicons-banknotes" class="w-5 h-5" />
        </div>
        <p class="text-xl sm:text-2xl font-black text-primary truncate">{{ formatCurrency(stats.total_revenue_dzd || 0) }}</p>
        <span class="text-[11px] text-slate-400 mt-1">DZD encaissés</span>
      </div>

      <!-- Cached Destinations -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
        <div class="flex items-center justify-between text-blue-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Destinations</span>
          <UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
        </div>
        <p class="text-2xl font-black text-blue-500">{{ Number(settings.destinations_count || 0).toLocaleString('fr-FR') }}</p>
        <span class="text-[11px] text-slate-400 mt-1">Villes en cache local</span>
      </div>

      <!-- Worldwide & Algeria Hotel Inventory -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
        <div class="flex items-center justify-between text-amber-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Inventaire Hôtels</span>
          <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-amber-500" />
        </div>
        <p class="text-2xl font-black text-amber-500">+838 000</p>
        <span class="text-[11px] text-slate-400 mt-1">{{ Number(settings.hotels_count || 0).toLocaleString('fr-FR') }} en cache · {{ Number(settings.algeria_hotels_count || 0).toLocaleString('fr-FR') }} DZ</span>
      </div>
    </div>

    <!-- ─── Search & Filters Bar ─────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Search Input -->
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Rechercher par hôtel, ville, réf NS, client..."
          class="w-full"
          @update:model-value="debounceFetch"
        />

        <!-- Status Filter -->
        <USelect
          v-model="selectedStatus"
          :items="statusOptions"
          value-key="value"
          placeholder="Statut Réservation"
          @change="fetchOrders"
        />

        <!-- Payment Status Filter -->
        <USelect
          v-model="selectedPayment"
          :items="paymentOptions"
          value-key="value"
          placeholder="Statut Paiement"
          @change="fetchOrders"
        />

        <!-- Reset Button -->
        <UButton
          variant="soft"
          color="gray"
          icon="i-heroicons-x-mark"
          class="w-full justify-center"
          @click="resetFilters"
        >
          Réinitialiser filtres
        </UButton>
      </div>
    </div>

    <!-- ─── Orders Data Table ────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th class="py-3 px-4">Dossier</th>
              <th class="py-3 px-4">Client</th>
              <th class="py-3 px-4">Hôtel & Ville</th>
              <th class="py-3 px-4">Dates & Nuits</th>
              <th class="py-3 px-4">Prix Total</th>
              <th class="py-3 px-4">Netstorming Ref</th>
              <th class="py-3 px-4">Statut</th>
              <th class="py-3 px-4">Paiement</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <!-- Loading skeleton -->
            <tr v-if="loading && !orders.length">
              <td colspan="9" class="py-12 text-center text-slate-400">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                Chargement des réservations hôtelières...
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-else-if="!orders.length">
              <td colspan="9" class="py-16 text-center text-slate-400">
                <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p class="font-bold text-slate-600 dark:text-slate-300">Aucune réservation hôtelière trouvée</p>
                <p class="text-xs text-slate-400 mt-1">Modifiez vos critères de recherche ou passez une commande de test.</p>
              </td>
            </tr>

            <!-- Table Rows -->
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              @click="openOrderDetails(order)"
            >
              <!-- ID & Date -->
              <td class="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                #{{ order.id }}
                <span class="block font-sans font-normal text-[11px] text-slate-400 mt-0.5">
                  {{ formatDate(order.created_at) }}
                </span>
              </td>

              <!-- Client -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-800 dark:text-slate-200">
                  {{ order.user?.name || 'Client Web' }}
                </div>
                <div class="text-[11px] text-slate-400">
                  {{ order.user?.phone || order.user?.email || '-' }}
                </div>
              </td>

              <!-- Hotel & City -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {{ order.hotel_name || 'Hôtel' }}
                </div>
                <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                  <span class="text-primary font-semibold uppercase">{{ order.hotel_city }}</span>
                  <span v-if="order.hotel_category">· {{ order.hotel_category }}★</span>
                </div>
              </td>

              <!-- Dates & Nights -->
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                <div class="font-medium text-xs">
                  {{ formatDateShort(order.check_in) }} → {{ formatDateShort(order.check_out) }}
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  {{ order.nights }} nuits · {{ order.adults }} adulte(s)
                </div>
              </td>

              <!-- Price -->
              <td class="py-3.5 px-4 font-bold text-primary">
                {{ formatCurrency(order.final_price_dzd) }} DZD
              </td>

              <!-- Netstorming Reference -->
              <td class="py-3.5 px-4 font-mono text-xs">
                <span v-if="order.ns_booking_reference" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ order.ns_booking_reference }}
                </span>
                <span v-else class="text-slate-400 italic">Non attribuée</span>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <UBadge
                  :color="getStatusBadgeColor(order.status)"
                  variant="subtle"
                  class="capitalize text-[11px] font-bold"
                >
                  {{ getStatusLabel(order.status) }}
                </UBadge>
              </td>

              <!-- Payment -->
              <td class="py-3.5 px-4">
                <UBadge
                  :color="getPaymentBadgeColor(order.payment_status)"
                  variant="subtle"
                  class="capitalize text-[11px] font-bold"
                >
                  {{ getPaymentLabel(order.payment_status) }}
                </UBadge>
              </td>

              <!-- Action -->
              <td class="py-3.5 px-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="primary"
                    icon="i-heroicons-ticket"
                    title="Bon d'Hôtel (Voucher)"
                    @click="openVoucher(order)"
                  />
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="gray"
                    icon="i-heroicons-document-text"
                    title="Facture Officielle"
                    @click="openInvoice(order)"
                  />
                  <UButton
                    size="xs"
                    variant="soft"
                    color="primary"
                    icon="i-heroicons-eye"
                    @click="openOrderDetails(order)"
                  >
                    Gérer
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800">
        <span class="text-xs text-slate-400">
          Affichage {{ (pagination.current_page - 1) * pagination.per_page + 1 }} à {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} sur {{ pagination.total }} dossiers
        </span>
        <UPagination
          v-model="pagination.current_page"
          :total="pagination.total"
          :items-per-page="pagination.per_page"
          @update:model-value="fetchOrders"
        />
      </div>
    </div>

    <!-- ─── Order Detail & Management Slideover ──────────────────────────── -->
    <USlideover
      v-model:open="showDetails"
      :close="false"
      :ui="{ content: 'sm:max-w-2xl max-w-full bg-white dark:bg-slate-900 shadow-2xl' }"
    >
      <template #content="{ close }">
        <div class="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
          <!-- Slideover Header -->
        <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <UIcon name="i-heroicons-building-office-2" class="w-5 h-5" />
            </span>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Dossier #{{ selectedOrder?.id }}</h2>
              <p class="text-xs text-slate-400">Créé le {{ formatDate(selectedOrder?.created_at) }}</p>
            </div>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            size="sm"
            @click="showDetails = false"
          />
        </div>

        <!-- Slideover Body (Scrollable) -->
        <div v-if="selectedOrder" class="flex-1 overflow-y-auto p-6 space-y-6">

          <!-- Hotel & Stay Card -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ selectedOrder.hotel_name }}</h3>
                <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary" />
                  {{ selectedOrder.hotel_city }} · {{ selectedOrder.destination_name || selectedOrder.destination_code }}
                </p>
              </div>
              <UBadge color="primary" variant="subtle" class="font-mono text-xs">
                Code: {{ selectedOrder.hotel_code }}
              </UBadge>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Arrivée</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatDateShort(selectedOrder.check_in) }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Départ</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatDateShort(selectedOrder.check_out) }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Durée</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedOrder.nights }} nuits</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Voyageurs</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedOrder.adults }} Adl / {{ selectedOrder.children || 0 }} Enf</span>
              </div>
            </div>
          </div>

          <!-- Netstorming Integration Status Box -->
          <div class="p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-heroicons-signal" class="w-4 h-4 text-blue-600" />
                Statut Système Netstorming
              </span>
              <UButton
                size="xs"
                color="blue"
                variant="soft"
                icon="i-heroicons-arrow-path"
                :loading="trackingLoading"
                @click="trackBookingNetstorming"
              >
                Vérifier En Direct
              </UButton>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px]">Réf. Netstorming:</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {{ selectedOrder.ns_booking_reference || 'Aucune référence' }}
                </span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Statut Netstorming:</span>
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {{ selectedOrder.ns_booking_status || 'Inconnu' }}
                </span>
              </div>
            </div>

            <div v-if="trackingResult" class="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-xs border border-blue-100 dark:border-blue-900 text-slate-700 dark:text-slate-300">
              <p class="font-bold text-blue-600 mb-1">Dernier rapport Netstorming :</p>
              <pre class="text-[11px] overflow-x-auto">{{ JSON.stringify(trackingResult, null, 2) }}</pre>
            </div>
          </div>

          <!-- Pricing & Financial Breakdown -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Décomposition Financière
            </h4>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between text-slate-500">
                <span>Prix brut Netstorming :</span>
                <span class="font-mono font-semibold">{{ selectedOrder.ns_price }} {{ selectedOrder.ns_currency }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Taux de change appliqué :</span>
                <span class="font-mono font-semibold">1 {{ selectedOrder.ns_currency }} = {{ selectedOrder.exchange_rate }} DZD</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Marge agence Bouazize :</span>
                <span class="font-mono font-semibold">+{{ selectedOrder.markup_percent }}%</span>
              </div>
              <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-primary">
                <span>Total Facturé au Client :</span>
                <span>{{ formatCurrency(selectedOrder.final_price_dzd) }} DZD</span>
              </div>
            </div>
          </div>

          <!-- Client & Guest Information -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Coordonnées Client & Voyageurs
            </h4>
            <div class="text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <p><strong>Titulaire du compte :</strong> {{ selectedOrder.user?.name }} ({{ selectedOrder.user?.email }})</p>
              <p><strong>Téléphone :</strong> {{ selectedOrder.user?.phone || 'Non renseigné' }}</p>
            </div>

            <!-- Pax list if available -->
            <div v-if="selectedOrder.pax_details && selectedOrder.pax_details.length" class="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
              <p class="text-[11px] font-bold text-slate-400 uppercase">Liste des occupants :</p>
              <div v-for="(pax, idx) in selectedOrder.pax_details" :key="idx" class="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <UIcon name="i-heroicons-user" class="w-3.5 h-3.5 text-primary" />
                <span>{{ pax.title }} {{ pax.name }} {{ pax.surname }} ({{ pax.type || 'adulte' }})</span>
              </div>
            </div>
          </div>

          <!-- CCP Payment Pending Notice -->
          <div v-if="selectedOrder.payment_status === 'verification_pending'" class="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <p class="text-xs font-bold text-blue-950 dark:text-blue-100">Paiement BaridiMob / CCP en Attente de Vérification</p>
                  <p class="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">Le client a soumis un reçu de virement pour ce dossier.</p>
                </div>
              </div>
              <UButton size="xs" variant="ghost" color="gray" to="/admin/ccp">
                Module CCP
              </UButton>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-blue-100 dark:border-blue-900/40">
              <UButton
                size="xs"
                color="emerald"
                icon="i-heroicons-check"
                :loading="updatingPayment"
                @click="quickConfirmCcp(selectedOrder)"
              >
                Valider Reçu &amp; Confirmer
              </UButton>
              <UButton
                size="xs"
                variant="soft"
                color="red"
                icon="i-heroicons-x-mark"
                :loading="updatingPayment"
                @click="quickRejectCcp(selectedOrder)"
              >
                Rejeter Paiement
              </UButton>
            </div>
          </div>

          <!-- Official Documents & Relevé de compte -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Documents Officiels &amp; Relevé de compte</span>
              <UIcon name="i-heroicons-document-duplicate" class="w-4 h-4 text-primary" />
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <UButton
                variant="outline"
                color="primary"
                icon="i-heroicons-ticket"
                class="font-semibold justify-center"
                @click="openVoucher(selectedOrder)"
              >
                Bon d'Hôtel (Voucher)
              </UButton>
              <UButton
                variant="outline"
                color="gray"
                icon="i-heroicons-document-text"
                class="font-semibold justify-center"
                @click="openInvoice(selectedOrder)"
              >
                Relevé de compte
              </UButton>
              <UButton
                variant="outline"
                color="emerald"
                icon="i-heroicons-envelope"
                class="font-semibold justify-center"
                @click="openEmail(selectedOrder)"
              >
                Email Confirmation
              </UButton>
            </div>
          </div>

          <!-- Edit Order Status & Notes -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Mise à Jour du Dossier
            </h4>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Statut Dossier</label>
                <USelect v-model="editForm.status" :items="statusOptions.filter(o => o.value !== 'all')" value-key="value" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Statut Paiement</label>
                <USelect v-model="editForm.payment_status" :items="paymentOptions.filter(o => o.value !== 'all')" value-key="value" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Notes Internes Administration</label>
              <UTextarea v-model="editForm.admin_notes" placeholder="Notes de gestion, justificatifs de paiement, échanges..." rows="3" />
            </div>

            <div class="flex items-center justify-between pt-2">
              <UButton
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                size="sm"
                :disabled="selectedOrder.status === 'cancelled'"
                @click="confirmCancelBooking"
              >
                Annuler sur Netstorming
              </UButton>

              <UButton
                color="primary"
                icon="i-heroicons-check"
                size="sm"
                :loading="updatingStatus"
                @click="saveOrderChanges"
              >
                Enregistrer modifications
              </UButton>
            </div>
          </div>

        </div>
      </div>
      </template>
    </USlideover>

    <!-- ─── Netstorming Configuration Modal ──────────────────────────────── -->
    <UModal
      v-model:open="openSettings"
      :close="false"
      :ui="{ content: 'sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 p-0 rounded-2xl shadow-2xl' }"
    >
      <template #content="{ close }">
        <div class="p-6 space-y-5 bg-white dark:bg-slate-900 rounded-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
            </span>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Configuration Netstorming &amp; Tarification</h3>
              <p class="text-xs text-slate-400">Paramétrage dynamique des marges, devises, webservice et scheduler.</p>
            </div>
          </div>
          <UButton icon="i-heroicons-x-mark" variant="ghost" color="gray" size="xs" @click="openSettings = false" />
        </div>

        <!-- Navigation Tabs inside Settings Modal -->
        <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="settingsTab === 'pricing' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
            @click="settingsTab = 'pricing'"
          >
            Tarification &amp; Devises
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="settingsTab === 'api' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
            @click="settingsTab = 'api'"
          >
            Webservice Netstorming
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="settingsTab === 'automation' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
            @click="settingsTab = 'automation'"
          >
            Automatisations &amp; Sécurité
          </button>
        </div>

        <!-- Tab 1: Pricing & Margins -->
        <div v-show="settingsTab === 'pricing'" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Marge B2C par défaut (%) :</label>
              <UInput v-model.number="settingsForm.b2c_markup_percent" type="number" step="0.5" min="0" max="100" />
              <span class="text-[10px] text-slate-400 mt-0.5 block">Appliquée aux réservations directes des particuliers.</span>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Marge B2B par défaut (%) :</label>
              <UInput v-model.number="settingsForm.b2b_default_markup_percent" type="number" step="0.5" min="0" max="100" />
              <span class="text-[10px] text-slate-400 mt-0.5 block">Marge de référence pour les agences partenaires B2B.</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 class="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase text-[11px] tracking-wider">
              Taux de Change Dynamiques (Devises Fournisseur → DZD)
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">1 EUR (€) en DZD :</label>
                <UInput v-model.number="settingsForm.exchange_rate_eur" type="number" step="0.5" min="1" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">1 USD ($) en DZD :</label>
                <UInput v-model.number="settingsForm.exchange_rate_usd" type="number" step="0.5" min="1" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">1 SAR (Riyal) en DZD :</label>
                <UInput v-model.number="settingsForm.exchange_rate_sar" type="number" step="0.1" min="0.1" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">1 TRY (Livre) en DZD :</label>
                <UInput v-model.number="settingsForm.exchange_rate_try" type="number" step="0.1" min="0.1" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Netstorming Webservice -->
        <div v-show="settingsTab === 'api'" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Endpoint XML API :</label>
            <UInput v-model="settingsForm.endpoint" type="text" placeholder="https://kalima.mygo.pro/call.php" class="font-mono text-xs" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actor ID :</label>
              <UInput v-model="settingsForm.actor" type="text" class="font-mono text-xs" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom d'utilisateur API :</label>
              <UInput v-model="settingsForm.user" type="text" class="font-mono text-xs" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Version Protocole :</label>
              <UInput v-model="settingsForm.version" type="text" class="font-mono text-xs" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Timeout Requêtes (s) :</label>
              <UInput v-model.number="settingsForm.timeout" type="number" min="10" max="300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nationalité défaut :</label>
              <UInput v-model="settingsForm.default_nationality" type="text" maxlength="2" class="uppercase font-mono" />
            </div>
          </div>
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <p class="font-bold text-slate-800 dark:text-slate-200">Mode Environnement de Production</p>
              <p class="text-[11px] text-slate-400">Activé = Réservations réelles Netstorming avec émission de code voucher officiel.</p>
            </div>
            <UToggle v-model="settingsForm.is_live_mode" />
          </div>
        </div>

        <!-- Tab 3: Automation & Security -->
        <div v-show="settingsTab === 'automation'" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Délai d'annulation auto impayés (heures) :</label>
              <UInput v-model.number="settingsForm.auto_cancel_unpaid_hours" type="number" min="1" max="168" />
              <span class="text-[10px] text-slate-400 mt-0.5 block">Annule automatiquement les dossiers non payés avant les pénalités.</span>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fréquence du Tracker (minutes) :</label>
              <UInput v-model.number="settingsForm.auto_sync_interval_minutes" type="number" min="5" max="1440" />
              <span class="text-[10px] text-slate-400 mt-0.5 block">Intervalle d'exécution de la commande de suivi en arrière-plan.</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone d'assistance d'urgence :</label>
              <UInput v-model="settingsForm.emergency_phone" type="text" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email de notification d'alerte :</label>
              <UInput v-model="settingsForm.emergency_email" type="email" />
            </div>
          </div>

          <!-- Destinations sync box -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Destinations en cache : {{ Number(settings.destinations_count || 0).toLocaleString('fr-FR') }} (pays + villes)</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Télécharger les dernières villes depuis le webservice Netstorming.</p>
            </div>
            <UButton
              icon="i-heroicons-arrow-path"
              color="gray"
              variant="outline"
              size="xs"
              :loading="syncingDestinations"
              @click="triggerManualSync"
            >
              Synchroniser Villes
            </UButton>
          </div>

          <!-- Algeria hotels sync box -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Hôtels en Algérie : {{ Number(settings.algeria_hotels_count || 0).toLocaleString('fr-FR') }} hôtels (58 Wilayas)</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Synchroniser tous les hôtels d'Algérie avec étoiles, adresses et coordonnées (Sétif, Alger, Oran...).</p>
            </div>
            <UButton
              icon="i-heroicons-arrow-path-rounded-square"
              color="emerald"
              variant="outline"
              size="xs"
              :loading="syncingHotelsAlgeria"
              @click="triggerSyncAlgeriaHotels"
            >
              Synchroniser Algérie
            </UButton>
          </div>

          <!-- Worldwide inventory sync box -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Catalogue Mondial Netstorming : {{ Number(settings.hotels_count || 0).toLocaleString('fr-FR') }} / 838 351 hôtels</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Importer des lots d'inventaire mondial via l'API officielle Netstorming (Chapitre 27 get_inventory).</p>
            </div>
            <UButton
              icon="i-heroicons-cloud-arrow-down"
              color="primary"
              variant="outline"
              size="xs"
              :loading="syncingHotelsWorld"
              @click="triggerSyncWorldwideInventory"
            >
              Importer Lot Mondial
            </UButton>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <UButton variant="ghost" color="gray" @click="openSettings = false">
            Annuler
          </UButton>
          <UButton color="primary" icon="i-heroicons-check" :loading="savingSettings" @click="saveSettings">
            Enregistrer les modifications
          </UButton>
        </div>
      </div>
      </template>
    </UModal>

    <!-- ─── Financial Reconciliation Modal ───────────────────────────────── -->
    <HotelReconciliationModal
      v-model:open="openReconciliation"
      v-model="openReconciliation"
    />

    <!-- ─── Official Hotel Voucher, Relevé de compte & Email Modals ──── -->
    <HotelVoucherModal
      v-model:open="showVoucherModal"
      v-model="showVoucherModal"
      :order="voucherOrder"
      :user="voucherOrder?.user"
    />

    <HotelInvoiceModal
      v-model:open="showInvoiceModal"
      v-model="showInvoiceModal"
      :order="invoiceOrder"
      :user="invoiceOrder?.user"
    />

    <HotelEmailModal
      v-model:open="showEmailModal"
      v-model="showEmailModal"
      :order="emailOrder"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { sendApi } from '@/composables/api';
import HotelVoucherModal from '~/components/hotels/HotelVoucherModal.vue';
import HotelInvoiceModal from '~/components/hotels/HotelInvoiceModal.vue';
import HotelEmailModal from '~/components/hotels/HotelEmailModal.vue';
import HotelReconciliationModal from '~/components/hotels/HotelReconciliationModal.vue';

definePageMeta({
  layout: 'admin',
});

// ─── Reactive State ─────────────────────────────────────────────────────────
const loading = ref(false);
const orders = ref([]);
const stats = ref({});
const settings = ref({});
const search = ref('');
const selectedStatus = ref('all');
const selectedPayment = ref('all');

const pagination = ref({
  current_page: 1,
  per_page: 15,
  total: 0,
});

const showDetails = ref(false);
const selectedOrder = ref(null);
const trackingLoading = ref(false);
const trackingResult = ref(null);
const updatingStatus = ref(false);
const updatingPayment = ref(false);
const openSettings = ref(false);
const openReconciliation = ref(false);
const syncingDestinations = ref(false);
const syncingHotelsAlgeria = ref(false);
const syncingHotelsWorld = ref(false);
const syncingPending = ref(false);
const savingSettings = ref(false);

const settingsTab = ref('pricing');
const settingsForm = ref({
  b2c_markup_percent: 10,
  b2b_default_markup_percent: 5,
  exchange_rate_eur: 165,
  exchange_rate_usd: 150,
  exchange_rate_sar: 40,
  exchange_rate_try: 4.5,
  endpoint: 'https://kalima.mygo.pro/call.php',
  actor: 'BOUAZIZE25',
  user: 'BOUAZIZAPI',
  version: '1.6.1',
  timeout: 90,
  default_nationality: 'DZ',
  is_live_mode: true,
  auto_cancel_unpaid_hours: 24,
  auto_sync_interval_minutes: 15,
  emergency_phone: '+213 (0) 770 20 20 84',
  emergency_email: 'hotels@bouazizetravel.com',
});

function openSettingsModal() {
  if (settings.value) {
    settingsForm.value = {
      b2c_markup_percent: Number(settings.value.b2c_markup_percent ?? 10),
      b2b_default_markup_percent: Number(settings.value.b2b_default_markup_percent ?? 5),
      exchange_rate_eur: Number(settings.value.exchange_rates?.EUR ?? settings.value.exchange_rate_eur ?? 165),
      exchange_rate_usd: Number(settings.value.exchange_rates?.USD ?? settings.value.exchange_rate_usd ?? 150),
      exchange_rate_sar: Number(settings.value.exchange_rates?.SAR ?? settings.value.exchange_rate_sar ?? 40),
      exchange_rate_try: Number(settings.value.exchange_rates?.TRY ?? settings.value.exchange_rate_try ?? 4.5),
      endpoint: settings.value.endpoint || 'https://kalima.mygo.pro/call.php',
      actor: settings.value.actor || 'BOUAZIZE25',
      user: settings.value.user || 'BOUAZIZAPI',
      version: settings.value.version || '1.6.1',
      timeout: Number(settings.value.timeout ?? 90),
      default_nationality: settings.value.default_nationality || 'DZ',
      is_live_mode: settings.value.is_live_mode !== false,
      auto_cancel_unpaid_hours: Number(settings.value.auto_cancel_unpaid_hours ?? 24),
      auto_sync_interval_minutes: Number(settings.value.auto_sync_interval_minutes ?? 15),
      emergency_phone: settings.value.emergency_phone || '+213 (0) 770 20 20 84',
      emergency_email: settings.value.emergency_email || 'hotels@bouazizetravel.com',
    };
  }
  openSettings.value = true;
}

async function saveSettings() {
  savingSettings.value = true;
  try {
    const res = await sendApi('/admin/hotels/settings', settingsForm.value, 'POST');
    alert(res?.message || 'Paramètres Netstorming enregistrés avec succès !');
    await fetchSettings();
    openSettings.value = false;
  } catch (e) {
    console.error('Failed to save settings:', e);
    alert('Erreur: ' + (e?.message || 'Échec de la sauvegarde des paramètres'));
  } finally {
    savingSettings.value = false;
  }
}

async function triggerSyncPending() {
  syncingPending.value = true;
  try {
    const res = await sendApi('/admin/hotels/orders/sync-pending', null, 'POST');
    alert(res?.message || 'Synchronisation des dossiers terminée avec succès !');
    await Promise.all([fetchOrders(), fetchStats()]);
  } catch (e) {
    console.error('Failed to sync pending orders:', e);
    alert('Erreur: ' + (e?.message || 'Échec de la synchronisation'));
  } finally {
    syncingPending.value = false;
  }
}

async function quickConfirmCcp(order) {
  if (!confirm(`Confirmer le règlement CCP de ${order.final_price_dzd} DZD pour le dossier #${order.id} ?`)) return;
  updatingPayment.value = true;
  try {
    await sendApi(`/admin/hotels/orders/${order.id}/status`, {
      payment_status: 'paid',
      status: 'confirmed',
      admin_notes: (order.admin_notes ? order.admin_notes + '\n' : '') + `[${new Date().toISOString()}] Paiement CCP validé manuellement par admin`,
    }, 'PUT');
    order.payment_status = 'paid';
    order.status = 'confirmed';
    await Promise.all([fetchOrders(), fetchStats()]);
    alert('Paiement validé avec succès ! Dossier confirmé.');
  } catch (e) {
    console.error('Failed to confirm payment:', e);
    alert('Erreur: ' + (e?.message || 'Échec de validation'));
  } finally {
    updatingPayment.value = false;
  }
}

async function quickRejectCcp(order) {
  const reason = prompt('Motif du rejet du reçu CCP :');
  if (!reason) return;
  updatingPayment.value = true;
  try {
    await sendApi(`/admin/hotels/orders/${order.id}/status`, {
      payment_status: 'unpaid',
      admin_notes: (order.admin_notes ? order.admin_notes + '\n' : '') + `[${new Date().toISOString()}] Paiement CCP rejeté: ${reason}`,
    }, 'PUT');
    order.payment_status = 'unpaid';
    await Promise.all([fetchOrders(), fetchStats()]);
    alert('Paiement rejeté.');
  } catch (e) {
    console.error('Failed to reject payment:', e);
    alert('Erreur: ' + (e?.message || 'Échec du rejet'));
  } finally {
    updatingPayment.value = false;
  }
}

const showVoucherModal = ref(false);
const voucherOrder = ref(null);

function openVoucher(order) {
  voucherOrder.value = order;
  showVoucherModal.value = true;
}

const showInvoiceModal = ref(false);
const invoiceOrder = ref(null);

function openInvoice(order) {
  invoiceOrder.value = order;
  showInvoiceModal.value = true;
}

const showEmailModal = ref(false);
const emailOrder = ref(null);

function openEmail(order) {
  emailOrder.value = order;
  showEmailModal.value = true;
}

const editForm = ref({
  status: '',
  payment_status: '',
  admin_notes: '',
});

// ─── Filter Options ─────────────────────────────────────────────────────────
const statusOptions = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'En Attente (Pending)', value: 'pending' },
  { label: 'Confirmé (Confirmed)', value: 'confirmed' },
  { label: 'Annulé (Cancelled)', value: 'cancelled' },
  { label: 'Échoué (Failed)', value: 'failed' },
  { label: 'Remboursé (Refunded)', value: 'refunded' },
];

const paymentOptions = [
  { label: 'Tous les paiements', value: 'all' },
  { label: 'Payé (Paid)', value: 'paid' },
  { label: 'Non payé (Unpaid)', value: 'unpaid' },
  { label: 'En Vérification CCP (Pending CCP)', value: 'verification_pending' },
  { label: 'Partiel (Partial)', value: 'partially_paid' },
  { label: 'Remboursé (Refunded)', value: 'refunded' },
];

// ─── Lifecycle & Data Fetching ──────────────────────────────────────────────
onMounted(() => {
  fetchData();
});

async function fetchData() {
  await Promise.all([
    fetchStats(),
    fetchOrders(),
    fetchSettings(),
  ]);
}

async function fetchStats() {
  try {
    const res = await sendApi('/admin/hotels/stats', null, 'GET');
    if (res?.data) {
      stats.value = res.data;
    }
  } catch (e) {
    console.error('Failed to load hotel stats:', e);
  }
}

async function fetchOrders() {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      search: search.value,
      status: selectedStatus.value,
      payment_status: selectedPayment.value,
    });

    const res = await sendApi(`/admin/hotels/orders?${params.toString()}`, null, 'GET');
    if (res?.data) {
      orders.value = res.data.data || [];
      pagination.value.total = res.data.total || 0;
      pagination.value.current_page = res.data.current_page || 1;
    }
  } catch (e) {
    console.error('Failed to load hotel orders:', e);
  } finally {
    loading.value = false;
  }
}

async function fetchSettings() {
  try {
    const res = await sendApi('/admin/hotels/settings', null, 'GET');
    if (res?.data) {
      settings.value = res.data;
    }
  } catch (e) {
    console.error('Failed to load hotel settings:', e);
  }
}

async function triggerManualSync() {
  syncingDestinations.value = true;
  try {
    const res = await sendApi('/admin/hotels/destinations/sync', {}, 'POST');
    alert(res?.message || 'Synchronisation réussie des destinations Netstorming !');
    await fetchSettings();
  } catch (e) {
    console.error('Failed to sync destinations:', e);
    alert('Erreur: ' + (e?.message || 'Échec de la synchronisation'));
  } finally {
    syncingDestinations.value = false;
  }
}

async function triggerSyncAlgeriaHotels() {
  syncingHotelsAlgeria.value = true;
  try {
    const res = await sendApi('/admin/hotels/inventory/sync', { algeria: true }, 'POST');
    alert(res?.message || 'Synchronisation des hôtels en Algérie réussie (58 Wilayas) !');
    await fetchSettings();
  } catch (e) {
    console.error('Failed to sync Algeria hotels:', e);
    alert('Erreur: ' + (e?.message || 'Échec de la synchronisation'));
  } finally {
    syncingHotelsAlgeria.value = false;
  }
}

async function triggerSyncWorldwideInventory() {
  syncingHotelsWorld.value = true;
  try {
    const res = await sendApi('/admin/hotels/inventory/sync', { batch_size: 5000, max: 10000 }, 'POST');
    alert(res?.message || 'Importation du lot mondial réussie !');
    await fetchSettings();
  } catch (e) {
    console.error('Failed to sync worldwide inventory:', e);
    alert('Erreur: ' + (e?.message || 'Échec de la synchronisation'));
  } finally {
    syncingHotelsWorld.value = false;
  }
}

let debounceTimer = null;
function debounceFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    pagination.value.current_page = 1;
    fetchOrders();
  }, 400);
}

function resetFilters() {
  search.value = '';
  selectedStatus.value = 'all';
  selectedPayment.value = 'all';
  pagination.value.current_page = 1;
  fetchOrders();
}

// ─── Order Detail & Actions ─────────────────────────────────────────────────
function openOrderDetails(order) {
  selectedOrder.value = order;
  editForm.value = {
    status: order.status,
    payment_status: order.payment_status,
    admin_notes: order.admin_notes || '',
  };
  trackingResult.value = null;
  showDetails.value = true;
}

async function saveOrderChanges() {
  if (!selectedOrder.value) return;
  updatingStatus.value = true;
  try {
    await sendApi(`/admin/hotels/orders/${selectedOrder.value.id}/status`, editForm.value, 'PUT');
    selectedOrder.value.status = editForm.value.status;
    selectedOrder.value.payment_status = editForm.value.payment_status;
    selectedOrder.value.admin_notes = editForm.value.admin_notes;
    await fetchOrders();
    await fetchStats();
  } catch (e) {
    console.error('Failed to update order:', e);
  } finally {
    updatingStatus.value = false;
  }
}

async function trackBookingNetstorming() {
  if (!selectedOrder.value) return;
  trackingLoading.value = true;
  try {
    const res = await sendApi(`/admin/hotels/orders/${selectedOrder.value.id}/track`, null, 'POST');
    if (res?.data) {
      trackingResult.value = res.data;
      if (res.data.ns_booking_status) {
        selectedOrder.value.ns_booking_status = res.data.ns_booking_status;
      }
    }
  } catch (e) {
    console.error('Failed to track on Netstorming:', e);
  } finally {
    trackingLoading.value = false;
  }
}

async function confirmCancelBooking() {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation sur Netstorming ? Cette action est irréversible.')) {
    return;
  }
  try {
    await sendApi(`/admin/hotels/orders/${selectedOrder.value.id}/cancel`, { reason: 'Annulation demandée depuis l\'administration' }, 'POST');
    selectedOrder.value.status = 'cancelled';
    selectedOrder.value.ns_booking_status = 'can';
    await fetchOrders();
    await fetchStats();
  } catch (e) {
    console.error('Failed to cancel order on Netstorming:', e);
    alert('Erreur: ' + (e?.message || 'Échec de l\'annulation'));
  }
}

// ─── Formatters ─────────────────────────────────────────────────────────────
function formatCurrency(val) {
  return Number(val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(val) {
  if (!val) return '-';
  const d = new Date(val);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(val) {
  if (!val) return '-';
  const d = new Date(val);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'confirmed': return 'emerald';
    case 'pending': return 'amber';
    case 'cancelled': return 'red';
    case 'failed': return 'red';
    case 'refunded': return 'purple';
    default: return 'gray';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'confirmed': return 'Confirmé';
    case 'pending': return 'En Attente';
    case 'cancelled': return 'Annulé';
    case 'failed': return 'Échoué';
    case 'refunded': return 'Remboursé';
    default: return status;
  }
}

function getPaymentBadgeColor(status) {
  switch (status) {
    case 'paid': return 'emerald';
    case 'unpaid': return 'red';
    case 'verification_pending': return 'blue';
    case 'partially_paid': return 'amber';
    case 'refunded': return 'purple';
    default: return 'gray';
  }
}

function getPaymentLabel(status) {
  switch (status) {
    case 'paid': return 'Payé';
    case 'unpaid': return 'Non Payé';
    case 'verification_pending': return 'En Vérification CCP';
    case 'partially_paid': return 'Partiel';
    case 'refunded': return 'Remboursé';
    default: return status;
  }
}
</script>
