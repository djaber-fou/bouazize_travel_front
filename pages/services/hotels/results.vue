<template>
  <div
    class="hotel-portal"
    :class="{ 'dark-theme': isDark }"
    :style="{
      '--site-header-h': siteHeaderHeight + 'px',
      '--results-header-h': stickyWrapperHeight + 'px'
    }"
  >
    
    <!-- ─── STICKY HEADER ZONE (TOP BAR + RIBBON + RESULTS BAR) ─────── -->
    <div ref="stickyWrapperRef" class="results-sticky-wrapper">
      <!-- ─── TOP BAR / BRAND HEADER ──────────────────────────────────── -->
      <header class="portal-subbar">
        <div class="portal-subbar-inner">
          <div class="portal-brand">
            <div class="portal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-1.5V4.5a3 3 0 00-3-3h-6a3 3 0 00-3 3v6H4.5a3 3 0 00-3 3V18a3 3 0 003 3h15zM6 18v-4.5a1.5 1.5 0 011.5-1.5h1.5v6H6zm4.5 0V4.5a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5V18h-9zm10.5 0h-3v-6H19.5a1.5 1.5 0 011.5 1.5V18z"/>
              </svg>
            </div>
            <div class="portal-brand-text">
              <div class="portal-title-row">
                <span class="portal-name">BOUAZIZE TRAVEL</span>
                <span class="portal-separator">|</span>
                <span class="portal-subname">RÉSULTATS DE RECHERCHE</span>
              </div>
              <span class="portal-tagline">Moteur de réservation hôtelière en direct</span>
            </div>
          </div>

          <div class="portal-nav-actions">
            <button
              type="button"
              class="tab-btn active compact-modify-btn"
              @click="navigateTo('/services/hotels')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              <span>Modifier</span>
            </button>
          </div>
        </div>
      </header>

      <!-- ─── RESULTS HEADER BAR (Count & Sort & Filter) ───────────────── -->
      <div v-if="hotelStore.hasSearchResults && !hotelStore.loadingSearch" class="results-header-bar">
        <div class="results-header-bar-inner">
          <div class="summary-left">
            <div class="summary-title-line">
              <span class="dest-highlight">{{ currentDestName }}</span>
              <span class="count-pill">{{ hotelStore.searchResults.total || hotelStore.filteredHotels.length }} hôtel{{ (hotelStore.searchResults.total || hotelStore.filteredHotels.length) > 1 ? 's' : '' }}</span>
            </div>
            <div class="dates-meta-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="dates-mini-pin">
                <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
              </svg>
              <span>{{ formatDate(currentCheckIn) }} → {{ formatDate(currentCheckOut) }} · {{ currentNights }} nuit{{ currentNights > 1 ? 's' : '' }}</span>
            </div>
          </div>

          <div class="summary-right">
            <!-- Filter Button (Mobile Trigger) -->
            <button
              id="mobile-header-filter-btn"
              type="button"
              class="header-filter-trigger-btn"
              @click="showMobileFilters = true"
              aria-label="Ouvrir les filtres de recherche"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
              </svg>
              <span>Filtres</span>
              <span v-if="activeFiltersCount > 0" class="header-filter-badge">
                {{ activeFiltersCount }}
              </span>
            </button>

            <!-- Sort Select -->
            <div class="sort-select-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="sort-select-icon">
                <path fill-rule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clip-rule="evenodd" />
              </svg>
              <select id="sort-results-select" v-model="hotelStore.sortBy" class="sort-dropdown">
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="stars_desc">Meilleures étoiles</option>
                <option value="name_asc">Nom A - Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── RESULTS PAGE BODY ─────────────────────────────────────────── -->
    <div class="page-body">

      <!-- Error State -->
      <div v-if="hotelStore.searchError" class="feedback-card error-card">
        <div class="feedback-icon error-ico">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 1.998-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.502-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="feedback-text">
          <h4>Erreur de connexion</h4>
          <p>{{ hotelStore.searchError }}</p>
        </div>
        <div class="feedback-actions">
          <button class="retry-action-btn" type="button" @click="executeSearch">
            Réessayer
          </button>
          <nuxt-link to="/services/hotels" class="tab-btn">
            Retourner au formulaire
          </nuxt-link>
        </div>
      </div>

      <!-- Skeleton Loading Grid -->
      <div v-else-if="hotelStore.loadingSearch" class="loading-state-wrapper">
        <div class="loading-banner">
          <span class="btn-spinner"></span>
          <div>
            <h4 class="loading-title">
              <template v-if="isRetrying">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline animate-spin mr-1.5 text-portal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Nouvelle tentative... ({{ retryCount }}/{{ maxRetries }})
              </template>
              <template v-else>Recherche des meilleurs tarifs en cours...</template>
            </h4>
            <p class="loading-sub">
              <template v-if="isRetrying">Netstorming interroge à nouveau les fournisseurs pour <strong>{{ currentDestName }}</strong> — résultats attendus dans quelques secondes.</template>
              <template v-else>Interrogation en direct du moteur Netstorming pour <strong>{{ currentDestName }}</strong></template>
            </p>
          </div>
        </div>

        <div class="hotels-cards-grid">
          <div v-for="i in 6" :key="i" class="hotel-preview-card skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="sk-line w-75"></div>
              <div class="sk-line w-40"></div>
              <div class="sk-line w-90"></div>
              <div class="sk-line w-50"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State (only shown when NOT auto-retrying) -->
      <div v-else-if="!hotelStore.hasSearchResults && !isRetrying" class="feedback-card empty-card">
        <div class="feedback-icon empty-ico">
          <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
        <div class="feedback-text">
          <h4>Aucun hôtel disponible</h4>
          <p>Aucun établissement n'est disponible pour <strong>{{ currentDestName }}</strong> aux dates choisies ({{ formatDate(currentCheckIn) }} au {{ formatDate(currentCheckOut) }}). Essayez d'ajuster vos dates ou de sélectionner une autre destination.</p>
        </div>
        <div class="feedback-actions">
          <button class="retry-action-btn" type="button" @click="executeSearch()">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-1 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Relancer la recherche
          </button>
          <nuxt-link to="/services/hotels" class="rechercher-gold-btn">
            Modifier mes critères de recherche
          </nuxt-link>
        </div>
      </div>

      <!-- Auto-retry waiting state -->
      <div v-else-if="!hotelStore.hasSearchResults && isRetrying" class="feedback-card retrying-card">
        <div class="feedback-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="feedback-text">
          <h4 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-portal-gold inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Recherche en cours...
          </h4>
          <p>Netstorming interroge les fournisseurs pour <strong>{{ currentDestName }}</strong>. Les résultats arrivent dans quelques secondes. (Tentative {{ retryCount }}/{{ maxRetries }})</p>
        </div>
        <div class="feedback-actions">
          <span class="btn-spinner" style="display:inline-block;margin-right:8px;"></span>
          <span style="opacity:0.7;">Patientez, récupération des disponibilités...</span>
        </div>
      </div>

      <!-- Results View -->
      <div v-else class="results-view">

        <!-- Main Layout with Filters + Grid -->
        <div class="results-grid-layout">

          <!-- Desktop Sidebar Filters -->
          <aside class="sidebar-filters">
            <div class="filter-box">
              <div class="filter-head">Nom de l'hôtel</div>
              <div class="hotel-search-input-wrap">
                <input
                  id="filter-hotel-name"
                  v-model="hotelStore.filters.searchName"
                  type="text"
                  class="form-ctrl"
                  placeholder="Rechercher par nom..."
                />
                <button
                  v-if="hotelStore.filters.searchName"
                  type="button"
                  class="clear-hotel-name-btn"
                  title="Effacer"
                  @click="hotelStore.filters.searchName = ''"
                >
                  &times;
                </button>
              </div>
            </div>

            <div class="filter-box">
              <div class="filter-head">Catégorie (Étoiles)</div>
              <div class="stars-filter-list">
                <button
                  v-for="s in [0, 5, 4, 3, 2, 1]"
                  :key="s"
                  :id="`filter-star-${s}`"
                  type="button"
                  class="star-filter-chip"
                  :class="{ active: (hotelStore.filters.minStars ?? 0) === s }"
                  @click="hotelStore.filters.minStars = s || null"
                >
                  <span v-if="s === 0">Toutes</span>
                  <span v-else class="star-chips-row">
                    <svg v-for="i in s" :key="i" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="star-chip-icon"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" /></svg>
                  </span>
                </button>
              </div>
            </div>

            <div class="filter-box">
              <div class="filter-head">Prix maximum (DZD)</div>
              <input
                id="filter-max-price"
                v-model.number="hotelStore.filters.maxPrice"
                type="number"
                class="form-ctrl"
                placeholder="Ex: 80 000"
              />
            </div>

            <div class="filter-box">
              <div class="filter-head">Régime de repas</div>
              <select id="filter-meal-basis" v-model="hotelStore.filters.mealBasis" class="form-ctrl">
                <option value="">Tous les régimes</option>
                <option value="RO">Chambre seule</option>
                <option value="RB">Petit-déjeuner inclus</option>
                <option value="FB">Pension complète</option>
                <option value="AI">Tout compris</option>
              </select>
            </div>

            <div class="filter-box">
              <label class="filter-checkbox-label" for="filter-refundable-only">
                <input
                  id="filter-refundable-only"
                  v-model="hotelStore.filters.refundableOnly"
                  type="checkbox"
                  class="custom-check"
                />
                <span class="filter-checkbox-text">Tarifs remboursables uniquement</span>
              </label>
            </div>

            <button
              id="reset-all-filters-btn"
              type="button"
              class="reset-filters-link"
              @click="hotelStore.resetFilters()"
            >
              Réinitialiser les filtres
            </button>
          </aside>

          <!-- Mobile Filter Drawer -->
          <Teleport to="body">
            <Transition name="filter-drawer">
              <div
                v-if="showMobileFilters"
                class="mobile-filter-drawer-overlay hotel-portal"
                :class="{ 'dark-theme': isDark }"
                @click.self="showMobileFilters = false"
              >
                <div class="mobile-filter-drawer">
                  <div class="drawer-drag-pill-wrap">
                    <div class="drawer-drag-pill"></div>
                  </div>
                  <div class="mobile-filter-drawer-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div class="filter-header-icon-box">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;color:var(--portal-gold)"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                      </div>
                      <span class="mobile-filter-drawer-title">Filtres de recherche</span>
                    </div>

                    <button type="button" class="mobile-filter-drawer-close" @click="showMobileFilters = false" aria-label="Fermer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div class="mobile-filter-drawer-body">
                    <div class="filter-box">
                      <div class="filter-head">Nom de l'hôtel</div>
                      <div class="hotel-search-input-wrap">
                        <input
                          v-model="hotelStore.filters.searchName"
                          type="text"
                          class="form-ctrl"
                          placeholder="Rechercher par nom..."
                        />
                        <button
                          v-if="hotelStore.filters.searchName"
                          type="button"
                          class="clear-hotel-name-btn"
                          title="Effacer"
                          @click="hotelStore.filters.searchName = ''"
                        >
                          &times;
                        </button>
                      </div>
                    </div>

                    <div class="filter-box">
                      <div class="filter-head">Catégorie (Étoiles)</div>
                      <div class="stars-filter-list">
                        <button
                          v-for="s in [0, 5, 4, 3, 2, 1]"
                          :key="s"
                          type="button"
                          class="star-filter-chip"
                          :class="{ active: (hotelStore.filters.minStars ?? 0) === s }"
                          @click="hotelStore.filters.minStars = s || null"
                        >
                          <span v-if="s === 0">Toutes</span>
                          <span v-else class="star-chips-row">
                            <svg v-for="i in s" :key="i" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="star-chip-icon"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" /></svg>
                          </span>
                        </button>
                      </div>
                    </div>

                    <div class="filter-box">
                      <div class="filter-head">Prix maximum (DZD)</div>
                      <input
                        v-model.number="hotelStore.filters.maxPrice"
                        type="number"
                        class="form-ctrl"
                        placeholder="Ex: 80 000"
                      />
                    </div>

                    <div class="filter-box">
                      <div class="filter-head">Régime de repas</div>
                      <select v-model="hotelStore.filters.mealBasis" class="form-ctrl">
                        <option value="">Tous les régimes</option>
                        <option value="RO">Chambre seule</option>
                        <option value="RB">Petit-déjeuner inclus</option>
                        <option value="FB">Pension complète</option>
                        <option value="AI">Tout compris</option>
                      </select>
                    </div>

                    <div class="filter-box">
                      <label class="filter-checkbox-label" for="drawer-filter-refundable-only">
                        <input
                          id="drawer-filter-refundable-only"
                          v-model="hotelStore.filters.refundableOnly"
                          type="checkbox"
                          class="custom-check"
                        />
                        <span class="filter-checkbox-text">Tarifs remboursables uniquement</span>
                      </label>
                    </div>
                  </div>

                  <div class="mobile-filter-drawer-footer">
                    <button type="button" class="filter-reset-btn" @click="hotelStore.resetFilters()">
                      Réinitialiser
                    </button>
                    <button type="button" class="filter-apply-btn" @click="showMobileFilters = false">
                      Voir les résultats
                      <span v-if="hotelStore.filteredHotels?.length" class="filter-count-badge">{{ hotelStore.filteredHotels.length }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>

          <!-- Right Column: Hotels Cards Grid + Progressive Loading Section -->
          <div class="hotels-results-column">

            <!-- Hotels Cards Grid -->
            <div class="hotels-cards-grid" id="hotels-catalog-grid">
              <div
                v-for="hotel in hotelStore.paginatedHotels"
                :key="hotel.hotel_code + '-' + (hotel.room_code || '')"
                :id="`hotel-card-${hotel.hotel_code}`"
                class="hotel-preview-card"
                @click="openHotelDetails(hotel)"
              >
                <!-- Image with fallback -->
                <div class="card-media">
                  <img
                    :src="resolveHotelImage(hotel)"
                    :alt="hotel.hotel_name"
                    class="card-img"
                    loading="lazy"
                    @error="onImageError($event, hotel.stars)"
                  />
                  <!-- Stars badge -->
                  <div v-if="hotel.stars" class="card-stars-badge">
                    <svg v-for="s in hotel.stars" :key="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="card-star-svg"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" /></svg>
                  </div>
                  <!-- Dynamic badge -->
                  <span v-if="hotel.agreements?.some(a => a.is_dynamic)" class="dynamic-chip">
                    Dynamique
                  </span>
                </div>

                <!-- Card Content -->
                <div class="card-details">
                  <div class="card-primary-info">
                    <h3 class="card-hotel-name">{{ hotel.hotel_name }}</h3>
                    <p class="card-hotel-location">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="card-pin">
                        <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
                      </svg>
                      {{ hotel.hotel_city }}
                    </p>
                  </div>

                  <!-- Badges / Tags -->
                  <div class="card-tags-list">
                    <span class="board-tag">{{ roomBasisName(hotel.room_basis_code) }}</span>
                    <span v-if="hotel.meal_basis_code && hotel.meal_basis_code !== 'X'" class="meal-tag">
                      {{ mealBasisName(hotel.meal_basis_code) }}
                    </span>
                    <span v-if="hotel.room_basis_name" class="room-spec-tag">{{ hotel.room_basis_name }}</span>
                  </div>

                  <!-- Footer Price & CTA -->
                  <div class="card-action-footer">
                    <div class="price-container">
                      <span class="price-nights-sub">{{ currentNights }} nuit{{ currentNights > 1 ? 's' : '' }} · Prix total</span>
                      <div class="price-amount-row">
                        <span class="price-val">{{ formatPrice(hotel.lowest_price_dzd || hotel.final_price_dzd) }}</span>
                        <span class="price-currency">DZD</span>
                      </div>
                      <div v-if="hotel.net_price_dzd != null" class="net-row">
                        <button type="button" class="net-toggle-btn" @click.stop="toggleNet(hotel.hotel_code)">Net</button>
                        <span v-if="netShown[hotel.hotel_code]" class="net-value">{{ formatPrice(hotel.net_price_dzd) }} DZD</span>
                      </div>
                    </div>

                    <button class="view-deal-btn" type="button" @click.stop="openHotelDetails(hotel)">
                      Voir l'offre
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="arrow-ico">
                        <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- In-filter Empty State (when hotels exist for destination, but active filters match 0) -->
            <div v-if="hotelStore.filteredHotels.length === 0" class="feedback-card empty-card" style="margin: 24px 0;">
              <div class="feedback-icon empty-ico">
                <UIcon name="i-heroicons-funnel" class="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <div class="feedback-text">
                <h4>Aucun établissement ne correspond à vos filtres</h4>
                <p>
                  Aucun résultat ne correspond aux filtres appliqués<span v-if="hotelStore.filters.searchName"> (recherche : "<strong>{{ hotelStore.filters.searchName }}</strong>")</span>.
                  <span v-if="hotelStore.allHotels.length || hotelStore.searchResults.total">
                    Il y a <strong>{{ hotelStore.allHotels.length || hotelStore.searchResults.total }}</strong> établissement(s) disponible(s) sans ces filtres.
                  </span>
                </p>
              </div>
              <div class="feedback-actions">
                <button class="retry-action-btn" type="button" @click="hotelStore.resetFilters()">
                  Effacer les filtres et tout afficher ({{ hotelStore.allHotels.length || hotelStore.searchResults.total }})
                </button>
              </div>
            </div>

            <!-- Pagination Bar (20 per page) -->
            <div v-if="hotelStore.filteredHotels.length > 0" class="progressive-load-wrapper">

              <!-- Background continuous loading indicator (loading other 20 20 20... in the background) -->
              <div v-if="hotelStore.loadingAllHotels" class="all-loading-info">
                <span class="btn-spinner btn-spinner-sm"></span>
                <span>Réception continue des autres disponibilités en cours&hellip; ({{ hotelStore.allHotels.length }} hôtels prêts)</span>
              </div>

              <!-- Pagination Controls -->
              <div class="pagination-bar-wrapper">
                <div class="pagination-info-text">
                  <span>Affichage de <strong>{{ Math.min((hotelStore.currentPage - 1) * hotelStore.pageSize + 1, hotelStore.filteredHotels.length) }}</strong> à <strong>{{ Math.min(hotelStore.currentPage * hotelStore.pageSize, hotelStore.filteredHotels.length) }}</strong> sur <strong>{{ hotelStore.filteredHotels.length }}</strong> hôtel(s)</span>
                  <span class="pagination-page-badge">Page {{ hotelStore.currentPage }} / {{ hotelStore.totalPages }}</span>
                </div>

                <div class="pagination-controls-nav" v-if="hotelStore.totalPages > 1">
                  <!-- Previous Button -->
                  <button
                    id="pagination-prev-btn"
                    type="button"
                    class="pagination-nav-btn prev-btn"
                    :disabled="hotelStore.currentPage <= 1"
                    @click="goToPage(hotelStore.currentPage - 1)"
                    title="Page précédente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                    <span>Précédent</span>
                  </button>

                  <!-- Numbered Buttons -->
                  <div class="pagination-numbers-list">
                    <template v-for="(p, idx) in visiblePages" :key="idx">
                      <span v-if="p === '...'" class="pagination-ellipsis">&hellip;</span>
                      <button
                        v-else
                        :id="`pagination-page-${p}`"
                        type="button"
                        class="page-number-btn"
                        :class="{ active: hotelStore.currentPage === p }"
                        @click="goToPage(p)"
                      >
                        {{ p }}
                      </button>
                    </template>
                  </div>

                  <!-- Next Button -->
                  <button
                    id="pagination-next-btn"
                    type="button"
                    class="pagination-nav-btn next-btn"
                    :disabled="hotelStore.currentPage >= hotelStore.totalPages"
                    @click="goToPage(hotelStore.currentPage + 1)"
                    title="Page suivante"
                  >
                    <span>Suivant</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Quick speed badge -->
              <div class="all-loaded-indicator" v-if="hotelStore.allHotelsLoaded && !hotelStore.loadingAllHotels">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 check-ico">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/>
                </svg>
                <span>Catalogue complet synchronisé : <strong>{{ hotelStore.filteredHotels.length }}</strong> hôtel(s) disponible(s).</span>
              </div>
            </div>

          </div><!-- /hotels-results-column -->

        </div>
      </div>

    </div><!-- /page-body -->

    <!-- Mobile Floating Filter Button (always accessible while scrolling) -->
    <div v-if="hotelStore.hasSearchResults && !hotelStore.loadingSearch" class="mobile-floating-filter-bar">
      <button
        id="mobile-floating-filter-btn"
        type="button"
        class="mobile-floating-filter-btn"
        @click="showMobileFilters = true"
        aria-label="Filtrer les établissements"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
        </svg>
        <span>Filtres</span>
        <span v-if="activeFiltersCount > 0" class="floating-filter-badge">
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, navigateTo, useHead } from '#app';
import { useHotelStore } from '~/stores/hotel';
import { useDark } from '@vueuse/core';
import { resolveHotelImage, onHotelImageError } from '~/composables/useHotelImages';

const route      = useRoute();
const hotelStore = useHotelStore();
const isDark     = useDark();

const stickyWrapperRef    = ref(null);
const siteHeaderHeight    = ref(72);
const stickyWrapperHeight = ref(95);
const showMobileFilters   = ref(false);

const activeFiltersCount = computed(() => {
  let count = 0;
  if (hotelStore.filters?.searchName && hotelStore.filters.searchName.trim()) count++;
  if (hotelStore.filters?.minStars) count++;
  if (hotelStore.filters?.maxPrice) count++;
  if (hotelStore.filters?.mealBasis) count++;
  if (hotelStore.filters?.refundableOnly) count++;
  return count;
});


function updateStickyHeights() {
  if (typeof window !== 'undefined') {
    const mainHeader = document.getElementById('site-global-header') || document.querySelector('header');
    if (mainHeader) {
      siteHeaderHeight.value = Math.round(mainHeader.getBoundingClientRect().height) || (window.innerWidth < 768 ? 64 : 72);
    }
    if (stickyWrapperRef.value) {
      stickyWrapperHeight.value = Math.round(stickyWrapperRef.value.getBoundingClientRect().height) || 95;
    }
  }
}

let resizeObserver = null;

// ── Computed Query Data ────────────────────────────────────────────────
const currentDestCode = computed(() => {
  return String(route.query.destination_code || hotelStore.searchForm.destination_code || '');
});

const currentDestName = computed(() => {
  return String(route.query.destination_name || hotelStore.searchForm.destination_name || currentDestCode.value || 'Destination');
});

const currentCheckIn = computed(() => {
  return String(route.query.check_in || hotelStore.searchForm.check_in || '');
});

const currentCheckOut = computed(() => {
  return String(route.query.check_out || hotelStore.searchForm.check_out || '');
});

const currentAdults = computed(() => {
  return Number(route.query.adults || hotelStore.searchForm.adults || 2);
});

const currentChildren = computed(() => {
  return Number(route.query.children || hotelStore.searchForm.children || 0);
});

const currentRooms = computed(() => {
  return Number(route.query.rooms || hotelStore.searchForm.rooms || 1);
});

const currentNights = computed(() => {
  if (!currentCheckIn.value || !currentCheckOut.value) return 2;
  const d1 = new Date(currentCheckIn.value);
  const d2 = new Date(currentCheckOut.value);
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
});

function getRouteSearchKey() {
  const q = route.query;
  const destCode  = q.destination_code || hotelStore.searchForm.destination_code || '';
  const hotelId   = q.hotel_id || hotelStore.searchForm.hotel_id || '';
  const hotelName = q.hotel_name || hotelStore.filters.searchName || '';
  const cIn       = q.check_in || hotelStore.searchForm.check_in || '';
  const cOut      = q.check_out || hotelStore.searchForm.check_out || '';
  const adults    = q.adults || hotelStore.searchForm.adults || 2;
  const children  = q.children || hotelStore.searchForm.children || 0;
  const rooms     = q.rooms || hotelStore.searchForm.rooms || 1;
  const ages      = q.children_ages || (hotelStore.searchForm.children_ages || []).join(',');
  return `${destCode}|${hotelId}|${hotelName}|${cIn}|${cOut}|${adults}|${children}|${rooms}|${ages}`;
}

// ── Auto-retry state (for cold Netstorming destinations) ─────────────────
const retryCount  = ref(0);
const isRetrying  = ref(false);
const maxRetries  = 2;      // retry up to 2 times after empty result
const retryDelay  = 8000;   // 8 seconds between retries

// ── Execute Search ────────────────────────────────────────────────────────
async function executeSearch(isAutoRetry = false) {
  const q = route.query;
  const destCode = q.destination_code || hotelStore.searchForm.destination_code || '';
  const destName = q.destination_name || hotelStore.searchForm.destination_name || destCode || '';

  // If no destination is present, redirect to the search page
  if (!destCode) {
    navigateTo('/services/hotels');
    return;
  }

  // On a fresh search (not auto-retry), reset retry counters
  if (!isAutoRetry) {
    retryCount.value = 0;
    isRetrying.value = false;
  }

  // Clear previous search results so old destination cards vanish immediately and skeleton shows
  hotelStore.clearSearchResults();
  hotelStore.loadingSearch = true;

  // Sync query params into hotelStore.searchForm
  hotelStore.searchForm.destination_code = String(destCode);
  hotelStore.searchForm.destination_name = String(destName);
  if (q.check_in)  hotelStore.searchForm.check_in  = String(q.check_in);
  if (q.check_out) hotelStore.searchForm.check_out = String(q.check_out);
  if (q.adults)    hotelStore.searchForm.adults    = Number(q.adults);
  if (q.children)  hotelStore.searchForm.children  = Number(q.children);
  if (q.rooms)     hotelStore.searchForm.rooms     = Number(q.rooms);
  if (q.children_ages) {
    hotelStore.searchForm.children_ages = String(q.children_ages).split(',').map(Number);
  } else if (!q.children) {
    hotelStore.searchForm.children_ages = [];
  }
  if (q.hotel_id) {
    hotelStore.searchForm.hotel_id = String(q.hotel_id);
  } else {
    hotelStore.searchForm.hotel_id = null;
  }
  if (q.hotel_name) {
    hotelStore.filters.searchName = String(q.hotel_name);
  } else {
    hotelStore.filters.searchName = '';
  }
  if (q.refundable_only === '1' || q.refundable_only === 'true' || q.refundable_only === true) {
    hotelStore.filters.refundableOnly = true;
  } else {
    hotelStore.filters.refundableOnly = false;
  }

  // Trigger search availability
  try {
    await hotelStore.searchAvailability();

    // ── Smart auto-retry for cold Netstorming cache ───────────────────────
    // Netstorming sometimes returns 0 results on first call for cold destinations.
    // If we got 0 hotels and haven't exhausted retries, wait and try again.
    const gotResults = (hotelStore.searchResults.total > 0) || (hotelStore.allHotels.length > 0);
    if (!gotResults && retryCount.value < maxRetries && !hotelStore.searchError) {
      retryCount.value++;
      isRetrying.value = true;
      console.info(`[HotelResults] 0 hotels returned — auto-retry ${retryCount.value}/${maxRetries} in ${retryDelay / 1000}s`);
      setTimeout(() => {
        executeSearch(true); // recurse as auto-retry
      }, retryDelay);
    } else {
      isRetrying.value = false;
    }
  } catch (err) {
    console.error('[HotelResults] Search error:', err);
    isRetrying.value = false;
  }
}


onMounted(() => {
  nextTick(() => {
    updateStickyHeights();
  });
  setTimeout(updateStickyHeights, 60);

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateStickyHeights);
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateStickyHeights();
    });
    if (stickyWrapperRef.value) {
      resizeObserver.observe(stickyWrapperRef.value);
    }
    const mainHeader = document.getElementById('site-global-header') || document.querySelector('header');
    if (mainHeader) {
      resizeObserver.observe(mainHeader);
    }
  }

  const currentKey = getRouteSearchKey();
  if (!hotelStore.hasSearchResults || hotelStore.lastSearchKey !== currentKey) {
    executeSearch();
  }
});

// Watch route changes (e.g. searching from home, navbar, recent searches, or browser back/forward)
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      const currentKey = getRouteSearchKey();
      if (!hotelStore.hasSearchResults || hotelStore.lastSearchKey !== currentKey) {
        executeSearch();
      }
    }
  }
);

// When filters or sort change, reset pagination to page 1
watch(
  () => [hotelStore.filters.searchName, hotelStore.filters.maxPrice, hotelStore.filters.minStars, hotelStore.filters.mealBasis, hotelStore.filters.refundableOnly, hotelStore.sortBy],
  () => {
    hotelStore.currentPage = 1;
    hotelStore.displayedCount = 20;
  }
);

// ── Numbered Pagination Navigation ──────────────────────────────────────
const visiblePages = computed(() => {
  const total = hotelStore.totalPages || 1;
  const current = hotelStore.currentPage || 1;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) {
    pages.push('...');
  }
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (current < total - 2) {
    pages.push('...');
  }
  pages.push(total);
  return pages;
});

function goToPage(page) {
  if (page === '...' || typeof page !== 'number') return;
  if (page < 1 || page > hotelStore.totalPages) return;
  hotelStore.setPage(page);
  if (typeof window !== 'undefined') {
    nextTick(() => {
      const el = document.getElementById('hotels-catalog-grid') || document.querySelector('.results-grid-layout');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

onUnmounted(() => {
  hotelStore.loadingSearch = false;
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateStickyHeights);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// ── Hotel Card Details Navigation ──────────────────────────────────────
function openHotelDetails(hotel) {
  hotelStore.selectedHotel = hotel;
  hotelStore.selectedRoom  = hotel.agreements?.[0] || hotel;
  try {
    sessionStorage.setItem('current_hotel_' + hotel.hotel_code, JSON.stringify(hotel));
    localStorage.setItem('current_hotel_' + hotel.hotel_code, JSON.stringify(hotel));
  } catch {}
  const sessId = hotelStore.searchResults.session_id || hotel.session_id || '';
  const rCode  = hotel.room_code || hotel.agreements?.[0]?.agreement_id || '';
  const cIn    = currentCheckIn.value;
  const cOut   = currentCheckOut.value;
  const ad     = currentAdults.value;
  const ch     = currentChildren.value;
  navigateTo(`/services/hotels/${hotel.hotel_code}?session=${sessId}&room=${encodeURIComponent(rCode)}&check_in=${cIn}&check_out=${cOut}&adults=${ad}&children=${ch}`);
}

function onImageError(event, stars) {
  onHotelImageError(event, stars || 3);
}

const netShown = ref({});
function toggleNet(code) {
  netShown.value = { ...netShown.value, [code]: !netShown.value[code] };
}

function formatPrice(val) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(val ?? 0));
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function roomBasisName(code) {
  const map = {
    RO: 'Chambre seule',
    RB: 'Petit-déjeuner inclus',
    RL: 'Déjeuner inclus',
    RD: 'Dîner inclus',
    FB: 'Pension complète',
    AI: 'Tout compris',
  };
  return map[code] || code || 'Standard';
}

function mealBasisName(code) {
  const map = {
    H: 'Buffet chaud',
    C: 'Continental',
    B: 'Buffet froid',
    A: 'Américain',
    E: 'Anglais',
    X: 'Sans PDJ',
  };
  return map[code] || code || '';
}

// ── SEO ────────────────────────────────────────────────────────────────
useHead({
  title: () => `Hôtels à ${currentDestName.value} — Résultats de recherche | Bouazize Travel`,
  meta: [
    {
      name: 'description',
      content: `Découvrez les hôtels disponibles à ${currentDestName.value} aux meilleurs tarifs avec confirmation instantanée et vouchers officiels Bouazize Travel.`,
    },
  ],
});
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM TOKENS (LIGHT & DARK)
══════════════════════════════════════════════════════════════════════ */
.hotel-portal {
  --site-header-h: 72px;
  --portal-page-bg: #f4f6fa;
  --portal-card-bg: #ffffff;
  --portal-card-border: #e2e8f0;
  --portal-input-bg: #ffffff;
  --portal-input-border: #cbd5e1;
  --portal-input-text: #0f172a;
  --portal-placeholder: #94a3b8;
  --portal-label-color: #64748b;
  --portal-box-bg: #f8fafc;
  --portal-box-border: #e2e8f0;
  --portal-title-color: #0A0B25;
  --portal-sub-color: #64748b;
  --portal-subbar-bg: #ffffff;
  --portal-subbar-border: #e2e8f0;
  --portal-gold: #d2a749;
  --portal-gold-hover: #b8923f;
  --portal-gold-light: rgba(210, 167, 73, 0.12);
  --portal-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  background: var(--portal-page-bg);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--portal-title-color);
  transition: background 0.25s ease, color 0.25s ease;
  overflow: visible !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

@media (max-width: 767px) {
  .hotel-portal {
    --site-header-h: 64px;
  }
}

/* ── Dark Mode Theme ─────────────────────────────────────────────────── */
.hotel-portal.dark-theme,
:global(html.dark) .hotel-portal,
:global(.dark) .hotel-portal {
  --portal-page-bg: #070a14;
  --portal-card-bg: #0b1022;
  --portal-card-border: #1a2542;
  --portal-input-bg: #080d1c;
  --portal-input-border: #18233e;
  --portal-input-text: #ffffff;
  --portal-placeholder: #475569;
  --portal-label-color: #7b8ba5;
  --portal-box-bg: #080d1c;
  --portal-box-border: #151d34;
  --portal-title-color: #ffffff;
  --portal-sub-color: #94a3b8;
  --portal-subbar-bg: #0a0f20;
  --portal-subbar-border: #172038;
  --portal-gold: #d2a749;
  --portal-gold-hover: #b8923f;
  --portal-gold-light: rgba(210, 167, 73, 0.18);
  --portal-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
}

/* ══════════════════════════════════════════════════════════════════════
   GLOBAL SHARP EDGES (NO BORDER RADIUS FOR BUTTONS, INPUTS & CONTROLS)
══════════════════════════════════════════════════════════════════════ */
.hotel-portal button,
.hotel-portal input,
.hotel-portal select,
.hotel-portal textarea,
.hotel-portal .tab-btn,
.hotel-portal .btn-new-search,
.hotel-portal .summary-pill,
.hotel-portal .form-ctrl,
.hotel-portal .rechercher-gold-btn,
.hotel-portal .view-deal-btn,
.hotel-portal .retry-action-btn,
.hotel-portal .star-filter-chip,
.hotel-portal .sort-dropdown,
.hotel-portal .hotel-preview-card,
.hotel-portal .sidebar-filters,
.hotel-portal .results-header-bar,
.hotel-portal .feedback-card,
.hotel-portal .dynamic-chip,
.hotel-portal .board-tag,
.hotel-portal .meal-tag,
.hotel-portal .room-spec-tag,
.hotel-portal .nights-chip,
.hotel-portal .sk-line,
.hotel-portal .loading-banner {
  border-radius: 0 !important;
}

/* ══════════════════════════════════════════════════════════════════════
   STICKY HEADER ZONE (TOP BAR + RIBBON + RESULTS BAR)
══════════════════════════════════════════════════════════════════════ */
.results-sticky-wrapper {
  position: -webkit-sticky;
  position: sticky;
  top: calc(var(--site-header-h, 72px) - 1px);
  z-index: 45;
  background: var(--portal-page-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: background 0.25s ease, box-shadow 0.25s ease;
  margin-top: 0 !important;
}
.results-sticky-wrapper::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--portal-subbar-bg, #ffffff);
  pointer-events: none;
}
.hotel-portal.dark-theme .results-sticky-wrapper,
:global(html.dark) .results-sticky-wrapper {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
}
.hotel-portal.dark-theme .results-sticky-wrapper::before,
:global(html.dark) .results-sticky-wrapper::before {
  background: var(--portal-subbar-bg, #0a0f20);
}

/* ══════════════════════════════════════════════════════════════════════
   PORTAL SUB-BAR
══════════════════════════════════════════════════════════════════════ */
.portal-subbar {
  background: var(--portal-subbar-bg);
  border-bottom: 1px solid var(--portal-subbar-border);
  padding: 8px 0;
}
.portal-subbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.portal-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.portal-icon {
  width: 32px;
  height: 32px;
  border-radius: 0 !important;
  background: var(--portal-gold);
  color: #0A0B25;
  display: flex;
  align-items: center;
  justify-content: center;
}
.portal-icon svg {
  width: 18px;
  height: 18px;
}
.portal-brand-text {
  display: flex;
  flex-direction: column;
}
.portal-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
}
.portal-name {
  color: var(--portal-gold);
}
.portal-separator {
  color: #64748b;
}
.portal-subname {
  color: var(--portal-title-color);
  font-size: 10px;
}
.portal-tagline {
  font-size: 9px;
  color: var(--portal-sub-color);
}
@media (max-width: 640px) {
  .portal-tagline { display: none; }
  .portal-subname { display: none; }
  .portal-subbar-inner { padding: 0 12px; gap: 8px; }
  .portal-subbar { padding: 6px 0; }
}

.portal-nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-radius: 0 !important;
  cursor: pointer;
  border: 1px solid var(--portal-gold);
  background: var(--portal-gold);
  color: #0A0B25;
  transition: all 0.2s;
  text-transform: uppercase;
}
.tab-btn svg {
  width: 14px;
  height: 14px;
}
.tab-btn:hover {
  background: var(--portal-gold-hover);
  color: #ffffff;
  border-color: var(--portal-gold-hover);
}

/* ══════════════════════════════════════════════════════════════════════
   SEARCH SUMMARY RIBBON
══════════════════════════════════════════════════════════════════════ */
.search-summary-ribbon {
  background: var(--portal-card-bg);
  border-bottom: 1px solid var(--portal-card-border);
  padding: 8px 0;
}
.ribbon-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.ribbon-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.summary-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-box-border);
  padding: 6px 12px;
  font-size: 12px;
  color: var(--portal-title-color);
}
.pill-ico {
  width: 14px;
  height: 14px;
  color: var(--portal-gold);
  flex-shrink: 0;
}
.pill-label {
  color: var(--portal-label-color);
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
}
.pill-val {
  color: var(--portal-title-color);
  font-weight: 800;
}
.nights-chip {
  background: var(--portal-gold);
  color: #0A0B25;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  text-transform: uppercase;
}
.ribbon-right {
  display: flex;
  align-items: center;
}
.btn-new-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--portal-input-border);
  color: var(--portal-label-color);
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-new-search:hover {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE BODY & RESULTS VIEW
══════════════════════════════════════════════════════════════════════ */
.page-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}
@media (max-width: 640px) {
  .page-body {
    padding: 12px 10px 40px;
  }
}


/* Loading state */
.loading-state-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.loading-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  padding: 18px 24px;
}
.loading-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--portal-title-color);
  margin: 0;
}
.loading-sub {
  font-size: 12px;
  color: var(--portal-label-color);
  margin: 2px 0 0;
}

/* Feedback cards */
.feedback-card {
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  padding: 40px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin: 20px 0;
}
.feedback-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feedback-icon svg {
  width: 36px;
  height: 36px;
}
.error-ico {
  color: #ef4444;
}
.empty-ico {
  color: var(--portal-gold);
}
.feedback-text h4 {
  font-size: 18px;
  font-weight: 800;
  color: var(--portal-title-color);
  margin: 0 0 6px;
}
.feedback-text p {
  font-size: 13px;
  color: var(--portal-label-color);
  max-width: 520px;
  margin: 0;
  line-height: 1.5;
}
.feedback-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.retry-action-btn {
  background: var(--portal-gold);
  color: #0A0B25;
  border: none;
  font-size: 12px;
  font-weight: 800;
  padding: 10px 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.retry-action-btn:hover {
  background: var(--portal-gold-hover);
  color: #ffffff;
}

/* Retrying state — pulsing border to signal "still working" */
.retrying-card {
  border-color: #3b82f6 !important;
  animation: retrying-pulse 2s ease-in-out infinite;
}
.retrying-card .feedback-icon {
  color: #3b82f6;
}
@keyframes retrying-pulse {
  0%, 100% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  50%       { border-color: #60a5fa; box-shadow: 0 0 0 6px rgba(59,130,246,0.12); }
}

.rechercher-gold-btn {
  background: var(--portal-gold);
  color: #0A0B25;
  border: none;
  font-size: 12px;
  font-weight: 800;
  padding: 12px 24px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-block;
}
.rechercher-gold-btn:hover {
  background: var(--portal-gold-hover);
  color: #ffffff;
}

/* Results header bar */
.results-header-bar {
  background: var(--portal-card-bg);
  border-bottom: 1px solid var(--portal-card-border);
  padding: 8px 0;
  margin-bottom: 0;
}
.results-header-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.summary-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 13px;
}
.count-highlight {
  font-size: 17px;
  font-weight: 800;
  color: var(--portal-gold);
}
.count-label {
  font-weight: 700;
  color: var(--portal-title-color);
}
.dest-highlight {
  font-size: 15px;
  font-weight: 800;
  color: var(--portal-title-color);
  letter-spacing: -0.2px;
}
.count-pill {
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 7px;
  background: rgba(210, 167, 73, 0.15);
  color: var(--portal-gold);
  border: 1px solid var(--portal-gold);
  border-radius: 0 !important;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.summary-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dates-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--portal-sub-color, #64748b);
}
.dates-mini-pin {
  width: 13px;
  height: 13px;
  color: var(--portal-gold);
  flex-shrink: 0;
}
.summary-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sort-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.sort-select-icon {
  position: absolute;
  left: 9px;
  width: 13px;
  height: 13px;
  color: var(--portal-gold);
  pointer-events: none;
}
.sort-dropdown {
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-input-border);
  color: var(--portal-input-text);
  font-size: 11.5px;
  font-weight: 700;
  padding: 7px 12px 7px 28px;
  border-radius: 0 !important;
  cursor: pointer;
  transition: all 0.2s;
}
.sort-dropdown:focus {
  border-color: var(--portal-gold);
  outline: none;
}

.header-filter-trigger-btn {
  display: none;
}

.compact-modify-btn {
  padding: 6px 12px !important;
  font-size: 11px !important;
}

@media (max-width: 900px) {
  .results-header-bar {
    padding: 8px 0;
  }
  .results-header-bar-inner {
    padding: 0 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .summary-left {
    gap: 3px;
  }
  .dest-highlight {
    font-size: 13.5px;
  }
  .dates-meta-row {
    font-size: 11px;
  }
  .summary-right {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .header-filter-trigger-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--portal-gold);
    color: #0b1022;
    font-size: 11.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border: none;
    border-radius: 0 !important;
    cursor: pointer;
    flex: 1;
    min-height: 38px;
    transition: all 0.15s;
  }
  .header-filter-trigger-btn:hover {
    background: var(--portal-gold-hover);
  }
  .header-filter-badge {
    background: #0b1022;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 900;
    padding: 1px 5px;
    border-radius: 0 !important;
  }
  .sort-select-wrapper {
    flex: 1.2;
  }
  .sort-dropdown {
    width: 100%;
    min-height: 38px;
    font-size: 11px;
  }
}

/* Results Grid Layout */
.results-grid-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  align-items: start;
}
@media (max-width: 900px) {
  .results-grid-layout {
    display: block; /* single column — sidebar hidden, FAB shown */
  }
}

.mobile-floating-filter-bar {
  display: none;
}
@media (max-width: 900px) {
  .mobile-floating-filter-bar {
    display: block;
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 80;
    pointer-events: auto;
  }
  .mobile-floating-filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #0A0B25;
    color: #ffffff;
    border: 1.5px solid var(--portal-gold, #d2a749);
    border-radius: 0 !important;
    padding: 10px 22px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .mobile-floating-filter-btn:active {
    transform: scale(0.97);
  }
  .floating-filter-badge {
    background: var(--portal-gold, #d2a749);
    color: #0A0B25;
    font-size: 10px;
    font-weight: 900;
    padding: 1px 6px;
    border-radius: 0 !important;
  }
}

/* Sidebar Filters — hidden on mobile */
.sidebar-filters {
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: calc(var(--site-header-h, 72px) + var(--results-header-h, 95px) + 12px);
  max-height: calc(100vh - var(--site-header-h, 72px) - var(--results-header-h, 95px) - 24px);
  overflow-y: auto;
  scrollbar-width: thin;
  z-index: 30;
}
.sidebar-filters::-webkit-scrollbar { width: 4px; }
.sidebar-filters::-webkit-scrollbar-thumb { background: var(--portal-input-border); }
@media (max-width: 900px) {
  .sidebar-filters {
    display: none; /* hidden on mobile — use FAB drawer instead */
  }
}

/* Star chip SVG icons */
.star-chips-row {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}
.star-chip-icon {
  width: 10px;
  height: 10px;
  color: var(--portal-gold);
  fill: var(--portal-gold);
}
.star-filter-chip.active .star-chip-icon {
  fill: white;
  color: white;
}

/* Mobile Filter Drawer */
.mobile-filter-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(7, 11, 25, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
}
.mobile-filter-drawer {
  width: 100%;
  background: #ffffff;
  border-top: 3px solid var(--portal-gold, #d2a749);
  border-radius: 0 !important;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -16px 45px rgba(0, 0, 0, 0.6);
}
.dark-theme .mobile-filter-drawer,
:global(.dark) .mobile-filter-drawer {
  background: #0b1022;
  border-top-color: #d2a749;
}
.drawer-drag-pill-wrap {
  display: flex;
  justify-content: center;
  padding: 8px 0 2px;
  background: inherit;
}
.drawer-drag-pill {
  width: 38px;
  height: 4px;
  border-radius: 999px;
  background: #cbd5e1;
  opacity: 0.8;
}
.dark-theme .drawer-drag-pill,
:global(.dark) .drawer-drag-pill {
  background: #334155;
}
.filter-header-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 0;
  background: rgba(210, 167, 73, 0.12);
  border: 1px solid rgba(210, 167, 73, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-filter-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px 14px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;
}
.dark-theme .mobile-filter-drawer-header,
:global(.dark) .mobile-filter-drawer-header {
  background: #080d1c;
  border-bottom-color: rgba(210, 167, 73, 0.2);
}
.mobile-filter-drawer-title {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #0b1022;
}
.dark-theme .mobile-filter-drawer-title,
:global(.dark) .mobile-filter-drawer-title {
  color: #ffffff;
}
.mobile-filter-drawer-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.dark-theme .mobile-filter-drawer-close,
:global(.dark) .mobile-filter-drawer-close {
  border-color: rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
}
.mobile-filter-drawer-close:hover {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
}
.mobile-filter-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
  -webkit-overflow-scrolling: touch;
}
.dark-theme .mobile-filter-drawer-body,
:global(.dark) .mobile-filter-drawer-body {
  background: #0b1022;
}
.mobile-filter-drawer-body .form-ctrl {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0b1022;
}
.dark-theme .mobile-filter-drawer-body .form-ctrl,
:global(.dark) .mobile-filter-drawer-body .form-ctrl {
  background: #080d1c;
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}
.mobile-filter-drawer-footer {
  display: flex;
  gap: 12px;
  padding: 14px 18px calc(14px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;
}
.dark-theme .mobile-filter-drawer-footer,
:global(.dark) .mobile-filter-drawer-footer {
  background: #080d1c;
  border-top-color: rgba(210, 167, 73, 0.2);
}
.filter-reset-btn {
  flex: 0 0 auto;
  padding: 12px 18px;
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.dark-theme .filter-reset-btn,
:global(.dark) .filter-reset-btn {
  border-color: rgba(255, 255, 255, 0.2);
  color: #94a3b8;
}
.filter-reset-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}
.filter-apply-btn {
  flex: 1;
  padding: 12px 20px;
  background: var(--portal-gold, #d2a749);
  border: none;
  color: #0b1022;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(212, 160, 60, 0.3);
  -webkit-tap-highlight-color: transparent;
}
.filter-apply-btn:hover {
  background: var(--portal-gold-hover, #b8923f);
  color: #ffffff;
}
.filter-count-badge {
  background: rgba(11, 16, 34, 0.2);
  border-radius: 0;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 900;
}
.card-star-svg {
  width: 10px;
  height: 10px;
  color: #f59e0b;
  fill: #f59e0b;
}
/* Filter Drawer Animation */
.filter-drawer-enter-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.filter-drawer-leave-active { transition: all 0.2s ease; }
.filter-drawer-enter-from { opacity: 0; }
.filter-drawer-leave-to { opacity: 0; }
.filter-drawer-enter-from .mobile-filter-drawer { transform: translateY(100%); }
.filter-drawer-enter-active .mobile-filter-drawer { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.filter-drawer-leave-active .mobile-filter-drawer { transition: transform 0.2s ease; }
.filter-drawer-leave-to .mobile-filter-drawer { transform: translateY(100%); }

.filter-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  user-select: none;
  padding: 8px 10px;
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-input-border);
  transition: border-color 0.15s ease;
}
.filter-checkbox-label:hover {
  border-color: var(--portal-gold);
}
.filter-checkbox-label .custom-check {
  width: 16px;
  height: 16px;
  accent-color: var(--portal-gold);
  border-radius: 0 !important;
  cursor: pointer;
}
.filter-checkbox-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--portal-title-color);
  line-height: 1.3;
}
.filter-head {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--portal-title-color);
}
.stars-filter-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}
.star-filter-chip {
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-input-border);
  color: var(--portal-label-color);
  font-size: 11px;
  font-weight: 700;
  padding: 6px 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
}
.star-filter-chip.active {
  background: var(--portal-gold);
  color: #0A0B25;
  border-color: var(--portal-gold);
  font-weight: 800;
}
.star-filter-chip:hover:not(.active) {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
}
.form-ctrl {
  background: var(--portal-input-bg);
  border: 1px solid var(--portal-input-border);
  color: var(--portal-input-text);
  font-size: 12px;
  padding: 8px 10px;
  width: 100%;
  box-sizing: border-box;
}
.hotel-search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.hotel-search-input-wrap .form-ctrl {
  padding-right: 28px;
}
.clear-hotel-name-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--portal-label-color);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}
.clear-hotel-name-btn:hover {
  color: var(--portal-gold);
}
.reset-filters-link {
  background: transparent;
  border: 1px dashed var(--portal-input-border);
  color: var(--portal-label-color);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.reset-filters-link:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Hotels Results Column (Right column in 2-column layout) */
.hotels-results-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  width: 100%;
}

/* Hotels cards grid */
.hotels-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hotel-preview-card {
  display: grid;
  grid-template-columns: 240px 1fr;
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}
.hotel-preview-card:hover {
  border-color: var(--portal-gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
@media (max-width: 640px) {
  .hotel-preview-card {
    grid-template-columns: 1fr;
  }
  .card-media {
    min-height: 180px;
    height: 180px;
  }
  .card-details {
    padding: 12px 14px;
    gap: 10px;
  }
  .card-action-footer {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 10px !important;
    padding-top: 10px !important;
    margin-top: 4px !important;
    border-top: 1px solid var(--portal-card-border, #e2e8f0);
  }
  .price-container {
    display: flex !important;
    flex-direction: column !important;
    min-width: 0 !important;
    flex: 1 !important;
  }
  .price-nights-sub {
    font-size: 9.5px !important;
    white-space: nowrap !important;
    color: var(--portal-sub-color, #64748b) !important;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .price-amount-row {
    display: flex !important;
    align-items: baseline !important;
    gap: 4px !important;
    margin-top: 1px;
  }
  .price-val {
    font-size: 21px !important;
    font-weight: 800 !important;
    color: var(--portal-title-color, #0b1022) !important;
    line-height: 1.1 !important;
  }
  .price-currency {
    font-size: 11.5px !important;
    font-weight: 800 !important;
    color: var(--portal-gold, #d2a749) !important;
  }
  .view-deal-btn {
    width: auto !important;
    padding: 10px 18px !important;
    font-size: 11.5px !important;
    font-weight: 800 !important;
    letter-spacing: 0.5px !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    justify-content: center !important;
    background: var(--portal-gold, #d2a749) !important;
    color: #0b1022 !important;
    border-radius: 0 !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(210, 167, 73, 0.3) !important;
  }
}

.card-media {
  position: relative;
  height: 100%;
  min-height: 160px;
  background: #0f172a;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card-stars-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(10, 11, 37, 0.85);
  color: #fbbf24;
  padding: 2px 6px;
  font-size: 10px;
  letter-spacing: 1px;
}
.dynamic-chip {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: var(--portal-gold);
  color: #0A0B25;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  letter-spacing: 0.5px;
}

.card-details {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}
.card-primary-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card-hotel-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--portal-title-color);
  margin: 0;
  line-height: 1.3;
}
.card-hotel-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--portal-label-color);
  margin: 0;
}
.card-pin {
  width: 13px;
  height: 13px;
  color: var(--portal-gold);
}

.card-tags-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.board-tag,
.meal-tag,
.room-spec-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.board-tag {
  background: rgba(210, 167, 73, 0.12);
  color: var(--portal-gold);
  border: 1px solid rgba(210, 167, 73, 0.3);
}
.meal-tag {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.room-spec-tag {
  background: var(--portal-box-bg);
  color: var(--portal-label-color);
  border: 1px solid var(--portal-box-border);
}

.card-action-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--portal-card-border);
  padding-top: 12px;
  margin-top: 4px;
}
.price-container {
  display: flex;
  flex-direction: column;
}
.price-nights-sub {
  font-size: 10px;
  color: var(--portal-label-color);
  text-transform: uppercase;
  font-weight: 700;
}
.price-amount-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.price-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--portal-title-color);
}
.net-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.net-toggle-btn {
  padding: 2px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 999px;
  cursor: pointer;
}
.net-toggle-btn:hover { background: #fde68a; }
.net-value { font-size: 12px; font-weight: 700; color: #b45309; }
.price-currency {
  font-size: 11px;
  font-weight: 800;
  color: var(--portal-gold);
}

.view-deal-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--portal-gold);
  color: #0A0B25;
  border: none;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 9px 18px;
  cursor: pointer;
  transition: all 0.2s;
}
.view-deal-btn:hover {
  background: var(--portal-gold-hover);
  color: #ffffff;
}
.arrow-ico {
  width: 14px;
  height: 14px;
}

/* Skeleton Loading */
.skeleton-card {
  pointer-events: none;
}
.skeleton-img {
  background: var(--portal-box-bg);
  height: 100%;
  min-height: 160px;
}
.skeleton-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sk-line {
  height: 12px;
  background: var(--portal-box-bg);
  animation: pulseShimmer 1.5s infinite ease-in-out;
}
.w-75 { width: 75%; }
.w-40 { width: 40%; }
.w-90 { width: 90%; }
.w-50 { width: 50%; }

@keyframes pulseShimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.25; }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(210, 167, 73, 0.3);
  border-top-color: var(--portal-gold);
  border-radius: 50% !important;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Progressive Loading & Chunk Section ─────────────────────────────── */
.progressive-load-wrapper {
  margin-top: 24px;
  padding: 20px 24px;
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-box-border);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}
.load-progress-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}
.progress-loaded-text {
  color: var(--portal-sub-color);
}
.progress-loaded-text strong {
  color: var(--portal-title-color);
  font-weight: 700;
}
.progress-percent-badge {
  background: rgba(210, 167, 73, 0.15);
  color: var(--portal-gold);
  border: 1px solid rgba(210, 167, 73, 0.3);
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 800;
}
.progress-track {
  width: 100%;
  height: 6px;
  background: var(--portal-input-bg);
  border-radius: 9999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--portal-gold) 0%, #ecc164 100%);
  border-radius: 9999px;
  transition: width 0.4s ease;
}
.pagination-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding-top: 6px;
}
@media (min-width: 768px) {
  .pagination-bar-wrapper {
    flex-direction: row;
    justify-content: space-between;
  }
}
.pagination-info-text {
  font-size: 0.9rem;
  color: var(--portal-sub-color);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.pagination-info-text strong {
  color: var(--portal-title-color);
  font-weight: 700;
}
.pagination-page-badge {
  background: rgba(210, 167, 73, 0.15);
  color: var(--portal-gold);
  border: 1px solid rgba(210, 167, 73, 0.3);
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}
.pagination-controls-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.pagination-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-box-border);
  color: var(--portal-title-color);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pagination-nav-btn:hover:not(:disabled) {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
  background: rgba(210, 167, 73, 0.08);
}
.pagination-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination-numbers-list {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-number-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--portal-box-border);
  background: var(--portal-card-bg);
  color: var(--portal-title-color);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.page-number-btn:hover:not(.active) {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
  background: rgba(210, 167, 73, 0.08);
}
.page-number-btn.active {
  background: linear-gradient(135deg, var(--portal-gold) 0%, #b88f36 100%);
  color: #111827;
  border-color: var(--portal-gold);
  font-weight: 800;
  box-shadow: 0 2px 10px rgba(210, 167, 73, 0.35);
}
.pagination-ellipsis {
  padding: 0 4px;
  color: var(--portal-sub-color);
  font-weight: 700;
}
.all-loaded-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}
.check-ico {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Background full-dataset loading indicator */
.all-loading-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(210, 167, 73, 0.07);
  border: 1px solid rgba(210, 167, 73, 0.2);
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--portal-gold);
  font-weight: 600;
}
.btn-spinner-sm {
  width: 12px;
  height: 12px;
  border-width: 2px;
  flex-shrink: 0;
}
</style>
