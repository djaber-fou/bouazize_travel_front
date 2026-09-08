<template>
  <div class="min-h-[calc(100vh-80px)] w-full space-y-6 py-8 pb-16 px-4 md:px-8 bg-slate-50/50 dark:bg-slate-900/50">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6" />
          </span>
          Mes Dossiers & Commandes
        </h1>
        <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Suivez vos réservations d'hôtels en temps réel, téléchargez vos vouchers certifiés ou consultez vos demandes de visa.
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="w-full sm:w-auto grid grid-cols-2 sm:flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl border border-slate-300/60 dark:border-slate-700 shadow-inner">
        <button
          type="button"
          @click="activeTab = 'hotels'"
          class="flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center"
          :class="activeTab === 'hotels' ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 shrink-0" />
          <span>Hôtels</span>
          <span v-if="hotelBookings.length" class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black" :class="activeTab === 'hotels' ? 'bg-white/20 text-white' : 'bg-primary/20 text-primary'">
            {{ hotelBookings.length }}
          </span>
        </button>

        <button
          type="button"
          @click="activeTab = 'visas'"
          class="flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center"
          :class="activeTab === 'visas' ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <UIcon name="i-heroicons-document-text" class="w-4 h-4 shrink-0" />
          <span>Visas</span>
          <span v-if="data.length" class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black" :class="activeTab === 'visas' ? 'bg-white/20 text-white' : 'bg-primary/20 text-primary'">
            {{ data.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 1: HOTEL RESERVATIONS & VOUCHERS       -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'hotels'" class="space-y-6 animate-in fade-in duration-200">
      <!-- KPI Stats Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Dossiers</div>
          <div class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1">{{ hotelBookings.length }}</div>
        </div>
        <div class="p-3 sm:p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs">
          <div class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Confirmés</div>
          <div class="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {{ hotelBookings.filter(b => b.status === 'confirmed').length }}
          </div>
        </div>
        <div class="p-3 sm:p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/40 shadow-xs">
          <div class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">En Option</div>
          <div class="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {{ hotelBookings.filter(b => b.status === 'option').length }}
          </div>
        </div>
        <div class="p-3 sm:p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40 shadow-xs">
          <div class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Annulés</div>
          <div class="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {{ hotelBookings.filter(b => b.status === 'cancelled').length }}
          </div>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div class="relative flex-1 max-w-md">
          <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            v-model="hotelSearch"
            placeholder="Rechercher par référence, hôtel, ville, passager..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:outline-hidden focus:border-primary transition-colors text-slate-800 dark:text-slate-100"
          />
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            v-for="st in [
              { key: 'all', label: 'Tous' },
              { key: 'confirmed', label: 'Confirmés' },
              { key: 'option', label: 'En Option' },
              { key: 'cancelled', label: 'Annulés' }
            ]"
            :key="st.key"
            @click="hotelStatusFilter = st.key"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            :class="hotelStatusFilter === st.key ? 'bg-primary text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            {{ st.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingHotels" class="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
        <UIcon name="i-lucide-loader-circle" class="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
        <p class="text-sm font-bold text-slate-600 dark:text-slate-300">Chargement de vos dossiers hôteliers...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredHotelBookings.length === 0" class="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-building-office-2" class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-black text-slate-800 dark:text-white">Aucune réservation trouvée</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {{ hotelSearch ? 'Aucun dossier ne correspond à votre recherche.' : 'Vous n\'avez pas encore effectué de réservation d\'hôtel.' }}
        </p>
        <NuxtLink
          to="/hotels"
          class="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 transition-colors cursor-pointer"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4" />
          <span>Explorer nos Hôtels</span>
        </NuxtLink>
      </div>

      <!-- Bookings List -->
      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="b in filteredHotelBookings"
          :key="b.id || b.reference"
          class="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 md:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <!-- Booking Main Info -->
          <div class="flex items-start gap-4 flex-1">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0 text-primary">
              <UIcon name="i-heroicons-building-office" class="w-7 h-7" />
              <div class="text-[9px] font-black uppercase mt-0.5">{{ b.stars || 4 }}★</div>
            </div>

            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base md:text-lg font-black text-slate-900 dark:text-white">
                  {{ cleanText(b.hotel_name) }}
                </h3>
                <span
                  class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5"
                  :class="{
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800': b.status === 'confirmed',
                    'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800': b.status === 'option',
                    'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800': b.status === 'cancelled'
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="{ 'bg-emerald-500 animate-pulse': b.status === 'confirmed', 'bg-sky-500': b.status === 'option', 'bg-rose-500': b.status === 'cancelled' }"></span>
                  {{ b.status === 'confirmed' ? 'Confirmé' : (b.status === 'option' ? 'En Option' : 'Annulé') }}
                </span>

                <!-- Payment Status Badge -->
                <span
                  v-if="b.paiment_status"
                  class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border"
                  :class="{
                    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700': b.status === 'confirmed' && b.paiment_status === 'paid',
                    'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-300 dark:border-blue-700': b.paiment_status === 'verification_pending',
                    'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700': b.paiment_status === 'pending_payment',
                    'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-700': b.paiment_status === 'unpaid' || b.paiment_status === 'rejected',
                    'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-300 dark:border-purple-700': b.paiment_status === 'half_paid'
                  }"
                >
                  <UIcon name="i-heroicons-credit-card" class="w-3 h-3" />
                  <span>{{ (b.status === 'confirmed' && b.paiment_status === 'paid') ? 'Confirmé & Payé' : (b.paiment_status === 'verification_pending' ? 'Vérification Admin' : (b.paiment_status === 'pending_payment' ? 'En attente paiement' : (b.paiment_status === 'rejected' ? 'Paiement Rejeté' : (b.paiment_status === 'half_paid' ? 'Acompte' : 'Non payé')))) }}</span>
                </span>
                <span
                  v-if="b.payment_method"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                >
                  {{ b.payment_method === 'ccp' ? 'BaridiMob / CCP' : (b.payment_method === 'credit' ? 'Crédit Agence' : (b.payment_method === 'cash' ? 'Espèces / En Agence' : b.payment_method)) }}
                </span>
              </div>

              <!-- Metadata pills -->
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-ticket" class="w-3.5 h-3.5 text-primary" />
                  <span class="font-mono font-bold text-slate-700 dark:text-slate-300">{{ b.reference }}</span>
                  <button
                    type="button"
                    @click="copyReference(b.reference)"
                    title="Copier la référence"
                    class="hover:text-primary transition-colors cursor-pointer"
                  >
                    <UIcon name="i-heroicons-clipboard" class="w-3.5 h-3.5" />
                  </button>
                </span>

                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ cleanText(b.city) || 'Destination' }}</span>
                </span>

                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ b.checkin }} ➔ {{ b.checkout }} ({{ b.nights || 1 }} n.)</span>
                </span>

                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-user" class="w-3.5 h-3.5 text-slate-400" />
                  <span class="font-semibold text-slate-700 dark:text-slate-200">{{ cleanText(b.holder_name) }}</span>
                </span>
              </div>

              <div class="text-xs text-slate-400 flex items-center gap-2">
                <span>Chambre : <strong class="text-slate-700 dark:text-slate-200">{{ cleanText(b.room_type) || 'Standard' }}</strong></span>
                <span>•</span>
                <span>Pension : <strong class="text-primary">{{ boardTypeLabel(b.board_type) }}</strong></span>
                <span v-if="b.rooms_count && b.rooms_count > 1">• {{ b.rooms_count }} chambres</span>
              </div>
            </div>
          </div>

          <!-- Price and Actions -->
          <div class="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-700/60">
            <div class="text-left md:text-right">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Montant Dossier</div>
              <div class="text-xl md:text-2xl font-black text-primary">
                {{ formatPrice(b.total_price) }} <span class="text-sm font-bold">DZD</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <!-- Primary actions -->
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <!-- CCP Payment Button if pending -->
                <NuxtLink
                  v-if="b.paiment_status === 'pending_payment'"
                  :to="`/payment/confirm?order_id=${b.id || ''}&type=hotel&amount=${b.total_price || ''}`"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <UIcon name="i-heroicons-credit-card" class="w-4 h-4" />
                  <span>Payer par BaridiMob / CCP</span>
                </NuxtLink>

                <!-- If verification pending, show badge -->
                <div
                  v-else-if="b.paiment_status === 'verification_pending'"
                  class="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 animate-spin" />
                  <span>Validation Admin en cours</span>
                </div>

                <!-- Official Voucher Button (Only when confirmed and paid) -->
                <button
                  v-if="b.status === 'confirmed' && b.paiment_status === 'paid'"
                  type="button"
                  @click="openVoucherModal(b)"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  <UIcon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  <span>Voucher Officiel</span>
                </button>
                <div
                  v-else
                  class="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-not-allowed"
                  :title="b.paiment_status === 'verification_pending' ? 'Paiement en cours de vérification par l\'administration' : 'Paiement et confirmation requis pour débloquer le voucher'"
                >
                  <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" />
                  <span>Voucher verrouillé</span>
                </div>
              </div>

              <!-- Secondary quick actions -->
              <div class="flex items-center justify-end gap-2 shrink-0">
                <!-- Email Voucher Button (Only when confirmed and paid) -->
                <button
                  v-if="b.status === 'confirmed' && b.paiment_status === 'paid'"
                  type="button"
                  @click="promptEmailVoucher(b)"
                  class="flex-1 sm:flex-none p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                  title="Renvoyer par email"
                >
                  <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                  <span class="sm:hidden">Email</span>
                </button>

                <!-- Cancel Button (if not already cancelled) -->
                <button
                  v-if="b.status !== 'cancelled'"
                  type="button"
                  @click="promptCancelBooking(b)"
                  class="flex-1 sm:flex-none p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                  title="Annuler ce dossier"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                  <span class="sm:hidden">Annuler</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: VISA ORDERS (PRESERVED)             -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'visas'" class="space-y-4 animate-in fade-in duration-200">
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

    <!-- ========================================== -->
    <!-- OFFICIAL VOUCHER MODAL                     -->
    <!-- ========================================== -->
    <div
      v-if="isVoucherModalOpen && selectedVoucherBooking"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      @click.self="closeVoucherModal"
    >
      <div id="official-voucher-printable" class="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-primary/40 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <!-- Voucher Header (Navy + Gold) -->
        <div class="bg-[#0A0B25] text-white p-6 border-b-4 border-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black">
              <UIcon name="i-heroicons-building-office-2" class="w-7 h-7" />
            </div>
            <div>
              <h2 class="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                BOUAZIZE TRAVEL
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-primary text-[#0A0B25]">OFFICIEL</span>
              </h2>
              <p class="text-xs text-slate-300">Agence de Voyages & Tourisme - Licence Catégorie A</p>
              <p class="text-[11px] text-primary/80 mt-0.5">Assistance 24/7 : contact@bouazizetravel.com | +213 (0) 23 45 67 89</p>
            </div>
          </div>

          <div class="text-left sm:text-right">
            <div class="text-[10px] uppercase tracking-widest text-primary font-black">BON D'ÉCHANGE HÔTELIER</div>
            <div class="font-mono text-lg font-black text-white bg-white/10 px-3 py-1 rounded-xl border border-white/20 mt-1 inline-block">
              {{ selectedVoucherBooking.reference }}
            </div>
          </div>
        </div>

        <!-- Voucher Body -->
        <div class="p-6 space-y-6 text-slate-800 dark:text-slate-200">
          <!-- Status & Guarantee Bar -->
          <div class="flex items-center justify-between p-3.5 bg-primary/10 dark:bg-primary/15 rounded-xl border border-primary/30">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-primary" />
              <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                RÉSERVATION CONFIRMÉE & GARANTIE PAR BOUAZIZE TRAVEL
              </span>
            </div>
            <span class="text-xs font-mono font-bold text-primary">
              Émis le {{ new Date().toLocaleDateString('fr-FR') }}
            </span>
          </div>

          <!-- 2-Column Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Hotel & Stay Box -->
            <div class="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 class="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700">
                <UIcon name="i-heroicons-building-office" class="w-4 h-4" />
                <span>Établissement & Séjour</span>
              </h3>
              <div>
                <h4 class="font-black text-base text-slate-900 dark:text-white">
                  {{ cleanText(selectedVoucherBooking.hotel_name) }}
                </h4>
                <div class="text-amber-500 text-xs font-bold mt-0.5">
                  {{ '★'.repeat(selectedVoucherBooking.stars || 4) }}
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {{ cleanText(selectedVoucherBooking.address) || cleanText(selectedVoucherBooking.city) }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Arrivée (Check-in)</span>
                  <span class="font-black text-slate-800 dark:text-slate-200">{{ selectedVoucherBooking.checkin }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Départ (Check-out)</span>
                  <span class="font-black text-slate-800 dark:text-slate-200">{{ selectedVoucherBooking.checkout }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Durée</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedVoucherBooking.nights || 1 }} Nuit(s)</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Chambres</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedVoucherBooking.rooms_count || 1 }}</span>
                </div>
              </div>
            </div>

            <!-- Room & Passenger Box -->
            <div class="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 class="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700">
                <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
                <span>Prestations & Titulaire</span>
              </h3>
              <div class="text-xs space-y-2">
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Catégorie de chambre</span>
                  <span class="font-black text-slate-800 dark:text-slate-200 uppercase">{{ cleanText(selectedVoucherBooking.room_type) || 'Chambre Standard' }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Traitement / Repas</span>
                  <span class="font-bold text-primary">{{ boardTypeLabel(selectedVoucherBooking.board_type) }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Titulaire du dossier</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ cleanText(selectedVoucherBooking.holder_name) }}</span>
                </div>
                <div v-if="selectedVoucherBooking.holder_phone || selectedVoucherBooking.holder_email" class="text-slate-500">
                  {{ selectedVoucherBooking.holder_phone }} {{ selectedVoucherBooking.holder_email ? `| ${selectedVoucherBooking.holder_email}` : '' }}
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Montant Total Enregistré</div>
                <div v-if="!hideVoucherPrice" class="text-xl font-black text-primary">
                  {{ formatPrice(selectedVoucherBooking.total_price) }} DZD
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">(RÉGLÉ)</span>
                </div>
                <div v-else class="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  PRESTATIONS RÉGLÉES — VOUCHER CLIENT
                </div>
              </div>
            </div>
          </div>

          <!-- QR & Check-in Verification Box -->
          <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 bg-white p-1 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                <svg class="w-12 h-12 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 2h2v2h-2v-2z"/>
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-black uppercase tracking-wide text-slate-800 dark:text-white">
                  Contrôle Check-in Hôtel
                </h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  À présenter lors du check-in avec une pièce d'identité en cours de validité.
                </p>
                <div class="font-mono text-[10px] text-slate-400 mt-0.5">REF: {{ selectedVoucherBooking.reference }}</div>
              </div>
            </div>

            <div class="text-right text-[11px] text-slate-400 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-4">
              <span class="font-bold text-slate-600 dark:text-slate-300">Bouazize Travel SARL</span><br/>
              Licence Tourisme N° 16/0428<br/>
              Alger / Oran, Algérie
            </div>
          </div>
        </div>

        <!-- Voucher Actions Footer -->
        <div class="p-4 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div class="flex items-center gap-3">
            <button
              @click="closeVoucherModal"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <label class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input type="checkbox" v-model="hideVoucherPrice" class="w-4 h-4 rounded text-primary accent-primary cursor-pointer" />
              <span>Masquer le prix</span>
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="promptEmailVoucher(selectedVoucherBooking)"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
            >
              <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
              <span>Envoyer par Email</span>
            </button>
            <button
              @click="printVoucher"
              type="button"
              class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 transition-colors cursor-pointer flex items-center gap-2"
            >
              <UIcon name="i-heroicons-printer" class="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Email Voucher Modal -->
    <UModal v-model:open="isEmailModalOpen" title="Renvoyer le Voucher par Email">
      <template #body>
        <div class="space-y-4">
          <p class="text-xs text-slate-500">
            Le voucher certifié de la réservation <strong class="text-primary">{{ emailTargetBooking?.reference }}</strong> sera envoyé à l'adresse ci-dessous.
          </p>
          <UFormField label="Adresse Email du Destinataire" name="email">
            <UInput v-model="emailRecipient" placeholder="nom@exemple.com" icon="i-heroicons-envelope" class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton color="neutral" variant="ghost" label="Annuler" @click="isEmailModalOpen = false" />
            <UButton color="primary" :loading="sendingEmail" label="Envoyer le Voucher" @click="confirmSendEmail" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Cancel Confirmation Modal -->
    <UModal v-model:open="isCancelModalOpen" title="Confirmation d'annulation">
      <template #body>
        <div class="space-y-4">
          <div class="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs">
            Êtes-vous sûr de vouloir annuler le dossier <strong>{{ cancelTargetBooking?.reference }}</strong> ({{ cleanText(cancelTargetBooking?.hotel_name) }}) ? Cette action est irréversible.
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <UButton color="neutral" variant="ghost" label="Conserver la réservation" @click="isCancelModalOpen = false" />
            <UButton color="error" :loading="cancellingBooking" label="Confirmer l'annulation" @click="confirmCancelBooking" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Visa Order Slideover & Modals (Preserved) -->
    <USlideover fullscreen v-model:open="open" close-icon="i-lucide-arrow-right" :close="{ color: 'secondary', class: 'cursor-pointer' }">
      <template #header>
        <div class="flex flex-col gap-2">
          <div class="font-bold text-secondary">
            <div>{{ order?.user?.name }}</div>
          </div>
          <UBadge class="w-fit font-bold" variant="subtle" :color="offerStatus.color" :label="offerStatus.label" />
        </div>
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <p class="text-secondary">Visa:</p>
            <div class="flex items-center gap-3">
              <UAvatar :src="order?.visa?.country?.flag" size="sm" />
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
import { refDebounced, useRoute } from '#imports'
import { NuxtTime, UIcon } from '#components'
import Confirmation from '~/components/modals/Confirmation.vue'
import Invoice from '~/components/invoices/Invoice.vue'
import html2canvas from 'html2canvas'
import { sendApi } from '@/composables/api'

const route = useRoute()
const toast = useToast()

// Tabs
const activeTab = ref(route.query.tab === 'visas' ? 'visas' : 'hotels')

// ----------------------------------------------------
// HOTELS STATE & ACTIONS
// ----------------------------------------------------
const hotelBookings = ref([])
const loadingHotels = ref(false)
const hotelSearch = ref('')
const hotelStatusFilter = ref('all')

const isVoucherModalOpen = ref(false)
const selectedVoucherBooking = ref(null)
const hideVoucherPrice = ref(false)

const isEmailModalOpen = ref(false)
const emailTargetBooking = ref(null)
const emailRecipient = ref('')
const sendingEmail = ref(false)

const isCancelModalOpen = ref(false)
const cancelTargetBooking = ref(null)
const cancellingBooking = ref(false)

const cleanText = (str) => {
  if (!str) return ''
  try {
    return decodeURIComponent(escape(str))
  } catch (e) {
    return str
      .replace(/Ã´/g, 'ô')
      .replace(/Ã©/g, 'é')
      .replace(/Ã¨/g, 'è')
      .replace(/Ã¯/g, 'ï')
      .replace(/Ã /g, 'à')
      .replace(/Ã§/g, 'ç')
      .replace(/Ãª/g, 'ê')
  }
}

const formatPrice = (val) => {
  if (!val) return '0'
  return new Intl.NumberFormat('fr-DZ').format(Math.round(Number(val)))
}

const boardTypeLabel = (bt) => {
  if (!bt) return 'Logement Seul (RO)'
  const map = {
    RO: 'Logement Seul (Room Only)',
    BB: 'Petit-déjeuner Inclus (Bed & Breakfast)',
    HB: 'Demi-pension (Half Board)',
    FB: 'Pension Complète (Full Board)',
    AI: 'Tout Compris (All Inclusive)',
    UAI: 'Ultra All Inclusive'
  }
  return map[bt.toUpperCase()] || bt
}

const fetchHotelBookings = async () => {
  loadingHotels.value = true
  try {
    const res = await sendApi('/hotels/bookings', {}, 'GET')
    if (res && res.data) {
      hotelBookings.value = res.data
    } else if (Array.isArray(res)) {
      hotelBookings.value = res
    }
  } catch (err) {
    console.error('Erreur chargement réservations hôtels:', err)
  } finally {
    loadingHotels.value = false
  }
}

const filteredHotelBookings = computed(() => {
  let list = hotelBookings.value || []
  if (hotelStatusFilter.value !== 'all') {
    list = list.filter(b => b.status === hotelStatusFilter.value)
  }
  if (hotelSearch.value.trim()) {
    const q = hotelSearch.value.toLowerCase().trim()
    list = list.filter(b => 
      (b.reference && b.reference.toLowerCase().includes(q)) ||
      (b.hotel_name && b.hotel_name.toLowerCase().includes(q)) ||
      (b.city && b.city.toLowerCase().includes(q)) ||
      (b.holder_name && b.holder_name.toLowerCase().includes(q))
    )
  }
  return list
})

const copyReference = (refVal) => {
  if (!refVal) return
  navigator.clipboard.writeText(refVal)
  toast.add({
    title: 'Copié !',
    description: `Référence ${refVal} copiée dans le presse-papier`,
    color: 'success',
    icon: 'i-heroicons-check-circle'
  })
}

const openVoucherModal = (booking) => {
  if (booking.status !== 'confirmed' || booking.paiment_status !== 'paid') {
    toast.add({
      title: 'Voucher verrouillé',
      description: "Le voucher officiel certifié sera débloqué dès que l'administration aura vérifié et validé votre paiement électronique.",
      color: 'amber'
    });
    return;
  }
  selectedVoucherBooking.value = booking
  isVoucherModalOpen.value = true
}

const closeVoucherModal = () => {
  isVoucherModalOpen.value = false
  selectedVoucherBooking.value = null
}

const printVoucher = () => {
  window.print()
}

const promptEmailVoucher = (booking) => {
  if (booking.status !== 'confirmed' || booking.paiment_status !== 'paid') {
    toast.add({
      title: 'Voucher verrouillé',
      description: "Le voucher ne peut pas être envoyé avant la validation définitive du paiement par l'administration.",
      color: 'amber'
    });
    return;
  }
  emailTargetBooking.value = booking
  emailRecipient.value = booking.holder_email || ''
  isEmailModalOpen.value = true
}

const confirmSendEmail = async () => {
  if (!emailRecipient.value) {
    toast.add({ title: 'Erreur', description: 'Veuillez saisir une adresse email', color: 'error' })
    return
  }
  sendingEmail.value = true
  try {
    await sendApi('/hotels/voucher/send-email', {
      reference: emailTargetBooking.value.reference,
      email: emailRecipient.value
    }, 'POST')
    toast.add({
      title: 'Voucher envoyé',
      description: `Le voucher a été transmis avec succès à ${emailRecipient.value}`,
      color: 'success'
    })
    isEmailModalOpen.value = false
  } catch (err) {
    toast.add({ title: 'Erreur d\'envoi', description: err.message || 'Impossible d\'envoyer le voucher', color: 'error' })
  } finally {
    sendingEmail.value = false
  }
}

const promptCancelBooking = (booking) => {
  cancelTargetBooking.value = booking
  isCancelModalOpen.value = true
}

const confirmCancelBooking = async () => {
  cancellingBooking.value = true
  try {
    await sendApi('/hotels/cancel', {
      reference: cancelTargetBooking.value.reference
    }, 'POST')
    toast.add({
      title: 'Réservation annulée',
      description: `Le dossier ${cancelTargetBooking.value.reference} a été annulé.`,
      color: 'success'
    })
    isCancelModalOpen.value = false
    await fetchHotelBookings()
  } catch (err) {
    toast.add({ title: 'Erreur d\'annulation', description: err.message || 'Échec de l\'annulation', color: 'error' })
  } finally {
    cancellingBooking.value = false
  }
}

// ----------------------------------------------------
// VISA STATE & ACTIONS (PRESERVED)
// ----------------------------------------------------
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
const offerStatus = ref({})
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
  fetchHotelBookings()
  getOrders(1)
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
    }[response.data.visa.guarantee]
    offerStatus.value = {
      accepted: { color: 'success', label: 'Accepté' },
      rejected: { color: 'error', label: 'Rejeté' },
      pending: { color: 'primary', label: 'En attente' },
    }[response.data.status]
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
    visibility: hidden;
  }
  #official-voucher-printable, #official-voucher-printable * {
    visibility: visible;
  }
  #official-voucher-printable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>
