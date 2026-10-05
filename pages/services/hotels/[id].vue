<template>
  <div
    class="hotel-detail-page"
    :class="{ 'dark-theme': isDark }"
    :style="{
      '--site-header-h': siteHeaderHeight + 'px',
      '--top-nav-h': topNavHeight + 'px'
    }"
  >
    <!-- ─── STICKY TOP NAV BAR (Retour aux résultats + Breadcrumbs) ─── -->
    <div ref="topNavWrapperRef" class="detail-sticky-nav-bar">
      <div class="detail-nav-inner">
        <button id="back-to-results-btn" class="nav-back-btn" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="nav-arrow">
            <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd"/>
          </svg>
          Retour aux résultats
        </button>

        <div class="breadcrumb-trail" v-if="hotel">
          <span class="bc-item" @click="navigateTo('/services/hotels')">Hôtels</span>
          <span class="bc-sep">/</span>
          <span class="bc-item">{{ hotel.hotel_city }}</span>
          <span class="bc-sep">/</span>
          <span class="bc-active">{{ hotel.hotel_name }}</span>
        </div>
      </div>
    </div>

    <div class="page-container">

      <!-- ─── Loading Skeleton ──────────────────────────────────────── -->
      <div v-if="loadingHotel" class="detail-skeleton">
        <div class="sk-hero-box"></div>
        <div class="sk-grid-split">
          <div class="sk-main-col">
            <div class="sk-card-line h-40"></div>
            <div class="sk-card-line h-120"></div>
            <div class="sk-card-line h-120"></div>
          </div>
          <div class="sk-side-col">
            <div class="sk-card-line h-200"></div>
          </div>
        </div>
      </div>

      <!-- ─── Main Content Layout ──────────────────────────────────── -->
      <div v-else-if="hotel" class="hotel-content-grid">

        <!-- ════════════ LEFT MAIN COLUMN ════════════ -->
        <main class="hotel-main-col">

          <!-- ── Hotel Header & Gallery Card ── -->
          <section class="hotel-hero-card" id="hotel-showcase">
            <div class="gallery-wrapper">
              <div class="main-image-viewport">
                <img
                  :src="activePhoto"
                  :alt="hotel.hotel_name"
                  class="hotel-primary-img"
                  @error="onImageError"
                />
                <div class="image-gradient-overlay"></div>

                <!-- Live Loading Indicator for Photos HD -->
                <div v-if="loadingOffersAndImages" class="gallery-live-loading-chip">
                  <span class="btn-spinner btn-spinner-xs"></span>
                  <span>Chargement des photos HD...</span>
                </div>

                <!-- Stars overlay -->
                <div class="hero-stars-badge" v-if="hotel.stars">
                  <span v-for="s in hotel.stars" :key="s" class="star-on">★</span>
                  <span v-for="s in (5 - hotel.stars)" :key="'off'+s" class="star-off">★</span>
                </div>

                <!-- Category badge -->
                <span class="hero-category-chip">Hôtel {{ hotel.stars }} étoiles</span>
              </div>

              <!-- Thumbnails row -->
              <div v-if="hotelPhotos.length > 1" class="gallery-thumbs-row">
                <button
                  v-for="(photo, pIdx) in hotelPhotos.slice(0, 5)"
                  :key="pIdx"
                  type="button"
                  class="thumb-btn"
                  :class="{ active: activePhoto === photo }"
                  @click="activePhoto = photo"
                >
                  <img :src="photo" :alt="`Photo ${pIdx + 1}`" class="thumb-img" @error="onThumbError($event, pIdx)" />
                </button>
              </div>
            </div>

            <!-- Hotel Identity & Location -->
            <div class="hotel-info-block">
              <div class="hotel-name-row">
                <div>
                  <h1 class="hotel-heading">{{ hotel.hotel_name }}</h1>
                  <p class="hotel-address-line">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="pin-icon">
                      <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ hotel.address || hotel.hotel_city }}</span>
                  </p>
                </div>
              </div>

              <!-- Highlight Facilities Chips -->
              <div class="hotel-highlights-chips">
                <span class="highlight-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="chip-svg"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/></svg>
                  Confirmation certifiée Netstorming
                </span>
                <span class="highlight-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="chip-svg"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
                  Wi-Fi gratuit
                </span>
                <span class="highlight-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="chip-svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd"/></svg>
                  Réception 24h/24
                </span>
                <span class="highlight-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="chip-svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Climatisation
                </span>
              </div>
            </div>
          </section>

          <!-- ── AVAILABLE ROOMS & OFFERS (CHAMBRES & OFFRES DISPONIBLES) ── -->
          <section class="section-card" id="rooms-and-offers-section">
            <div class="section-card-head">
              <div class="head-left">
                <div class="head-icon gold-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"/>
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="head-title">Chambres &amp; Offres Disponibles</h2>
                  <p class="head-sub">
                    Sélectionnez votre type de chambre pour vos dates ({{ hotelStore.nights }} nuits, {{ hotelStore.searchForm.check_in }} → {{ hotelStore.searchForm.check_out }})
                  </p>
                </div>
              </div>

              <div class="room-offers-count">
                <span class="count-badge" v-if="!loadingOffersAndImages">{{ availableAgreements.length }} offre(s)</span>
                <span class="count-badge count-loading" v-else>
                  <span class="btn-spinner btn-spinner-xs"></span> Recherche...
                </span>
              </div>
            </div>

            <!-- Live Loading Feedback Banner for Offers & Photos -->
            <div v-if="loadingOffersAndImages" class="offers-live-feedback-box">
              <div class="feedback-pulse-spinner">
                <span class="btn-spinner btn-spinner-md"></span>
              </div>
              <div class="feedback-text-wrap">
                <h4 class="feedback-main-title">Interrogation des offres en temps réel...</h4>
                <p class="feedback-main-sub">
                  Vérification en direct auprès de la passerelle Netstorming pour récupérer toutes les formules de chambres, options repas et tarifs actualisés.
                </p>
              </div>
            </div>

            <!-- Verified Live Badge when loaded -->
            <div v-else-if="availableAgreements.length > 0" class="offers-live-verified-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 verified-check-icon">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/>
              </svg>
              <span>{{ availableAgreements.length }} formule(s) vérifiée(s) en direct avec confirmation immédiate.</span>
            </div>

            <!-- Offers Filter & Sort Bar -->
            <div class="offers-filter-bar">
              <div class="filter-pills-group">
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ active: offersFilter === 'all' }"
                  @click="offersFilter = 'all'"
                >
                  Toutes les offres ({{ availableAgreements.length }})
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ active: offersFilter === 'breakfast' }"
                  @click="offersFilter = 'breakfast'"
                >
                  🥐 Avec Petit-déjeuner
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ active: offersFilter === 'refundable' }"
                  @click="offersFilter = 'refundable'"
                >
                  ✓ Annulation Gratuite
                </button>
              </div>

              <!-- Orders Selection List with Pricing -->
              <div class="offers-sort-wrap">
                <label for="offers-sort-select" class="offers-sort-label">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="sort-icon">
                    <path fill-rule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clip-rule="evenodd" />
                  </svg>
                  Trier par :
                </label>
                <select id="offers-sort-select" v-model="offersSortOrder" class="offers-sort-select">
                  <option value="price_asc">Prix : du moins cher au plus cher (DZD ↑)</option>
                  <option value="price_desc">Prix : du plus cher au moins cher (DZD ↓)</option>
                  <option value="name_asc">Type de chambre (A - Z)</option>
                </select>
              </div>
            </div>

            <!-- List of Room Offers -->
            <div class="room-offers-list">
              <!-- Skeletons while offers are loading and none are displayed yet -->
              <div v-if="loadingOffersAndImages && filteredAgreements.length === 0" class="room-offers-skeleton-group">
                <div v-for="sk in 3" :key="sk" class="room-offer-card room-offer-skeleton-card">
                  <div class="sk-body">
                    <div class="sk-line w-60 h-20"></div>
                    <div class="sk-line w-40 h-14"></div>
                    <div class="sk-line w-80 h-14"></div>
                  </div>
                  <div class="sk-side">
                    <div class="sk-line w-50 h-28"></div>
                    <div class="sk-line w-80 h-36"></div>
                  </div>
                </div>
              </div>

              <div
                v-for="(agreement, agIdx) in filteredAgreements"
                :key="agreement.agreement_id || agIdx"
                :id="`room-offer-${agIdx}`"
                class="room-offer-card"
                :class="{
                  'selected-offer': selectedAgreement?.agreement_id === agreement.agreement_id
                }"
              >
                <!-- Room Card Header / Main Info -->
                <div class="room-card-content">

                  <!-- Room Details Left -->
                  <div class="room-info-col">
                    <div class="room-type-title">
                      <h3>{{ agreement.room_type || hotel.room_basis_name || 'Chambre Standard' }}</h3>
                      <span v-if="selectedAgreement?.agreement_id === agreement.agreement_id" class="current-selected-badge">
                        Offre choisie
                      </span>
                    </div>

                    <div class="room-features-meta">
                      <span class="meta-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="meta-ico"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"/></svg>
                        {{ hotelStore.searchForm.adults || 2 }} Adulte(s)
                      </span>
                      <span class="meta-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="meta-ico"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/></svg>
                        Salle de bain privée
                      </span>
                      <span class="meta-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="meta-ico"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
                        Wi-Fi Gratuit
                      </span>
                    </div>

                    <!-- Meal plan & Refund conditions -->
                    <div class="room-perks-row">
                      <div class="perk-item" :class="agreement.room_basis === 'RO' ? 'perk-muted' : 'perk-green'">
                        <span class="perk-bullet">●</span>
                        <strong>{{ roomBasisLabel(agreement.room_basis) }}</strong>
                        <span v-if="agreement.meal_basis && agreement.meal_basis !== 'X'" class="meal-sub">
                          ({{ mealBasisLabel(agreement.meal_basis) }})
                        </span>
                      </div>

                      <!-- Cancellation deadline -->
                      <div class="perk-item" :class="agreement.is_fully_refundable ? 'perk-green' : 'perk-amber'">
                        <span class="perk-bullet">●</span>
                        <span v-if="agreement.is_fully_refundable && agreement.deadline">
                          Annulation <strong>GRATUITE</strong> jusqu'au {{ formatDate(agreement.deadline) }}
                        </span>
                        <span v-else-if="agreement.is_fully_refundable">
                          Annulation <strong>GRATUITE</strong>
                        </span>
                        <span v-else>
                          Tarif non-remboursable
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Price & Action Column Right -->
                  <div class="room-price-col">
                    <div class="pricing-display">
                      <span class="pricing-duration">{{ hotelStore.nights }} nuit(s) pour {{ hotelStore.searchForm.adults || 2 }} personne(s)</span>
                      <div class="pricing-figures">
                        <span class="amount-num">{{ formatPrice(agreement.final_price_dzd || agreement.raw_price) }}</span>
                        <span class="amount-curr">DZD</span>
                      </div>
                      <span class="per-night-estimate">
                        ~ {{ formatPrice(Math.round((agreement.final_price_dzd || agreement.raw_price) / (hotelStore.nights || 1))) }} DZD / nuit
                      </span>
                      <span class="taxes-included">Taxes et frais inclus</span>
                      <template v-if="agreement.net_price_dzd != null">
                        <button type="button" class="net-toggle-btn" @click="toggleNet(agreement.agreement_id)">Net</button>
                        <span v-if="netVisible[agreement.agreement_id]" class="net-value">{{ formatPrice(agreement.net_price_dzd) }} DZD</span>
                      </template>
                    </div>

                    <button
                      type="button"
                      class="select-offer-btn"
                      :class="{ 'btn-selected': selectedAgreement?.agreement_id === agreement.agreement_id }"
                      @click="chooseAgreement(agreement)"
                    >
                      <span v-if="selectedAgreement?.agreement_id === agreement.agreement_id" class="btn-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="check-ico"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                        Offre sélectionnée
                      </span>
                      <span v-else class="btn-flex">
                        Choisir cette chambre
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="arrow-ico"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/></svg>
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ── Modal Popin : Coordonnées des Voyageurs ── -->
          <Teleport to="body">
            <Transition name="modal-fade">
              <div
                v-if="showBookingForm"
                class="passenger-modal-backdrop hotel-detail-page"
                :class="{ 'dark-theme': isDark }"
                @click.self="showBookingForm = false"
              >
                <div class="passenger-modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-pax-title">

                  <!-- Modal Header -->
                  <div class="passenger-modal-header">
                    <div class="modal-header-left">
                      <div class="modal-header-icon user-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <h2 id="modal-pax-title" class="modal-title-text">Coordonnées des Voyageurs</h2>
                        <p class="modal-subtitle-text">Veuillez renseigner les noms et prénoms tels qu'indiqués sur les pièces d'identité</p>
                      </div>
                    </div>

                    <div class="modal-header-right">
                      <button
                        type="button"
                        class="modal-close-btn"
                        @click="showBookingForm = false"
                        title="Fermer la fenêtre"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Mini Booking Recap Ribbon in Modal -->
                  <div class="modal-booking-recap-ribbon">
                    <div class="ribbon-item">
                      <span class="ribbon-label">Hôtel :</span>
                      <strong class="ribbon-val">{{ hotel?.hotel_name }}</strong>
                    </div>
                    <div class="ribbon-item">
                      <span class="ribbon-label">Chambre :</span>
                      <strong class="ribbon-val">{{ selectedAgreement?.room_type || 'Chambre Standard' }}</strong>
                    </div>
                    <div class="ribbon-item">
                      <span class="ribbon-label">Séjour :</span>
                      <strong class="ribbon-val">{{ formatDate(hotelStore.searchForm.check_in) }} → {{ formatDate(hotelStore.searchForm.check_out) }} ({{ hotelStore.nights }} nuits)</strong>
                    </div>
                    <div class="ribbon-item ribbon-price">
                      <span class="ribbon-label">Total :</span>
                      <strong class="ribbon-price-val">{{ formatPrice(currentPrice) }} DZD</strong>
                    </div>
                  </div>

                  <!-- Modal Body -->
                  <div class="passenger-modal-body">
                    <div class="passengers-form-body">
                      <!-- ── GUEST CHECKOUT OR AUTH BANNER ── -->
                      <div v-if="!authStore.isLoggedIn" class="guest-checkout-banner">
                        <div class="guest-banner-hdr">
                          <div class="guest-badge-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"/>
                            </svg>
                          </div>
                          <div class="guest-banner-text">
                            <div class="guest-banner-title">
                              <span>Réservation en Mode Invité</span>
                              <span class="guest-quick-tag">Sans connexion requise</span>
                            </div>
                            <p class="guest-banner-sub">
                              Renseignez vos coordonnées directes ci-dessous. Le bon d'échange officiel (voucher) et le reçu vous seront envoyés par e-mail et SMS dès confirmation.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div v-else class="auth-user-pill">
                        <span class="auth-dot"></span>
                        <span class="auth-text">Connecté en tant que : <strong>{{ authStore.User?.name || 'Client' }}</strong> ({{ authStore.User?.email }})</span>
                        <span v-if="authStore.isBusiness" class="b2b-flag">Compte Agence B2B</span>
                      </div>

                      <!-- ── PASSENGERS LIST ── -->
                      <div v-for="(pax, pIdx) in paxList" :key="pIdx" class="pax-card-box">
                        <div class="pax-head-row">
                          <span class="pax-role-badge" :class="pax.type === 'adult' ? 'adult-role' : 'child-role'">
                            {{ pax.type === 'adult' ? 'Voyageur Adulte' : 'Enfant' }} {{ pIdx + 1 }}
                          </span>
                          <span v-if="pIdx === 0" class="lead-flag">⭐ Responsable de la réservation (Titulaire)</span>
                          <span v-if="pax.type === 'child'" class="child-age-flag">{{ pax.age }} ans</span>
                        </div>

                        <div class="pax-inputs-grid">
                          <div class="input-item col-title">
                            <label :for="`title-${pIdx}`" class="input-lbl">Titre <span class="req">*</span></label>
                            <select :id="`title-${pIdx}`" v-model="pax.title" class="form-select-ctrl">
                              <option value="MR">M. (MR)</option>
                              <option value="MS">Mme (MS)</option>
                              <option value="MRS">Mme (MRS)</option>
                              <option value="MISS">Mlle (MISS)</option>
                            </select>
                          </div>

                          <div class="input-item col-name">
                            <label :for="`first-name-${pIdx}`" class="input-lbl">Prénom <span class="req">*</span></label>
                            <input
                              :id="`first-name-${pIdx}`"
                              v-model="pax.name"
                              type="text"
                              class="form-input-ctrl uppercase"
                              placeholder="Ex: MOHAMED"
                            />
                          </div>

                          <div class="input-item col-surname">
                            <label :for="`last-name-${pIdx}`" class="input-lbl">Nom de famille <span class="req">*</span></label>
                            <input
                              :id="`last-name-${pIdx}`"
                              v-model="pax.surname"
                              type="text"
                              class="form-input-ctrl uppercase"
                              placeholder="Ex: BENALI"
                            />
                          </div>

                          <!-- Email for lead pax -->
                          <div v-if="pIdx === 0" class="input-item col-email">
                            <label for="lead-email" class="input-lbl">Email de confirmation &amp; Voucher <span class="req">*</span></label>
                            <input
                              id="lead-email"
                              v-model="pax.email"
                              type="email"
                              class="form-input-ctrl"
                              placeholder="client@email.com"
                            />
                          </div>

                          <!-- Phone for lead pax -->
                          <div v-if="pIdx === 0" class="input-item col-phone">
                            <label for="lead-phone" class="input-lbl">Téléphone de contact (SMS / Appel) <span class="req">*</span></label>
                            <input
                              id="lead-phone"
                              v-model="pax.phone"
                              type="tel"
                              class="form-input-ctrl"
                              placeholder="+213 550 00 00 00"
                            />
                          </div>

                          <!-- Child Age input (mandatory for child pax) -->
                          <div v-if="pax.type === 'child'" class="input-item col-age">
                            <label :for="`child-age-${pIdx}`" class="input-lbl">Âge de l'enfant <span class="req">*</span></label>
                            <select :id="`child-age-${pIdx}`" v-model.number="pax.age" class="form-select-ctrl">
                              <option v-for="a in 18" :key="a - 1" :value="a - 1">{{ a - 1 }} ans</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <!-- Special Remarks -->
                      <div class="remarks-box">
                        <label class="remarks-heading">Demandes spéciales &amp; Préférences (Optionnel)</label>
                        <div class="remarks-chips-grid">
                          <label v-for="r in remarksList" :key="r.code" class="remark-pill-checkbox">
                            <input type="checkbox" :value="r.code" v-model="selectedRemarks" class="custom-check" />
                            <span>{{ r.label }}</span>
                          </label>
                        </div>
                      </div>

                      <!-- ── MODE DE PAIEMENT SÉCURISÉ ── -->
                      <div class="payment-method-section">
                        <div class="section-subheading-row">
                          <span class="section-subheading-icon">💳</span>
                          <span class="section-subheading-title">Mode de Règlement &amp; Confirmation</span>
                        </div>

                        <div class="payment-options-grid">
                          <!-- OPTION 1: SATIM / CIB / Edahabia (Automatic Instant Confirmation) -->
                          <label
                            class="pay-method-card"
                            :class="{ active: selectedPaymentMethod === 'satim' }"
                          >
                            <input
                              type="radio"
                              value="satim"
                              v-model="selectedPaymentMethod"
                              name="hotel_payment_choice"
                              class="pay-radio"
                            />
                            <div class="pay-method-content">
                              <div class="pay-method-top">
                                <div class="pay-badges-row">
                                  <span class="pay-badge-auto">⚡ Confirmation Automatique</span>
                                  <span class="pay-brand-tag">CIB • EDAHABIA</span>
                                </div>
                                <span class="pay-title">Carte CIB / Edahabia (SATIM)</span>
                              </div>
                              <p class="pay-desc">
                                Paiement en ligne sécurisé 3D-Secure. Dès validation du paiement, votre réservation est <strong>instantanément confirmée et transmise à Netstorming / MyGo</strong>.
                              </p>
                            </div>
                          </label>

                          <!-- OPTION 2: BaridiMob / CCP (Manual Admin Confirmation) -->
                          <label
                            class="pay-method-card"
                            :class="{ active: selectedPaymentMethod === 'baridimob' }"
                          >
                            <input
                              type="radio"
                              value="baridimob"
                              v-model="selectedPaymentMethod"
                              name="hotel_payment_choice"
                              class="pay-radio"
                            />
                            <div class="pay-method-content">
                              <div class="pay-method-top">
                                <div class="pay-badges-row">
                                  <span class="pay-badge-manual">📬 Validation par l'Admin</span>
                                  <span class="pay-brand-tag">BARIDIMOB • CCP</span>
                                </div>
                                <span class="pay-title">Virement BaridiMob / CCP</span>
                              </div>
                              <p class="pay-desc">
                                Effectuez le versement sur le compte de l'agence et envoyez le reçu. Dès validation par l'administration, la réservation est <strong>automatiquement envoyée et confirmée sur Netstorming / MyGo</strong>.
                              </p>
                            </div>
                          </label>

                          <!-- OPTION 3: B2B Agency Wallet (Instant NET deduction) -->
                          <label
                            v-if="canPayWithWallet"
                            class="pay-method-card"
                            :class="{ active: selectedPaymentMethod === 'wallet' }"
                          >
                            <input
                              type="radio"
                              value="wallet"
                              v-model="selectedPaymentMethod"
                              name="hotel_payment_choice"
                              class="pay-radio"
                            />
                            <div class="pay-method-content">
                              <div class="pay-method-top">
                                <div class="pay-badges-row">
                                  <span class="pay-badge-wallet">💼 Solde Portefeuille</span>
                                  <span class="pay-brand-tag">{{ formatPrice(authStore.User?.account_balance || 0) }} DZD</span>
                                </div>
                                <span class="pay-title">Débit Direct du Portefeuille Agence B2B</span>
                              </div>
                              <p class="pay-desc">
                                Déduction immédiate du montant NET du solde de votre compte agence. Confirmation instantanée transmise à Netstorming.
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <!-- Booking Error Banner -->
                      <div v-if="hotelStore.bookingError" class="booking-fail-banner">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="err-ico"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        <span>{{ hotelStore.bookingError }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Modal Footer Actions -->
                  <div class="passenger-modal-footer">
                    <button
                      type="button"
                      class="modal-cancel-btn"
                      @click="showBookingForm = false"
                    >
                      Annuler
                    </button>

                    <button
                      id="final-booking-confirm-btn"
                      type="button"
                      class="final-booking-btn"
                      :class="{ loading: hotelStore.loadingBooking, disabled: !paxFormValid }"
                      :disabled="!paxFormValid || hotelStore.loadingBooking"
                      @click="submitBookingOrder"
                    >
                      <span v-if="hotelStore.loadingBooking" class="btn-spinner"></span>
                      <span class="btn-txt">
                        <template v-if="hotelStore.loadingBooking">
                          TRAITEMENT EN COURS...
                        </template>
                        <template v-else-if="selectedPaymentMethod === 'satim'">
                          RÉGLER PAR CARTE CIB / EDAHABIA ({{ formatPrice(currentPrice) }} DZD) →
                        </template>
                        <template v-else-if="selectedPaymentMethod === 'baridimob'">
                          TRANSMETTRE LE REÇU BARIDIMOB / CCP →
                        </template>
                        <template v-else>
                          CONFIRMER VIA PORTEFEUILLE ({{ formatPrice(currentPrice) }} DZD)
                        </template>
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            </Transition>
          </Teleport>

          <!-- ── Booking Confirmation Success ──────────────────────── -->
          <section v-if="hotelStore.bookingConfirmation" class="section-card success-card" id="booking-confirmed-card">
            <div class="success-icon-wrap">🎉</div>
            <h2 class="success-title">Réservation Confirmée avec Succès !</h2>
            <p class="success-sub">Votre réservation d'hôtel a été validée par la passerelle officielle Netstorming.</p>

            <div class="reference-code-box">
              <span class="ref-title">RÉFÉRENCE OFFICIELLE DE RÉSERVATION</span>
              <span class="ref-code">{{ hotelStore.bookingConfirmation.reference || hotelStore.bookingConfirmation.ns_booking_reference }}</span>
            </div>

            <div class="success-actions">
              <button class="orders-btn" @click="navigateTo('/client/orders?tab=hotels')">
                Accéder à mes réservations &amp; Vouchers
              </button>
            </div>
          </section>

        </main>

        <!-- ════════════ RIGHT STICKY SIDEBAR ════════════ -->
        <aside class="hotel-sidebar-col">
          <div class="sticky-summary-card">
            <div class="summary-head">
              <span class="summary-title">Récapitulatif du Séjour</span>
            </div>

            <div class="summary-hotel-mini">
              <img
                :src="activePhoto"
                :alt="hotel.hotel_name"
                class="mini-hotel-thumb"
                @error="onImageError"
              />
              <div class="mini-hotel-details">
                <h4 class="mini-hotel-name">{{ hotel.hotel_name }}</h4>
                <div class="mini-stars">
                  <span v-for="s in hotel.stars" :key="s">★</span>
                </div>
                <span class="mini-city">{{ hotel.hotel_city }}</span>
              </div>
            </div>

            <!-- ── DISPONIBILITÉ & PRIX CONFIRMÉS (NETSTORMING) ── -->
            <div v-if="selectedAgreement" class="sb-verified-card">
              <div class="sb-verified-header">
                <div class="sb-check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="sb-verified-titles">
                  <h4 class="sb-verified-title">Disponibilité &amp; Prix Confirmés</h4>
                  <p class="sb-verified-sub">Tarif et conditions vérifiés en temps réel auprès de Netstorming</p>
                </div>
              </div>

              <div class="sb-avail-banner">
                <span class="sb-green-check">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:14px;height:14px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                </span>

                <span class="sb-avail-text">
                  Chambre disponible immédiatement à la réservation au tarif de <strong>{{ formatPrice(currentPrice) }} DZD</strong>.
                </span>
              </div>

              <div class="sb-cancellation-block">
                <div class="sb-cancel-title-row">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="sb-cancel-ico">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd"/>
                  </svg>
                  <span class="sb-cancel-label">Politique d'annulation</span>
                </div>
                <p v-if="selectedAgreement?.is_fully_refundable !== false" class="sb-cancel-desc">
                  Annulation sans frais garantie jusqu'au : <strong>{{ cancellationDeadlineFormatted }}</strong>. Au-delà de cette date, les pénalités contractuelles de l'hôtelier s'appliquent.
                </p>
                <p v-else class="sb-cancel-desc">
                  Tarif non-remboursable. En cas d'annulation ou de non-présentation, la totalité du séjour sera retenue.
                </p>
              </div>
            </div>

            <div class="summary-key-values">
              <div class="kv-row">
                <span class="kv-lbl">Dates de séjour</span>
                <span class="kv-val">{{ formatDate(hotelStore.searchForm.check_in) }} → {{ formatDate(hotelStore.searchForm.check_out) }}</span>
              </div>
              <div class="kv-row">
                <span class="kv-lbl">Durée</span>
                <span class="kv-val">{{ hotelStore.nights }} nuit(s)</span>
              </div>
              <div class="kv-row">
                <span class="kv-lbl">Voyageurs</span>
                <span class="kv-val">{{ hotelStore.searchForm.adults || 2 }} Adulte(s) <span v-if="hotelStore.searchForm.children">, {{ hotelStore.searchForm.children }} enfant(s)</span></span>
              </div>
              <div class="kv-row">
                <span class="kv-lbl">Offre sélectionnée</span>
                <span class="kv-val highlight-val">{{ selectedAgreement?.room_type || hotel.room_basis_name || 'Chambre Standard' }}</span>
              </div>
              <div class="kv-row">
                <span class="kv-lbl">Régime repas</span>
                <span class="kv-val">{{ roomBasisLabel(selectedAgreement?.room_basis || hotel.room_basis_code) }}</span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="summary-price-box">
              <div class="price-row-total">
                <span class="total-lbl">Prix Total</span>
                <div class="total-figures">
                  <span class="total-amt">{{ formatPrice(currentPrice) }}</span>
                  <span class="total-cur">DZD</span>
                </div>
              </div>
              <span class="taxes-notice">Paiement sécurisé · Confirmation officielle</span>
            </div>

            <!-- Primary Action Button -->
            <div class="summary-cta-wrap">
              <button
                v-if="!hotelStore.bookingConfirmation"
                id="sidebar-book-btn"
                type="button"
                class="sidebar-action-gold-btn"
                :class="{ loading: hotelStore.loadingEvaluation }"
                @click="openPassengerForm"
              >
                <span v-if="hotelStore.loadingEvaluation" class="btn-spinner"></span>
                <span>{{ hotelStore.loadingEvaluation ? 'VÉRIFICATION EN COURS...' : 'SAISIR LES COORDONNÉES DES VOYAGEURS' }}</span>
              </button>
            </div>

            <div class="security-trust-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="lock-svg"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/></svg>
              <span>Voucher officiel et confirmation garantie par Bouazize Travel</span>
            </div>

          </div>
        </aside>

      </div><!-- /hotel-content-grid -->

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHotelStore } from '~/stores/hotel';
import { useAuthStore } from '~/stores/auth';
import { fetchHotelDetails } from '~/services/hotel';
import { useDark } from '@vueuse/core';
import { resolveHotelImage, resolveHotelGallery, onHotelImageError } from '~/composables/useHotelImages';

const route      = useRoute();
const router     = useRouter();
const hotelStore = useHotelStore();
const authStore  = useAuthStore();
const isDark     = useDark();

const selectedPaymentMethod = ref('satim'); // 'satim' | 'baridimob' | 'wallet'
const guestInfo             = ref({ name: '', email: '', phone: '' });

const canPayWithWallet = computed(() => {
  return authStore.isLoggedIn && (
    authStore.isBusiness ||
    authStore.isAdmin ||
    (Number(authStore.User?.account_balance || 0) >= Number(currentPrice.value || 0))
  );
});

// ── Sticky Header & Subbar Heights (for dynamic scroll-pinning) ──────
const siteHeaderHeight = ref(76);
const topNavWrapperRef = ref(null);
const topNavHeight     = ref(52);

const updateStickyHeights = () => {
  if (typeof window === 'undefined') return;
  const siteHdr = document.getElementById('site-global-header') || document.querySelector('header.sticky') || document.querySelector('header');
  if (siteHdr) {
    siteHeaderHeight.value = siteHdr.offsetHeight || 76;
  }
  if (topNavWrapperRef.value) {
    topNavHeight.value = topNavWrapperRef.value.offsetHeight || 52;
  }
};

// ── State ──────────────────────────────────────────────────────────────
const loadingHotel          = ref(true);
const loadingOffersAndImages = ref(true);
const hotel                 = ref(null);
const selectedAgreement     = ref(null);
const netVisible = ref({});
const toggleNet = (id) => { netVisible.value = { ...netVisible.value, [id]: !netVisible.value[id] }; };
const evaluation        = ref(null);
const showBookingForm   = ref(false);
const offersFilter      = ref('all');
const offersSortOrder   = ref('price_asc');
const activePhoto       = ref('');
const hotelPhotos       = ref([]);
const paxList           = ref([]);
const selectedRemarks   = ref([]);

const starFallbackPhotos = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  '/images/services/hotels.jpg',
];

const remarksList = [
  { code: 'NSR', label: 'Chambre non-fumeur' },
  { code: 'BK',  label: 'Grand lit double (King size)' },
  { code: 'TWN', label: 'Lits jumeaux (Twin beds)' },
  { code: 'RH',  label: 'Étage élevé' },
  { code: 'RL',  label: 'Étage inférieur' },
  { code: 'HM',  label: 'Voyage de noces' },
];

function getDefaultCheckIn() {
  const d = new Date();
  d.setDate(d.getDate() + 10);
  return d.toISOString().split('T')[0];
}

function getDefaultCheckOut() {
  const d = new Date();
  d.setDate(d.getDate() + 12);
  return d.toISOString().split('T')[0];
}

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(async () => {
  const hotelId = String(route.params.id);

  // 1. Instant Cache Hydration: Check Store, SessionStorage, LocalStorage
  let cached = null;
  if (hotelStore.selectedHotel && String(hotelStore.selectedHotel.hotel_code) === hotelId) {
    cached = hotelStore.selectedHotel;
  } else if (hotelStore.searchResults?.hotels?.length) {
    cached = hotelStore.searchResults.hotels.find(h => String(h.hotel_code) === hotelId);
  }
  if (!cached && typeof sessionStorage !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('current_hotel_' + hotelId);
      if (raw) cached = JSON.parse(raw);
    } catch {}
  }
  if (!cached && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('current_hotel_' + hotelId);
      if (raw) cached = JSON.parse(raw);
    } catch {}
  }

  if (cached) {
    hotel.value = cached;
    hotelStore.selectedHotel = cached;
    initPhotos(cached);
    initAgreement(cached);
    loadingHotel.value = false;
  }

  // 2. Resolve search criteria
  const checkIn  = hotelStore.searchForm.check_in || route.query.check_in || getDefaultCheckIn();
  const checkOut = hotelStore.searchForm.check_out || route.query.check_out || getDefaultCheckOut();
  const adults   = Number(hotelStore.searchForm.adults || route.query.adults || 2);
  const children = Number(hotelStore.searchForm.children || route.query.children || 0);
  const sessId   = String(route.query.session || hotelStore.searchResults.session_id || cached?.session_id || '');

  hotelStore.searchForm.check_in  = checkIn;
  hotelStore.searchForm.check_out = checkOut;
  hotelStore.searchForm.adults    = adults;
  hotelStore.searchForm.children  = children;

  // 3. Fetch full hotel static details AND live room agreements
  loadingOffersAndImages.value = true;
  try {
    const res = await fetchHotelDetails(hotelId, {
      check_in: checkIn,
      check_out: checkOut,
      adults,
      children,
      session_id: sessId,
    });
    const details = res?.data;
    if (details) {
      const mergedAgreements = details.agreements?.length
        ? details.agreements
        : (hotel.value?.agreements?.length ? hotel.value.agreements : []);

      hotel.value = {
        hotel_code: details.hotel_id || hotelId,
        hotel_name: details.name || hotel.value?.hotel_name || ('Hôtel ' + hotelId),
        address: details.address || hotel.value?.address || '',
        hotel_city: details.city || hotel.value?.hotel_city || '',
        stars: details.stars || hotel.value?.stars || 3,
        description: details.description || hotel.value?.description || '',
        pictures: details.pictures?.length ? details.pictures : (hotel.value?.pictures || []),
        agreements: mergedAgreements,
        session_id: details.session_id || sessId || hotel.value?.session_id,
        lowest_price_dzd: details.lowest_price_dzd || hotel.value?.lowest_price_dzd || 0,
      };

      hotelStore.selectedHotel = hotel.value;
      try {
        sessionStorage.setItem('current_hotel_' + hotelId, JSON.stringify(hotel.value));
      } catch {}

      initPhotos(hotel.value);
      initAgreement(hotel.value);
    }
  } catch (err) {
    console.warn('Could not load live hotel offers:', err);
  } finally {
    loadingOffersAndImages.value = false;
  }

  // 4. Ensure agreement & photos are initialized even if network failed
  if (hotel.value) {
    initPhotos(hotel.value);
    initAgreement(hotel.value);
  } else {
    // Fallback minimal hotel
    hotel.value = {
      hotel_code: hotelId,
      hotel_name: 'Hôtel ' + hotelId,
      address: '',
      hotel_city: '',
      stars: 3,
      agreements: [],
      lowest_price_dzd: 34140,
    };
    initPhotos(hotel.value);
    initAgreement(hotel.value);
  }

  buildPassengers();
  loadingHotel.value = false;

  nextTick(() => {
    updateStickyHeights();
  });
  setTimeout(updateStickyHeights, 60);
  window.addEventListener('resize', updateStickyHeights);

  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateStickyHeights();
    });
    if (topNavWrapperRef.value) {
      resizeObserver.observe(topNavWrapperRef.value);
    }
    const siteHdr = document.getElementById('site-global-header') || document.querySelector('header');
    if (siteHdr) {
      resizeObserver.observe(siteHdr);
    }
  }

  const handleKeydown = (e) => {
    if (e.key === 'Escape' && showBookingForm.value) {
      showBookingForm.value = false;
    }
  };
  window.addEventListener('keydown', handleKeydown);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', updateStickyHeights);
    if (resizeObserver) resizeObserver.disconnect();
  });
});

function initPhotos(h) {
  hotelPhotos.value = resolveHotelGallery(h);
  activePhoto.value = hotelPhotos.value[0] || resolveHotelImage(h);
}

function initAgreement(h) {
  if (h?.agreements?.length) {
    const reqRoom = route.query.room;
    // Sort agreements ascending by price by default (lowest to highest)
    const sorted = [...h.agreements].sort((a, b) => {
      const pA = Number(a.final_price_dzd || a.raw_price || 0);
      const pB = Number(b.final_price_dzd || b.raw_price || 0);
      return pA - pB;
    });
    const match = reqRoom ? sorted.find(a => a.agreement_id === reqRoom) : null;
    selectedAgreement.value = match || sorted[0];
  } else if (!selectedAgreement.value) {
    selectedAgreement.value = {
      agreement_id: route.query.room || h?.room_code || ('AG-' + (h?.hotel_code || '1')),
      room_type: h?.room_basis_name || 'Twin Room With Shared Bathroom',
      room_basis: h?.room_basis_code || 'RO',
      meal_basis: h?.meal_basis_code || 'X',
      final_price_dzd: h?.final_price_dzd || h?.lowest_price_dzd || 17399,
      is_fully_refundable: true,
      deadline: '2026-10-01',
    };
    if (h && (!h.agreements || !h.agreements.length)) {
      h.agreements = [selectedAgreement.value];
    }
  }
}

// ── Computed ───────────────────────────────────────────────────────────
const availableAgreements = computed(() => {
  return hotel.value?.agreements?.length ? hotel.value.agreements : (selectedAgreement.value ? [selectedAgreement.value] : []);
});

const filteredAgreements = computed(() => {
  let list = [...availableAgreements.value];

  // Filters
  if (offersFilter.value === 'breakfast') {
    list = list.filter(a => a.room_basis === 'RB' || a.meal_basis !== 'X');
  } else if (offersFilter.value === 'refundable') {
    list = list.filter(a => a.is_fully_refundable);
  }

  // Sorting: Default 'price_asc' (from lower to greater)
  if (offersSortOrder.value === 'price_asc') {
    list.sort((a, b) => {
      const pA = Number(a.final_price_dzd || a.raw_price || 0);
      const pB = Number(b.final_price_dzd || b.raw_price || 0);
      return pA - pB;
    });
  } else if (offersSortOrder.value === 'price_desc') {
    list.sort((a, b) => {
      const pA = Number(a.final_price_dzd || a.raw_price || 0);
      const pB = Number(b.final_price_dzd || b.raw_price || 0);
      return pB - pA;
    });
  } else if (offersSortOrder.value === 'name_asc') {
    list.sort((a, b) => (a.room_type || '').localeCompare(b.room_type || ''));
  }

  return list;
});

const currentPrice = computed(() => {
  return evaluation.value?.price ||
         selectedAgreement.value?.final_price_dzd ||
         selectedAgreement.value?.raw_price ||
         hotel.value?.final_price_dzd ||
         hotel.value?.lowest_price_dzd || 0;
});

const cancellationDeadlineFormatted = computed(() => {
  if (evaluation.value?.cancellation_deadline) {
    return evaluation.value.cancellation_deadline;
  }
  if (selectedAgreement.value?.deadline) {
    return selectedAgreement.value.deadline;
  }
  if (hotelStore.searchForm.check_in) {
    try {
      const d = new Date(hotelStore.searchForm.check_in);
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() - 2);
        return d.toISOString().split('T')[0];
      }
    } catch (_) {}
  }
  return '2026-10-01';
});

const paxFormValid = computed(() => {
  if (!paxList.value.length) return false;
  return paxList.value.every((p, idx) => {
    if (!p.name?.trim() || !p.surname?.trim() || !p.title) return false;
    if (idx === 0 && (!p.email?.trim() || !p.phone?.trim())) return false;
    if (p.type === 'child' && (p.age === undefined || p.age === null || p.age === '' || isNaN(p.age))) return false;
    return true;
  });
});

// ── Methods ────────────────────────────────────────────────────────────
function goBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    navigateTo('/services/hotels/results');
  }
}

function buildPassengers() {
  paxList.value = [];
  const adults = hotelStore.searchForm.adults || 2;
  const children = hotelStore.searchForm.children || 0;

  const leadName = authStore.User?.name ? authStore.User.name.split(' ')[0] : (guestInfo.value.name ? guestInfo.value.name.split(' ')[0] : '');
  const leadSurname = authStore.User?.name ? authStore.User.name.split(' ').slice(1).join(' ') : (guestInfo.value.name ? guestInfo.value.name.split(' ').slice(1).join(' ') : '');
  const leadEmail = authStore.User?.email || guestInfo.value.email || '';
  const leadPhone = authStore.User?.phone || guestInfo.value.phone || '';

  for (let i = 0; i < adults; i++) {
    paxList.value.push({
      type: 'adult',
      title: 'MR',
      name: i === 0 ? leadName : '',
      surname: i === 0 ? leadSurname : '',
      email: i === 0 ? leadEmail : undefined,
      phone: i === 0 ? leadPhone : undefined,
    });
  }

  for (let i = 0; i < children; i++) {
    const age = hotelStore.searchForm.children_ages?.[i] ?? 5;
    paxList.value.push({
      type: 'child',
      title: 'MR',
      name: '',
      surname: '',
      age,
    });
  }

  // Pre-select payment method based on user wallet capability
  if (canPayWithWallet.value) {
    selectedPaymentMethod.value = 'wallet';
  } else {
    selectedPaymentMethod.value = 'satim';
  }
}

function chooseAgreement(ag) {
  if (selectedAgreement.value?.agreement_id === ag.agreement_id) {
    // If clicking on already selected offer ("Offre sélectionnée"), open traveler form
    openPassengerForm();
    return;
  }
  selectedAgreement.value = ag;
  hotelStore.selectedRoom = ag;
  evaluation.value = null;
  // Automatically evaluate this agreement for instant confirmation
  evaluateCurrentOffer();
}

function openPassengerForm() {
  showBookingForm.value = true;
}

async function evaluateCurrentOffer() {
  if (!hotel.value) return;
  const res = await hotelStore.evaluateRoom(hotel.value, selectedAgreement.value || hotel.value);
  evaluation.value = res;
}

async function submitBookingOrder() {
  if (!paxFormValid.value) return;
  hotelStore.selectedRoom = selectedAgreement.value;
  if (evaluation.value?.search_number && hotelStore.selectedRoom) {
    hotelStore.selectedRoom.search_number = evaluation.value.search_number;
  }

  const leadPax = paxList.value[0] || {};
  const fullGuestName = (guestInfo.value.name?.trim())
    || (`${leadPax.name || ''} ${leadPax.surname || ''}`.trim())
    || (authStore.User?.name || 'Client Invité');
  const fullGuestEmail = (guestInfo.value.email?.trim())
    || (leadPax.email?.trim())
    || (authStore.User?.email || '');
  const fullGuestPhone = (guestInfo.value.phone?.trim())
    || (leadPax.phone?.trim())
    || (authStore.User?.phone || '');

  const bookingPayload = {
    remarks: selectedRemarks.value,
    payment_method: selectedPaymentMethod.value,
    guest_name: fullGuestName,
    guest_email: fullGuestEmail,
    guest_phone: fullGuestPhone,
  };

  const res = await hotelStore.bookRoom(paxList.value, bookingPayload);

  if (res) {
    showBookingForm.value = false;

    // Payment redirection flow (SATIM or BaridiMob)
    if (res.payment_redirect || res.requires_payment) {
      const targetMethod = (selectedPaymentMethod.value === 'baridimob' || selectedPaymentMethod.value === 'ccp') ? 'ccp' : 'cib';
      const redirectUrl = res.payment_redirect
        ? `${res.payment_redirect}&method=${targetMethod}`
        : `/payment/confirm?order_id=${res.order_id}&type=hotel&amount=${res.price_dzd || currentPrice.value}&ref=${res.reference || ('BZZ-ORD-' + res.order_id)}&method=${targetMethod}`;

      navigateTo(redirectUrl);
    } else {
      // Immediate confirmation (Wallet or pre-authorized)
      nextTick(() => {
        const el = document.getElementById('booking-confirmed-card');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
}

function onImageError(e) {
  onHotelImageError(e, hotel.value?.stars || 3);
}

function onThumbError(e) {
  onHotelImageError(e, hotel.value?.stars || 3);
}

function formatPrice(val) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(val ?? 0));
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function roomBasisLabel(code) {
  const map = {
    RO: 'Chambre seule',
    RB: 'Petit-déjeuner inclus',
    RL: 'Déjeuner inclus',
    RD: 'Dîner inclus',
    FB: 'Pension complète',
    AI: 'Tout compris',
  };
  return map[code] || code || 'Petit-déjeuner inclus';
}

function mealBasisLabel(code) {
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
  title: () => hotel.value ? `${hotel.value.hotel_name} — Chambres & Tarifs | Bouazize Travel` : 'Détails Hôtel | Bouazize Travel',
  meta: [
    {
      name: 'description',
      content: 'Consultez les offres et réservez votre chambre d\'hôtel en ligne avec confirmation immédiate sur Bouazize Travel.',
    },
  ],
});
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — THEME SUPPORT
══════════════════════════════════════════════════════════════════════ */
.hotel-detail-page {
  --dt-page-bg: #f4f6fa;
  --dt-card-bg: #ffffff;
  --dt-card-border: #e2e8f0;
  --dt-box-bg: #f8fafc;
  --dt-box-border: #e2e8f0;
  --dt-text-main: #0f172a;
  --dt-text-sub: #64748b;
  --dt-text-label: #475569;
  --dt-input-bg: #ffffff;
  --dt-input-border: #cbd5e1;
  --dt-input-text: #0f172a;
  --dt-gold: #d4a03c;
  --dt-gold-hover: #c4912c;
  --dt-gold-light: rgba(212, 160, 60, 0.12);
  --dt-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  background: var(--dt-page-bg);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--dt-text-main);
  transition: background 0.25s ease, color 0.25s ease;
  overflow: visible !important;
}

.hotel-detail-page.dark-theme,
:global(html.dark) .hotel-detail-page,
:global(.dark) .hotel-detail-page {
  --dt-page-bg: #070a14;
  --dt-card-bg: #0b1022;
  --dt-card-border: #1a2542;
  --dt-box-bg: #080d1c;
  --dt-box-border: #16203a;
  --dt-text-main: #ffffff;
  --dt-text-sub: #94a3b8;
  --dt-text-label: #7b8ba5;
  --dt-input-bg: #080d1c;
  --dt-input-border: #18233e;
  --dt-input-text: #ffffff;
  --dt-gold: #d4a03c;
  --dt-gold-hover: #c4912c;
  --dt-gold-light: rgba(212, 160, 60, 0.16);
  --dt-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
}

/* ══════════════════════════════════════════════════════════════════════
   GLOBAL SHARP EDGES (NO BORDER RADIUS FOR BUTTONS, INPUTS & CONTROLS)
══════════════════════════════════════════════════════════════════════ */
.hotel-detail-page button,
.hotel-detail-page input,
.hotel-detail-page select,
.hotel-detail-page textarea,
.hotel-detail-page .nav-back-btn,
.hotel-detail-page .hotel-hero-card,
.hotel-detail-page .hero-stars-badge,
.hotel-detail-page .hero-category-chip,
.hotel-detail-page .thumb-btn,
.hotel-detail-page .thumb-img,
.hotel-detail-page .chip,
.hotel-detail-page .section-card,
.hotel-detail-page .head-icon,
.hotel-detail-page .count-badge,
.hotel-detail-page .filter-pill,
.hotel-detail-page .room-offer-card,
.hotel-detail-page .board-chip,
.hotel-detail-page .select-offer-btn,
.hotel-detail-page .eval-success-banner,
.hotel-detail-page .eval-warn-banner,
.hotel-detail-page .eval-error-banner,
.hotel-detail-page .policy-notice-box,
.hotel-detail-page .pax-card-box,
.hotel-detail-page .pax-role-badge,
.hotel-detail-page .form-input-ctrl,
.hotel-detail-page .form-select-ctrl,
.hotel-detail-page .remarks-box,
.hotel-detail-page .booking-fail-banner,
.hotel-detail-page .final-booking-btn,
.hotel-detail-page .reference-code-box,
.hotel-detail-page .orders-btn,
.hotel-detail-page .sticky-summary-card,
.hotel-detail-page .mini-hotel-thumb,
.hotel-detail-page .summary-price-box,
.hotel-detail-page .sidebar-action-gold-btn,
.hotel-detail-page .sk-hero-box,
.hotel-detail-page .sk-card-line {
  border-radius: 0 !important;
}

.page-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px 20px 80px;
}
@media (max-width: 640px) {
  .page-container {
    padding: 12px 12px 60px;
  }
}


/* ── Sticky Top Navigation Bar ── */
.detail-sticky-nav-bar {
  position: -webkit-sticky;
  position: sticky;
  top: var(--site-header-h, 76px);
  z-index: 40;
  background: var(--dt-card-bg);
  border-bottom: 1px solid var(--dt-card-border);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  transition: background 0.25s ease, border-color 0.25s ease;
}
.detail-nav-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
@media (max-width: 640px) {
  .detail-nav-inner { padding: 8px 12px; gap: 8px; }
  .breadcrumb-trail { display: none; }
}

.nav-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 0;
  border: 1px solid var(--dt-card-border);
  background: var(--dt-card-bg);
  color: var(--dt-text-sub);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-back-btn:hover {
  border-color: var(--dt-gold);
  color: var(--dt-gold);
}
.nav-arrow {
  width: 14px;
  height: 14px;
}
.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
.bc-item {
  color: var(--dt-text-sub);
  cursor: pointer;
}
.bc-item:hover {
  color: var(--dt-gold);
}
.bc-sep {
  color: #475569;
}
.bc-active {
  color: var(--dt-gold);
  font-weight: 700;
}

/* ── Content Grid ── */
.hotel-content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}
.hotel-main-col {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}

/* ── Hotel Hero Showcase ── */
.hotel-hero-card {
  background: var(--dt-card-bg);
  border: 1px solid var(--dt-card-border);
  border-radius: 0;
  overflow: hidden;
  box-shadow: var(--dt-shadow);
}
.gallery-wrapper {
  position: relative;
  background: #000;
}
.main-image-viewport {
  position: relative;
  width: 100%;
  height: 340px;
  overflow: hidden;
}
@media (max-width: 768px) {
  .main-image-viewport { height: 260px; }
}
@media (max-width: 480px) {
  .main-image-viewport { height: 210px; }
}

.hotel-primary-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);
}
.hero-stars-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  padding: 4px 10px;
  border-radius: 0;
  font-size: 14px;
  letter-spacing: 2px;
}
.star-on { color: #fbbf24; }
.star-off { color: rgba(255,255,255,0.25); }

.hero-category-chip {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--dt-gold);
  color: #111827;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 0;
  letter-spacing: 0.5px;
}

.gallery-thumbs-row {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  background: var(--dt-card-bg);
  border-bottom: 1px solid var(--dt-card-border);
}
.thumb-btn {
  width: 72px;
  height: 48px;
  border-radius: 0;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  background: transparent;
  transition: all 0.15s;
}
.thumb-btn.active {
  border-color: var(--dt-gold);
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-info-block {
  padding: 20px 22px;
}
.hotel-heading {
  font-size: 24px;
  font-weight: 900;
  color: var(--dt-text-main);
  margin: 0 0 6px;
  line-height: 1.25;
}
.hotel-address-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--dt-text-sub);
  margin: 0 0 16px;
}
.pin-icon {
  width: 15px;
  height: 15px;
  color: var(--dt-gold);
  flex-shrink: 0;
}
.hotel-highlights-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.highlight-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-box-border);
  color: var(--dt-text-label);
  padding: 5px 10px;
  border-radius: 0;
}
.chip-svg {
  width: 12px;
  height: 12px;
  color: var(--dt-gold);
}

/* ── Section Cards ── */
.section-card {
  background: var(--dt-card-bg);
  border: 1px solid var(--dt-card-border);
  border-radius: 0;
  box-shadow: var(--dt-shadow);
  padding: 20px 22px;
}
.section-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--dt-card-border);
  padding-bottom: 14px;
  flex-wrap: wrap;
  gap: 10px;
}
.head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.head-icon {
  width: 38px;
  height: 38px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.head-icon svg {
  width: 20px;
  height: 20px;
}
.gold-icon {
  background: var(--dt-gold-light);
  color: var(--dt-gold);
}
.check-icon {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}
.user-icon {
  background: var(--dt-gold-light);
  color: var(--dt-gold);
}
.head-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--dt-text-main);
  margin: 0 0 2px;
}
.head-sub {
  font-size: 11px;
  color: var(--dt-text-sub);
  margin: 0;
}
.count-badge {
  background: var(--dt-gold);
  color: #111827;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 0;
}
.count-loading {
  background: rgba(212, 160, 60, 0.15) !important;
  color: var(--dt-gold) !important;
  border: 1px solid rgba(212, 160, 60, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Photo loading chip on hero image */
.gallery-live-loading-chip {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--dt-gold);
  border: 1px solid rgba(212, 160, 60, 0.4);
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Offers Live Loading Feedback Banner */
.offers-live-feedback-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(212, 160, 60, 0.08) 0%, rgba(212, 160, 60, 0.02) 100%);
  border: 1px solid rgba(212, 160, 60, 0.28);
  border-left: 4px solid var(--dt-gold);
}
.feedback-pulse-spinner {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feedback-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.feedback-main-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--dt-gold);
  margin: 0;
}
.feedback-main-sub {
  font-size: 11.5px;
  color: var(--dt-text-sub);
  margin: 0;
  line-height: 1.4;
}

/* Verified Live Badge */
.offers-live-verified-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-left: 3px solid #22c55e;
  font-size: 11.5px;
  font-weight: 600;
  color: #22c55e;
}
.verified-check-icon {
  flex-shrink: 0;
}

.btn-spinner-md {
  width: 18px;
  height: 18px;
  border-width: 2px;
}
.btn-spinner-xs {
  width: 10px;
  height: 10px;
  border-width: 2px;
}

/* Shimmer Skeleton cards for offers */
.room-offers-skeleton-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.room-offer-skeleton-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  background: var(--dt-card-bg);
  border: 1px solid var(--dt-card-border);
  gap: 16px;
}
.room-offer-skeleton-card .sk-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.room-offer-skeleton-card .sk-side {
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* Filter & Sort bar for room offers */
.offers-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-pills-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-pill {
  border: 1px solid var(--dt-card-border);
  background: var(--dt-box-bg);
  color: var(--dt-text-sub);
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 0 !important;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-pill.active {
  background: var(--dt-gold);
  color: #111827;
  border-color: var(--dt-gold);
}
.filter-pill:hover:not(.active) {
  border-color: var(--dt-gold);
  color: var(--dt-gold);
}

.offers-sort-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-card-border);
  padding: 4px 10px;
  border-radius: 0 !important;
}
.offers-sort-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--dt-text-sub);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.sort-icon {
  width: 13px;
  height: 13px;
  color: var(--dt-gold);
  flex-shrink: 0;
}
.offers-sort-select {
  border: none;
  background: transparent;
  color: var(--dt-text-main);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 6px;
  outline: none;
  cursor: pointer;
  border-radius: 0 !important;
}
.offers-sort-select option {
  background: var(--dt-card-bg);
  color: var(--dt-text-main);
}

/* Room Offers List */
.room-offers-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.room-offer-card {
  background: var(--dt-box-bg);
  border: 1.5px solid var(--dt-box-border);
  border-radius: 0;
  padding: 16px 18px;
  transition: all 0.2s ease;
}
.room-offer-card:hover {
  border-color: var(--dt-gold);
}
.room-offer-card.selected-offer {
  border-color: var(--dt-gold);
  background: var(--dt-gold-light);
  box-shadow: 0 0 0 2px rgba(212, 160, 60, 0.2);
}

.room-card-content {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  align-items: center;
}
@media (max-width: 768px) {
  .room-card-content {
    grid-template-columns: 1fr;
  }
}

.room-info-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.room-type-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.room-type-title h3 {
  font-size: 15px;
  font-weight: 800;
  color: var(--dt-text-main);
  margin: 0;
}
.current-selected-badge {
  background: var(--dt-gold);
  color: #111827;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 0;
}

.room-features-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--dt-text-sub);
}
.meta-ico {
  width: 12px;
  height: 12px;
  color: var(--dt-gold);
}

.room-perks-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}
.perk-item {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.perk-bullet {
  font-size: 8px;
}
.perk-green {
  color: #16a34a;
}
.perk-amber {
  color: #d97706;
}
.perk-muted {
  color: var(--dt-text-sub);
}
.meal-sub {
  font-size: 10px;
  opacity: 0.85;
}

/* Pricing & Button Right */
.room-price-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  border-left: 1px solid var(--dt-card-border);
  padding-left: 16px;
}
@media (max-width: 768px) {
  .room-price-col {
    align-items: stretch;
    border-left: none;
    padding-left: 0;
    border-top: 1px dashed var(--dt-card-border);
    padding-top: 12px;
  }
}

.pricing-display {
  text-align: right;
}
.pricing-duration {
  font-size: 10px;
  color: var(--dt-text-sub);
  display: block;
}
.pricing-figures {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
  margin: 2px 0;
}
.amount-num {
  font-size: 20px;
  font-weight: 900;
  color: var(--dt-gold);
}
.amount-curr {
  font-size: 12px;
  font-weight: 800;
  color: var(--dt-text-sub);
}
.per-night-estimate {
  font-size: 10px;
  color: var(--dt-text-sub);
  display: block;
}
.net-toggle-btn {
  margin-top: 6px;
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
.net-value { display: block; margin-top: 4px; font-size: 12px; font-weight: 700; color: #b45309; }
.taxes-included {
  font-size: 9px;
  color: #16a34a;
  display: block;
}

.select-offer-btn {
  width: 100%;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 0;
  cursor: pointer;
  border: 1px solid var(--dt-gold);
  background: var(--dt-gold);
  color: #111827;
  transition: all 0.2s;
}
.select-offer-btn:hover {
  background: var(--dt-gold-hover);
}
.select-offer-btn.btn-selected {
  background: #16a34a;
  border-color: #16a34a;
  color: white;
}
.btn-flex {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.check-ico {
  width: 14px;
  height: 14px;
}
.arrow-ico {
  width: 13px;
  height: 13px;
}

/* ══════════════════════════════════════════════════════════════════════
   PASSENGER MODAL (POPIN WINDOW)
══════════════════════════════════════════════════════════════════════ */
.passenger-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 11, 37, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.passenger-modal-container {
  background: var(--dt-card-bg);
  border: 1px solid var(--dt-card-border);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 0 !important;
  position: relative;
  overflow: hidden;
}

.passenger-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--dt-card-border);
  background: var(--dt-box-bg);
  gap: 16px;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 0 !important;
  background: rgba(212, 160, 60, 0.15);
  color: var(--dt-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-header-icon svg {
  width: 20px;
  height: 20px;
}

.modal-title-text {
  font-size: 16px;
  font-weight: 800;
  color: var(--dt-text-main);
  margin: 0;
  letter-spacing: 0.3px;
}

.modal-subtitle-text {
  font-size: 11px;
  color: var(--dt-text-sub);
  margin: 2px 0 0;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 0 !important;
  background: transparent;
  border: 1px solid var(--dt-card-border);
  color: var(--dt-text-sub);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close-btn svg {
  width: 16px;
  height: 16px;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border-color: #ef4444;
}

/* Ribbon summary */
.modal-booking-recap-ribbon {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  padding: 10px 20px;
  background: var(--dt-box-bg);
  border-bottom: 1px solid var(--dt-card-border);
  font-size: 11px;
}

.ribbon-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ribbon-label {
  color: var(--dt-text-sub);
  font-weight: 500;
}

.ribbon-val {
  color: var(--dt-text-main);
  font-weight: 700;
}

.ribbon-price-val {
  color: var(--dt-gold);
  font-weight: 900;
  font-size: 12.5px;
}

.passenger-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.passenger-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid var(--dt-card-border);
  background: var(--dt-box-bg);
}

.modal-cancel-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--dt-card-border);
  color: var(--dt-text-main);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 0 !important;
  transition: all 0.2s ease;
}

.modal-cancel-btn:hover {
  background: var(--dt-card-bg);
  border-color: var(--dt-text-sub);
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .passenger-modal-container,
.modal-fade-leave-active .passenger-modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from .passenger-modal-container {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

.modal-fade-leave-to .passenger-modal-container {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

/* ── Passenger Form ── */
.passengers-form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pax-card-box {
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-box-border);
  border-radius: 0;
  padding: 14px;
}
.pax-head-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.pax-role-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 0;
  text-transform: uppercase;
}
.adult-role {
  background: var(--dt-gold-light);
  color: var(--dt-gold);
}
.child-role {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}
.lead-flag {
  font-size: 10px;
  color: var(--dt-gold);
  font-weight: 700;
}
.child-age-flag {
  font-size: 10px;
  color: var(--dt-text-sub);
}

.pax-inputs-grid {
  display: grid;
  grid-template-columns: 110px 1fr 1fr;
  gap: 10px;
}
@media (max-width: 640px) {
  .pax-inputs-grid {
    grid-template-columns: 1fr;
  }
}
.col-email,
.col-phone {
  grid-column: span 1;
}
.input-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.input-lbl {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--dt-text-label);
}
.req {
  color: #ef4444;
}
.form-input-ctrl,
.form-select-ctrl {
  padding: 8px 10px;
  font-size: 12px;
  border-radius: 0;
  border: 1px solid var(--dt-input-border);
  background: var(--dt-input-bg);
  color: var(--dt-input-text);
  outline: none;
}
.form-input-ctrl:focus,
.form-select-ctrl:focus {
  border-color: var(--dt-gold);
}
.uppercase {
  text-transform: uppercase;
}

.remarks-box {
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-box-border);
  padding: 12px 14px;
  border-radius: 0;
}
.remarks-heading {
  font-size: 11px;
  font-weight: 700;
  color: var(--dt-text-label);
  display: block;
  margin-bottom: 8px;
}
.remarks-chips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 640px) {
  .remarks-chips-grid {
    grid-template-columns: 1fr;
  }
}
.remark-pill-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--dt-text-main);
  cursor: pointer;
}
.custom-check {
  accent-color: var(--dt-gold);
}

.booking-fail-banner {
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 0;
  color: #ef4444;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.err-ico {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.booking-submit-row {
  display: flex;
  justify-content: flex-end;
}
.final-booking-btn {
  padding: 12px 28px;
  background: var(--dt-gold);
  color: #111827;
  border: none;
  border-radius: 0;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.final-booking-btn:hover:not(:disabled) {
  background: var(--dt-gold-hover);
  box-shadow: 0 4px 16px rgba(212, 160, 60, 0.4);
}
.final-booking-btn.disabled,
.final-booking-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Success Card ── */
.success-card {
  text-align: center;
  padding: 36px 20px;
}
.success-icon-wrap {
  font-size: 40px;
  margin-bottom: 8px;
}
.success-title {
  font-size: 22px;
  font-weight: 900;
  color: #16a34a;
  margin: 0 0 6px;
}
.success-sub {
  font-size: 13px;
  color: var(--dt-text-sub);
  margin: 0 0 20px;
}
.reference-code-box {
  background: var(--dt-box-bg);
  border: 1px dashed var(--dt-gold);
  display: inline-block;
  padding: 12px 24px;
  border-radius: 0;
  margin-bottom: 24px;
}
.ref-title {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--dt-text-sub);
  display: block;
  margin-bottom: 4px;
}
.ref-code {
  font-size: 18px;
  font-weight: 900;
  font-family: monospace;
  color: var(--dt-gold);
}
.orders-btn {
  padding: 10px 24px;
  background: var(--dt-gold);
  color: #111827;
  border: none;
  font-size: 12px;
  font-weight: 800;
  border-radius: 0;
  cursor: pointer;
}

/* ══════════════════════════════════════════════════════════════════════
   RIGHT STICKY SIDEBAR (RÉCAPITULATIF DU SÉJOUR)
══════════════════════════════════════════════════════════════════════ */
.hotel-sidebar-col {
  position: -webkit-sticky;
  position: sticky;
  top: calc(var(--site-header-h, 76px) + var(--top-nav-h, 52px) + 16px);
  max-height: calc(100vh - var(--site-header-h, 76px) - var(--top-nav-h, 52px) - 24px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--dt-card-border) transparent;
  z-index: 30;
}
.hotel-sidebar-col::-webkit-scrollbar {
  width: 5px;
}
.hotel-sidebar-col::-webkit-scrollbar-track {
  background: transparent;
}
.hotel-sidebar-col::-webkit-scrollbar-thumb {
  background: var(--dt-card-border);
  border-radius: 0;
}
.hotel-sidebar-col::-webkit-scrollbar-thumb:hover {
  background: var(--dt-gold);
}
@media (max-width: 900px) {
  .hotel-content-grid {
    grid-template-columns: 1fr;
  }
  .hotel-sidebar-col {
    position: static;
    max-height: none;
    overflow-y: visible;
  }
}

.sticky-summary-card {
  background: var(--dt-card-bg);
  border: 1px solid var(--dt-card-border);
  border-radius: 0;
  box-shadow: var(--dt-shadow);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.summary-head {
  border-bottom: 1px solid var(--dt-card-border);
  padding-bottom: 10px;
}
.summary-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--dt-text-main);
  text-transform: uppercase;
}

.summary-hotel-mini {
  display: flex;
  gap: 10px;
  align-items: center;
}
.mini-hotel-thumb {
  width: 58px;
  height: 58px;
  border-radius: 0;
  object-fit: cover;
  flex-shrink: 0;
}
.mini-hotel-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mini-hotel-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--dt-text-main);
  margin: 0;
  line-height: 1.25;
}
.mini-stars {
  font-size: 11px;
  color: #fbbf24;
}
.mini-city {
  font-size: 10px;
  color: var(--dt-text-sub);
}

/* ── Sidebar Verified Netstorming Confirmation Box ── */
.sb-verified-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  background: var(--dt-box-bg);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 0 !important;
}

.sb-verified-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.sb-check-icon {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 0 !important;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.sb-check-icon svg {
  width: 16px;
  height: 16px;
}

.sb-verified-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sb-verified-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--dt-text-main);
  margin: 0;
  line-height: 1.25;
}

.sb-verified-sub {
  font-size: 10.5px;
  color: var(--dt-text-sub);
  margin: 0;
  line-height: 1.35;
}

.sb-avail-banner {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 8px 10px;
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #10b981;
  border-radius: 0 !important;
  font-size: 11px;
  line-height: 1.45;
  color: #059669;
}

:global(.dark) .sb-avail-banner,
.hotel-detail-page.dark-theme .sb-avail-banner {
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
}

.sb-green-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 1px;
}

.sb-avail-text {
  color: inherit;
}

.sb-avail-text strong {
  font-weight: 800;
  color: var(--dt-text-main);
}

.sb-cancellation-block {
  padding: 8px 10px;
  background: var(--dt-card-bg);
  border: 1px solid var(--dt-box-border);
  border-radius: 0 !important;
}

.sb-cancel-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
}

.sb-cancel-ico {
  width: 13px;
  height: 13px;
  color: var(--dt-gold);
}

.sb-cancel-label {
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--dt-text-main);
}

.sb-cancel-desc {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--dt-text-sub);
  margin: 0;
}

.sb-cancel-desc strong {
  color: var(--dt-text-main);
  font-weight: 700;
}

.summary-key-values {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--dt-card-border);
  border-bottom: 1px solid var(--dt-card-border);
  padding: 12px 0;
}
.kv-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}
.kv-lbl {
  color: var(--dt-text-sub);
}
.kv-val {
  color: var(--dt-text-main);
  font-weight: 600;
  text-align: right;
  max-width: 60%;
}
.highlight-val {
  color: var(--dt-gold);
  font-weight: 700;
}

.summary-price-box {
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-box-border);
  border-radius: 0;
  padding: 12px 14px;
}
.price-row-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.total-lbl {
  font-size: 12px;
  font-weight: 800;
  color: var(--dt-text-main);
  text-transform: uppercase;
}
.total-figures {
  display: flex;
  align-items: baseline;
  gap: 3px;
}
.total-amt {
  font-size: 20px;
  font-weight: 900;
  color: var(--dt-gold);
}
.total-cur {
  font-size: 12px;
  font-weight: 800;
  color: var(--dt-text-sub);
}
.taxes-notice {
  font-size: 9px;
  color: #16a34a;
  display: block;
}

.summary-cta-wrap {
  display: flex;
  flex-direction: column;
}
.sidebar-action-gold-btn {
  width: 100%;
  padding: 12px;
  background: var(--dt-gold);
  color: #111827;
  border: none;
  border-radius: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}
.sidebar-action-gold-btn:hover:not(:disabled) {
  background: var(--dt-gold-hover);
}
.sidebar-action-gold-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.security-trust-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--dt-text-sub);
  line-height: 1.3;
}
.lock-svg {
  width: 14px;
  height: 14px;
  color: var(--dt-gold);
  flex-shrink: 0;
}

/* Spinner */
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #111827;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Skeletons ── */
.detail-skeleton {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sk-hero-box {
  height: 300px;
  border-radius: 0;
  background: linear-gradient(90deg, #151d34 25%, #1e2948 50%, #151d34 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.sk-grid-split {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}
.sk-card-line {
  border-radius: 0;
  background: linear-gradient(90deg, #151d34 25%, #1e2948 50%, #151d34 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 12px;
}
.h-40 { height: 40px; }
.h-120 { height: 120px; }
.h-200 { height: 200px; }
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
/* ── Guest & Auth Banners in Booking Modal ── */
.guest-checkout-banner {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(202, 138, 4, 0.03) 100%);
  border: 1px solid rgba(234, 179, 8, 0.25);
  border-left: 4px solid var(--dt-gold, #eab308);
  padding: 14px 16px;
  margin-bottom: 18px;
}
.guest-banner-hdr {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.guest-badge-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(234, 179, 8, 0.15);
  color: var(--dt-gold, #eab308);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.guest-badge-icon svg {
  width: 18px;
  height: 18px;
}
.guest-banner-text {
  flex: 1;
}
.guest-banner-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 800;
  color: var(--dt-text-main);
  margin-bottom: 4px;
}
.guest-quick-tag {
  font-size: 10px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  padding: 2px 7px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.guest-banner-sub {
  font-size: 11px;
  color: var(--dt-text-sub);
  line-height: 1.45;
  margin: 0;
}

.auth-user-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-box-border);
  margin-bottom: 18px;
  font-size: 11.5px;
  color: var(--dt-text-main);
}
.auth-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
  flex-shrink: 0;
}
.b2b-flag {
  margin-left: auto;
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.25);
  padding: 2px 7px;
}

/* ── Payment Method Section & Cards ── */
.payment-method-section {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--dt-card-border);
}
.section-subheading-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.section-subheading-icon {
  font-size: 16px;
}
.section-subheading-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--dt-text-main);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.payment-options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pay-method-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: var(--dt-card-bg);
  border: 1.5px solid var(--dt-box-border);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.pay-method-card:hover {
  border-color: rgba(234, 179, 8, 0.4);
  background: var(--dt-box-bg);
}
.pay-method-card.active {
  border-color: var(--dt-gold, #eab308);
  background: rgba(234, 179, 8, 0.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.pay-radio {
  margin-top: 4px;
  accent-color: var(--dt-gold, #eab308);
  cursor: pointer;
  transform: scale(1.15);
}
.pay-method-content {
  flex: 1;
}
.pay-method-top {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 5px;
}
.pay-badges-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.pay-badge-auto {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 1.5px 6px;
}
.pay-badge-manual {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 1.5px 6px;
}
.pay-badge-wallet {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 1.5px 6px;
}
.pay-brand-tag {
  font-size: 9px;
  font-weight: 800;
  font-family: monospace;
  color: var(--dt-text-sub);
  background: var(--dt-box-bg);
  border: 1px solid var(--dt-box-border);
  padding: 1.5px 5px;
}
.pay-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--dt-text-main);
}
.pay-desc {
  font-size: 11px;
  color: var(--dt-text-sub);
  line-height: 1.45;
  margin: 0;
}
.pay-desc strong {
  color: var(--dt-text-main);
  font-weight: 700;
}
</style>
