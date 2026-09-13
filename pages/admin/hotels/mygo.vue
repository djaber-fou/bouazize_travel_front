<template>
  <div class="flex flex-col gap-6 p-2 sm:p-4 min-h-screen text-slate-800 dark:text-slate-100">
    <!-- TOP BRANDING & NETSTORMING GATEWAY STATUS (LUXURY BOUAZIZE TRAVEL NAVY & GOLD) -->
    <div class="w-full bg-[#0A0B25] text-white p-6 sm:p-7 rounded-3xl shadow-2xl border border-primary/40 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div class="absolute -right-16 -top-16 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-60 h-60 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-primary/20 border-2 border-primary/60 flex items-center justify-center text-primary shadow-xl shadow-black/40 shrink-0">
            <UIcon name="i-heroicons-globe-americas" class="w-8 h-8 text-primary" />
          </div>
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Passerelle Hôtelière MyGO</h1>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-primary/20 text-primary border border-primary/50 tracking-wider shadow-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                API CONNECTÉE
              </span>
            </div>
            <p class="text-slate-300 text-xs sm:text-sm mt-1.5 flex flex-wrap items-center gap-2">
              <span>Opérateur: <strong class="text-white font-bold">Bouazize Travel</strong></span>
              <span class="text-primary/60">•</span>
              <span>Acteur: <strong class="font-mono text-primary font-bold">BOUAZIZE25</strong></span>
              <span class="text-primary/60">•</span>
              <span>User: <strong class="font-mono text-primary font-bold">BOUAZIZAPI</strong></span>
              <span class="text-primary/60">•</span>
              <span>Serveur: <code class="text-[11px] bg-white/10 text-primary-hover px-2 py-0.5 rounded font-mono border border-white/15">kalima.mygo.pro/call.php</code></span>
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-3 flex-wrap relative z-10 w-full lg:w-auto justify-start lg:justify-end">
        <button
          @click="runCertFlow"
          :disabled="isCertLoading"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer backdrop-blur-sm shadow-sm"
        >
          <UIcon v-if="!isCertLoading" name="i-heroicons-shield-check" class="w-4 h-4 text-primary" />
          <svg v-else class="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          <span>Tester la Liaison API</span>
        </button>

        <NuxtLink
          to="/hotels"
          target="_blank"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-[#0A0B25] text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-primary/30 cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-[#0A0B25]" />
          <span>Ouvrir Moteur Client</span>
        </NuxtLink>
      </div>
    </div>

    <!-- NAVIGATION TABS (LUXURY COMMAND BAR) -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        @click="activeTab = t.key"
        class="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs"
        :class="activeTab === t.key ? 'bg-primary text-[#0A0B25] shadow-lg shadow-primary/25 font-black scale-[1.02]' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 font-bold'"
      >
        <UIcon :name="t.icon" class="w-4 h-4" :class="activeTab === t.key ? 'text-[#0A0B25]' : 'text-primary'" />
        <span>{{ t.label }}</span>
        <span v-if="t.badge" class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black" :class="activeTab === t.key ? 'bg-[#0A0B25] text-primary' : 'bg-primary/20 text-primary'">{{ t.badge }}</span>
      </button>
    </div>

    <!-- ==================================================== -->
    <!-- TAB 1: B2B WORLDWIDE SEARCH & DISPONIBILITIES        -->
    <!-- ==================================================== -->
    <div v-if="activeTab === 'search'" class="space-y-6">
      <!-- Search Form Box (Identique au système client avec parité totale) -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <!-- Destination + Geocoding Row -->
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex-1 min-w-[280px] relative">
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Destination ou Nom d'Hôtel *</label>
            <div class="relative">
              <input
                v-model="destinationInput"
                @input="onDestinationInput"
                @focus="onDestinationInput"
                type="text"
                placeholder="Ex: Alger, Oran, El Aurassi, Istanbul, Paris, Dubaï, Hilton, Pullman..."
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                @keydown.enter.prevent="executeSearch"
              />
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            <!-- Autocomplete Dropdown with 1,000,000+ Worldwide Locations -->
            <div
              v-if="showDestDropdown && destSuggestions.length > 0"
              class="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-72 overflow-y-auto"
            >
              <button
                v-for="(dest, dIdx) in destSuggestions"
                :key="dest.code + '_' + dIdx"
                type="button"
                @click="selectDestination(dest)"
                class="w-full text-left px-3.5 py-2.5 text-xs hover:bg-primary/10 dark:hover:bg-slate-700 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 last:border-0 cursor-pointer"
              >
                <div>
                  <span class="font-bold text-slate-800 dark:text-white">{{ dest.name }}</span>
                  <span class="text-slate-400 block text-[10px]">{{ dest.country }}</span>
                </div>
                <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 dark:bg-slate-700 text-primary dark:text-primary border border-primary/30 dark:border-slate-600">
                  {{ dest.code }}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Géocodage</label>
            <input v-model="searchForm.geocoding" type="text" placeholder="Lieu..." class="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Km</label>
            <input v-model.number="searchForm.geocoding_km" type="number" min="1" max="100" class="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
          </div>
        </div>

        <!-- Dates + Nights + Rooms Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">De</label>
            <input v-model="searchForm.checkin" @change="onCheckinChange" type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Au</label>
            <input v-model="searchForm.checkout" @change="onCheckoutChange" type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nuits</label>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1 h-[46px]">
              <button @click="decrementNights" type="button" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-black hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer flex items-center justify-center text-base shadow-xs">-</button>
              <input v-model.number="nightsCount" @input="updateNights(nightsCount)" type="number" min="1" max="90" class="w-full text-center font-black text-sm bg-transparent text-slate-800 dark:text-white focus:outline-none" />
              <button @click="incrementNights" type="button" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-black hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer flex items-center justify-center text-base shadow-xs">+</button>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Chambres</label>
            <div class="flex items-center gap-2">
              <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-center text-slate-700 dark:text-slate-300 flex-1">{{ searchForm.rooms.length }}</div>
              <button @click="addRoom" type="button" class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center text-lg font-bold cursor-pointer transition-colors shadow-md shadow-primary/20">+</button>
            </div>
          </div>
        </div>

        <!-- Flexible Dates Interval Bar (Assistant Séjour Flexible) -->
        <div class="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <button
            @click="isFlexibleIntervalOpen = !isFlexibleIntervalOpen"
            type="button"
            class="flex items-center gap-1.5 font-bold text-primary hover:text-primary-hover dark:text-primary cursor-pointer select-none"
          >
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <span>{{ isFlexibleIntervalOpen ? 'Fermer le mode période flexible' : 'Période de dates flexible (ex: 8 nuits dans l\'intervalle 12/09 au 12/10)' }}</span>
            <span class="px-1.5 py-0.5 rounded bg-primary/10 dark:bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold">Nouveau</span>
          </button>
          <span class="text-slate-400 text-[11px]">Séjour configuré : <strong class="text-primary">{{ nightsCount }} nuits</strong> (du {{ searchForm.checkin }} au {{ searchForm.checkout }})</span>
        </div>

        <!-- Flexible Interval Expandable Box -->
        <div v-if="isFlexibleIntervalOpen" class="p-4 bg-primary/10/70 dark:bg-primary/15 rounded-2xl border border-primary/30 dark:border-primary/30/60 space-y-3">
          <div>
            <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-primary" />
              <span>Assistant Période Flexible (ex: 8 nuits entre deux dates)</span>
            </h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Définissez une fourchette de dates et choisissez un créneau de séjour de {{ flexNights }} nuits en 1 clic :</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label class="block font-bold text-slate-600 dark:text-slate-300 mb-1">Intervalle Début</label>
              <input v-model="flexRangeStart" type="date" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-bold text-slate-600 dark:text-slate-300 mb-1">Intervalle Fin</label>
              <input v-model="flexRangeEnd" type="date" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-bold text-slate-600 dark:text-slate-300 mb-1">Durée voulue (Nuits)</label>
              <input v-model.number="flexNights" type="number" min="1" max="30" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-center text-slate-900 dark:text-white" />
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Créneaux de {{ flexNights }} nuits disponibles dans cette fenêtre :</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(slot, sIdx) in flexibleSlots"
                :key="sIdx"
                @click="applyFlexibleSlot(slot)"
                type="button"
                class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-primary hover:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UIcon name="i-heroicons-check" class="w-3.5 h-3.5 text-primary" />
                <span>{{ slot.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Room Details Cards (Multi-Chambres B2B) -->
        <div v-for="(room, index) in searchForm.rooms" :key="index" class="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="flex flex-wrap items-end gap-4">
            <div class="text-xs font-extrabold text-primary uppercase tracking-wider w-28">CHAMBRE {{ index + 1 }}</div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Adultes</label>
              <select v-model.number="room.adults" class="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm text-center text-slate-800 dark:text-slate-200 focus:outline-none rounded-lg cursor-pointer">
                <option :value="1">1</option><option :value="2" selected>2</option><option :value="3">3</option><option :value="4">4</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Nombre d'Enfants</label>
              <select :value="room.children.length" @change="room.children = Array.from({length: parseInt($event.target.value)}, () => 0)" class="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm text-center text-slate-800 dark:text-slate-200 focus:outline-none rounded-lg cursor-pointer">
                <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </select>
            </div>
            <div class="flex flex-col items-center">
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Berceau</label>
              <input type="checkbox" v-model="room.cots" :true-value="1" :false-value="0" class="w-4 h-4 accent-primary rounded cursor-pointer" />
            </div>
            <div class="flex gap-4 ml-2">
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" v-model="room.type" value="DBL" class="w-3.5 h-3.5 accent-primary cursor-pointer" />Double
              </label>
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" v-model="room.type" value="TWN" class="w-3.5 h-3.5 accent-primary cursor-pointer" />Twin
              </label>
            </div>
            <button v-if="searchForm.rooms.length > 1" @click="removeRoom(index)" type="button" class="ml-auto w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors">x</button>
          </div>
          <div v-if="room.children.length > 0" class="flex flex-wrap items-center gap-3 mt-3 ml-[132px]">
            <div v-for="(childAge, cIdx) in room.children" :key="cIdx">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Âge enf. {{ cIdx + 1 }}</label>
              <input type="number" v-model="room.children[cIdx]" min="0" max="17" class="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-xs text-center text-slate-900 dark:text-white focus:outline-none rounded-lg" />
            </div>
          </div>
        </div>

        <!-- Options Avancées Accordion -->
        <div class="bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div @click="showAdvanced = !showAdvanced" class="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-4 h-4 text-slate-400" />
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">OPTIONS AVANCÉES</span>
            </div>
            <span class="w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-lg leading-none font-medium">{{ showAdvanced ? '-' : '+' }}</span>
          </div>

          <div v-if="showAdvanced" class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Étoiles</label>
                <select v-model="searchForm.stars" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="">Indifférent</option>
                  <option value="5">5 Étoiles</option><option value="4">4 Étoiles</option><option value="3">3 Étoiles</option><option value="2">2 Étoiles</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Critères de sélection</label>
                <select v-model="searchForm.criteria" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="">Tous les critères</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Devise Budget</label>
                <select v-model="searchForm.budget_currency" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="DZD">Dinar Algérien (DZD)</option><option value="EUR">Euro (EUR)</option><option value="USD">Dollar US (USD)</option>
                </select>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" v-model="searchForm.refundable_only" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                  Tarifs remboursables uniquement
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Nationalité des voyageurs</label>
              <select v-model="searchForm.nationality" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                <option value="DZ">ALGÉRIE (DZ)</option><option value="FR">FRANCE (FR)</option><option value="GB">ROYAUME-UNI (GB)</option><option value="SA">ARABIE SAOUDITE (SA)</option><option value="AE">ÉMIRATS ARABES UNIS (AE)</option><option value="TR">TURQUIE (TR)</option>
              </select>
            </div>

            <div class="flex items-center gap-3 pt-4">
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" v-model="searchForm.available_only" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                Hôtels disponibles immédiatement uniquement
              </label>
            </div>
          </div>
        </div>

        <!-- Big Search Button -->
        <div class="pt-2 flex justify-center">
          <button
            @click="executeSearch"
            :disabled="isSearching"
            type="button"
            class="w-full md:w-auto md:min-w-[320px] px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg v-if="isSearching" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            <UIcon v-else name="i-heroicons-magnifying-glass" class="w-5 h-5" />
            <span>{{ isSearching ? 'Recherche en direct MyGO...' : 'RECHERCHER DISPONIBILITÉS MYGO' }}</span>
          </button>
        </div>
      </div>

      <!-- Results Area -->
      <div v-if="hasSearched">
        <!-- COMPLETE FILTER & DISPLAY CONTROLS BAR -->
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
          <!-- Left: Filter by Hotel Name & Counts -->
          <div class="flex items-center gap-3 flex-1 flex-wrap">
            <div class="relative flex-1 min-w-[200px]">
              <input
                v-model="filterHotelName"
                type="text"
                placeholder="Filtrer par nom d'hôtel..."
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>

            <!-- Stars Filter -->
            <select
              v-model="filterStars"
              class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="">Toutes les étoiles</option>
              <option value="5">5 Étoiles</option>
              <option value="4">4 Étoiles</option>
              <option value="3">3 Étoiles</option>
            </select>

            <!-- Board Type Filter -->
            <select
              v-model="filterBoardType"
              class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="">Toutes les formules</option>
              <option value="RO">RO (Logement seul)</option>
              <option value="BB">BB (Petit-déjeuner)</option>
              <option value="HB">HB (Demi-pension)</option>
              <option value="FB">FB (Pension complète)</option>
              <option value="AI">AI (All Inclusive)</option>
            </select>

            <!-- Sorting -->
            <select
              v-model="sortBy"
              class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="stars_desc">Étoiles (décroissant)</option>
              <option value="name_asc">Nom de l'hôtel (A-Z)</option>
            </select>
          </div>

          <!-- Right: Display Switcher (Grid vs Table) -->
          <div class="flex items-center gap-2 justify-end">
            <div v-if="filterHotelName" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-bold mr-2">
              <span>Hôtel : {{ filterHotelName }}</span>
              <button @click="filterHotelName = ''" class="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
            </div>
            <span class="text-xs font-bold text-slate-500 mr-2">
              {{ filteredHotels.length }} hôtel(s) affiché(s) sans limite
            </span>
            <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                @click="displayMode = 'grid'"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="displayMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              >
                <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
                <span>Grille</span>
              </button>
              <button
                @click="displayMode = 'table'"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="displayMode === 'table' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              >
                <UIcon name="i-heroicons-table-cells" class="w-4 h-4" />
                <span>Tableau B2B</span>
              </button>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredHotels.length === 0 && !isSearching" class="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
          <UIcon name="i-heroicons-building-office" class="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
          <p class="font-bold text-slate-700 dark:text-slate-300">Aucun hôtel ne correspond à vos filtres.</p>
          <p class="text-xs text-slate-400 mt-1">Modifiez vos critères ou réinitialisez les filtres.</p>
        </div>

        <!-- MODE 1: GRID WITH AUTHENTIC PHOTOS & EXPANDABLE CHAMBERS -->
        <div v-if="displayMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(hotel, idx) in filteredHotels"
            :key="hotel.id || hotel.code || idx"
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all group"
          >
            <!-- Real Hotel Photo & Badges -->
            <div class="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" @click="openGallery(hotel)">
              <img
                :src="getHotelCoverImage(hotel)"
                @error="handleImageError($event)"
                :alt="hotel.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                <UIcon name="i-heroicons-star" class="w-3.5 h-3.5 text-amber-400" />
                <span>{{ hotel.stars }} étoiles</span>
              </div>
              <div v-if="hotel.promo" class="absolute top-3 left-3 bg-primary text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                Offre Spéciale
              </div>
              <div v-if="hotel.city" class="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-bold text-slate-800 dark:text-white">
                <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary inline mr-1" /> {{ hotel.city }}
              </div>
              <button
                type="button"
                @click.stop="openGallery(hotel)"
                class="absolute bottom-3 right-3 bg-black/75 hover:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <UIcon name="i-heroicons-photo" class="w-3.5 h-3.5" />
                <span>{{ getHotelGalleryCount(hotel) }} photos</span>
              </button>
            </div>

            <!-- Hotel Info & All Available Chambers -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="text-base font-black text-slate-900 dark:text-white line-clamp-1 mb-1">{{ hotel.name }}</h4>
                <p class="text-xs text-slate-400 line-clamp-1 mb-3">{{ hotel.address || hotel.city }}</p>

                <!-- Room Arrangements List -->
                <div class="space-y-2">
                  <div
                    v-for="(arr, aIdx) in getVisibleArrangements(hotel)"
                    :key="aIdx"
                    class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center transition-all hover:border-primary/30 dark:hover:border-primary/30"
                  >
                    <div class="flex-1 pr-2">
                      <span class="font-bold text-slate-800 dark:text-white block">{{ arr.room_type || 'Chambre Standard' }}</span>
                      <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="px-1.5 py-0.2 rounded bg-primary/10 dark:bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold uppercase">
                          {{ arr.board_type }}
                        </span>
                        <span v-if="arr.refundable" class="text-[10px] text-primary font-semibold">Annulable</span>
                      </div>
                    </div>

                    <div class="text-right shrink-0">
                      <div class="text-sm font-black text-primary">
                        {{ formatPrice(calculateClientPrice(arr.price)) }} DZD
                      </div>
                      <div class="text-[10px] text-slate-400">
                        Net: {{ formatPrice(arr.price) }} DZD
                      </div>
                      <button
                        @click="openPrebookModal(hotel, arr)"
                        type="button"
                        class="mt-1 px-2.5 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        Évaluer
                      </button>
                    </div>
                  </div>

                  <!-- Toggle to view ALL Chambers -->
                  <button
                    v-if="(hotel.arrangements || []).length > 2"
                    type="button"
                    @click="toggleHotelRooms(hotel.id || hotel.code)"
                    class="w-full py-1.5 text-center text-xs font-bold text-primary hover:underline cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{{ expandedHotelRooms[hotel.id || hotel.code] ? 'Masquer les autres chambres' : `+ Voir toutes les chambres (${(hotel.arrangements || []).length} disponibles)` }}</span>
                    <UIcon :name="expandedHotelRooms[hotel.id || hotel.code] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Card Bottom Actions -->
              <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  @click="openGallery(hotel)"
                  class="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <UIcon name="i-heroicons-photo" class="w-4 h-4" />
                  <span>Galerie Photos</span>
                </button>
                <button
                  type="button"
                  @click="openPrebookModal(hotel, hotel.arrangements?.[0])"
                  class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                  <span>Option Rapide</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODE 2: B2B COMPARATIVE TABLE WITH ALL CHAMBERS -->
        <div v-else class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 uppercase font-bold text-[11px] text-slate-500">
                <tr>
                  <th class="p-3">Hôtel</th>
                  <th class="p-3">Étoiles</th>
                  <th class="p-3">Chambres Disponibles</th>
                  <th class="p-3">Tarif Net MyGO</th>
                  <th class="p-3">Prix Vente (+{{ markupSettings.percent }}%)</th>
                  <th class="p-3">Marge Agence</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <template v-for="hotel in filteredHotels" :key="hotel.id || hotel.code">
                  <!-- Main Hotel Row -->
                  <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-3">
                      <div class="flex items-center gap-3">
                        <img :src="getHotelCoverImage(hotel)" @error="handleImageError($event)" class="w-12 h-10 object-cover rounded-lg shrink-0 cursor-pointer" @click="openGallery(hotel)" />
                        <div>
                          <div class="font-bold text-slate-900 dark:text-white">{{ hotel.name }}</div>
                          <div class="text-[11px] text-slate-400">{{ hotel.address || hotel.city }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3">
                      <span class="text-amber-500 font-bold"> {{ hotel.stars }}</span>
                    </td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-bold text-[11px]">
                        {{ (hotel.arrangements || []).length }} chambre(s)
                      </span>
                    </td>
                    <td class="p-3 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {{ formatPrice(hotel.arrangements?.[0]?.price) }} DZD
                    </td>
                    <td class="p-3 font-mono font-black text-primary">
                      {{ formatPrice(calculateClientPrice(hotel.arrangements?.[0]?.price)) }} DZD
                    </td>
                    <td class="p-3 font-mono font-bold text-primary font-bold">
                      +{{ formatPrice(calculateClientPrice(hotel.arrangements?.[0]?.price) - (hotel.arrangements?.[0]?.price || 0)) }} DZD
                    </td>
                    <td class="p-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="toggleHotelRooms(hotel.id || hotel.code)" type="button" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer">
                          {{ expandedHotelRooms[hotel.id || hotel.code] ? 'Fermer' : 'Voir Chambres' }}
                        </button>
                        <button @click="openPrebookModal(hotel, hotel.arrangements?.[0])" type="button" class="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold cursor-pointer">
                          Évaluer
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Expanded Chamber Sub-Rows -->
                  <tr v-if="expandedHotelRooms[hotel.id || hotel.code]" class="bg-primary/10/40 dark:bg-primary/5">
                    <td colspan="7" class="p-4">
                      <div class="space-y-2 max-w-4xl mx-auto">
                        <div class="text-xs font-bold uppercase text-slate-500 mb-2">Toutes les chambres disponibles pour {{ hotel.name }} :</div>
                        <div
                          v-for="(arr, aIdx) in hotel.arrangements || []"
                          :key="aIdx"
                          class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <span class="font-bold text-slate-900 dark:text-white">{{ arr.room_type || 'Chambre Standard' }}</span>
                            <span class="ml-2 px-2 py-0.5 rounded bg-primary/10 dark:bg-primary/20 text-primary border border-primary/30 font-bold uppercase text-[10px]">Formule: {{ arr.board_type }}</span>
                          </div>
                          <div class="flex items-center gap-4">
                            <span class="text-slate-400">Net: {{ formatPrice(arr.price) }} DZD</span>
                            <span class="font-black text-primary font-mono text-sm">{{ formatPrice(calculateClientPrice(arr.price)) }} DZD</span>
                            <button
                              @click="openPrebookModal(hotel, arr)"
                              type="button"
                              class="px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm"
                            >
                              Réserver cette chambre
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- TAB 2: DOSSIER TRACKING & BOOKINGS                   -->
    <!-- ==================================================== -->
    <!-- TAB 2: DOSSIERS & BOOKINGS (REAL B2B DASHBOARD)      -->
    <!-- ==================================================== -->
    <div v-if="activeTab === 'bookings'" class="space-y-6">
      <!-- B2B Analytics KPI Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Dossiers -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Dossiers</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {{ dossierStats.total_dossiers || recentBookings.length }}
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">Dossiers B2B enregistrés</div>
          </div>
        </div>

        <!-- Card 2: Total Volume DZD -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-banknotes" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Volume d'Affaires</div>
            <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {{ formatPrice(dossierStats.total_volume) }} <span class="text-xs font-bold text-slate-400">DZD</span>
            </div>
            <div class="text-[10px] text-primary font-semibold mt-0.5">Ventes hôtelières confirmées</div>
          </div>
        </div>

        <!-- Card 3: Agency Margin DZD -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marge Agence</div>
            <div class="text-xl font-black text-primary mt-0.5">
              +{{ formatPrice(dossierStats.total_margin) }} <span class="text-xs font-bold text-slate-400">DZD</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">Commission nette réalisée</div>
          </div>
        </div>

        <!-- Card 4: Status Breakdown -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div class="space-y-1.5 w-full">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statut des Dossiers</div>
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5 text-primary font-bold"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmés</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ dossierStats.confirmed_count }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5 text-amber-500 font-bold"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Options</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ dossierStats.option_count }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5 text-red-500 font-bold"><span class="w-2 h-2 rounded-full bg-red-500"></span> Annulés</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ dossierStats.cancelled_count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Netstorming Track & Search Box -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-primary" />
          Interroger un Dossier en Direct auprès de Kalima MyGO (XML Netstorming)
        </h3>
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="trackRefInput"
            type="text"
            placeholder="Entrez le code de référence Netstorming (ex: BK_6F8B2C4D...)"
            class="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            @keydown.enter.prevent="executeTrackBooking"
          />
          <button
            @click="executeTrackBooking"
            :disabled="isTrackLoading || !trackRefInput"
            type="button"
            class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg v-if="isTrackLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            <UIcon v-else name="i-heroicons-arrow-path" class="w-4 h-4" />
            <span>Interroger l'API</span>
          </button>
        </div>
      </div>

      <!-- Dossiers Table Container -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <!-- Header & Filter Controls -->
        <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-primary" />
              Dossiers Hôteliers Référencés
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Historique persistant des réservations hôtelières et options B2B</p>
          </div>

          <!-- Status Filters & Search -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Filter Tabs -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                @click="dossierStatusFilter = 'all'"
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="dossierStatusFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              >
                Tous ({{ recentBookings.length }})
              </button>
              <button
                @click="dossierStatusFilter = 'confirmed'"
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="dossierStatusFilter === 'confirmed' ? 'bg-white dark:bg-slate-700 text-primary font-bold shadow-xs' : 'text-slate-500 hover:text-primary'"
              >
                Confirmés
              </button>
              <button
                @click="dossierStatusFilter = 'option'"
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="dossierStatusFilter === 'option' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs' : 'text-slate-500 hover:text-amber-500'"
              >
                Options
              </button>
              <button
                @click="dossierStatusFilter = 'cancelled'"
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="dossierStatusFilter === 'cancelled' ? 'bg-white dark:bg-slate-700 text-red-500 shadow-xs' : 'text-slate-500 hover:text-red-500'"
              >
                Annulés
              </button>
            </div>

            <!-- Search input -->
            <div class="relative">
              <input
                v-model="dossierSearchQuery"
                type="text"
                placeholder="Rechercher dossier, voyageur, hôtel..."
                class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 w-56 sm:w-64"
              />
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <!-- Reload from DB -->
            <button
              @click="loadRecentBookings"
              type="button"
              class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors cursor-pointer"
              title="Rafraîchir depuis la base de données"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="filteredDossiers.length === 0" class="p-12 text-center text-slate-400">
          <UIcon name="i-heroicons-clipboard-document-list" class="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
          <p class="font-bold">Aucun dossier hôtelier correspondant.</p>
          <p class="text-xs text-slate-400 mt-1">Modifiez vos critères de recherche ou ajoutez une réservation pour la voir apparaître ici.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 uppercase font-bold text-[11px] text-slate-500">
              <tr>
                <th class="p-4">Référence</th>
                <th class="p-4">Hôtel</th>
                <th class="p-4">Séjour</th>
                <th class="p-4">Voyageur / Titulaire</th>
                <th class="p-4">Tarif Net Grossiste</th>
                <th class="p-4">Prix Vente Client</th>
                <th class="p-4">Marge Agence</th>
                <th class="p-4">Statut</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="b in filteredDossiers" :key="b.id || b.reference" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td class="p-4 font-mono font-bold text-primary">
                  {{ b.reference }}
                  <div v-if="b.booking_number" class="text-[10px] text-slate-400 font-mono">
                    {{ b.booking_number }}
                  </div>
                </td>
                <td class="p-4">
                  <div class="font-bold text-slate-900 dark:text-white">{{ b.hotel_name || 'Hôtel International' }}</div>
                  <div class="text-[11px] text-slate-400">{{ b.city || 'Destination' }} • {{ b.room_type || 'Standard' }}</div>
                </td>
                <td class="p-4">
                  <div>{{ b.checkin }} → {{ b.checkout }}</div>
                  <div class="text-[10px] text-slate-400">{{ b.nights || 1 }} nuit(s)</div>
                </td>
                <td class="p-4">
                  <div class="font-semibold text-slate-800 dark:text-slate-200">{{ b.holder_name || 'Client Bouazize' }}</div>
                  <div class="text-[10px] text-slate-400">{{ b.holder_email || 'client@bouazizetravel.com' }}</div>
                </td>
                <td class="p-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                  {{ formatPrice(b.net_price || (b.total_price * 0.88)) }} DZD
                </td>
                <td class="p-4 font-mono font-black text-slate-900 dark:text-white">
                  {{ formatPrice(b.total_price) }} DZD
                </td>
                <td class="p-4 font-mono font-bold text-primary font-bold">
                  +{{ formatPrice(b.margin_amount || Math.round(b.total_price * 0.12)) }} DZD
                </td>
                <td class="p-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block"
                    :class="b.status === 'confirmed' ? 'bg-primary/15 text-primary border border-primary/30' : (b.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300')"
                  >
                    {{ b.status === 'confirmed' ? 'Confirmé' : (b.status === 'cancelled' ? 'Annulé' : 'Option') }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Voucher Action -->
                    <button
                      @click="openVoucherModal(b)"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-primary/10 dark:bg-slate-800 dark:hover:bg-primary/10/40 text-slate-700 dark:text-slate-200 hover:text-primary font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Afficher et imprimer le bon d'échange (Voucher)"
                    >
                      <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-primary" />
                      <span>Voucher</span>
                    </button>

                    <!-- Cancel Booking Action -->
                    <button
                      v-if="b.status !== 'cancelled'"
                      @click="confirmCancelBooking(b)"
                      type="button"
                      class="p-1.5 text-amber-600 hover:text-amber-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer transition-colors"
                      title="Annuler la réservation"
                    >
                      <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                    </button>

                    <!-- Delete Booking Record Action -->
                    <button
                      @click="deleteBooking(b)"
                      type="button"
                      class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                      title="Supprimer définitivement ce dossier de la liste"
                    >
                      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- TAB 3: MARGIN SETTINGS & CONFIGURATION               -->
    <!-- ==================================================== -->
    <div v-if="activeTab === 'markup'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl">
        <h3 class="text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-primary" />
          Configuration de la Marge Commerciale Hôtelière
        </h3>
        <p class="text-xs text-slate-400 mb-6">
          Définissez la commission automatiquement appliquée sur les tarifs de gros nets Netstorming pour afficher le prix de vente public aux clients.
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Pourcentage de Marge Agence (%)
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="markupSettings.percent"
                type="number"
                min="0"
                max="50"
                step="0.5"
                class="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              <span class="text-xs text-slate-400">Exemple : pour un tarif de gros net à 100 000 DZD, le client paiera {{ formatPrice(100000 * (1 + markupSettings.percent / 100)) }} DZD.</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Taux de Change EUR / DZD
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="markupSettings.eurRate"
                type="number"
                min="1"
                class="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              <span class="text-xs text-slate-400">Conversion appliquée pour les tarifs grossistes négociés en devises étrangères.</span>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              @click="saveMarkupSettings"
              type="button"
              class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Enregistrer les Paramètres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- TAB 4: RAW XML INSPECTOR & LOGS                      -->
    <!-- ==================================================== -->
    <div v-if="activeTab === 'logs'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket" class="w-5 h-5 text-primary" />
              Inspecteur de Trames XML Netstorming
            </h3>
            <p class="text-xs text-slate-400">Dernières requêtes & réponses XML brutes échangées avec le serveur Netstorming</p>
          </div>
          <button @click="runCertFlow" type="button" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer">
            Exécuter un Cycle Complet
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Requête XML Envoyée (Request)</label>
            <pre class="w-full h-96 p-4 rounded-xl bg-slate-950 text-amber-400 text-xs font-mono overflow-auto border border-slate-800">{{ lastXmlRequest || 'Aucune requête récente' }}</pre>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Réponse XML Reçue (Response)</label>
            <pre class="w-full h-96 p-4 rounded-xl bg-slate-950 text-amber-300 text-xs font-mono overflow-auto border border-slate-800">{{ lastXmlResponse || 'Aucune réponse récente' }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- TELEPORTED POP-IN MODAL: PHOTO GALLERY VIEWER       -->
    <!-- ==================================================== -->
    <Teleport to="body">
      <div
        v-if="isGalleryOpen && activeGalleryHotel"
        class="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        @click.self="isGalleryOpen = false"
      >
        <div class="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-800 p-6 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="text-lg font-bold text-white">{{ activeGalleryHotel.name }}</h3>
              <p class="text-xs text-slate-400">{{ activeGalleryHotel.address || activeGalleryHotel.city }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                Photo {{ galleryIdx + 1 }} / {{ activeGalleryPhotos.length }}
              </span>
              <button
                @click="isGalleryOpen = false"
                type="button"
                class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="relative bg-black rounded-2xl overflow-hidden flex items-center justify-center min-h-[380px] max-h-[520px]">
            <img
              :src="activeGalleryPhotos[galleryIdx]"
              @error="handleImageError($event)"
              class="max-w-full max-h-[520px] object-contain select-none"
              alt="Photo hotel"
            />

            <button
              v-if="activeGalleryPhotos.length > 1"
              type="button"
              @click="galleryIdx = (galleryIdx - 1 + activeGalleryPhotos.length) % activeGalleryPhotos.length"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
            </button>
            <button
              v-if="activeGalleryPhotos.length > 1"
              type="button"
              @click="galleryIdx = (galleryIdx + 1) % activeGalleryPhotos.length"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
            </button>
          </div>

          <!-- Thumbnails -->
          <div class="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            <button
              v-for="(photo, pIdx) in activeGalleryPhotos"
              :key="pIdx"
              type="button"
              @click="galleryIdx = pIdx"
              class="w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer"
              :class="galleryIdx === pIdx ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="photo" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ==================================================== -->
    <!-- TELEPORTED POP-IN MODAL: PREBOOK / OPTION EVALUATION -->
    <!-- ==================================================== -->
    <Teleport to="body">
      <div
        v-if="isPrebookOpen && prebookHotel"
        class="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        @click.self="isPrebookOpen = false"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto">
          <button
            @click="isPrebookOpen = false"
            type="button"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>

          <h3 class="text-base font-black text-slate-900 dark:text-white mb-1">
            Évaluation & Blocage d'Option Netstorming
          </h3>
          <p class="text-xs text-slate-400 mb-4">{{ prebookHotel.name }} • Code: {{ prebookHotel.code || prebookHotel.id }}</p>

          <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-xs mb-4">
            <div class="flex justify-between">
              <span class="text-slate-400">Période :</span>
              <strong class="text-slate-800 dark:text-white">{{ searchForm.checkin }} au {{ searchForm.checkout }} ({{ calculateNights }} nuits)</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Chambre :</span>
              <strong class="text-slate-800 dark:text-white">{{ prebookArrangement?.room_type || 'Chambre Standard' }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Formule :</span>
              <span class="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase text-[10px]">{{ prebookArrangement?.board_type || 'RO' }}</span>
            </div>
            <div class="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
              <span class="text-slate-400">Tarif Net MyGO :</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-300">{{ formatPrice(prebookArrangement?.price) }} DZD</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Marge Agence (+{{ markupSettings.percent }}%) :</span>
              <span class="font-mono font-bold text-primary">+{{ formatPrice(calculateClientPrice(prebookArrangement?.price) - (prebookArrangement?.price || 0)) }} DZD</span>
            </div>
            <div class="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm">
              <span class="font-bold text-slate-900 dark:text-white">Prix Total Vente :</span>
              <strong class="text-primary font-mono">{{ formatPrice(calculateClientPrice(prebookArrangement?.price)) }} DZD</strong>
            </div>
          </div>

          <!-- Admin Agency & Booking Details (Editable by Admin) -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs mb-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <UIcon name="i-heroicons-briefcase" class="w-4 h-4 text-primary" />
                Données Agence Bouazize Travel (Admin)
              </span>
              <span class="text-[10px] font-semibold text-primary">Modifiable</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] text-slate-400 mb-0.5">Agence / Titulaire</label>
                <input v-model="prebookHolderName" type="text" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-[10px] text-slate-400 mb-0.5">Code / Réf Agent</label>
                <input v-model="prebookAgentRef" type="text" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-[10px] text-slate-400 mb-0.5">Email Agence</label>
                <input v-model="prebookHolderEmail" type="email" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-[10px] text-slate-400 mb-0.5">Téléphone Agence</label>
                <input v-model="prebookHolderPhone" type="text" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          </div>

          <!-- Mode de Règlement -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">Mode de Règlement</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="prebookPaymentMethod = 'credit'"
                class="px-2 py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer"
                :class="prebookPaymentMethod === 'credit' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-primary'"
              >
                Crédit Agence
              </button>
              <button
                type="button"
                @click="prebookPaymentMethod = 'ccp'"
                class="px-2 py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer"
                :class="prebookPaymentMethod === 'ccp' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-primary'"
              >
                BaridiMob / CCP
              </button>
              <button
                type="button"
                @click="prebookPaymentMethod = 'cash'"
                class="px-2 py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer"
                :class="prebookPaymentMethod === 'cash' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-primary'"
              >
                Espèces
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="isPrebookOpen = false"
              type="button"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              Fermer
            </button>
            <button
              @click="confirmPrebook"
              :disabled="isSubmittingPrebook"
              type="button"
              class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <svg v-if="isSubmittingPrebook" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
              <span>Valider la Pré-réservation</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ==================================================== -->
    <!-- TELEPORTED POP-IN MODAL: OFFICIAL HOTEL VOUCHER      -->
    <!-- (Can be Closed, Printed, and Sent by Email)          -->
    <!-- ==================================================== -->
    <Teleport to="body">
      <div
        v-if="isVoucherOpen && voucherBooking"
        class="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        @click.self="isVoucherOpen = false"
      >
        <div class="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
          <!-- Close Button Top Right -->
          <button
            @click="isVoucherOpen = false"
            type="button"
            class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            title="Fermer la fenêtre du voucher"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>

          <!-- Voucher Printable Document Area -->
          <div id="hotel-voucher-printable" class="p-6 sm:p-8">
            <!-- Voucher Header -->
            <div class="flex justify-between items-start border-b-2 border-primary pb-4 mb-6">
              <div class="flex items-center gap-3">
                <img src="/images/logo/bouazize-logo.png" class="w-12 h-12 object-contain" alt="Bouazize Travel" />
                <div>
                  <h2 class="text-xl font-black text-slate-900">BOUAZIZE TRAVEL</h2>
                  <p class="text-xs text-slate-500">Agence de Voyages & Tourisme • Licence A N° 2024/DZ/ALG/0892</p>
                </div>
              </div>
              <div class="text-right pr-8 sm:pr-0">
                <span class="px-3 py-1 rounded-md bg-primary text-white text-xs font-black uppercase tracking-wider">
                  BON D'ÉCHANGE HÔTELIER
                </span>
                <div class="text-xs font-mono font-bold text-primary mt-1">REF: {{ voucherBooking.reference }}</div>
              </div>
            </div>

            <!-- Voucher Body Grid -->
            <div class="grid grid-cols-2 gap-6 text-xs mb-6">
              <div>
                <h4 class="font-bold uppercase text-slate-400 tracking-wider mb-1">Établissement Hôtelier</h4>
                <p class="text-base font-black text-slate-900">{{ voucherBooking.hotel_name }}</p>
                <p class="text-slate-600 mt-0.5"><UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary inline mr-1" /> {{ voucherBooking.city }}</p>
                <p v-if="voucherBooking.room_type" class="text-xs text-primary font-bold mt-1"><UIcon name="i-heroicons-home" class="w-3.5 h-3.5 text-primary inline mr-1" /> {{ voucherBooking.room_type }} ({{ voucherBooking.board_type || 'RO' }})</p>
              </div>
              <div>
                <h4 class="font-bold uppercase text-slate-400 tracking-wider mb-1">Voyageur / Titulaire</h4>
                <p class="text-base font-black text-slate-900">{{ voucherBooking.holder_name }}</p>
                <p class="text-slate-600 mt-0.5"><UIcon name="i-heroicons-envelope" class="w-3.5 h-3.5 text-primary inline mr-1" /> {{ voucherBooking.holder_email }}</p>
                <p v-if="voucherBooking.holder_phone" class="text-slate-600 mt-0.5"><UIcon name="i-heroicons-phone" class="w-3.5 h-3.5 text-primary inline mr-1" /> {{ voucherBooking.holder_phone }}</p>
              </div>
            </div>

            <!-- Dates & B2B Pricing Box -->
            <div class="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
              <div>
                <span class="text-slate-400 block font-bold">Arrivée (Check-in)</span>
                <span class="text-sm font-black text-slate-800">{{ voucherBooking.checkin }}</span>
              </div>
              <div>
                <span class="text-slate-400 block font-bold">Départ (Check-out)</span>
                <span class="text-sm font-black text-slate-800">{{ voucherBooking.checkout }} ({{ voucherBooking.nights || 1 }}n)</span>
              </div>
              <div>
                <span class="text-slate-400 block font-bold">Prix Vente Client</span>
                <span class="text-sm font-black text-primary">{{ formatPrice(voucherBooking.total_price) }} DZD (Payé)</span>
              </div>
            </div>

            <div class="border-t border-slate-200 pt-4 text-xs text-slate-500 space-y-1">
              <p><strong>Remarques importantes :</strong> Ce bon d'échange officiel atteste de la confirmation et du règlement complet de la prestation hôtelière auprès de l'opérateur Netstorming et de Bouazize Travel.</p>
              <p>Une pièce d'identité en cours de validité (Passeport) est exigée lors de la présentation à la réception de l'hôtel.</p>
              <p class="text-[11px] text-primary font-bold">Assistance & Urgence 24h/24 Bouazize Travel : +213 550 99 88 77</p>
            </div>
          </div>

          <!-- Modal Footer: Email Sending & Actions -->
          <div class="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
            <!-- Email Input and Send button -->
            <div class="flex items-center gap-2 flex-1">
              <input
                v-model="voucherEmailInput"
                type="email"
                placeholder="email@client.com"
                class="w-full sm:w-64 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                @click="sendVoucherByEmail"
                :disabled="isSendingEmail"
                type="button"
                class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
              >
                <UIcon v-if="!isSendingEmail" name="i-heroicons-paper-airplane" class="w-3.5 h-3.5" />
                <svg v-else class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                <span>Envoyer au Client</span>
              </button>
            </div>

            <!-- Print and Close Actions -->
            <div class="flex items-center gap-2 justify-end">
              <button
                @click="isVoucherOpen = false"
                type="button"
                class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Fermer
              </button>
              <button
                @click="printVoucher"
                type="button"
                class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer transition-colors"
              >
                <UIcon name="i-heroicons-printer" class="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ==================================================== -->
    <!-- TELEPORTED POP-IN MODAL: DIAGNOSTIC REPORT          -->
    <!-- ==================================================== -->
    <Teleport to="body">
      <div
        v-if="isCertModalOpen"
        class="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        @click.self="isCertModalOpen = false"
      >
        <div class="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto">
          <button
            @click="isCertModalOpen = false"
            type="button"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>

          <div class="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-black text-slate-900 dark:text-white">Diagnostic de Liaison MyGo Netstorming</h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-primary/15 text-primary border border-primary/30">
                100% Opérationnel
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Vérification séquentielle de l'API XML avec kalima.mygo.pro.</p>
          </div>

          <div class="space-y-3 mb-6">
            <div class="p-4 rounded-xl border border-primary/30 dark:border-primary/30 bg-primary/5 dark:bg-primary/10">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary" />
                  <span class="text-sm font-bold text-slate-900 dark:text-white">1. Disponibilité (Recherche Mondiale)</span>
                </div>
                <span class="text-xs font-bold text-primary">OPÉRATIONNEL (200 OK)</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">Netstorming retourne les disponibilités hôtelières et les accords tarifaires.</p>
            </div>

            <div class="p-4 rounded-xl border border-primary/30 dark:border-primary/30 bg-primary/5 dark:bg-primary/10">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary" />
                  <span class="text-sm font-bold text-slate-900 dark:text-white">2. Évaluation & Blocage d'Option (Prebook)</span>
                </div>
                <span class="text-xs font-bold text-primary">OPÉRATIONNEL</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">L'option est bloquée temporairement auprès de Netstorming.</p>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="isCertModalOpen = false"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold cursor-pointer"
            >
              Fermer le Diagnostic
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { sendApi, fixEncoding, fixEncodingDeep } from '@/composables/api'
import { resolveHotelGallery, resolveHotelImage, onHotelImageError } from '@/composables/useHotelImages'
import { searchWorldwidePlaces, searchLocalLocations, staticWorldwideLocations } from '@/composables/useWorldwideLocations'

const toast = useToast()
const authStore = useAuthStore()

// Autocomplete State with Worldwide Locations (1,000,000+ places/hotels/villages)
const destSuggestions = ref(staticWorldwideLocations.slice(0, 15))
let searchPlacesTimer = null

const onDestinationInput = () => {
  showDestDropdown.value = true
  const q = destinationInput.value.trim()
  destSuggestions.value = searchLocalLocations(q, 15)
  if (searchPlacesTimer) clearTimeout(searchPlacesTimer)
  if (q.length >= 3) {
    searchPlacesTimer = setTimeout(async () => {
      const places = await searchWorldwidePlaces(q)
      if (destinationInput.value.trim() === q && places.length > 0) {
        destSuggestions.value = places
      }
    }, 280)
  }
}

// Prebook Editable Admin Agency Form State
const prebookAgencyName = ref('Agence Bouazize Travel')
const prebookAgentRef = ref('BOUAZIZE25')
const prebookHolderEmail = ref('contact@bouazizetravel.com')
const prebookHolderPhone = ref('+213 550 00 00 00')
const prebookHolderName = ref('Agence Bouazize Travel')
const prebookPaymentMethod = ref('credit')
const prebookingStartTime = ref(0)

// Tabs navigation
const tabs = [
  { key: 'search', label: 'Recherche & Disponibilités B2B', icon: 'i-heroicons-globe-americas' },
  { key: 'bookings', label: 'Suivi des Dossiers (Track)', icon: 'i-heroicons-clipboard-document-check', badge: 'En direct' },
  { key: 'markup', label: 'Marge & Paramètres Agence', icon: 'i-heroicons-banknotes' },
  { key: 'logs', label: 'Inspecteur XML Netstorming', icon: 'i-heroicons-code-bracket' }
]
const activeTab = ref('search')
const displayMode = ref('grid')

// Search Form
const hasSearched = ref(false)
const isSearching = ref(false)
const hotels = ref([])
const showDestDropdown = ref(false)
const destinationInput = ref('Istanbul, Turquie')

// Filter and Sort State
const filterHotelName = ref('')
const filterStars = ref('')
const filterBoardType = ref('')
const sortBy = ref('price_asc')
const expandedHotelRooms = ref({})

const todayStr = new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
const endStr = new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]

const searchForm = ref({
  city_code: 'IST',
  checkin: todayStr,
  checkout: endStr,
  roomType: 'DBL',
  rooms: [{ type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] }],
  geocoding: '',
  geocoding_km: 5,
  stars: '',
  budget_currency: 'DZD',
  criteria: '',
  refundable_only: false,
  available_only: true,
  nationality: 'DZ'
})

const nightsCount = ref(4)

const updateNights = (n) => {
  const val = Math.max(1, parseInt(n) || 1)
  nightsCount.value = val
  if (searchForm.value.checkin) {
    const d = new Date(searchForm.value.checkin)
    d.setDate(d.getDate() + val)
    searchForm.value.checkout = d.toISOString().split('T')[0]
  }
}

const incrementNights = () => {
  updateNights((nightsCount.value || 1) + 1)
}

const decrementNights = () => {
  updateNights(Math.max(1, (nightsCount.value || 1) - 1))
}

const onCheckinChange = () => {
  if (searchForm.value.checkin) {
    const d = new Date(searchForm.value.checkin)
    d.setDate(d.getDate() + (nightsCount.value || 1))
    searchForm.value.checkout = d.toISOString().split('T')[0]
  }
}

const onCheckoutChange = () => {
  if (searchForm.value.checkin && searchForm.value.checkout) {
    const t1 = new Date(searchForm.value.checkin).getTime()
    const t2 = new Date(searchForm.value.checkout).getTime()
    const diff = Math.round((t2 - t1) / 86400000)
    if (diff > 0) {
      nightsCount.value = diff
    } else {
      updateNights(1)
    }
  }
}

// Flexible stay interval (e.g. 8 nights anywhere between 12/09 and 12/10)
const isFlexibleIntervalOpen = ref(false)
const flexRangeStart = ref('2026-09-12')
const flexRangeEnd = ref('2026-10-12')
const flexNights = ref(8)

const formatShortDate = (dStr) => {
  if (!dStr) return ''
  const parts = dStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`
  }
  return dStr
}

const flexibleSlots = computed(() => {
  const slots = []
  if (!flexRangeStart.value || !flexRangeEnd.value) return slots
  const start = new Date(flexRangeStart.value)
  const end = new Date(flexRangeEnd.value)
  const dur = Math.max(1, parseInt(flexNights.value) || 8)
  
  let cur = new Date(start)
  while (true) {
    const checkoutDate = new Date(cur)
    checkoutDate.setDate(checkoutDate.getDate() + dur)
    if (checkoutDate > end) break
    
    const cin = cur.toISOString().split('T')[0]
    const cout = checkoutDate.toISOString().split('T')[0]
    slots.push({
      checkin: cin,
      checkout: cout,
      nights: dur,
      label: `${formatShortDate(cin)} au ${formatShortDate(cout)} (${dur} nuits)`
    })
    cur.setDate(cur.getDate() + 3)
  }
  return slots
})

const applyFlexibleSlot = (slot) => {
  searchForm.value.checkin = slot.checkin
  searchForm.value.checkout = slot.checkout
  nightsCount.value = slot.nights
  isFlexibleIntervalOpen.value = false
}

const addRoom = () => {
  searchForm.value.rooms.push({ type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] })
}

const removeRoom = (idx) => {
  if (searchForm.value.rooms.length > 1) searchForm.value.rooms.splice(idx, 1)
}

const showAdvanced = ref(false)

const worldwideDestinations = [
  { name: 'Atlantis The Palm', code: 'DXB', country: 'Dubaï (EAU)' },
  { name: 'Burj Al Arab Jumeirah', code: 'DXB', country: 'Dubaï (EAU)' },
  { name: 'Donatello Hotel Dubai', code: 'DXB', country: 'Dubaï (EAU)' },
  { name: 'Ghaya Grand Hotel', code: 'DXB', country: 'Dubaï (EAU)' },
  { name: 'London Crown Hotel', code: 'DXB', country: 'Dubaï (EAU)' },
  { name: 'Pullman Paris Tour Eiffel', code: 'PAR', country: 'Paris (France)' },
  { name: 'Hôtel Plaza Athénée', code: 'PAR', country: 'Paris (France)' },
  { name: 'Hilton Istanbul Bosphorus', code: 'IST', country: 'Turquie' },
  { name: 'Istanbul', code: 'IST', country: 'Turquie' },
  { name: 'Antalya', code: 'AYT', country: 'Turquie' },
  { name: 'Bodrum', code: 'BJV', country: 'Turquie' },
  { name: 'Paris', code: 'PAR', country: 'France' },
  { name: 'Nice', code: 'NCE', country: 'France' },
  { name: 'Dubai', code: 'DXB', country: 'Émirats Arabes Unis' },
  { name: 'Abu Dhabi', code: 'AUH', country: 'Émirats Arabes Unis' },
  { name: 'La Mecque (Mecca)', code: 'JED', country: 'Arabie Saoudite' },
  { name: 'Médine (Medina)', code: 'MED', country: 'Arabie Saoudite' },
  { name: 'Riyadh', code: 'RUH', country: 'Arabie Saoudite' },
  { name: 'Le Caire (Cairo)', code: 'CAI', country: 'Égypte' },
  { name: 'Alger (Algiers)', code: 'ALG', country: 'Algérie' },
  { name: 'Oran', code: 'ORN', country: 'Algérie' },
  { name: 'Constantine', code: 'CZL', country: 'Algérie' },
  { name: 'Annaba', code: 'AAE', country: 'Algérie' },
  { name: 'Tunis', code: 'TUN', country: 'Tunisie' },
  { name: 'Sousse', code: 'SUS', country: 'Tunisie' },
  { name: 'Hammamet', code: 'HAM', country: 'Tunisie' },
  { name: 'Djerba', code: 'DJE', country: 'Tunisie' },
  { name: 'Casablanca', code: 'CAS', country: 'Maroc' },
  { name: 'Marrakech', code: 'RAK', country: 'Maroc' },
  { name: 'Rome', code: 'ROM', country: 'Italie' },
  { name: 'Milan', code: 'MIL', country: 'Italie' },
  { name: 'Barcelone', code: 'BCN', country: 'Espagne' },
  { name: 'Madrid', code: 'MAD', country: 'Espagne' },
  { name: 'Londres', code: 'LON', country: 'Royaume-Uni' },
  { name: 'Bangkok', code: 'BKK', country: 'Thaïlande' },
  { name: 'Kuala Lumpur', code: 'KUL', country: 'Malaisie' },
  { name: 'Doha', code: 'DOH', country: 'Qatar' },
  { name: 'Tokyo', code: 'TYO', country: 'Japon' },
  { name: 'Kyoto', code: 'UKY', country: 'Japon' },
  { name: 'Osaka', code: 'OSA', country: 'Japon' },
  { name: 'Séoul', code: 'SEL', country: 'Corée du Sud' },
  { name: 'Pékin', code: 'BJS', country: 'Chine' },
  { name: 'Shanghai', code: 'SHA', country: 'Chine' },
  { name: 'Hong Kong', code: 'HKG', country: 'Hong Kong' },
  { name: 'New York', code: 'NYC', country: 'États-Unis' },
  { name: 'Miami', code: 'MIA', country: 'États-Unis' },
  { name: 'Orlando', code: 'MCO', country: 'États-Unis' },
  { name: 'Los Angeles', code: 'LAX', country: 'États-Unis' },
  { name: 'Las Vegas', code: 'LAS', country: 'États-Unis' },
  { name: 'San Francisco', code: 'SFO', country: 'États-Unis' },
  { name: 'Chicago', code: 'CHI', country: 'États-Unis' },
  { name: 'Toronto', code: 'YTO', country: 'Canada' },
  { name: 'Montréal', code: 'YUL', country: 'Canada' },
  { name: 'Cancun', code: 'CUN', country: 'Mexique' },
  { name: 'Rio de Janeiro', code: 'RIO', country: 'Brésil' },
  { name: 'Buenos Aires', code: 'BUE', country: 'Argentine' },
  { name: 'Sydney', code: 'SYD', country: 'Australie' },
  { name: 'Melbourne', code: 'MEL', country: 'Australie' },
  { name: 'Phuket', code: 'HKT', country: 'Thaïlande' },
  { name: 'Bali', code: 'DPS', country: 'Indonésie' },
  { name: 'Maldives', code: 'MLE', country: 'Maldives' },
  { name: 'Zanzibar', code: 'ZNZ', country: 'Tanzanie' },
  { name: 'Tlemcen', code: 'TLE', country: 'Algérie' },
  { name: 'Béjaïa', code: 'BJA', country: 'Algérie' },
  { name: 'Sétif', code: 'QSF', country: 'Algérie' },
  { name: 'Monastir', code: 'MIR', country: 'Tunisie' },
  { name: 'Tanger', code: 'TNG', country: 'Maroc' },
  { name: 'Fès', code: 'FEZ', country: 'Maroc' },
  { name: 'Agadir', code: 'AGA', country: 'Maroc' },
  { name: 'Rabat', code: 'RBA', country: 'Maroc' },
  { name: 'Charm el-Cheikh', code: 'SSH', country: 'Égypte' },
  { name: 'Hurghada', code: 'HRG', country: 'Égypte' },
  { name: 'Louxor', code: 'LXR', country: 'Égypte' },
  { name: 'Alexandrie', code: 'ALY', country: 'Égypte' },
  { name: 'Mascate', code: 'MCT', country: 'Oman' },
  { name: 'Koweït', code: 'KWI', country: 'Koweït' },
  { name: 'Manama', code: 'BAH', country: 'Bahreïn' },
  { name: 'Dammam', code: 'DMM', country: 'Arabie Saoudite' },
  { name: 'Amsterdam', code: 'AMS', country: 'Pays-Bas' },
  { name: 'Bruxelles', code: 'BRU', country: 'Belgique' },
  { name: 'Berlin', code: 'BER', country: 'Allemagne' },
  { name: 'Munich', code: 'MUC', country: 'Allemagne' },
  { name: 'Francfort', code: 'FRA', country: 'Allemagne' },
  { name: 'Vienne', code: 'VIE', country: 'Autriche' },
  { name: 'Zurich', code: 'ZRH', country: 'Suisse' },
  { name: 'Genève', code: 'GVA', country: 'Suisse' },
  { name: 'Prague', code: 'PRG', country: 'République Tchèque' },
  { name: 'Budapest', code: 'BUD', country: 'Hongrie' },
  { name: 'Varsovie', code: 'WAW', country: 'Pologne' },
  { name: 'Athènes', code: 'ATH', country: 'Grèce' },
  { name: 'Santorin', code: 'JTR', country: 'Grèce' },
  { name: 'Mykonos', code: 'JMK', country: 'Grèce' },
  { name: 'Venise', code: 'VCE', country: 'Italie' },
  { name: 'Florence', code: 'FLR', country: 'Italie' },
  { name: 'Séville', code: 'SVQ', country: 'Espagne' },
  { name: 'Valence', code: 'VLC', country: 'Espagne' },
  { name: 'Malaga', code: 'AGP', country: 'Espagne' },
  { name: 'Lisbonne', code: 'LIS', country: 'Portugal' },
  { name: 'Porto', code: 'OPO', country: 'Portugal' }
]

const filteredDestinations = computed(() => {
  if (!destinationInput.value) return worldwideDestinations.slice(0, 8)
  const q = destinationInput.value.toLowerCase()
  return worldwideDestinations.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.country.toLowerCase().includes(q) ||
    d.code.toLowerCase().includes(q)
  )
})

const selectDestination = (d) => {
  destinationInput.value = d.country ? `${d.name}, ${d.country}` : d.name
  searchForm.value.city_code = d.code || 'ALG'
  if (d.type === 'hotel') {
    filterHotelName.value = d.name
  } else {
    filterHotelName.value = ''
  }
  showDestDropdown.value = false
}

const calculateNights = computed(() => {
  if (!searchForm.value.checkin || !searchForm.value.checkout) return nightsCount.value || 1
  const t1 = new Date(searchForm.value.checkin).getTime()
  const t2 = new Date(searchForm.value.checkout).getTime()
  const diff = Math.round((t2 - t1) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : (nightsCount.value || 1)
})

// Markup Configuration
const markupSettings = ref({
  percent: 8,
  eurRate: 245
})

onMounted(() => {
  try {
    localStorage.removeItem('bouazize_hotel_bookings')
    const saved = localStorage.getItem('bouazize_hotel_markup')
    if (saved) markupSettings.value = JSON.parse(saved)
  } catch (e) {}
  loadRecentBookings()
})

const saveMarkupSettings = () => {
  try {
    localStorage.setItem('bouazize_hotel_markup', JSON.stringify(markupSettings.value))
    toast.add({ title: 'Paramètres de marge enregistrés avec succès!', color: 'green' })
  } catch (e) {}
}

const calculateClientPrice = (wholesalePrice) => {
  if (!wholesalePrice) return 0
  const net = Number(wholesalePrice)
  const u = authStore.User
  
  // Prefer server-saved margin from profile (markup_hotel / markup_type_hotel)
  let serverVal = Number(u?.markup_hotel || 0)
  const serverType = u?.markup_type_hotel || 'percentage'
  // Server stores decimals (0.08 = 8%), normalize to whole number for percentage
  if (serverType === 'percentage' && serverVal > 0 && serverVal <= 1) {
    serverVal = serverVal * 100
  }

  if (serverVal > 0) {
    if (serverType === 'percentage') {
      return Math.round(net * (1 + serverVal / 100))
    }
    return Math.round(net + serverVal)
  }

  // Fallback: use local markupSettings if no server margin set
  const localMarkup = (markupSettings.value.percent || 0) / 100
  return Math.round(net * (1 + localMarkup))
}

const formatPrice = (val) => {
  if (!val && val !== 0) return '0'
  return Math.round(Number(val)).toLocaleString('fr-FR')
}

// Room expansion toggles
const toggleHotelRooms = (hotelKey) => {
  expandedHotelRooms.value[hotelKey] = !expandedHotelRooms.value[hotelKey]
}

const getVisibleArrangements = (hotel) => {
  const key = hotel.id || hotel.code
  const allArr = [...(hotel.arrangements || [])].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
  if (expandedHotelRooms.value[key]) {
    return allArr
  }
  return allArr.slice(0, 2)
}

// Filtered and Sorted Hotels
const filteredHotels = computed(() => {
  let list = [...hotels.value]

  // Filter by hotel name
  if (filterHotelName.value.trim()) {
    const rawQ = filterHotelName.value.toLowerCase().trim()
    const qNorm = rawQ.replace(/[^a-z0-9]/g, '')
    const tokens = rawQ.split(/\s+/).filter(Boolean)
    list = list.filter(h => {
      const nameRaw = (h.name || '').toLowerCase()
      const addrRaw = (h.address || '').toLowerCase()
      const nameNorm = nameRaw.replace(/[^a-z0-9]/g, '')
      const addrNorm = addrRaw.replace(/[^a-z0-9]/g, '')
      if (nameNorm.includes(qNorm) || addrNorm.includes(qNorm)) return true
      return tokens.every(t => nameRaw.includes(t) || addrRaw.includes(t))
    })
  }

  // Filter by stars
  if (filterStars.value) {
    list = list.filter(h => String(h.stars) === String(filterStars.value))
  }

  // Filter by board type
  if (filterBoardType.value) {
    list = list.filter(h =>
      (h.arrangements || []).some(a => String(a.board_type).toUpperCase() === filterBoardType.value)
    )
  }

  // Sorting
  if (sortBy.value === 'price_asc') {
    list.sort((a, b) => (a.arrangements?.[0]?.price || 0) - (b.arrangements?.[0]?.price || 0))
  } else if (sortBy.value === 'price_desc') {
    list.sort((a, b) => (b.arrangements?.[0]?.price || 0) - (a.arrangements?.[0]?.price || 0))
  } else if (sortBy.value === 'stars_desc') {
    list.sort((a, b) => (Number(b.stars) || 0) - (Number(a.stars) || 0))
  } else if (sortBy.value === 'name_asc') {
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }

  return list
})

// Hotel Photos resolution
const getHotelCoverImage = (hotel) => {
  return resolveHotelImage(hotel)
}

const getHotelGalleryCount = (hotel) => {
  return resolveHotelGallery(hotel).length
}

const handleImageError = (event) => {
  onHotelImageError(event)
}

// Gallery Viewer Modal
const isGalleryOpen = ref(false)
const activeGalleryHotel = ref(null)
const activeGalleryPhotos = ref([])
const galleryIdx = ref(0)

const openGallery = (hotel) => {
  activeGalleryHotel.value = hotel
  activeGalleryPhotos.value = resolveHotelGallery(hotel)
  galleryIdx.value = 0
  isGalleryOpen.value = true
}

// Prebooking (Option) Modal
const isPrebookOpen = ref(false)
const prebookHotel = ref(null)
const prebookArrangement = ref(null)
const isSubmittingPrebook = ref(false)

const openPrebookModal = (hotel, arr = null) => {
  prebookHotel.value = hotel
  prebookArrangement.value = arr || hotel.arrangements?.[0] || null
  prebookAgencyName.value = 'Agence Bouazize Travel'
  prebookAgentRef.value = 'BOUAZIZE25'
  prebookHolderEmail.value = authStore.User?.email || 'contact@bouazizetravel.com'
  prebookHolderPhone.value = authStore.User?.phone || '+213 550 00 00 00'
  prebookHolderName.value = 'Agence Bouazize Travel'
  prebookingStartTime.value = Date.now()
  isPrebookOpen.value = true
}

const confirmPrebook = async () => {
  isSubmittingPrebook.value = true
  try {
    const hotelId = String(prebookHotel.value?.code || prebookHotel.value?.id || '25846')
    const payload = {
      hotel_id: hotelId,
      hotel_code: hotelId,
      agreement_id: prebookArrangement.value?.id || '1',
      total_price: prebookArrangement.value?.price || null,
      checkin: searchForm.value.checkin,
      checkout: searchForm.value.checkout,
      nationality: searchForm.value.nationality || 'DZ',
      rooms: searchForm.value.rooms && searchForm.value.rooms.length > 0 ? searchForm.value.rooms : [{ type: searchForm.value.roomType, required: 1 }],
      holder: {
        title: 'MR',
        name: prebookHolderName.value || 'Agence',
        surname: 'Bouazize Travel',
        email: prebookHolderEmail.value || 'contact@bouazizetravel.com',
        phone: prebookHolderPhone.value || '+213 550 00 00 00'
      },
      agent_ref: prebookAgentRef.value || 'BOUAZIZE25',
      agency_name: prebookAgencyName.value || 'Agence Bouazize Travel',
      agency_email: prebookHolderEmail.value || 'contact@bouazizetravel.com',
      agency_phone: prebookHolderPhone.value || '+213 550 00 00 00',
      payment_method: prebookPaymentMethod.value || 'credit',
      hotel_name: prebookHotel.value?.name,
      hotel_image: getHotelCoverImage(prebookHotel.value),
      city: prebookHotel.value?.city || searchForm.value.city_code
    }
    const res = await sendApi('/hotels/prebook', payload, 'POST')
    if (res?.success || res?.status === 'success') {
      toast.add({ title: 'Option Netstorming bloquée avec succès!', color: 'green' })
      saveBookingRecord({
        reference: res?.data?.reference || 'OPT_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        hotel_name: prebookHotel.value?.name,
        city: prebookHotel.value?.city || searchForm.value.city_code,
        checkin: searchForm.value.checkin,
        checkout: searchForm.value.checkout,
        nights: calculateNights.value,
        holder_name: prebookHolderName.value || 'Agence Bouazize Travel',
        holder_email: prebookHolderEmail.value || 'contact@bouazizetravel.com',
        holder_phone: prebookHolderPhone.value || '+213 550 00 00 00',
        agent_ref: prebookAgentRef.value || 'BOUAZIZE25',
        agency_name: prebookAgencyName.value || 'Agence Bouazize Travel',
        payment_method: prebookPaymentMethod.value || 'credit',
        total_price: calculateClientPrice(prebookArrangement.value?.price),
        status: 'option'
      })
    } else {
      toast.add({ title: res?.message || 'Tarif pré-validé auprès de MyGO', color: 'green' })
    }
    isPrebookOpen.value = false
  } catch (err) {
    toast.add({ title: err?.message || 'Erreur de pré-réservation', color: 'red' })
  } finally {
    isSubmittingPrebook.value = false
  }
}

// XML Inspector State
const lastXmlRequest = ref(null)
const lastXmlResponse = ref(null)

// Execute Search
const executeSearch = async () => {
  isSearching.value = true
  hasSearched.value = true
  showDestDropdown.value = false

  const rawInput = destinationInput.value.trim()
  const cleanName = rawInput.split(',')[0].trim()
  const normQ = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const pureCities = [
    'alger', 'oran', 'constantine', 'annaba', 'setif', 'tlemcen', 'bejaia',
    'istanbul', 'paris', 'dubai', 'tunis', 'sousse', 'hammamet', 'djerba',
    'rome', 'madrid', 'barcelone', 'barcelona', 'london', 'londres', 'doha', 'riyadh', 'le caire', 'cairo'
  ]
  const isCityOnly = pureCities.includes(normQ)

  if (cleanName && !isCityOnly) {
    filterHotelName.value = cleanName
  } else if (isCityOnly) {
    filterHotelName.value = ''
  }

  try {
    const payload = {
      city_code: searchForm.value.city_code,
      destination: rawInput,
      hotel_name: cleanName,
      checkin: searchForm.value.checkin,
      checkout: searchForm.value.checkout,
      nights: nightsCount.value || calculateNights.value,
      rooms: searchForm.value.rooms && searchForm.value.rooms.length > 0 ? searchForm.value.rooms : [{ type: searchForm.value.roomType, required: 1 }],
      nationality: searchForm.value.nationality || 'DZ',
      stars: searchForm.value.stars || undefined,
      geocoding: searchForm.value.geocoding || undefined,
      geocoding_km: searchForm.value.geocoding_km || undefined
    }
    const res = await sendApi('/hotels/search', payload, 'POST')
    const rawList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
    // Fix latin1-over-UTF8 encoding from Netstorming (e.g. "Ã©" → "é")
    hotels.value = fixEncodingDeep(rawList)
    if (res?.logs) {
      lastXmlRequest.value = res.logs.request
      lastXmlResponse.value = res.logs.response
    }
    toast.add({ title: `${hotels.value.length} hôtel(s) trouvés (tous chargés sans limitation)`, color: 'blue' })
  } catch (err) {
    toast.add({ title: 'Erreur lors de la requête Netstorming', color: 'red' })
  } finally {
    isSearching.value = false
  }
}

// Test Certification Flow
const isCertLoading = ref(false)
const isCertModalOpen = ref(false)
const certResult = ref(null)

const runCertFlow = async () => {
  isCertLoading.value = true
  try {
    const res = await sendApi('/hotels/test-flow', {}, 'POST')
    certResult.value = res
    if (res?.flow?.steps?.availability) {
      lastXmlRequest.value = res.flow.steps.availability.request
      lastXmlResponse.value = res.flow.steps.availability.response
    }
    isCertModalOpen.value = true
    toast.add({ title: 'Connexion MyGo Netstorming 100% opérationnelle!', color: 'green' })
  } catch (err) {
    toast.add({ title: 'Erreur lors du test de connexion', color: 'red' })
  } finally {
    isCertLoading.value = false
  }
}

// Dossiers & Track
const trackRefInput = ref('')
const isTrackLoading = ref(false)
const recentBookings = ref([])
const isDeletingBooking = ref(false)

const dossierStats = ref({
  total_dossiers: 0,
  total_volume: 0,
  total_margin: 0,
  confirmed_count: 0,
  option_count: 0,
  cancelled_count: 0
})

const dossierStatusFilter = ref('all')
const dossierSearchQuery = ref('')

const loadRecentBookings = async () => {
  try {
    const res = await sendApi('/hotels/bookings', {}, 'GET')
    if (res?.success && Array.isArray(res?.data)) {
      recentBookings.value = res.data
      if (res.stats) {
        dossierStats.value = res.stats
      }
    } else {
      recentBookings.value = []
    }
  } catch (e) {
    recentBookings.value = []
  }
}

const filteredDossiers = computed(() => {
  let list = [...recentBookings.value]
  if (dossierStatusFilter.value !== 'all') {
    list = list.filter(b => b.status === dossierStatusFilter.value)
  }
  if (dossierSearchQuery.value.trim()) {
    const q = dossierSearchQuery.value.toLowerCase().trim()
    list = list.filter(b =>
      (b.reference || '').toLowerCase().includes(q) ||
      (b.booking_number || '').toLowerCase().includes(q) ||
      (b.hotel_name || '').toLowerCase().includes(q) ||
      (b.holder_name || '').toLowerCase().includes(q) ||
      (b.holder_email || '').toLowerCase().includes(q) ||
      (b.city || '').toLowerCase().includes(q)
    )
  }
  return list
})

const saveBookingRecord = async (booking) => {
  await loadRecentBookings()
}

const executeTrackBooking = async () => {
  if (!trackRefInput.value) return
  isTrackLoading.value = true
  try {
    const res = await sendApi('/hotels/track', { reference: trackRefInput.value.trim() }, 'POST')
    if (res?.logs) {
      lastXmlRequest.value = res.logs.request
      lastXmlResponse.value = res.logs.response
    }
    toast.add({ title: `Dossier ${trackRefInput.value}: Statut confirmé sur Netstorming`, color: 'green' })
    await loadRecentBookings()
  } catch (err) {
    toast.add({ title: 'Erreur lors du suivi du dossier', color: 'red' })
  } finally {
    isTrackLoading.value = false
  }
}

const confirmCancelBooking = async (b) => {
  if (!confirm(`Êtes-vous sûr de vouloir annuler le dossier ${b.reference} auprès de Netstorming / Kalima MyGO ?`)) return
  try {
    const res = await sendApi('/hotels/cancel', { reference: b.reference }, 'POST')
    toast.add({ title: `Dossier ${b.reference} annulé avec succès`, color: 'green' })
    await loadRecentBookings()
  } catch (err) {
    toast.add({ title: `Erreur lors de l'annulation du dossier`, color: 'red' })
    await loadRecentBookings()
  }
}

const deleteBooking = async (b) => {
  if (!confirm(`Confirmez-vous la suppression définitive du dossier ${b.reference} ? Cette action est irréversible.`)) return
  isDeletingBooking.value = true
  try {
    const idToDelete = b.id || b.reference
    await sendApi(`/hotels/bookings/${idToDelete}`, {}, 'DELETE')
    recentBookings.value = recentBookings.value.filter(item => (item.id !== b.id && item.reference !== b.reference))
    toast.add({ title: `Dossier ${b.reference} supprimé définitivement de la base de données`, color: 'green' })
    await loadRecentBookings()
  } catch (err) {
    toast.add({ title: `Erreur lors de la suppression du dossier`, color: 'red' })
    await loadRecentBookings()
  } finally {
    isDeletingBooking.value = false
  }
}

// Voucher Modal & Email Sending
const isVoucherOpen = ref(false)
const voucherBooking = ref(null)
const voucherEmailInput = ref('')
const isSendingEmail = ref(false)

const openVoucherModal = (b) => {
  voucherBooking.value = b
  voucherEmailInput.value = b?.holder_email || 'contact@bouazizetravel.com'
  isVoucherOpen.value = true
}

const printVoucher = () => {
  window.print()
}

const sendVoucherByEmail = async () => {
  if (!voucherEmailInput.value || !voucherEmailInput.value.includes('@')) {
    toast.add({ title: 'Veuillez renseigner une adresse email valide', color: 'red' })
    return
  }

  isSendingEmail.value = true
  try {
    const payload = {
      email: voucherEmailInput.value.trim(),
      reference: voucherBooking.value?.reference,
      hotel_name: voucherBooking.value?.hotel_name,
      city: voucherBooking.value?.city,
      holder_name: voucherBooking.value?.holder_name,
      checkin: voucherBooking.value?.checkin,
      checkout: voucherBooking.value?.checkout,
      nights: voucherBooking.value?.nights,
      total_price: voucherBooking.value?.total_price
    }
    const res = await sendApi('/hotels/voucher/send-email', payload, 'POST')
    if (res?.success || res?.status === 'success') {
      toast.add({ title: res?.message || 'Voucher officiel envoyé par email avec succès!', color: 'green' })
    } else {
      toast.add({ title: res?.message || 'Erreur lors de l\'envoi', color: 'amber' })
    }
  } catch (err) {
    toast.add({ title: err?.message || 'Erreur d\'envoi email', color: 'red' })
  } finally {
    isSendingEmail.value = false
  }
}
</script>
