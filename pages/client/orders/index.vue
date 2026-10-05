<template>
  <div class="min-h-[calc(100vh-80px)] w-full space-y-6 py-8 pb-16 px-4 md:px-8 bg-slate-50/50 dark:bg-slate-900/50">
    
    <!-- ─── Header Section ────────────────────────────────────────────────── -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xs">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6" />
          </span>
          Mes Dossiers & Commandes
        </h1>
        <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Consultez et suivez l'état de vos réservations d'hôtels et demandes de visa en temps réel.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-arrow-path"
          variant="outline"
          color="gray"
          :loading="activeTab === 'hotels' ? hotelLoading : loading"
          @click="activeTab === 'hotels' ? fetchHotelOrders(hotelPagination.current_page) : getOrders(pagination.pageIndex + 1)"
        >
          Actualiser
        </UButton>
      </div>
    </div>

    <!-- ─── Service Tabs Switcher ─────────────────────────────────────────── -->
    <div class="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
      <!-- Hotels Tab -->
      <button
        type="button"
        @click="switchTab('hotels')"
        :class="[
          'px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2.5 cursor-pointer whitespace-nowrap shadow-xs',
          activeTab === 'hotels'
            ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/20'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/50'
        ]"
      >
        <UIcon name="i-heroicons-building-office-2" class="w-5 h-5" />
        <span>Hôtels (Netstorming)</span>
        <UBadge
          v-if="hotelOrders.length > 0"
          :color="activeTab === 'hotels' ? 'white' : 'primary'"
          variant="subtle"
          size="xs"
          class="font-mono font-bold ml-1"
        >
          {{ hotelPagination.total || hotelOrders.length }}
        </UBadge>
      </button>

      <!-- Visa Tab -->
      <button
        type="button"
        @click="switchTab('visa')"
        :class="[
          'px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2.5 cursor-pointer whitespace-nowrap shadow-xs',
          activeTab === 'visa'
            ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/20'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/50'
        ]"
      >
        <UIcon name="i-heroicons-identification" class="w-5 h-5" />
        <span>Demandes de Visa</span>
        <UBadge
          v-if="data.length > 0"
          :color="activeTab === 'visa' ? 'white' : 'primary'"
          variant="subtle"
          size="xs"
          class="font-mono font-bold ml-1"
        >
          {{ pagination.totalItems || data.length }}
        </UBadge>
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  TAB 1: HÔTELS NETSTORMING                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'hotels'" class="space-y-6 animate-in fade-in duration-200">
      
      <!-- KPI Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <!-- Total -->
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider">Total Réservations</span>
            <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-primary" />
          </div>
          <p class="text-2xl font-black text-slate-900 dark:text-white">{{ hotelStats.total }}</p>
          <span class="text-[11px] text-slate-400">Toutes destinations</span>
        </div>

        <!-- Confirmées -->
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div class="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider">Confirmées</span>
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          </div>
          <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ hotelStats.confirmed }}</p>
          <span class="text-[11px] text-slate-400">Prêtes pour séjour</span>
        </div>

        <!-- En Attente / Non payé -->
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div class="flex items-center justify-between text-amber-500 mb-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider">À Régler / Attente</span>
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
          </div>
          <p class="text-2xl font-black text-amber-500">{{ hotelStats.pending + hotelStats.unpaid }}</p>
          <span class="text-[11px] text-slate-400">Paiement requis</span>
        </div>

        <!-- Annulées -->
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div class="flex items-center justify-between text-rose-500 mb-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider">Annulées</span>
            <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
          </div>
          <p class="text-2xl font-black text-rose-500">{{ hotelStats.cancelled }}</p>
          <span class="text-[11px] text-slate-400">Dossiers clôturés</span>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <!-- Search Input -->
          <div class="sm:col-span-2 lg:col-span-2">
            <UInput
              v-model="hotelSearch"
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher par hôtel, ville, réf. Netstorming..."
              class="w-full"
              @update:model-value="debounceHotelFetch"
            />
          </div>

          <!-- Status Filter -->
          <USelect
            v-model="hotelSelectedStatus"
            :items="hotelStatusOptions"
            value-key="value"
            placeholder="Statut Réservation"
            @change="fetchHotelOrders(1)"
          />

          <!-- Payment Filter -->
          <USelect
            v-model="hotelSelectedPayment"
            :items="hotelPaymentOptions"
            value-key="value"
            placeholder="Statut Paiement"
            @change="fetchHotelOrders(1)"
          />
        </div>
      </div>

      <!-- Hotel Orders Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th class="py-3.5 px-4">Dossier & Réf.</th>
                <th class="py-3.5 px-4">Hôtel & Destination</th>
                <th class="py-3.5 px-4">Séjour & Formule</th>
                <th class="py-3.5 px-4">Voyageurs</th>
                <th class="py-3.5 px-4">Montant Total</th>
                <th class="py-3.5 px-4">Statut</th>
                <th class="py-3.5 px-4">Paiement</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <!-- Loading -->
              <tr v-if="hotelLoading && !hotelOrders.length">
                <td colspan="8" class="py-12 text-center text-slate-400">
                  <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                  Chargement de vos réservations d'hôtels...
                </td>
              </tr>

              <!-- Empty -->
              <tr v-else-if="!hotelOrders.length">
                <td colspan="8" class="py-16 text-center text-slate-400">
                  <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p class="font-bold text-slate-700 dark:text-slate-200 text-base">Aucune réservation hôtelière trouvée</p>
                  <p class="text-xs text-slate-400 mt-1 mb-4">Vous n'avez pas encore effectué de réservation d'hôtel.</p>
                  <UButton to="/services/hotels" color="primary" icon="i-heroicons-magnifying-glass">
                    Rechercher un Hôtel
                  </UButton>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="order in hotelOrders"
                :key="order.id"
                class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <!-- Reference & ID -->
                <td class="py-3.5 px-4">
                  <div class="font-mono font-bold text-slate-900 dark:text-white">
                    #HOTEL-{{ order.id }}
                  </div>
                  <div v-if="order.ns_booking_reference" class="flex items-center gap-1.5 mt-1">
                    <span class="inline-flex items-center gap-1 text-[11px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-semibold">
                      {{ order.ns_booking_reference }}
                    </span>
                    <button
                      type="button"
                      class="text-slate-400 hover:text-primary transition-colors"
                      title="Copier référence"
                      @click.stop="copyToClipboard(order.ns_booking_reference)"
                    >
                      <UIcon name="i-heroicons-clipboard-document" class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span class="block text-[11px] text-slate-400 mt-0.5">
                    {{ formatDateShort(order.created_at) }}
                  </span>
                </td>

                <!-- Hotel & Destination -->
                <td class="py-3.5 px-4 max-w-[220px]">
                  <div class="font-bold text-slate-900 dark:text-white truncate" :title="order.hotel_name">
                    {{ order.hotel_name || 'Hôtel' }}
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <span class="text-primary font-semibold uppercase">{{ order.hotel_city || order.destination_name }}</span>
                    <span v-if="order.hotel_category" class="text-amber-500 font-bold">· {{ order.hotel_category }}★</span>
                  </div>
                </td>

                <!-- Stay & Meal -->
                <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  <div class="font-medium text-xs">
                    {{ formatDateShort(order.check_in) }} → {{ formatDateShort(order.check_out) }}
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <span class="font-semibold text-slate-700 dark:text-slate-300">{{ order.nights }} nuits</span>
                    <span v-if="order.meal_basis_name" class="truncate max-w-[140px]" :title="order.meal_basis_name">· {{ order.meal_basis_name }}</span>
                  </div>
                </td>

                <!-- Pax -->
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {{ order.adults }} Adulte(s)<span v-if="order.children">, {{ order.children }} Enfant(s)</span>
                  </div>
                  <div v-if="order.pax_details && order.pax_details[0]" class="text-[11px] text-slate-400 truncate max-w-[140px]">
                    {{ order.pax_details[0].name }} {{ order.pax_details[0].surname }}
                  </div>
                </td>

                <!-- Total Price -->
                <td class="py-3.5 px-4">
                  <div class="font-black text-primary text-sm whitespace-nowrap">
                    {{ formatCurrency(order.final_price_dzd) }} DZD
                  </div>
                </td>

                <!-- Booking Status -->
                <td class="py-3.5 px-4">
                  <UBadge
                    :color="getStatusBadgeColor(order.status)"
                    variant="subtle"
                    size="sm"
                    class="font-semibold capitalize"
                  >
                    {{ getStatusLabel(order.status) }}
                  </UBadge>
                </td>

                <!-- Payment Status -->
                <td class="py-3.5 px-4">
                  <UBadge
                    :color="getPaymentBadgeColor(order.payment_status)"
                    variant="subtle"
                    size="sm"
                    class="font-semibold capitalize"
                  >
                    {{ getPaymentLabel(order.payment_status) }}
                  </UBadge>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- View Details -->
                    <UButton
                      size="xs"
                      variant="soft"
                      color="primary"
                      icon="i-heroicons-eye"
                      title="Voir détails de la réservation"
                      @click="openHotelDrawer(order)"
                    >
                      Détails
                    </UButton>

                    <!-- Pay via CCP if unpaid -->
                    <UButton
                      v-if="order.payment_status === 'unpaid'"
                      size="xs"
                      color="emerald"
                      icon="i-heroicons-credit-card"
                      title="Payer par CCP / BaridiMob"
                      @click="openCcpPayment(order)"
                    >
                      Payer
                    </UButton>

                    <!-- Print Voucher if confirmed -->
                    <UButton
                      v-if="order.status === 'confirmed'"
                      size="xs"
                      variant="outline"
                      color="gray"
                      icon="i-heroicons-printer"
                      title="Imprimer le bon d'hôtel (Voucher)"
                      @click="openVoucher(order)"
                    />

                    <!-- Official Invoice Button -->
                    <UButton
                      v-if="order.payment_status === 'paid' || order.status === 'confirmed'"
                      size="xs"
                      variant="outline"
                      color="gray"
                      icon="i-heroicons-document-text"
                      title="Facture officielle"
                      @click="openHotelInvoice(order)"
                    />

                    <!-- Cancel Button -->
                    <UButton
                      v-if="order.status !== 'cancelled' && order.status !== 'failed'"
                      size="xs"
                      variant="ghost"
                      color="rose"
                      icon="i-heroicons-x-mark"
                      title="Annuler cette réservation"
                      @click="promptCancelHotelOrder(order)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Hotel Pagination -->
        <div v-if="hotelPagination.last_page > 1" class="flex justify-between items-center px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Page {{ hotelPagination.current_page }} sur {{ hotelPagination.last_page }} ({{ hotelPagination.total }} réservations)
          </div>
          <div class="flex items-center gap-1.5">
            <UButton
              size="xs"
              variant="outline"
              color="gray"
              :disabled="hotelPagination.current_page <= 1"
              @click="fetchHotelOrders(hotelPagination.current_page - 1)"
            >
              Précédent
            </UButton>
            <UButton
              size="xs"
              variant="outline"
              color="gray"
              :disabled="hotelPagination.current_page >= hotelPagination.last_page"
              @click="fetchHotelOrders(hotelPagination.current_page + 1)"
            >
              Suivant
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  TAB 2: DEMANDES DE VISA (PRESERVED INTACT)                             -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'visa'" class="space-y-4 animate-in fade-in duration-200">
      <div class="flex flex-col gap-5">
        <div>
          <UInput 
            v-model="search"
            icon="i-lucide-search" 
            size="md" 
            variant="outline"
            placeholder="Rechercher par pays, demandeur..."
            @update:model-value="getOrders"
          />
        </div>
        <div>
          <UTable
            :sticky="true"
            ref="table"
            v-model:pagination="pagination"
            :data="data"
            :columns="columns"
            :loading="loading && !data.length"
            :empty="loading ? 'Chargement en cours...' : 'Aucune demande de visa trouvée'"
            class="flex-1 h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
          />

          <div class="flex justify-center border-t border-default pt-4">
            <UPagination
              :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getState().pagination.totalItems"
              @update:page="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  SLIDEOVER: HOTEL ORDER DETAILS & ACTIONS                               -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <USlideover
      v-model:open="showHotelDetails"
      :close="false"
      :ui="{ content: 'sm:max-w-2xl max-w-full bg-white dark:bg-slate-900 shadow-2xl' }"
    >
      <template #content="{ close }">
        <div v-if="selectedHotelOrder" class="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
        
        <!-- Header Hotel Badge -->
        <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono font-bold text-primary">#HOTEL-{{ selectedHotelOrder.id }}</span>
            <UBadge :color="getStatusBadgeColor(selectedHotelOrder.status)" variant="subtle" size="sm" class="font-bold">
              {{ getStatusLabel(selectedHotelOrder.status) }}
            </UBadge>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">
            {{ selectedHotelOrder.hotel_name }}
          </h2>
          <div class="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span class="font-semibold text-slate-700 dark:text-slate-300 uppercase">{{ selectedHotelOrder.hotel_city }}</span>
            <span v-if="selectedHotelOrder.hotel_category" class="text-amber-500 font-bold">· {{ selectedHotelOrder.hotel_category }}★</span>
            <span>· Réservé le {{ formatDateShort(selectedHotelOrder.created_at) }}</span>
          </div>
        </div>

        <!-- Netstorming Live Status Box -->
        <div class="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 class="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Suivi Direct Netstorming
              </h4>
            </div>
            <UButton
              size="xs"
              color="primary"
              variant="outline"
              :loading="hotelTrackingLoading"
              @click="trackHotelBooking(selectedHotelOrder)"
            >
              Vérifier en direct
            </UButton>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-400 block text-[10px]">Référence Netstorming:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                {{ selectedHotelOrder.ns_booking_reference || 'Non assigné' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Statut Fournisseur:</span>
              <span class="font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                {{ selectedHotelOrder.ns_booking_status || selectedHotelOrder.status }}
              </span>
            </div>
          </div>

          <div v-if="hotelTrackingData" class="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-xs border border-blue-100 dark:border-blue-900 text-slate-700 dark:text-slate-300">
            <p class="font-bold text-blue-600 mb-1">Rapport de synchronisation en direct :</p>
            <div class="space-y-1 text-[11px]">
              <p><strong>Statut :</strong> {{ hotelTrackingData.ns_booking_status }}</p>
              <p v-if="hotelTrackingData.supplier_reference"><strong>Réf. Fournisseur :</strong> {{ hotelTrackingData.supplier_reference }}</p>
              <p v-if="hotelTrackingData.booked_at"><strong>Horodatage :</strong> {{ hotelTrackingData.booked_at }}</p>
            </div>
          </div>
        </div>

        <!-- Stay Details -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
          <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Informations du Séjour
          </h4>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Date d'arrivée (Check-in) :</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatDateShort(selectedHotelOrder.check_in) }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Date de départ (Check-out) :</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatDateShort(selectedHotelOrder.check_out) }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Durée :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedHotelOrder.nights }} nuit(s)</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Régime de repas :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedHotelOrder.meal_basis_name || 'Standard' }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-slate-400 block text-[11px]">Type de chambre :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedHotelOrder.room_basis_name || selectedHotelOrder.room_code }}</span>
            </div>
          </div>
        </div>

        <!-- Passengers Manifest -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
          <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Liste des Voyageurs ({{ selectedHotelOrder.adults }} Adultes<span v-if="selectedHotelOrder.children">, {{ selectedHotelOrder.children }} Enfants</span>)
          </h4>
          <div v-if="selectedHotelOrder.pax_details && selectedHotelOrder.pax_details.length" class="space-y-2">
            <div
              v-for="(pax, idx) in selectedHotelOrder.pax_details"
              :key="idx"
              class="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-user" class="w-4 h-4 text-primary" />
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ pax.title || '' }} {{ pax.name }} {{ pax.surname }}</span>
              </div>
              <UBadge size="xs" variant="subtle" color="gray" class="capitalize">
                {{ pax.type || 'adulte' }}
              </UBadge>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 italic">Aucun détail passager spécifique enregistré.</p>
        </div>

        <!-- Pricing Breakdown -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-2.5">
          <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Règlement & Tarifs
          </h4>
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span>Statut du paiement :</span>
            <UBadge :color="getPaymentBadgeColor(selectedHotelOrder.payment_status)" variant="subtle" size="xs">
              {{ getPaymentLabel(selectedHotelOrder.payment_status) }}
            </UBadge>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span>Condition d'annulation :</span>
            <span class="font-semibold text-slate-700 dark:text-slate-300">
              {{ selectedHotelOrder.cancellation_deadline ? `Gratuite jusqu'au ${formatDateShort(selectedHotelOrder.cancellation_deadline)}` : 'Selon conditions de l\'hôtel' }}
            </span>
          </div>
          <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span class="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Total à payer :</span>
            <span class="text-lg font-black text-primary">{{ formatCurrency(selectedHotelOrder.final_price_dzd) }} DZD</span>
          </div>
        </div>

        <!-- Drawer Action Buttons -->
        <div class="space-y-2.5 pt-2">
          <!-- Pay via CCP button -->
          <UButton
            v-if="selectedHotelOrder.payment_status === 'unpaid'"
            block
            color="emerald"
            icon="i-heroicons-credit-card"
            class="font-bold"
            @click="openCcpPayment(selectedHotelOrder)"
          >
            Payer par CCP / BaridiMob ({{ formatCurrency(selectedHotelOrder.final_price_dzd) }} DZD)
          </UButton>

          <!-- Print Voucher -->
          <UButton
            v-if="selectedHotelOrder.status === 'confirmed'"
            block
            variant="outline"
            color="primary"
            icon="i-heroicons-printer"
            class="font-bold"
            @click="openVoucher(selectedHotelOrder)"
          >
            Télécharger / Imprimer Bon d'Hôtel (Voucher)
          </UButton>

          <!-- Official Relevé de compte -->
          <UButton
            v-if="selectedHotelOrder.payment_status === 'paid' || selectedHotelOrder.status === 'confirmed'"
            block
            variant="outline"
            color="gray"
            icon="i-heroicons-document-text"
            class="font-bold"
            @click="openHotelInvoice(selectedHotelOrder)"
          >
            Télécharger / Imprimer Relevé de compte
          </UButton>

          <!-- Official Email Confirmation -->
          <UButton
            block
            variant="outline"
            color="emerald"
            icon="i-heroicons-envelope"
            class="font-bold"
            @click="openEmail(selectedHotelOrder)"
          >
            Aperçu Email de Confirmation
          </UButton>

          <!-- Cancel Reservation -->
          <UButton
            v-if="selectedHotelOrder.status !== 'cancelled' && selectedHotelOrder.status !== 'failed'"
            block
            variant="soft"
            color="rose"
            icon="i-heroicons-trash"
            class="font-bold"
            @click="promptCancelHotelOrder(selectedHotelOrder)"
          >
            Demander l'Annulation de la Réservation
          </UButton>
        </div>
      </div>
      </template>
    </USlideover>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  MODALS: OFFICIAL HOTEL VOUCHER, RELEVÉ DE COMPTE & EMAIL             -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <HotelVoucherModal
      v-model:open="showVoucherModal"
      v-model="showVoucherModal"
      :order="voucherOrder"
      :user="user"
    />

    <HotelInvoiceModal
      v-model:open="showInvoiceModal"
      v-model="showInvoiceModal"
      :order="invoiceOrder"
      :user="user"
    />

    <HotelEmailModal
      v-model:open="showEmailModal"
      v-model="showEmailModal"
      :order="emailOrder"
    />

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  MODAL: CCP / BARIDIMOB PAYMENT                                        -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <UModal
      v-model:open="showCcpModal"
      :close="false"
      :ui="{ content: 'sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 p-0 rounded-2xl shadow-2xl' }"
    >
      <template #content="{ close }">
        <div v-if="ccpOrder" class="p-6 space-y-5 bg-white dark:bg-slate-900 rounded-2xl">
          <!-- Header & Amount -->
          <div class="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 dark:text-slate-400">Montant à régler pour :</span>
              <h4 class="font-bold text-slate-900 dark:text-white line-clamp-1">{{ ccpOrder.hotel_name }}</h4>
              <span class="text-[11px] font-mono text-primary">#HOTEL-{{ ccpOrder.id }}</span>
            </div>
            <div class="text-right">
              <span class="text-xl font-black text-primary">{{ formatCurrency(ccpOrder.final_price_dzd) }} DZD</span>
            </div>
          </div>

          <!-- Agency Bank Details -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Coordonnées Bancaires de l'Agence
            </p>
            <div v-if="ccpLoading" class="text-slate-400 py-2">Chargement des coordonnées...</div>
            <div v-else-if="ccpSettings" class="space-y-1.5 text-slate-600 dark:text-slate-300">
              <div class="flex justify-between">
                <span>Compte CCP :</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ ccpSettings.ccp_account_number }} (Clé: {{ ccpSettings.ccp_key }})</span>
              </div>
              <div v-if="ccpSettings.baridi_mob_number" class="flex justify-between">
                <span>RIP BaridiMob :</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ ccpSettings.baridi_mob_number }}</span>
              </div>
              <div class="flex justify-between">
                <span>Titulaire du compte :</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ ccpSettings.owner_name }}</span>
              </div>
            </div>
            <div v-else class="text-amber-500 py-1">Coordonnées par défaut : Contactez le support au besoin.</div>
          </div>

          <!-- Payment Submission Form -->
          <div class="space-y-4">
            <!-- Transaction Number -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro de Transaction (BaridiMob ou Reçu Postal) *
              </label>
              <UInput
                v-model="ccpTransactionNumber"
                placeholder="Ex: 0092837492..."
                class="w-full"
              />
            </div>

            <!-- File Upload -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preuve de paiement (Reçu scanné ou capture d'écran) *
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
                @change="onCcpFileChange"
              />
              <p v-if="ccpProofFile" class="text-[11px] text-emerald-600 mt-1 font-semibold">
                Fichier sélectionné : {{ ccpProofFile.name }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <UButton variant="ghost" color="gray" @click="showCcpModal = false">
              Annuler
            </UButton>
            <UButton
              color="primary"
              icon="i-heroicons-arrow-up-tray"
              :loading="ccpSubmitting"
              @click="submitCcpPayment"
            >
              Envoyer le Justificatif
            </UButton>
          </div>

        </div>
      </template>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  MODAL: CONFIRMATION ANNULATION HÔTEL                                  -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <UModal
      v-model:open="openHotelCancelModal"
      :close="false"
      :ui="{ content: 'sm:max-w-md bg-white dark:bg-slate-900 p-0 rounded-2xl shadow-2xl' }"
    >
      <template #content="{ close }">
        <div v-if="orderToCancel" class="p-6 space-y-4 bg-white dark:bg-slate-900 rounded-2xl">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-rose-500 shrink-0" />
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">Annuler la réservation ?</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Êtes-vous sûr de vouloir annuler votre réservation pour <strong>{{ orderToCancel.hotel_name }}</strong> (Réf: {{ orderToCancel.ns_booking_reference || orderToCancel.id }}) ?
              </p>
              <p v-if="orderToCancel.cancellation_deadline" class="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">
                Date limite sans frais : {{ formatDateShort(orderToCancel.cancellation_deadline) }}
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <UButton variant="ghost" color="gray" @click="openHotelCancelModal = false">
              Garder ma réservation
            </UButton>
            <UButton color="rose" :loading="cancellingOrder" @click="confirmCancelHotelBooking">
              Confirmer l'annulation
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!--  VISA SLIDEOVER & MODALS (PRESERVED INTACT)                             -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <USlideover fullscreen v-model:open="open" close-icon="i-lucide-arrow-right" :close="{ color: 'secondary', class: 'cursor-pointer' }">
      <template #header>
        <div class="flex flex-col gap-2">
          <div class="font-bold text-secondary">
            <div>{{ order?.user?.name }}</div>
          </div>
          <UBadge class="w-fit font-bold" variant="subtle" :color="offerStatus?.color || 'primary'" :label="offerStatus?.label || 'En attente'" />
        </div>
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Visa:</p>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center">
                <img v-if="order?.visa?.country?.flag" :src="order?.visa?.country?.flag" class="w-full h-full object-cover" />
                <UIcon v-else name="i-heroicons-globe-alt" class="w-4 h-4 text-gray-400" />
              </div>
              <div>{{ order?.visa?.country?.name }}</div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Offre:</p>
            <div>{{ order?.visa?.name }}</div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Garantie:</p>
            <div>{{ offerGuarantee }}</div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Date:</p>
            <NuxtTime :datetime="order?.created_at" locale="fr-FR" year="numeric" month="long" day="numeric" />
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Prix unitaire:</p>
            <div>{{ order?.price / (order?.members || 1) }} DZD</div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Membres:</p>
            <div>{{ order?.members }}</div>
          </div>
          <UBadge size="xl" color="success" variant="subtle" class="w-fit flex items-center gap-2">
            <p class="text-secondary">Prix total:</p>
            <div class="font-bold">{{ order?.price }} DZD</div>
          </UBadge>
        </div>
      </template>
      <template #footer>
        <div v-if="order?.paiment_status === 'unpaid'" class="w-1/2">
          <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'payer')" class="w-full align-middle font-bold" color="success">
            <div class="w-full flex justify-between items-center">
              <div>Payé</div>
              <UIcon name="i-fluent-payment-24-filled" />
            </div>
          </UButton>
        </div>
        <div v-else-if="order?.status === 'pending' && order?.paiment_status === 'paid'" class="w-full flex gap-2 justify-between">
          <UButton @click="openAccept = true" class="w-full align-middle font-bold" color="success">
            <div class="w-full flex justify-between items-center">
              <div>Accepter</div>
              <UIcon name="i-icon-park-solid-correct" />
            </div>
          </UButton>
          <UButton :loading="loadingAction === 'reject'" loading-icon="i-lucide-loader-circle" @click="() => openConfirmation(order.id, 'rejeter')" class="w-full align-middle font-bold" color="error">
            <div class="w-full flex justify-between items-center">
              <div>Rejeter</div>
              <UIcon name="i-emojione-monotone-heavy-multiplication-x" />
            </div>
          </UButton>
        </div>
        <div v-else class="w-1/2">
          <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'supprimer')" class="w-full align-middle font-bold" color="error">
            <div class="w-full flex justify-between items-center">
              <div>Supprimer</div>
              <UIcon name="i-material-symbols-delete-outline" />
            </div>
          </UButton>
        </div>
      </template>
    </USlideover>

    <UModal v-model:open="openAccept" title="Confirmation de commande">
      <template #body>
        <div class="flex flex-col gap-5">
          <div class="flex justify-center">
            <label v-if="!uploadedFile.url" for="file">
              <div class="cursor-pointer flex flex-col gap-2 justify-center items-center w-[200px] h-[100px] border-solid border-1 border-primary bg-primary/5 rounded-none">
                <UIcon name="i-lineicons-upload" class="text-primary" size="30" />
                <div class="text-primary text-sm font-bold">Télécharger un document</div>
              </div>
              <UInput type="file" class="hidden" id="file" @change="onFileChange" />
            </label>
            <div v-else class="flex items-start" style="margin-top: 20px;">
              <ULink :to="uploadedFile.url">
                <UIcon name="i-teenyicons-pdf-solid" class="text-secondary" size="100" />
              </ULink>
              <UIcon 
                name="i-material-symbols-cancel" 
                class="cursor-pointer text-error"
                @click="() => {
                  uploadedFile.url = null
                  uploadedFile.file = null 
                }"
              />
            </div>
          </div>
          <div class="flex justify-center">
            <UButton loading-icon="i-lucide-loader-circle" :loading="loadingAction === 'accept'" @click="acceptOrder" label="Envoyer" color="primary" class="font-bold w-fit" />
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="openInvoice" title="Ajouter une facture">
      <template #body>
        <div class="flex flex-col gap-5">
          <UFormField :ui="{ label: 'text-secondary' }" label="Adresse" name="address">
            <UInput placeholder="Adresse" v-model="bank_info.address" class="lg:w-100 md:w-80 w-60" />
          </UFormField>
          <UFormField :ui="{ label: 'text-secondary' }" label="Clé" name="key">
            <UInput placeholder="Clé" v-model="bank_info.key" class="lg:w-100 md:w-80 w-60" />
          </UFormField>
          <UFormField :ui="{ label: 'text-secondary' }" label="RIB" name="rib">
            <UInput placeholder="RIB" v-model="bank_info.rib" class="lg:w-100 md:w-80 w-60" />
          </UFormField>
          <div class="flex justify-center">
            <UButton loading-icon="i-lucide-loader-circle" :loading="loadingAction === 'invoice'" @click="createInvoice()" label="Ajouter" color="primary" class="font-bold w-fit" />
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup>
import { h, resolveComponent, ref, computed, onMounted } from 'vue'
import { refDebounced, useRoute, useRouter } from '#imports'
import { NuxtTime, UIcon } from '#components'
import Confirmation from '~/components/modals/Confirmation.vue'
import Invoice from '~/components/invoices/Invoice.vue'
import html2canvas from 'html2canvas'
import { sendApi } from '@/composables/api'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// ─── ACTIVE SERVICE TAB ──────────────────────────────────────────────────────
const activeTab = ref(route.query.tab === 'visa' ? 'visa' : 'hotels')

function switchTab(tab) {
  activeTab.value = tab
  router.replace({ query: { ...route.query, tab } })
  if (tab === 'hotels') {
    fetchHotelOrders(1)
  } else if (tab === 'visa') {
    getOrders(1)
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  HOTEL ORDERS STATE & LOGIC
// ═════════════════════════════════════════════════════════════════════════════
const hotelOrders = ref([])
const hotelLoading = ref(false)
const hotelSearch = ref('')
const hotelSelectedStatus = ref('all')
const hotelSelectedPayment = ref('all')

const hotelStatusOptions = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'Confirmé', value: 'confirmed' },
  { label: 'En Attente', value: 'pending' },
  { label: 'Annulé', value: 'cancelled' },
  { label: 'Échoué', value: 'failed' },
]

const hotelPaymentOptions = [
  { label: 'Tous les paiements', value: 'all' },
  { label: 'Payé', value: 'paid' },
  { label: 'Non Payé', value: 'unpaid' },
  { label: 'En Vérification CCP', value: 'verification_pending' },
]

const hotelPagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1
})

const hotelStats = computed(() => {
  const all = hotelOrders.value || []
  return {
    total: hotelPagination.value.total || all.length,
    confirmed: all.filter(o => o.status === 'confirmed').length,
    pending: all.filter(o => o.status === 'pending').length,
    cancelled: all.filter(o => o.status === 'cancelled').length,
    unpaid: all.filter(o => o.payment_status === 'unpaid').length,
  }
})

let hotelDebounceTimer = null
function debounceHotelFetch() {
  clearTimeout(hotelDebounceTimer)
  hotelDebounceTimer = setTimeout(() => {
    fetchHotelOrders(1)
  }, 350)
}

async function fetchHotelOrders(page = 1) {
  hotelLoading.value = true
  try {
    let url = `/hotels/orders?page=${page}&per_page=10`
    if (hotelSearch.value) url += `&search=${encodeURIComponent(hotelSearch.value)}`
    if (hotelSelectedStatus.value && hotelSelectedStatus.value !== 'all') url += `&status=${hotelSelectedStatus.value}`
    if (hotelSelectedPayment.value && hotelSelectedPayment.value !== 'all') url += `&payment_status=${hotelSelectedPayment.value}`

    const res = await sendApi(url, null, 'GET', { silent: true })
    const data = res?.data
    if (data?.data && Array.isArray(data.data)) {
      hotelOrders.value = data.data
      hotelPagination.value = {
        current_page: data.current_page || page,
        per_page: data.per_page || 10,
        total: data.total || 0,
        last_page: data.last_page || 1
      }
    } else if (Array.isArray(data)) {
      hotelOrders.value = data
      hotelPagination.value.total = data.length
    }
  } catch (err) {
    console.error('Error fetching hotel orders:', err)
  } finally {
    hotelLoading.value = false
  }
}

// ─── Hotel Slideover & Live Tracking ─────────────────────────────────────────
const showHotelDetails = ref(false)
const selectedHotelOrder = ref(null)
const hotelTrackingLoading = ref(false)
const hotelTrackingData = ref(null)

function openHotelDrawer(order) {
  selectedHotelOrder.value = order
  hotelTrackingData.value = null
  showHotelDetails.value = true
}

async function trackHotelBooking(order) {
  if (!order?.id) return
  hotelTrackingLoading.value = true
  try {
    const res = await sendApi(`/hotels/orders/${order.id}/track`, null, 'GET')
    if (res?.data) {
      hotelTrackingData.value = res.data
      if (res.data.ns_booking_status) {
        order.ns_booking_status = res.data.ns_booking_status
      }
      toast.add({
        title: 'Suivi Netstorming mis à jour',
        description: `Statut en direct : ${res.data.ns_booking_status || 'Confirmé'}`,
        color: 'emerald'
      })
    }
  } catch (err) {
    toast.add({
      title: 'Erreur de suivi',
      description: err?.response?.data?.message || 'Impossible de contacter Netstorming en direct.',
      color: 'red'
    })
  } finally {
    hotelTrackingLoading.value = false
  }
}

// ─── Hotel Cancellation ──────────────────────────────────────────────────────
const openHotelCancelModal = ref(false)
const orderToCancel = ref(null)
const cancellingOrder = ref(false)

function promptCancelHotelOrder(order) {
  orderToCancel.value = order
  openHotelCancelModal.value = true
}

async function confirmCancelHotelBooking() {
  if (!orderToCancel.value) return
  cancellingOrder.value = true
  try {
    await sendApi(`/hotels/orders/${orderToCancel.value.id}/cancel`, null, 'POST')
    toast.add({
      title: 'Réservation annulée',
      description: 'Votre réservation d\'hôtel a été annulée avec succès.',
      color: 'emerald'
    })
    orderToCancel.value.status = 'cancelled'
    openHotelCancelModal.value = false
    if (selectedHotelOrder.value?.id === orderToCancel.value.id) {
      selectedHotelOrder.value.status = 'cancelled'
    }
    await fetchHotelOrders(hotelPagination.value.current_page)
  } catch (err) {
    toast.add({
      title: 'Échec d\'annulation',
      description: err?.response?.data?.message || 'Erreur lors de l\'annulation.',
      color: 'red'
    })
  } finally {
    cancellingOrder.value = false
  }
}

// ─── Voucher, Relevé de compte & Email Modals ──────────────────────────────
import HotelVoucherModal from '~/components/hotels/HotelVoucherModal.vue'
import HotelInvoiceModal from '~/components/hotels/HotelInvoiceModal.vue'
import HotelEmailModal from '~/components/hotels/HotelEmailModal.vue'

const showVoucherModal = ref(false)
const voucherOrder = ref(null)

function openVoucher(order) {
  voucherOrder.value = order
  showVoucherModal.value = true
}

const showInvoiceModal = ref(false)
const invoiceOrder = ref(null)

function openHotelInvoice(order) {
  invoiceOrder.value = order
  showInvoiceModal.value = true
}

const showEmailModal = ref(false)
const emailOrder = ref(null)

function openEmail(order) {
  emailOrder.value = order
  showEmailModal.value = true
}

// ─── CCP / BaridiMob Payment Modal ───────────────────────────────────────────
const showCcpModal = ref(false)
const ccpOrder = ref(null)
const ccpSettings = ref(null)
const ccpLoading = ref(false)
const ccpSubmitting = ref(false)
const ccpTransactionNumber = ref('')
const ccpProofFile = ref(null)

async function openCcpPayment(order) {
  ccpOrder.value = order
  ccpTransactionNumber.value = ''
  ccpProofFile.value = null
  showCcpModal.value = true

  if (!ccpSettings.value) {
    ccpLoading.value = true
    try {
      const res = await sendApi('/client/ccp/settings', null, 'GET', { silent: true })
      ccpSettings.value = res?.data || null
    } catch (e) {
      console.error(e)
    } finally {
      ccpLoading.value = false
    }
  }
}

function onCcpFileChange(e) {
  const file = e.target.files?.[0]
  if (file) {
    ccpProofFile.value = file
  }
}

async function submitCcpPayment() {
  if (!ccpOrder.value || !ccpTransactionNumber.value || !ccpProofFile.value) {
    toast.add({
      title: 'Champs incomplets',
      description: 'Veuillez saisir le numéro de transaction et joindre le reçu.',
      color: 'red'
    })
    return
  }

  ccpSubmitting.value = true
  const formData = new FormData()
  formData.append('order_type', 'hotel')
  formData.append('order_id', ccpOrder.value.id)
  formData.append('transaction_number', ccpTransactionNumber.value)
  formData.append('proof_file', ccpProofFile.value)

  try {
    await sendApi('/client/ccp/submit', formData, 'POST')
    toast.add({
      title: 'Paiement soumis !',
      description: 'Votre reçu a été envoyé avec succès et est en cours de vérification.',
      color: 'emerald'
    })
    showCcpModal.value = false
    ccpOrder.value.payment_status = 'verification_pending'
    if (selectedHotelOrder.value?.id === ccpOrder.value.id) {
      selectedHotelOrder.value.payment_status = 'verification_pending'
    }
    await fetchHotelOrders(hotelPagination.value.current_page)
  } catch (err) {
    toast.add({
      title: 'Erreur de soumission',
      description: err?.response?.data?.message || 'Échec de l\'envoi du justificatif de paiement.',
      color: 'red'
    })
  } finally {
    ccpSubmitting.value = false
  }
}

// ─── Formatters & Utility Functions ──────────────────────────────────────────
function formatCurrency(val) {
  return Number(val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(val) {
  if (!val) return '-'
  const d = new Date(val)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(val) {
  if (!val) return '-'
  const d = new Date(val)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'confirmed': return 'emerald'
    case 'pending': return 'amber'
    case 'cancelled': return 'rose'
    case 'failed': return 'red'
    case 'refunded': return 'purple'
    default: return 'gray'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'confirmed': return 'Confirmé'
    case 'pending': return 'En Attente'
    case 'cancelled': return 'Annulé'
    case 'failed': return 'Échoué'
    case 'refunded': return 'Remboursé'
    default: return status || 'Inconnu'
  }
}

function getPaymentBadgeColor(status) {
  switch (status) {
    case 'paid': return 'emerald'
    case 'unpaid': return 'rose'
    case 'verification_pending': return 'blue'
    case 'partially_paid': return 'amber'
    case 'refunded': return 'purple'
    default: return 'gray'
  }
}

function getPaymentLabel(status) {
  switch (status) {
    case 'paid': return 'Payé'
    case 'unpaid': return 'Non Payé'
    case 'verification_pending': return 'En Vérification CCP'
    case 'partially_paid': return 'Partiel'
    case 'refunded': return 'Remboursé'
    default: return status || 'Non payé'
  }
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text)
  toast.add({
    title: 'Copié !',
    description: `Référence ${text} copiée dans le presse-papiers.`,
    color: 'emerald'
  })
}

// ═════════════════════════════════════════════════════════════════════════════
//  VISA STATE & ACTIONS (PRESERVED INTACT)
// ═════════════════════════════════════════════════════════════════════════════
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const overlay = useOverlay()
const order = ref({})
const action = ref(null)

const openConfirmation = async (id, action) => {
  const modal = overlay.create(Confirmation, {
    props: {
      title: `Êtes-vous sûr de vouloir ${action} cette commande ?`,
    },
    defineEmits: ['delete']
  })
  const instance = modal.open()
  const close = await instance.result
  if (!close) {
    if (action === "rejeter") {
      rejectOrder(id)
    } else if (action === "payer") {
      markAsPaid(id)
    } else {
      deleteOrder(id)
    }
  }
}

const openInvoiceModal = async (id) => {
  const invoices = await getInvoice(id)
  const invoiceModal = overlay.create(Invoice, {
    props: {
      id: id,
      invoices: invoices
    }
  })
  const instance = invoiceModal.open()
  const close = await instance.result
  if (close) {
    const { jsPDF } = await import('jspdf')
    html2canvas(close).then(function(canvas) {
      const imgData = canvas.toDataURL('image/jpeg')
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
      })
      pdf.addImage(imgData, 'JPEG', 5, 5)
      pdf.save("document.pdf")
    })
  }
  order.value.id = null
}

const open = ref(false)
const openAccept = ref(false)
const openInvoice = ref(false)
const offerGuarantee = ref({})
const offerStatus = ref({ color: 'primary', label: 'En attente' })
const uploadedFile = ref({
  url: null,
  file: null
})
const bank_info = ref({
  address: null,
  key: null,
  rib: null
})

const table = useTemplateRef('table')

const columns = [
  {
    accessorKey: 'offer',
    header: 'Visa',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original?.offer?.flag,
          size: 'xl',
        }),
        h('div', undefined, [
          h('div', { class: '' }, row.original.offer.name),
        ])
      ])
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date de soumission',
    cell: ({ row }) => {
      return h(
        'div',
        undefined,
        h(NuxtTime, {
          datetime: row.original.created_at,
          locale: "fr-FR",
          year: "numeric",
          month: "numeric",
          day: "numeric"
        })
      )
    }
  },
  {
    accessorKey: 'unit_price',
    header: 'Prix unitaire',
  },
  {
    accessorKey: 'members',
    header: 'Membres',
  },
  {
    accessorKey: 'total_price',
    header: 'Prix total',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const color = {
        accepted: 'success',
        rejected: 'error',
        pending: 'warning'
      }[row.getValue('status')]

      const status = {
        accepted: 'Accepté',
        rejected: 'Rejeté',
        pending: 'En attente'
      }[row.getValue('status')]

      return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, status)
    }
  },
  {
    accessorKey: 'payment_status',
    header: 'Paiement',
    cell: ({ row }) => {
      const color = {
        paid: 'success',
        unpaid: 'error',
      }[row.getValue('payment_status')]

      const status = {
        paid: 'Payé',
        unpaid: 'Non payé',
      }[row.getValue('payment_status')]

      return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, status)
    }
  },
  {
    accessorKey: 'response_by_date',
    header: 'Date de réponse',
    cell: ({ row }) => {
      return h(
        'div',
        undefined,
        row.original.response_by_date ?
        h(NuxtTime, {
          datetime: row.original.response_by_date,
          locale: "fr-FR",
          year: "numeric",
          month: "numeric",
          day: "numeric"
        }) : "Aucun"
      )
    }
  },
  {
    accessorKey: "attachment",
    header: "Attachement",
    cell: ({ row }) => {
      return h(
        'div',
        { class: "text-center" },
        row.original.attachment ?
        h(UIcon, {
          name: "i-teenyicons-attachment-solid",
          size: "17",
          class: "cursor-pointer text-primary",
          onClick: () => {
            const url = row.original.attachment
            window.open(url, "_blank")
          }
        }) : "Aucun"
      )
    }
  }
]

const pagination = ref({
  pageIndex: undefined,
  pageSize: undefined,
  totalItems: undefined,
  totalPages: undefined
})
const data = ref([])
const loading = ref(false)
const loadingAction = ref(null)
const search = ref('')
const searchDebounce = refDebounced(search, 200)

onMounted(() => {
  if (activeTab.value === 'hotels') {
    fetchHotelOrders(1)
  } else {
    getOrders(1)
  }
})

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('application/pdf')) {
    uploadedFile.value.url = URL.createObjectURL(file)
    uploadedFile.value.file = file
  } else {
    uploadedFile.value = null
  }
}

const getOrders = async (page = 1) => {
  loading.value = true
  sendApi(`/client/visa/orders?page=${page}&per_page=10&search=${searchDebounce.value}`, null, 'GET').then(response => {
    data.value = response.data || []
    if (response.pagination) {
      pagination.value = {
        pageIndex: response.pagination.current_page - 1,
        pageSize: response.pagination.per_page,
        totalItems: response.pagination.total_items,
        totalPages: response.pagination.total_pages
      }
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

const getOrder = async (id) => {
  loading.value = true
  sendApi(`/admin/visa/orders/${id}`, null, 'GET').then(response => {
    order.value = response.data
    offerGuarantee.value = {
      with: 'Totale',
      without: 'Sans',
      half: 'Demi'
    }[response.data.visa?.guarantee] || 'Sans'
    const statusMap = {
      accepted: { color: 'success', label: 'Accepté' },
      confirmed: { color: 'success', label: 'Confirmé' },
      paid: { color: 'success', label: 'Payé' },
      completed: { color: 'success', label: 'Terminé' },
      rejected: { color: 'error', label: 'Rejeté' },
      cancelled: { color: 'error', label: 'Annulé' },
      pending: { color: 'primary', label: 'En attente' },
      pending_payment: { color: 'warning', label: 'Attente Paiement' },
      unpaid: { color: 'warning', label: 'Non Payé' },
      option: { color: 'info', label: 'En Option' },
    }
    offerStatus.value = statusMap[response.data.status] || { color: 'primary', label: response.data.status || 'En attente' }
    loading.value = false
  })
}

const acceptOrder = async () => {
  loadingAction.value = "accept" 
  const formData = new FormData()
  formData.append('file', uploadedFile.value.file)
  formData.append('_method', 'PUT')
  sendApi(`/admin/visa/orders/${order.value.id}/accept`, formData, 'POST').then(() => {
    getOrder(order.value.id)
    getOrders(pagination.value.pageIndex + 1)
    openAccept.value = false
    uploadedFile.value.url = null
    uploadedFile.value.file = null
    loadingAction.value = null
  })
}

const markAsPaid = async () => {
  loadingAction.value = "paid"
  sendApi(`/admin/visa/orders/${order.value.id}/paid`, null, 'PUT').then(() => {
    getOrder(order.value.id)
    getOrders(pagination.value.pageIndex + 1)
    loadingAction.value = null
  })
}

const rejectOrder = async () => {
  loadingAction.value = "reject" 
  sendApi(`/admin/visa/orders/${order.value.id}/reject`, null, 'PUT').then(() => {
    getOrder(order.value.id)
    getOrders(pagination.value.pageIndex + 1)
    loadingAction.value = null
  })
}

const deleteOrder = async (id) => {
  sendApi(`/admin/visa/orders/${id}/delete`, null, 'DELETE').then(() => {
    open.value = false
    getOrders(pagination.value.pageIndex + 1)
  })
}

const getInvoice = async (id) => {
  const response = await sendApi(`/admin/visa/orders/${id}/invoice`, null, 'GET').then(response => {
    return response.data
  })
  return response
}

const createInvoice = async () => {
  sendApi(`/admin/visa/orders/${order.value.id}/create-invoice`, { bank_info: bank_info.value }, 'POST').then(() => {
    order.value.id = null
    bank_info.value.address = null
    bank_info.value.key = null
    bank_info.value.rib = null
    openInvoice.value = false
    getOrders(pagination.value.pageIndex + 1)
  })
}

const onPageChange = async (page) => {
  await getOrders(page)
}
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden !important;
  }
  #official-hotel-voucher-printable, #official-hotel-voucher-printable * {
    visibility: visible !important;
  }
  #official-hotel-voucher-printable {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 100vw !important;
    height: auto !important;
    margin: 0 !important;
    padding: 15mm !important;
    background: white !important;
    color: black !important;
    z-index: 999999 !important;
    box-shadow: none !important;
  }
}
</style>
