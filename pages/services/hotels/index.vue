<template>
  <div class="hotel-portal" :class="{ 'dark-theme': isDark }">

    <!-- ─── Sub-Bar (Portal Navigation) ────────────────────────────── -->
    <div class="portal-subbar">
      <div class="portal-subbar-inner">
        <div class="portal-brand">
          <div class="portal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H9.75A.75.75 0 019 19.5z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="portal-brand-text">
            <div class="portal-title-row">
              <span class="portal-name">BOUAZIZE TRAVEL</span>
              <span class="portal-separator">|</span>
              <span class="portal-subname">PORTAIL HÔTELLERIE</span>
            </div>
            <span class="portal-tagline">Réservations en direct &amp; Vouchers officiels certifiés</span>
          </div>
        </div>

        <nav class="portal-nav-tabs">
          <button id="tab-search-hotels" class="tab-btn active" @click="activeTab='search'">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"/>
            </svg>
            RECHERCHER DES HÔTELS
          </button>
          <button id="tab-my-orders" class="tab-btn" @click="navigateTo('/client/orders?tab=hotels')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.33.615z"/>
              <path fill-rule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm2 3a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm12-1.5v5a.5.5 0 001 0v-5a.5.5 0 00-1 0zm-11 0v5a.5.5 0 001 0v-5a.5.5 0 00-1 0z" clip-rule="evenodd"/>
            </svg>
            MES RÉSERVATIONS &amp; VOUCHERS
          </button>
          <button id="tab-my-favorites" class="tab-btn" @click="navigateTo('/client/hotels/favorites')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.644 12.637 3 10.372 3 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0119 7.5c0 2.872-1.644 5.137-3.885 7.036a22.046 22.046 0 01-3.744 2.866l-.02.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"/>
            </svg>
            MES FAVORIS
          </button>
        </nav>
      </div>
    </div>

    <!-- ─── Main Hero Title ────────────────────────────────────────── -->
    <div class="page-title-section">
      <h1 class="page-title">Réservation d'Hôtel en Ligne</h1>
      <p class="page-subtitle">
        Accédez en direct à plus de <strong>{{ hotelsTotalLabel }} hôtels</strong> et <strong>{{ destinationsTotalLabel }} destinations</strong> avec confirmation instantanée
      </p>
      <div class="hero-stats-badges">
        <span class="hero-badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="badge-icon text-gold">
            <path d="M4 16.5v-13h-.25a.75.75 0 010-1.5H16.25a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z"/>
          </svg>
          <strong>{{ hotelsTotalLabel }}</strong> Hôtels dans le Monde
        </span>
        <span class="hero-badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="badge-icon text-gold">
            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
          </svg>
          <strong>{{ destinationsTotalLabel }}</strong> Villes &amp; Pays
        </span>
      </div>
    </div>

    <!-- ─── Page Container ─────────────────────────────────────────── -->
    <div class="page-body">

      <!-- ─── Search Form Card ─────────────────────────────────────── -->
      <div class="search-form-card" id="hotel-search-card">

        <!-- Top bar: Recent searches button (above Geocodage) -->
        <div class="recent-searches-anchor">
          <button
            id="recent-searches-btn"
            type="button"
            class="recent-searches-btn"
            @click="showRecentModal = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="clock-icon">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd"/>
            </svg>
            RECHERCHES RÉCENTES
            <span class="badge-count">{{ recentSearches.length }}</span>
          </button>
        </div>

        <!-- ROW 1: Destination + Geocodage + KM -->
        <div class="form-row-grid row-destination">
          <div class="form-col col-destination">
            <label class="form-label">CHOISISSEZ VOTRE DESTINATION</label>
            <div class="autocomplete-container">
              <input
                id="destination-input"
                v-model="destinationQuery"
                type="text"
                class="form-ctrl input-dest"
                placeholder="Destination, Hôtel ou Wilaya (ex: Park Mall Sétif, Golden Rose, Paris, Moscou, Bali...)"
                autocomplete="off"
                @input="onDestinationInput"
                @focus="onFocusDest"
                @blur="onBlurDest"
              />
              <div v-if="hotelStore.loadingDestinations" class="input-spinner">
                <span class="spinner-dot"></span>
              </div>

              <!-- Autocomplete suggestions dropdown -->
              <div v-if="showSuggestions && destinationSuggestions.length" class="dest-dropdown">
                <div v-for="group in groupedSuggestions" :key="group.title" class="dest-group">
                  <div class="dest-group-header">
                    <svg v-if="group.type === 'city'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-portal-gold">
                      <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else-if="group.type === 'hotel'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-amber-500">
                      <path d="M2.25 19.5h19.5M3.75 6.75h.75M3.75 10.5h.75M3.75 14.25h.75M9 6.75h1.5M9 10.5h1.5M9 14.25h1.5M15 6.75h.75M15 10.5h.75M15 14.25h.75M3 21V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25V21" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-blue-500">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 7.647a6.015 6.015 0 012.302-2.302l1.015 1.015a.75.75 0 001.06 0l1.22-1.22a6.006 6.006 0 013.914 1.157l-.872.872a.75.75 0 00.22 1.255l1.52.443a6.002 6.002 0 01-.84 4.887l-.95-.95a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 000 1.06l.354.354A5.986 5.986 0 0110 16a5.975 5.975 0 01-4.243-1.757l.89-.89a.75.75 0 00-.53-1.28H4.66a5.98 5.98 0 01-.328-4.426z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ group.title }}</span>
                  </div>
                  <div
                    v-for="dest in group.items"
                    :key="dest.type === 'hotel' ? ('h-' + dest.hotel_id) : ('c-' + (dest.code || dest.ns_code) + '-' + dest.name)"
                    class="dest-item"
                    :class="{ 'dest-item-hotel': dest.type === 'hotel', 'dest-item-city': dest.type === 'city' }"
                    @mousedown.prevent="selectDestination(dest)"
                  >
                    <div class="dest-info">
                      <!-- City icon -->
                      <svg v-if="dest.type !== 'hotel'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="pin-ico">
                        <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
                      </svg>
                      <!-- Hotel icon -->
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="pin-ico pin-ico-hotel">
                        <path d="M2.25 19.5h19.5M3.75 6.75h.75M3.75 10.5h.75M3.75 14.25h.75M9 6.75h1.5M9 10.5h1.5M9 14.25h1.5M15 6.75h.75M15 10.5h.75M15 14.25h.75M3 21V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25V21" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                      </svg>
                      <div>
                        <div class="dest-title">{{ dest.name }}</div>
                        <div class="dest-subtitle">
                          <span v-if="dest.type === 'hotel'" class="dest-type-badge">Hôtel</span>
                          {{ dest.type === 'hotel' ? dest.city_name + ', ' : '' }}{{ dest.country_name || dest.country_code }}
                          <span v-if="dest.type === 'hotel' && dest.stars" class="dest-stars">
                            <svg v-for="n in dest.stars" :key="n" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="dest-star-icon"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" /></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="dest-meta">
                      <span v-if="dest.type === 'hotel'" class="dest-hotel-view-badge">
                        Voir l'offre
                      </span>
                      <span v-else-if="dest.hotel_count > 1" class="dest-hotel-count">
                        {{ formatCount(dest.hotel_count) }} hôtels
                      </span>
                      <span class="dest-code">{{ dest.code || dest.ns_code }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="form-col col-geocodage">
            <label class="form-label">GEOCODAGE</label>
            <input
              id="geocodage-input"
              v-model="geocodage"
              type="text"
              class="form-ctrl"
              placeholder="Lieu..."
            />
          </div>

          <div class="form-col col-km">
            <label class="form-label">KM</label>
            <input
              id="km-input"
              v-model.number="km"
              type="number"
              class="form-ctrl text-center"
              min="1"
              max="500"
            />
          </div>
        </div>

        <!-- ROW 2: Dates + Nuits + Chambres -->
        <div class="form-row-grid row-dates">
          <div class="form-col col-date">
            <label class="form-label">DU</label>
            <div class="date-input-wrap">
              <input
                id="checkin-date"
                v-model="hotelStore.searchForm.check_in"
                type="date"
                class="form-ctrl date-ctrl"
                :min="tomorrow"
                @change="onDateChange"
              />
            </div>
          </div>

          <div class="form-col col-date">
            <label class="form-label">AU</label>
            <div class="date-input-wrap">
              <input
                id="checkout-date"
                v-model="hotelStore.searchForm.check_out"
                type="date"
                class="form-ctrl date-ctrl"
                :min="minCheckout"
                @change="onDateChange"
              />
            </div>
          </div>

          <div class="form-col col-nuits">
            <label class="form-label">NUITS</label>
            <div class="stepper-box">
              <button
                id="nuits-minus-btn"
                type="button"
                class="stepper-btn minus"
                @click="changeNights(-1)"
              >-</button>
              <span class="stepper-val">{{ nights }}</span>
              <button
                id="nuits-plus-btn"
                type="button"
                class="stepper-btn plus"
                @click="changeNights(1)"
              >+</button>
            </div>
          </div>

          <div class="form-col col-chambres">
            <label class="form-label">CHAMBRES</label>
            <div class="rooms-input-box">
              <input
                id="rooms-count-input"
                :value="rooms.length"
                type="text"
                readonly
                class="form-ctrl rooms-val text-center"
              />
              <button
                id="add-room-plus-btn"
                type="button"
                class="add-room-gold-btn"
                title="Ajouter une chambre"
                @click="addRoom"
              >+</button>
            </div>
          </div>
        </div>


        <!-- Room Cards Container -->
        <div class="rooms-stack">
          <div
            v-for="(room, idx) in rooms"
            :key="idx"
            :id="`room-box-${idx}`"
            class="room-config-box"
          >
            <div class="room-title-col">
              <span class="room-title">CHAMBRE {{ idx + 1 }}</span>
              <button
                v-if="rooms.length > 1"
                type="button"
                class="remove-room-link"
                title="Supprimer cette chambre"
                @click="removeRoom(idx)"
              >×</button>
            </div>

            <div class="room-fields-row">
              <!-- Adultes -->
              <div class="room-field-item">
                <label class="field-micro-label">Adultes</label>
                <div class="select-wrap">
                  <select
                    :id="`room-${idx}-adults`"
                    v-model.number="room.adults"
                    class="room-select"
                  >
                    <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
              </div>

              <!-- Nombre d'Enfants -->
              <div class="room-field-item">
                <label class="field-micro-label">Nombre d'Enfants</label>
                <div class="select-wrap">
                  <select
                    :id="`room-${idx}-children`"
                    v-model.number="room.children"
                    class="room-select"
                    @change="updateChildAges(idx)"
                  >
                    <option v-for="n in 7" :key="n-1" :value="n-1">{{ n-1 }}</option>
                  </select>
                </div>
              </div>

              <!-- Berceau -->
              <div class="room-field-item berceau-item">
                <label class="field-micro-label">Berceau</label>
                <div class="berceau-checkbox-wrap">
                  <input
                    :id="`room-${idx}-berceau`"
                    v-model="room.berceau"
                    type="checkbox"
                    class="custom-check"
                  />
                </div>
              </div>

              <!-- Room Type Radios -->
              <div class="room-field-item room-types-item">
                <label class="radio-label">
                  <input
                    :id="`room-${idx}-type-double`"
                    v-model="room.type"
                    type="radio"
                    :name="`room-type-${idx}`"
                    value="dbl"
                    class="custom-radio"
                  />
                  <span>Double</span>
                </label>
                <label class="radio-label">
                  <input
                    :id="`room-${idx}-type-twin`"
                    v-model="room.type"
                    type="radio"
                    :name="`room-type-${idx}`"
                    value="twn"
                    class="custom-radio"
                  />
                  <span>Chambre Twin</span>
                </label>
              </div>
            </div>

            <!-- Children Ages Sub-Row -->
            <div v-if="room.children > 0" class="children-ages-panel">
              <span class="ages-intro">Âges des enfants :</span>
              <div class="ages-chips-list">
                <div v-for="(age, aIdx) in room.childrenAges" :key="aIdx" class="age-picker-pill">
                  <label :for="`child-age-${idx}-${aIdx}`" class="age-lbl">Enfant {{ aIdx + 1 }}</label>
                  <select
                    :id="`child-age-${idx}-${aIdx}`"
                    v-model.number="room.childrenAges[aIdx]"
                    class="age-select"
                  >
                    <option v-for="a in 18" :key="a-1" :value="a-1">{{ a-1 }} an{{ a-1 > 1 ? 's' : '' }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OPTIONS AVANCÉES (Collapsible Bar) -->
        <div class="advanced-options-container" id="advanced-options-section">
          <div
            id="toggle-advanced-btn"
            class="advanced-bar-header"
            @click="showAdvanced = !showAdvanced"
          >
            <div class="adv-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="sliders-icon">
                <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.75 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z"/>
              </svg>
              <span class="adv-title">OPTIONS AVANCÉES</span>
            </div>
            <div class="adv-toggle-circle">
              <span>{{ showAdvanced ? '−' : '+' }}</span>
            </div>
          </div>

          <!-- Advanced content -->
          <div v-if="showAdvanced" class="advanced-body">
            <div class="adv-grid">
              <!-- ÉTOILES -->
              <div class="adv-col">
                <label class="form-label">ÉTOILES</label>
                <div class="select-wrap">
                  <select id="stars-select" v-model="advancedOptions.stars" class="form-ctrl">
                    <option value="">Indifférent</option>
                    <option value="1">1 étoile</option>
                    <option value="2">2 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="5">5 étoiles</option>
                  </select>
                </div>
              </div>

              <!-- BUDGET -->
              <div class="adv-col">
                <label class="form-label">BUDGET</label>
                <div class="select-wrap">
                  <select id="budget-select" v-model="advancedOptions.currency" class="form-ctrl">
                    <option value="DZD">Algerian Dinar</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
              </div>

              <!-- CRITÈRES DE SÉLECTION -->
              <div class="adv-col">
                <label class="form-label">CRITÈRES DE SÉLECTION</label>
                <div class="select-wrap">
                  <select id="criteria-select" v-model="advancedOptions.criteria" class="form-ctrl">
                    <option value="">Tous</option>
                    <option value="BESTPRICE">Meilleur prix</option>
                    <option value="AVAILONLY">Disponibles uniquement</option>
                    <option value="BESTARRANGMENT">Meilleur arrangement</option>
                  </select>
                </div>
              </div>

              <!-- Checkboxes Right -->
              <div class="adv-col adv-check-col">
                <label class="adv-check-label">
                  <input
                    id="refundable-only-check"
                    v-model="advancedOptions.refundableOnly"
                    type="checkbox"
                    class="custom-check"
                  />
                  <span>Tarifs remboursables uniquement</span>
                </label>
              </div>

              <!-- NATIONALITÉ DE PASSAGE -->
              <div class="adv-col">
                <label class="form-label">NATIONALITÉ DE PASSAGE</label>
                <div class="select-wrap">
                  <select
                    id="nationality-select"
                    v-model="hotelStore.searchForm.nationality"
                    class="form-ctrl"
                  >
                    <option value="DZ">ALGERIA</option>
                    <option value="TN">TUNISIA</option>
                    <option value="MA">MOROCCO</option>
                    <option value="FR">FRANCE</option>
                    <option value="GB">UNITED KINGDOM</option>
                    <option value="DE">GERMANY</option>
                    <option value="IT">ITALY</option>
                    <option value="ES">SPAIN</option>
                    <option value="SA">SAUDI ARABIA</option>
                    <option value="AE">UAE</option>
                    <option value="TR">TURKEY</option>
                    <option value="EG">EGYPT</option>
                    <option value="US">USA</option>
                  </select>
                </div>
              </div>

              <!-- Checkbox: Hôtels disponibles uniquement -->
              <div class="adv-col adv-check-col">
                <label class="adv-check-label">
                  <input
                    id="available-only-check"
                    v-model="advancedOptions.availableOnly"
                    type="checkbox"
                    class="custom-check"
                  />
                  <span>Hôtels disponibles uniquement</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── Center Search Button ─────────────────────────────────── -->
        <div class="submit-row">
          <button
            id="main-rechercher-btn"
            type="button"
            class="rechercher-gold-btn"
            :class="{ loading: isNavigating, disabled: !canSearch }"
            :disabled="!canSearch || isNavigating"
            @click="triggerSearch"
          >
            <span v-if="isNavigating" class="btn-spinner"></span>
            <span class="btn-text">
              {{ isNavigating ? 'CHARGEMENT...' : 'RECHERCHER' }}
            </span>
          </button>
        </div>

      </div><!-- /search-form-card -->

      <!-- ─── Portal Highlights & Advantages ──────────────────────────── -->
      <div class="portal-features-grid">
        <div class="portal-feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-1.5V4.5a3 3 0 00-3-3h-6a3 3 0 00-3 3v6H4.5a3 3 0 00-3 3V18a3 3 0 003 3h15zM6 18v-4.5a1.5 1.5 0 011.5-1.5h1.5v6H6zm4.5 0V4.5a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5V18h-9zm10.5 0h-3v-6H19.5a1.5 1.5 0 011.5 1.5V18z"/>
            </svg>
          </div>
          <div class="feature-text">
            <h4>{{ destinationsTotalLabel }} Villes & Destinations</h4>
            <p>Accédez en direct aux disponibilités et tarifs de milliers d'établissements hôteliers dans le monde entier.</p>
          </div>
        </div>

        <div class="portal-feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="feature-text">
            <h4>Confirmation Instantanée</h4>
            <p>Réservation sécurisée avec émission immédiate de votre bon d'échange officiel Bouazize Travel.</p>
          </div>
        </div>

        <div class="portal-feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 7.5A.75.75 0 009 9h1.5c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75H9a.75.75 0 000 1.5h.75v1.25a.75.75 0 001.5 0V14h.25A3.25 3.25 0 0014.75 10.75 3.25 3.25 0 0011.5 7.5H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="feature-text">
            <h4>Meilleurs Tarifs Négociés</h4>
            <p>Tarifs B2B et grand public calculés en direct en dinars algériens (DZD) aux prix les plus compétitifs du marché.</p>
          </div>
        </div>
      </div>

    </div><!-- /page-body -->

    <!-- ─── RECENT SEARCHES PRO MODAL POPUP ──────────────────────────── -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="modal-fade">
          <div
            v-if="showRecentModal"
            class="recent-modal-backdrop hotel-portal"
            :class="{ 'dark-theme': isDark }"
            @click.self="showRecentModal = false"
          >
            <div class="recent-modal-container" role="dialog" aria-modal="true">
              <!-- Top Gold Accent Line -->
              <div class="recent-modal-accent-bar"></div>
              
              <!-- Header -->
              <div class="recent-modal-header">
                <div class="modal-header-left">
                  <div class="modal-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="modal-title-col">
                    <div class="modal-title-row">
                      <h3 class="modal-title-text">RECHERCHES RÉCENTES</h3>
                      <span v-if="recentSearches.length" class="modal-badge-count">{{ recentSearches.length }}</span>
                    </div>
                    <p class="modal-subtitle-text">Vos dernières recherches d'hôtels et destinations</p>
                  </div>
                </div>

                <div class="modal-header-right">
                  <button
                    v-if="recentSearches.length"
                    type="button"
                    class="clear-history-btn"
                    @click="clearAllRecentSearches"
                    title="Effacer tout l'historique"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                      <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                    </svg>
                    <span>Vider</span>
                  </button>
                  <button
                    type="button"
                    class="recent-modal-close-btn"
                    @click="showRecentModal = false"
                    aria-label="Fermer"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="recent-modal-body">
                <!-- Empty state -->
                <div v-if="!recentSearches.length" class="modal-empty-box">
                  <div class="empty-clock-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="modal-empty-title">Aucune recherche récente</h4>
                  <p class="modal-empty-desc">Vos futures recherches d'hôtels s'afficheront ici automatiquement pour vous permettre de les relancer en un clic.</p>
                </div>

                <!-- Cards list -->
                <div v-else class="recent-cards-list">
                  <div
                    v-for="(item, idx) in recentSearches"
                    :key="idx"
                    class="recent-card-item"
                    @click="applyRecent(item)"
                  >
                    <div class="recent-card-top-row">
                      <div class="recent-dest-title-wrap">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="recent-dest-pin">
                          <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433 1.244-.77 3.13-2.146 4.629-4.288 1.498-2.14 2.001-4.375 2.001-6.064 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 1.689.503 3.924 2.001 6.064 1.499 2.142 3.385 3.518 4.629 4.288.311.193.571.337.757.433a5.741 5.741 0 00.281.14l.018.008.006.003zM10 11a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                        </svg>
                        <span class="recent-dest-name">{{ item.destination_name }}</span>
                      </div>
                      <span v-if="item.nights" class="recent-nights-badge">{{ item.nights }} nuit{{ item.nights > 1 ? 's' : '' }}</span>
                    </div>

                    <div class="recent-dates-line">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-portal-gold shrink-0">
                        <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
                      </svg>
                      <span>Du <strong>{{ formatDate(item.check_in) }}</strong> au <strong>{{ formatDate(item.check_out) }}</strong></span>
                    </div>

                    <div class="recent-card-action-bar">
                      <button
                        type="button"
                        class="btn-apply-recent"
                        @click.stop="applyRecent(item)"
                      >
                        <span>Appliquer cette recherche</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
                          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        class="btn-del-recent"
                        @click.stop="removeRecentSearch(idx)"
                        title="Supprimer cette recherche"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
                          <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="recent-modal-footer">
                <span class="footer-hint">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-portal-gold">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                  </svg>
                  Les critères sont appliqués en un clic
                </span>
                <button type="button" class="btn-close-recent-footer" @click="showRecentModal = false">
                  Fermer
                </button>
              </div>

            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useHotelStore } from '~/stores/hotel';
import { getHotelStats } from '~/services/hotel';
import { useDark } from '@vueuse/core';
import { resolveHotelImage, onHotelImageError } from '~/composables/useHotelImages';

// ── State & Stores ─────────────────────────────────────────────────────
const hotelStore = useHotelStore();
const isDark     = useDark();

const destinationQuery       = ref('');
const destinationSuggestions = ref([]);
const showSuggestions       = ref(false);
const showRecentModal       = ref(false);
const destinationsTotal     = ref(0);
const hotelsTotal           = ref(838351);
const destinationsTotalLabel = computed(() =>
  destinationsTotal.value ? Number(destinationsTotal.value).toLocaleString('fr-FR') : '50 000+'
);
const hotelsTotalLabel = computed(() =>
  hotelsTotal.value ? '+' + Number(hotelsTotal.value).toLocaleString('fr-FR') : '+838 000'
);

async function loadDestinationStats() {
  try {
    const res = await getHotelStats();
    destinationsTotal.value = res?.data?.destinations_count || 0;
    if (res?.data?.worldwide_inventory_count) {
      hotelsTotal.value = res.data.worldwide_inventory_count;
    }
  } catch { /* keep placeholder */ }
}
const geocodage              = ref('');
const km                     = ref(5);
const nights                 = ref(2);
const flexibleDates          = ref(false);
const showAdvanced           = ref(false);
const searched               = ref(false);
const recentSearches         = ref([]);

const rooms = ref([
  { adults: 2, children: 0, childrenAges: [], type: 'dbl', berceau: false }
]);

const advancedOptions = ref({
  stars: '',
  currency: 'DZD',
  criteria: '',
  refundableOnly: false,
  availableOnly: true,
});

const isNavigating = ref(false);
let debounceTimer = null;

// ── Fallback Hotel Images ──────────────────────────────────────────────
const fallbackPhotos = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
];

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(() => {
  loadDestinationStats();
  // Always clear loadingSearch & searchError on mount so button never stays stuck
  hotelStore.loadingSearch = false;
  hotelStore.searchError = null;
  isNavigating.value = false;

  // Ensure default nationality
  if (!hotelStore.searchForm.nationality) {
    hotelStore.searchForm.nationality = 'DZ';
  }

  // Pre-fill dates if empty: Check-in = +10 days, Check-out = +12 days (matching reference)
  if (!hotelStore.searchForm.check_in) {
    const d1 = new Date();
    d1.setDate(d1.getDate() + 10);
    hotelStore.searchForm.check_in = d1.toISOString().split('T')[0];
  }
  if (!hotelStore.searchForm.check_out) {
    const d2 = new Date();
    d2.setDate(d2.getDate() + 12);
    hotelStore.searchForm.check_out = d2.toISOString().split('T')[0];
  }

  // Pre-fill destination if already selected
  if (hotelStore.searchForm.destination_name) {
    destinationQuery.value = hotelStore.searchForm.destination_name;
  }

  // Load recent searches from localStorage
  try {
    const saved = localStorage.getItem('hotel_recent_searches');
    if (saved) recentSearches.value = JSON.parse(saved);
  } catch {}

  // Sync initial nights count
  calculateNights();

  if (hotelStore.hasSearchResults) {
    searched.value = true;
  }

  const handleKeydown = (e) => {
    if (e.key === 'Escape' && showRecentModal.value) {
      showRecentModal.value = false;
    }
  };
  window.addEventListener('keydown', handleKeydown);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
});

// ── Computed ───────────────────────────────────────────────────────────
const tomorrow = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
});

const minCheckout = computed(() => {
  if (hotelStore.searchForm.check_in) {
    const d = new Date(hotelStore.searchForm.check_in);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  return tomorrow.value;
});

const canSearch = computed(() => {
  return (
    !!hotelStore.searchForm.destination_code &&
    !!hotelStore.searchForm.check_in &&
    !!hotelStore.searchForm.check_out &&
    nights.value > 0
  );
});

// ── Methods ────────────────────────────────────────────────────────────
function calculateNights() {
  if (hotelStore.searchForm.check_in && hotelStore.searchForm.check_out) {
    const t1 = new Date(hotelStore.searchForm.check_in).getTime();
    const t2 = new Date(hotelStore.searchForm.check_out).getTime();
    const diff = Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
    nights.value = Math.max(1, diff);
  }
}

function onDateChange() {
  calculateNights();
}

function changeNights(delta) {
  const newNights = Math.max(1, nights.value + delta);
  nights.value = newNights;

  if (hotelStore.searchForm.check_in) {
    const d = new Date(hotelStore.searchForm.check_in);
    d.setDate(d.getDate() + newNights);
    hotelStore.searchForm.check_out = d.toISOString().split('T')[0];
  }
}

function addRoom() {
  if (rooms.value.length < 9) {
    rooms.value.push({
      adults: 2,
      children: 0,
      childrenAges: [],
      type: 'dbl',
      berceau: false,
    });
    hotelStore.searchForm.rooms = rooms.value.length;
  }
}

function removeRoom(idx) {
  if (rooms.value.length > 1) {
    rooms.value.splice(idx, 1);
    hotelStore.searchForm.rooms = rooms.value.length;
  }
}

function updateChildAges(idx) {
  const cnt = rooms.value[idx].children;
  const current = rooms.value[idx].childrenAges || [];
  const updated = [];
  for (let i = 0; i < cnt; i++) {
    updated.push(current[i] ?? 5);
  }
  rooms.value[idx].childrenAges = updated;
}

// ── Popular / Recommended destinations shown when input is focused empty ──
const popularDestinations = [
  { type: 'city', name: 'MOSCOU', label: 'MOSCOU, Russie', code: 'MOW', country_code: 'RU', country_name: 'Russie', hotel_count: 1656, hotel_id: null },
  { type: 'city', name: 'BALI', label: 'BALI, Indonésie', code: 'KUTB', country_code: 'IA', country_name: 'Indonésie', hotel_count: 7737, hotel_id: null },
  { type: 'city', name: 'PARIS', label: 'PARIS, France', code: 'PAR', country_code: 'F', country_name: 'France', hotel_count: 3554, hotel_id: null },
  { type: 'city', name: 'LONDON', label: 'LONDON, United Kingdom', code: 'LON', country_code: 'GB', country_name: 'United Kingdom', hotel_count: 5263, hotel_id: null },
  { type: 'city', name: 'ISTANBUL', label: 'ISTANBUL, Turquie', code: 'IST', country_code: 'TR', country_name: 'Turquie', hotel_count: 5065, hotel_id: null },
  { type: 'city', name: 'DUBAI', label: 'DUBAI, Émirats Arabes Unis', code: 'DXB', country_code: 'AE', country_name: 'Émirats Arabes Unis', hotel_count: 1890, hotel_id: null },
  { type: 'city', name: 'TOKYO', label: 'TOKYO, Japon', code: 'TYO', country_code: 'J', country_name: 'Japon', hotel_count: 3048, hotel_id: null },
  { type: 'city', name: 'BANGKOK', label: 'BANGKOK, Thaïlande', code: 'BKK', country_code: 'TH', country_name: 'Thaïlande', hotel_count: 4846, hotel_id: null },
  { type: 'city', name: 'NEW YORK', label: 'NEW YORK (NY), United States', code: 'NYC', country_code: 'US', country_name: 'United States', hotel_count: 1267, hotel_id: null },
  { type: 'city', name: 'ROME', label: 'ROME, Italie', code: 'ROM', country_code: 'I', country_name: 'Italie', hotel_count: 1200, hotel_id: null },
  { type: 'city', name: 'ALGER', label: 'ALGER, Algérie', code: 'AXAL', country_code: 'DZ', country_name: 'Algérie', hotel_count: 133, hotel_id: null },
  { type: 'city', name: 'ORAN', label: 'ORAN, Algérie', code: 'ORNA', country_code: 'DZ', country_name: 'Algérie', hotel_count: 85, hotel_id: null },
  { type: 'hotel', name: 'HILTON BALI RESORT', label: 'HILTON BALI RESORT (Bali)', code: 'KUTB', hotel_id: '43970', city_name: 'Bali', stars: 5, country_name: 'Indonésie' },
  { type: 'hotel', name: 'THE RITZ-CARLTON, MOSCOW', label: 'THE RITZ-CARLTON, MOSCOW (Moscou)', code: 'MOW', hotel_id: '38192', city_name: 'Moscou', stars: 5, country_name: 'Russie' },
  { type: 'hotel', name: 'FOUR SEASONS HOTEL GEORGE V PARIS', label: 'FOUR SEASONS HOTEL GEORGE V PARIS (Paris)', code: 'PAR', hotel_id: '11595', city_name: 'Paris', stars: 5, country_name: 'France' },
  { type: 'hotel', name: 'HOTEL EL AURASSI', label: 'HOTEL EL AURASSI (Alger)', code: 'AXAL', hotel_id: '852001', city_name: 'Alger', stars: 5, country_name: 'Algérie' },
];

const groupedSuggestions = computed(() => {
  const list = destinationSuggestions.value || [];
  if (!list.length) return [];

  const cities = list.filter(d => d.type === 'city');
  const hotels = list.filter(d => d.type === 'hotel');
  const countries = list.filter(d => d.type === 'country');
  const groups = [];

  const firstType = list[0]?.type;
  if (firstType === 'hotel') {
    if (hotels.length) groups.push({ type: 'hotel', title: 'Hôtels & Établissements', items: hotels });
    if (cities.length) groups.push({ type: 'city', title: 'Destinations & Villes', items: cities });
    if (countries.length) groups.push({ type: 'country', title: 'Pays', items: countries });
  } else {
    if (cities.length) groups.push({ type: 'city', title: 'Destinations & Villes', items: cities });
    if (hotels.length) groups.push({ type: 'hotel', title: 'Hôtels & Établissements', items: hotels });
    if (countries.length) groups.push({ type: 'country', title: 'Pays', items: countries });
  }
  return groups;
});

function onFocusDest() {
  if (destinationQuery.value.trim().length >= 2) {
    if (destinationSuggestions.value.length > 0) {
      showSuggestions.value = true;
    } else {
      onDestinationInput();
    }
  } else {
    // Show popular destinations immediately so user never sees empty list
    destinationSuggestions.value = popularDestinations;
    showSuggestions.value = true;
  }
}

async function onDestinationInput() {
  clearTimeout(debounceTimer);

  if (destinationQuery.value.trim().length < 2) {
    destinationSuggestions.value = popularDestinations;
    showSuggestions.value = true;
    return;
  }

  debounceTimer = setTimeout(async () => {
    await hotelStore.fetchDestinations(destinationQuery.value.trim());
    destinationSuggestions.value = hotelStore.destinationSuggestions.length > 0
      ? hotelStore.destinationSuggestions
      : [];
    showSuggestions.value = destinationSuggestions.value.length > 0;
  }, 200);
}

function onBlurDest() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 250);
}

function selectDestination(dest) {
  hotelStore.selectDestination(dest);
  // Show nice display name in the input
  if (dest.type === 'hotel') {
    destinationQuery.value = dest.name + ' — ' + dest.city_name;
  } else {
    destinationQuery.value = dest.name || dest.label || '';
  }
  showSuggestions.value = false;
}

function applyRecent(item) {
  hotelStore.searchForm.destination_name = item.destination_name;
  hotelStore.searchForm.destination_code = item.destination_code;
  hotelStore.searchForm.check_in         = item.check_in;
  hotelStore.searchForm.check_out        = item.check_out;
  destinationQuery.value                 = item.destination_name;
  calculateNights();
  showRecentModal.value                  = false;

  hotelStore.clearSearchResults();

  navigateTo({
    path: '/services/hotels/results',
    query: {
      destination_code: item.destination_code,
      destination_name: item.destination_name,
      check_in: item.check_in,
      check_out: item.check_out,
      adults: hotelStore.searchForm.adults || 2,
      children: hotelStore.searchForm.children || 0,
      rooms: rooms.value.length || 1,
    },
  });
}

function removeRecentSearch(index) {
  recentSearches.value.splice(index, 1);
  try {
    localStorage.setItem('hotel_recent_searches', JSON.stringify(recentSearches.value));
  } catch {}
}

function clearAllRecentSearches() {
  recentSearches.value = [];
  try {
    localStorage.removeItem('hotel_recent_searches');
  } catch {}
}

async function triggerSearch() {
  if (!canSearch.value) return;

  const firstRoom = rooms.value[0];
  hotelStore.searchForm.adults        = firstRoom.adults;
  hotelStore.searchForm.children      = firstRoom.children;
  hotelStore.searchForm.children_ages = firstRoom.childrenAges;
  hotelStore.searchForm.room_type     = firstRoom.type;
  hotelStore.searchForm.rooms         = rooms.value.length;

  hotelStore.clearSearchResults();

  // Save to recent searches
  const recItem = {
    destination_name: hotelStore.searchForm.destination_name,
    destination_code: hotelStore.searchForm.destination_code,
    check_in: hotelStore.searchForm.check_in,
    check_out: hotelStore.searchForm.check_out,
    nights: nights.value,
    timestamp: Date.now(),
  };
  const filtered = recentSearches.value.filter(
    r => r.destination_code !== recItem.destination_code
  );
  recentSearches.value = [recItem, ...filtered].slice(0, 5);
  try {
    localStorage.setItem('hotel_recent_searches', JSON.stringify(recentSearches.value));
  } catch {}

  // Navigate to dedicated results page
  const query = {
    destination_code: hotelStore.searchForm.destination_code,
    destination_name: hotelStore.searchForm.destination_name,
    check_in: hotelStore.searchForm.check_in,
    check_out: hotelStore.searchForm.check_out,
    adults: hotelStore.searchForm.adults,
    children: hotelStore.searchForm.children,
    rooms: rooms.value.length,
  };
  if (hotelStore.searchForm.children_ages?.length) {
    query.children_ages = hotelStore.searchForm.children_ages.join(',');
  }
  if (hotelStore.searchForm.hotel_id) query.hotel_id = hotelStore.searchForm.hotel_id;
  if (hotelStore.searchForm.hotel_name) query.hotel_name = hotelStore.searchForm.hotel_name;
  if (advancedOptions.value.stars) query.stars = advancedOptions.value.stars;
  if (advancedOptions.value.currency) query.currency = advancedOptions.value.currency;
  if (geocodage.value) query.geocodage = geocodage.value;
  if (km.value) query.km = km.value;

  isNavigating.value = true;
  navigateTo({
    path: '/services/hotels/results',
    query,
  }).finally(() => {
    setTimeout(() => { isNavigating.value = false; }, 1000);
  });
}

function openHotelDetails(hotel) {
  hotelStore.selectedHotel = hotel;
  hotelStore.selectedRoom  = hotel.agreements?.[0] || hotel;
  try {
    sessionStorage.setItem('current_hotel_' + hotel.hotel_code, JSON.stringify(hotel));
    localStorage.setItem('current_hotel_' + hotel.hotel_code, JSON.stringify(hotel));
  } catch {}
  const sessId = hotelStore.searchResults.session_id || hotel.session_id || '';
  const rCode  = hotel.room_code || hotel.agreements?.[0]?.agreement_id || '';
  const cIn    = hotelStore.searchForm.check_in || '';
  const cOut   = hotelStore.searchForm.check_out || '';
  const ad     = hotelStore.searchForm.adults || 2;
  const ch     = hotelStore.searchForm.children || 0;
  navigateTo(`/services/hotels/${hotel.hotel_code}?session=${sessId}&room=${encodeURIComponent(rCode)}&check_in=${cIn}&check_out=${cOut}&adults=${ad}&children=${ch}`);
}

function onImageError(event, stars) {
  onHotelImageError(event, stars || 3);
}

function formatPrice(val) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(val ?? 0));
}

function formatCount(val) {
  return new Intl.NumberFormat('fr-FR').format(val);
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

// ── SEO ─────────────────────────────────────────────────────────────────
useHead({
  title: 'Réservation Hôtels en Ligne | Bouazize Travel',
  meta: [
    {
      name: 'description',
      content: 'Recherchez et réservez des milliers d\'hôtels à travers le monde avec confirmation immédiate et vouchers officiels Bouazize Travel.',
    },
  ],
});
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM TOKENS (LIGHT & DARK)
══════════════════════════════════════════════════════════════════════ */
.hotel-portal {
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
  --portal-title-color: #0f172a;
  --portal-sub-color: #64748b;
  --portal-subbar-bg: #ffffff;
  --portal-subbar-border: #e2e8f0;
  --portal-gold: #d4a03c;
  --portal-gold-hover: #c4912c;
  --portal-gold-light: rgba(212, 160, 60, 0.12);
  --portal-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  background: var(--portal-page-bg);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--portal-title-color);
  transition: background 0.25s ease, color 0.25s ease;
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
  --portal-gold: #d4a03c;
  --portal-gold-hover: #c4912c;
  --portal-gold-light: rgba(212, 160, 60, 0.15);
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
.hotel-portal .recent-searches-btn,
.hotel-portal .form-ctrl,
.hotel-portal .stepper-box,
.hotel-portal .stepper-btn,
.hotel-portal .add-room-gold-btn,
.hotel-portal .rechercher-gold-btn,
.hotel-portal .view-deal-btn,
.hotel-portal .retry-action-btn,
.hotel-portal .star-filter-chip,
.hotel-portal .sort-dropdown,
.hotel-portal .room-select,
.hotel-portal .age-picker-pill,
.hotel-portal .age-select,
.hotel-portal .search-form-card,
.hotel-portal .hotel-preview-card,
.hotel-portal .room-config-box,
.hotel-portal .advanced-options-container,
.hotel-portal .sidebar-filters,
.hotel-portal .results-header-bar,
.hotel-portal .recent-dropdown,
.hotel-portal .dest-dropdown,
.hotel-portal .feedback-card,
.hotel-portal .dest-hotel-count,
.hotel-portal .dest-type-badge,
.hotel-portal .nouveau-badge,
.hotel-portal .card-stars-badge,
.hotel-portal .dynamic-chip,
.hotel-portal .board-tag,
.hotel-portal .meal-tag,
.hotel-portal .room-spec-tag,
.hotel-portal .badge-count,
.hotel-portal .adv-toggle-circle,
.hotel-portal .sk-line {
  border-radius: 0 !important;
}

/* ══════════════════════════════════════════════════════════════════════
   PORTAL SUB-BAR
══════════════════════════════════════════════════════════════════════ */
.portal-subbar {
  background: var(--portal-subbar-bg);
  border-bottom: 1px solid var(--portal-subbar-border);
  padding: 10px 0;
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
  border-radius: 0;
  background: var(--portal-gold);
  color: #0b1022;
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

.portal-nav-tabs {
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
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 0;
  cursor: pointer;
  border: 1px solid var(--portal-card-border);
  background: var(--portal-box-bg);
  color: var(--portal-sub-color);
  transition: all 0.2s;
  text-transform: uppercase;
}
.tab-btn svg {
  width: 14px;
  height: 14px;
}
.tab-btn.active {
  background: var(--portal-gold);
  color: #111827;
  border-color: var(--portal-gold);
  font-weight: 800;
}
.tab-btn:hover:not(.active) {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
}

/* ══════════════════════════════════════════════════════════════════════
   HERO TITLE
══════════════════════════════════════════════════════════════════════ */
.page-title-section {
  text-align: center;
  padding: 34px 20px 22px;
}
.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--portal-title-color);
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}
.page-subtitle {
  font-size: 13px;
  color: var(--portal-sub-color);
  margin: 0;
}
.hero-stats-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-card-border);
  color: var(--portal-title-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.hero-badge strong {
  font-weight: 800;
  color: var(--portal-gold);
}
.hero-badge .badge-icon {
  width: 14px;
  height: 14px;
}
.hero-badge .text-gold {
  color: var(--portal-gold);
}
.hero-badge .text-emerald {
  color: #10b981;
}

/* ══════════════════════════════════════════════════════════════════════
   SEARCH FORM CARD (Matches Screenshot)
══════════════════════════════════════════════ */
.page-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}
@media (max-width: 640px) {
  .page-body {
    padding: 0 12px 40px;
  }
}
.search-form-card {
  max-width: 900px;
  margin: 0 auto;
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  border-radius: 0;

  box-shadow: var(--portal-shadow);
  padding: 22px 24px 24px;
  position: relative;
  transition: all 0.25s ease;
}
@media (max-width: 640px) {
  .search-form-card {
    padding: 14px 14px 18px;
  }
}


/* ══════════════════════════════════════════════════════════════════════
   PORTAL FEATURES HIGHLIGHTS
══════════════════════════════════════════════════════════════════════ */
.portal-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 900px;
  margin: 32px auto 0;
}
@media (max-width: 768px) {
  .portal-features-grid {
    grid-template-columns: 1fr;
  }
}
.portal-feature-card {
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;
}
.portal-feature-card:hover {
  border-color: var(--portal-gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.feature-icon {
  width: 42px;
  height: 42px;
  background: var(--portal-gold);
  color: #0A0B25;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 !important;
}
.feature-icon svg {
  width: 22px;
  height: 22px;
}
.feature-text h4 {
  font-size: 14px;
  font-weight: 800;
  color: var(--portal-title-color);
  margin: 0 0 6px;
  letter-spacing: 0.2px;
}
.feature-text p {
  font-size: 12px;
  color: var(--portal-label-color);
  margin: 0;
  line-height: 1.5;
}

/* Recent searches anchor (positioned above row 1, aligned right above Geocodage) */
.recent-searches-anchor {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  position: relative;
  z-index: 25;
}
.recent-searches-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 5px 12px;
  border-radius: 0;
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-input-border);
  color: var(--portal-label-color);
  cursor: pointer;
  transition: all 0.2s;
}
.recent-searches-btn:hover {
  border-color: var(--portal-gold);
  color: var(--portal-gold);
}
.clock-icon {
  width: 12px;
  height: 12px;
  color: var(--portal-gold);
}
.badge-count {
  width: 17px;
  height: 17px;
  border-radius: 0;
  background: var(--portal-gold);
  color: #111827;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ══════════════════════════════════════════════════════════════════════
   PRO RECENT SEARCHES MODAL POPUP (MATCHES WEBSITE LIGHT & DARK THEME)
══════════════════════════════════════════════════════════════════════ */
.recent-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 11, 25, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.recent-modal-container {
  width: min(520px, 94vw);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid var(--portal-gold, #d2a749);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
  border-radius: 0 !important;
  overflow: hidden;
  animation: modalPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.dark-theme .recent-modal-container,
:global(.dark) .recent-modal-container {
  background: #0b1022;
  border-color: rgba(210, 167, 73, 0.5);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75);
}

.recent-modal-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, #d2a749, #f59e0b, #d2a749);
  flex-shrink: 0;
}

@keyframes modalPopIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.recent-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--portal-card-border, #e2e8f0);
  background: #ffffff;
  gap: 12px;
}
.dark-theme .recent-modal-header,
:global(.dark) .recent-modal-header {
  background: #080d1c;
  border-bottom-color: rgba(210, 167, 73, 0.18);
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}
.modal-header-icon {
  width: 32px;
  height: 32px;
  min-width: 32px;
  max-width: 32px;
  background: var(--portal-gold, #d2a749);
  color: #0b1022;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 !important;
  flex-shrink: 0;
}
.modal-title-col {
  min-width: 0;
  flex: 1;
}
.modal-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.modal-title-text {
  font-size: 13.5px;
  font-weight: 800;
  color: #0b1022;
  letter-spacing: 0.5px;
  margin: 0;
}
.dark-theme .modal-title-text,
:global(.dark) .modal-title-text {
  color: #ffffff;
}

.modal-badge-count {
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  background: rgba(210, 167, 73, 0.15);
  color: #b45309;
  border: 1px solid #d2a749;
  border-radius: 0 !important;
}
.dark-theme .modal-badge-count,
:global(.dark) .modal-badge-count {
  color: #d2a749;
  background: rgba(210, 167, 73, 0.2);
}

.modal-subtitle-text {
  font-size: 10.5px;
  color: #64748b;
  margin: 1px 0 0;
}
.dark-theme .modal-subtitle-text,
:global(.dark) .modal-subtitle-text {
  color: #94a3b8;
}

.modal-header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.clear-history-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid var(--portal-input-border, #cbd5e1);
  color: #64748b;
  padding: 5px 9px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  border-radius: 0 !important;
  cursor: pointer;
  transition: all 0.15s;
}
.dark-theme .clear-history-btn,
:global(.dark) .clear-history-btn {
  border-color: rgba(255, 255, 255, 0.15);
  color: #94a3b8;
}
.clear-history-btn:hover {
  border-color: #ef4444 !important;
  color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.08) !important;
}
.recent-modal-close-btn {
  width: 30px;
  height: 30px;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--portal-input-border, #cbd5e1);
  color: #64748b;
  font-size: 18px;
  cursor: pointer;
  border-radius: 0 !important;
  transition: all 0.15s;
  line-height: 1;
}
.dark-theme .recent-modal-close-btn,
:global(.dark) .recent-modal-close-btn {
  border-color: rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
}
.recent-modal-close-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.recent-modal-body {
  padding: 14px 18px;
  overflow-y: auto;
  max-height: calc(85vh - 120px);
  background: var(--portal-box-bg, #f8fafc);
}
.dark-theme .recent-modal-body,
:global(.dark) .recent-modal-body {
  background: #080d1c;
}

.modal-empty-box {
  padding: 36px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty-clock-wrap {
  width: 44px;
  height: 44px;
  background: rgba(210, 167, 73, 0.14);
  color: #d2a749;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 !important;
  margin-bottom: 6px;
}
.modal-empty-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #0b1022;
  margin: 0;
}
.dark-theme .modal-empty-title,
:global(.dark) .modal-empty-title {
  color: #ffffff;
}
.modal-empty-desc {
  font-size: 11.5px;
  color: #64748b;
  max-width: 360px;
  margin: 0;
  line-height: 1.4;
}
.dark-theme .modal-empty-desc,
:global(.dark) .modal-empty-desc {
  color: #94a3b8;
}

.recent-cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.recent-card-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid var(--portal-card-border, #e2e8f0);
  border-radius: 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.18s ease;
}
.dark-theme .recent-card-item,
:global(.dark) .recent-card-item {
  background: #0b1022;
  border-color: rgba(210, 167, 73, 0.2);
  box-shadow: none;
}
.recent-card-item:hover {
  border-color: var(--portal-gold, #d2a749);
  background: rgba(210, 167, 73, 0.04);
  box-shadow: 0 4px 14px rgba(210, 167, 73, 0.15);
}
.dark-theme .recent-card-item:hover,
:global(.dark) .recent-card-item:hover {
  background: rgba(210, 167, 73, 0.08);
  box-shadow: none;
}

.recent-card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.recent-dest-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
}
.recent-dest-pin {
  width: 14px;
  height: 14px;
  color: var(--portal-gold, #d2a749);
  flex-shrink: 0;
}
.recent-dest-name {
  font-size: 12.5px;
  font-weight: 800;
  color: #0b1022;
  letter-spacing: 0.3px;
  white-space: normal;
  word-break: break-word;
}
.dark-theme .recent-dest-name,
:global(.dark) .recent-dest-name {
  color: #ffffff;
}

.recent-nights-badge {
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  background: #0b1022;
  color: #ffffff;
  border-radius: 0 !important;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  flex-shrink: 0;
}
.dark-theme .recent-nights-badge,
:global(.dark) .recent-nights-badge {
  background: var(--portal-gold, #d2a749);
  color: #0b1022;
}

.recent-dates-line {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}
.dark-theme .recent-dates-line,
:global(.dark) .recent-dates-line {
  color: #94a3b8;
}
.recent-dates-line strong {
  color: #0b1022;
}
.dark-theme .recent-dates-line strong,
:global(.dark) .recent-dates-line strong {
  color: #ffffff;
}

.recent-card-action-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed rgba(210, 167, 73, 0.2);
}
.btn-apply-recent {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--portal-gold, #d2a749);
  color: #0b1022;
  border: none;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 0 !important;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 36px;
}
.btn-apply-recent:hover {
  background: var(--portal-gold-hover, #b8923f);
  color: #ffffff;
}
.btn-del-recent {
  width: 36px;
  height: 36px;
  min-width: 36px;
  background: transparent;
  border: 1px solid var(--portal-input-border, #cbd5e1);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 !important;
  transition: all 0.15s;
}
.dark-theme .btn-del-recent,
:global(.dark) .btn-del-recent {
  border-color: rgba(255, 255, 255, 0.15);
  color: #94a3b8;
}
.btn-del-recent:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.recent-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-top: 1px solid var(--portal-card-border, #e2e8f0);
  background: #ffffff;
  gap: 10px;
}
.dark-theme .recent-modal-footer,
:global(.dark) .recent-modal-footer {
  background: #080d1c;
  border-top-color: rgba(210, 167, 73, 0.18);
}
.footer-hint {
  font-size: 10.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}
.dark-theme .footer-hint,
:global(.dark) .footer-hint {
  color: #94a3b8;
}
.btn-close-recent-footer {
  padding: 5px 12px;
  font-size: 10.5px;
  font-weight: 700;
  background: transparent;
  border: 1px solid var(--portal-input-border, #cbd5e1);
  color: var(--portal-title-color, #0b1022);
  cursor: pointer;
  border-radius: 0 !important;
  transition: all 0.15s;
}
.dark-theme .btn-close-recent-footer,
:global(.dark) .btn-close-recent-footer {
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}
.btn-close-recent-footer:hover {
  border-color: var(--portal-gold, #d2a749);
  color: var(--portal-gold, #d2a749);
}
.dark-theme .footer-hint,
:global(.dark) .footer-hint {
  color: #94a3b8;
}

/* Form labels */
.form-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: var(--portal-label-color);
  margin-bottom: 5px;
  display: block;
}

/* Controls */
.form-ctrl {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 0;
  border: 1px solid var(--portal-input-border);
  background: var(--portal-input-bg);
  color: var(--portal-input-text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-ctrl::placeholder {
  color: var(--portal-placeholder);
}
.form-ctrl:focus {
  border-color: var(--portal-gold);
  box-shadow: 0 0 0 2px var(--portal-gold-light);
}
.text-center {
  text-align: center;
}

/* Row 1: Destination */
.form-row-grid {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: flex-end;
}
.col-destination {
  flex: 1;
}
.col-geocodage {
  width: 130px;
}
.col-km {
  width: 60px;
}

/* Autocomplete */
.autocomplete-container {
  position: relative;
}
.input-spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.spinner-dot {
  width: 12px;
  height: 12px;
  border: 2px solid var(--portal-gold);
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.dest-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  border-radius: 0;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  z-index: 50;
}
.dest-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid var(--portal-card-border);
  transition: background 0.15s;
}
.dest-item:last-child {
  border-bottom: none;
}
.dest-item:hover {
  background: var(--portal-gold-light);
}
.dest-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pin-ico {
  width: 14px;
  height: 14px;
  color: var(--portal-gold);
  flex-shrink: 0;
}
.dest-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--portal-title-color);
}
.dest-subtitle {
  font-size: 10px;
  color: var(--portal-sub-color);
}
.dest-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dest-hotel-count {
  font-size: 10px;
  font-weight: 700;
  color: var(--portal-gold);
  background: var(--portal-gold-light);
  padding: 2px 6px;
  border-radius: 0;
}
.dest-code {
  font-size: 10px;
  font-family: monospace;
  color: var(--portal-sub-color);
}

/* Hotel-specific dropdown styles */
.dest-item-hotel {
  background: rgba(var(--portal-gold-rgb, 175, 130, 70), 0.04);
}
.dest-item-hotel:hover {
  background: rgba(var(--portal-gold-rgb, 175, 130, 70), 0.12);
}
.pin-ico-hotel {
  color: var(--portal-blue, #3b82f6);
}
.dest-type-badge {
  display: inline-block;
  background: var(--portal-blue, #3b82f6);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 0;
  margin-right: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.dest-group-header {
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--portal-sub-color);
  background: rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid var(--portal-card-border);
  display: flex;
  align-items: center;
  gap: 6px;
  position: sticky;
  top: 0;
  z-index: 2;
}
.dest-hotel-view-badge {
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: var(--portal-gold);
  padding: 2px 8px;
  border-radius: 2px;
}
.dest-stars {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  margin-left: 3px;
}
.dest-star-icon {
  width: 9px;
  height: 9px;
  color: #f59e0b;
  fill: #f59e0b;
}


/* Row 2: Dates */
.row-dates {
  align-items: flex-end;
}
.col-date {
  flex: 1;
}
.col-nuits {
  width: 120px;
}
.col-chambres {
  width: 120px;
}

.stepper-box {
  display: flex;
  align-items: center;
  border: 1px solid var(--portal-input-border);
  border-radius: 0;
  background: var(--portal-input-bg);
  height: 36px;
  box-sizing: border-box;
}
.stepper-btn {
  width: 32px;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--portal-sub-color);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.stepper-btn:hover {
  color: var(--portal-gold);
  background: var(--portal-gold-light);
}
.stepper-val {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--portal-input-text);
}

.rooms-input-box {
  display: flex;
  gap: 5px;
  align-items: center;
}
.rooms-val {
  height: 36px;
  flex: 1;
}
.add-room-gold-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--portal-gold);
  color: #111827;
  font-size: 18px;
  font-weight: 800;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.add-room-gold-btn:hover {
  background: var(--portal-gold-hover);
}

/* Flexible dates banner */
.flexible-dates-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
  margin-bottom: 8px;
  font-size: 11px;
}
.flex-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.flexible-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--portal-title-color);
  font-weight: 500;
  cursor: pointer;
}
.flex-clock-icon {
  width: 13px;
  height: 13px;
  color: var(--portal-gold);
}
.nouveau-badge {
  background: var(--portal-gold);
  color: #111827;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.configured-stay {
  font-size: 10px;
  color: var(--portal-sub-color);
}

/* Room card box */
.rooms-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.room-config-box {
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-box-border);
  border-radius: 0;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.room-title-col {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.room-title {
  color: var(--portal-gold);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
}
.remove-room-link {
  border: none;
  background: transparent;
  color: var(--portal-sub-color);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
}
.remove-room-link:hover {
  color: #ef4444;
}

.room-fields-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.room-field-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.field-micro-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--portal-label-color);
}
.room-select {
  padding: 5px 22px 5px 8px;
  font-size: 12px;
  border-radius: 0;
  border: 1px solid var(--portal-input-border);
  background: var(--portal-input-bg);
  color: var(--portal-input-text);
  outline: none;
  cursor: pointer;
}
.berceau-item {
  align-items: center;
}
.berceau-checkbox-wrap {
  padding-top: 4px;
}

.room-types-item {
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding-top: 12px;
}
.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--portal-title-color);
  cursor: pointer;
}

.custom-check,
.custom-radio {
  accent-color: var(--portal-gold);
  cursor: pointer;
}

.children-ages-panel {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 6px;
  border-top: 1px dashed var(--portal-box-border);
}
.ages-intro {
  font-size: 10px;
  font-weight: 700;
  color: var(--portal-sub-color);
}
.ages-chips-list {
  display: flex;
  gap: 8px;
}
.age-picker-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--portal-input-bg);
  border: 1px solid var(--portal-input-border);
  padding: 3px 8px;
  border-radius: 0;
}
.age-lbl {
  font-size: 9px;
  color: var(--portal-sub-color);
}
.age-select {
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  color: var(--portal-input-text);
  outline: none;
}

/* ══════════════════════════════════════════════════════════════════════
   OPTIONS AVANCÉES
══════════════════════════════════════════════════════════════════════ */
.advanced-options-container {
  border: 1px solid var(--portal-box-border);
  border-radius: 0;
  background: var(--portal-box-bg);
  margin-bottom: 20px;
  overflow: hidden;
}
.advanced-bar-header {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}
.adv-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sliders-icon {
  width: 14px;
  height: 14px;
  color: var(--portal-label-color);
}
.adv-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: var(--portal-label-color);
}
.adv-toggle-circle {
  width: 20px;
  height: 20px;
  border-radius: 0;
  border: 1px solid var(--portal-input-border);
  color: var(--portal-label-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.advanced-body {
  padding: 12px 14px 16px;
  border-top: 1px solid var(--portal-box-border);
}
.adv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 18px;
}
@media (max-width: 640px) {
  .adv-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
.adv-col {
  display: flex;
  flex-direction: column;
}
.adv-check-col {
  justify-content: flex-end;
  padding-bottom: 4px;
}
.adv-check-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--portal-title-color);
  cursor: pointer;
}

/* ══════════════════════════════════════════════════════════════════════
   SUBMIT BUTTON (RECHERCHER)
══════════════════════════════════════════════════════════════════════ */
.submit-row {
  display: flex;
  justify-content: center;
  padding-top: 4px;
}
.rechercher-gold-btn {
  background: var(--portal-gold);
  color: #111827;
  border: none;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 13px 56px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
@media (max-width: 640px) {
  .submit-row { padding-top: 8px; }
  .rechercher-gold-btn { width: 100%; padding: 14px 20px; font-size: 14px; }
}

.rechercher-gold-btn:hover:not(:disabled) {
  background: var(--portal-gold-hover);
  box-shadow: 0 4px 14px rgba(212, 160, 60, 0.4);
}
.rechercher-gold-btn.disabled,
.rechercher-gold-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #111827;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ══════════════════════════════════════════════════════════════════════
   RESULTS SECTION
══════════════════════════════════════════════════════════════════════ */
.results-container {
  margin-top: 36px;
}

/* Feedback states */
.feedback-card {
  max-width: 600px;
  margin: 30px auto;
  padding: 24px;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--portal-card-border);
  background: var(--portal-card-bg);
}
.error-card {
  border-color: rgba(239, 68, 68, 0.3);
}
.feedback-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.error-ico {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}
.empty-ico {
  background: var(--portal-gold-light);
  color: var(--portal-gold);
}
.feedback-icon svg {
  width: 22px;
  height: 22px;
}
.feedback-text h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--portal-title-color);
}
.feedback-text p {
  font-size: 12px;
  color: var(--portal-sub-color);
  margin: 0;
}
.retry-action-btn {
  margin-left: auto;
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 0;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* Results header bar */
.results-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 18px;
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  border-radius: 0;
  margin-bottom: 20px;
}
.summary-left {
  font-size: 13px;
  color: var(--portal-sub-color);
}
.count-highlight {
  font-size: 16px;
  font-weight: 900;
  color: var(--portal-gold);
}
.dest-highlight {
  font-weight: 800;
  color: var(--portal-title-color);
}
.dates-meta {
  font-size: 12px;
}
.summary-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sort-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--portal-label-color);
}
.sort-dropdown {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 0;
  border: 1px solid var(--portal-input-border);
  background: var(--portal-input-bg);
  color: var(--portal-input-text);
  outline: none;
  cursor: pointer;
}

/* Results layout */
.results-grid-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  align-items: start;
}

/* Sidebar */
.sidebar-filters {
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  border-radius: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-head {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--portal-label-color);
}
.stars-filter-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.star-filter-chip {
  text-align: left;
  padding: 5px 8px;
  font-size: 11px;
  border-radius: 0;
  border: 1px solid var(--portal-input-border);
  background: var(--portal-input-bg);
  color: var(--portal-sub-color);
  cursor: pointer;
  transition: all 0.15s;
}
.star-filter-chip:hover,
.star-filter-chip.active {
  background: var(--portal-gold);
  color: #111827;
  border-color: var(--portal-gold);
  font-weight: 700;
}
.reset-filters-link {
  border: none;
  background: transparent;
  color: var(--portal-gold);
  font-size: 11px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  padding-top: 6px;
}

/* Cards Grid */
.hotels-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.hotel-preview-card {
  background: var(--portal-card-bg);
  border: 1px solid var(--portal-card-border);
  border-radius: 0;
  overflow: hidden;
  box-shadow: var(--portal-shadow);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}
.hotel-preview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  border-color: var(--portal-gold);
}

.card-media {
  position: relative;
  width: 100%;
  height: 160px;
  background: #111827;
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.hotel-preview-card:hover .card-img {
  transform: scale(1.05);
}
.card-stars-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  padding: 3px 7px;
  border-radius: 0;
  color: #fbbf24;
  font-size: 11px;
  letter-spacing: 1px;
}
.dynamic-chip {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 0;
  text-transform: uppercase;
}

.card-details {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.card-hotel-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--portal-title-color);
  margin: 0 0 3px;
  line-height: 1.25;
}
.card-hotel-location {
  font-size: 11px;
  color: var(--portal-sub-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-pin {
  width: 12px;
  height: 12px;
  color: var(--portal-gold);
}

.card-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.board-tag,
.meal-tag,
.room-spec-tag {
  font-size: 9px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 0;
  text-transform: uppercase;
}
.board-tag {
  background: var(--portal-gold-light);
  color: var(--portal-gold);
}
.meal-tag {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.room-spec-tag {
  background: var(--portal-box-bg);
  border: 1px solid var(--portal-box-border);
  color: var(--portal-sub-color);
}

.card-action-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--portal-card-border);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.price-nights-sub {
  font-size: 9px;
  color: var(--portal-sub-color);
  display: block;
}
.price-amount-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.price-val {
  font-size: 17px;
  font-weight: 900;
  color: var(--portal-gold);
}
.price-currency {
  font-size: 11px;
  font-weight: 700;
  color: var(--portal-sub-color);
}
.view-deal-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--portal-gold);
  color: #111827;
  border: none;
  font-size: 11px;
  font-weight: 800;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.15s;
}
.view-deal-btn:hover {
  background: var(--portal-gold-hover);
}
.arrow-ico {
  width: 12px;
  height: 12px;
}

/* Skeletons */
.skeleton-card {
  pointer-events: none;
}
.skeleton-img {
  height: 160px;
  background: linear-gradient(90deg, #1f293d 25%, #2a3754 50%, #1f293d 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sk-line {
  height: 12px;
  border-radius: 0;
  background: linear-gradient(90deg, #1f293d 25%, #2a3754 50%, #1f293d 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.w-40 { width: 40%; }
.w-50 { width: 50%; }
.w-75 { width: 75%; }
.w-90 { width: 90%; }
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ══════════════════════════════════════════════════════════════════════
   RESPONSIVE QUERIES
══════════════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .portal-subbar {
    padding: 8px 0;
    overflow: hidden;
  }
  .portal-subbar-inner {
    padding: 0 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    min-width: 0;
    width: 100%;
    overflow: hidden;
  }
  .portal-nav-tabs {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    touch-action: pan-x !important;
    width: 100% !important;
    min-width: 0 !important;
    white-space: nowrap !important;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 4px;
    padding-top: 2px;
    gap: 8px;
  }
  .portal-nav-tabs::-webkit-scrollbar {
    display: none;
  }
  .tab-btn {
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    padding: 7px 12px;
    font-size: 10.5px;
  }
}

@media (max-width: 820px) {
  .results-grid-layout {
    grid-template-columns: 1fr;
  }
  .form-row-grid {
    flex-direction: column;
    align-items: stretch;
  }
  .col-geocodage,
  .col-km,
  .col-nuits,
  .col-chambres {
    width: 100%;
  }
  .adv-grid {
    grid-template-columns: 1fr;
  }
  .recent-searches-anchor {
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .recent-modal-backdrop {
    padding: 10px;
  }
  .recent-modal-container {
    width: 100%;
    max-height: 90vh;
  }
  .recent-modal-header {
    padding: 10px 12px;
    gap: 8px;
  }
  .modal-title-text {
    font-size: 12px;
  }
  .modal-subtitle-text {
    font-size: 10px;
  }
  .recent-modal-body {
    padding: 10px 12px;
  }
  .recent-card-item {
    padding: 10px 12px;
  }
  .recent-dest-name {
    font-size: 12px;
  }
  .btn-apply-recent {
    min-height: 36px;
    font-size: 10.5px;
  }
  .page-title-section {
    padding: 24px 14px 18px;
  }
  .page-title {
    font-size: 22px;
  }
  .page-subtitle {
    font-size: 12px;
  }
  .hero-stats-badges {
    gap: 6px;
    margin-top: 10px;
  }
  .hero-badge {
    font-size: 10px;
    padding: 4px 9px;
  }
  .search-form-card {
    padding: 14px 12px 18px;
  }
  .row-dates {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .row-dates .col-date,
  .row-dates .col-nuits,
  .row-dates .col-chambres {
    width: 100%;
  }
  .room-fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .room-fields-row .child-ages-group {
    grid-column: span 2;
  }
}

@media (max-width: 440px) {
  .room-fields-row {
    grid-template-columns: 1fr;
  }
  .room-fields-row .child-ages-group {
    grid-column: span 1;
  }
}
</style>
