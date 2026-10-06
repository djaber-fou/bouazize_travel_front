/**
 * HOTEL PINIA STORE — Netstorming Integration
 *
 * KEY DESIGN: Full dataset loaded into allHotels in background after initial 50.
 * All filters operate on allHotels (not just the loaded chunk).
 * The UI renders filteredHotels.slice(0, displayedCount).
 */

import { defineStore } from 'pinia';
import {
  searchDestinations,
  searchHotelsAutocomplete,
  searchHotelAvailability,
  warmupDestination,
  getHotelSearchPage,
  getAllHotelSearchResults,
  evaluateHotelRoom,
  createHotelBooking,
  getMyHotelOrders,
  getHotelOrder,
  trackHotelOrder,
  cancelHotelOrder,
} from '~/services/hotel';

let searchSeq = 0; // monotonically increasing id: only the latest search may write to the store

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    searchForm: {
      destination_code: '',
      destination_name: '',
      hotel_id: null,
      hotel_name: null,
      check_in: '',
      check_out: '',
      room_type: 'dbl',
      rooms: 1,
      adults: 2,
      children: 0,
      children_ages: [],
      nationality: 'DZ',
    },
    destinationSuggestions: [],
    loadingDestinations: false,
    searchResults: {
      session_id: null,
      hotels: [],
      total: 0,
      page: 1,
      per_page: 50,
      displayed: 0,
      has_more: false,
      criteria: null,
    },
    // Full dataset loaded in background for cross-chunk filtering
    allHotels: [],
    allHotelsLoaded: false,
    loadingAllHotels: false,
    // Numbered 20-hotel pagination
    currentPage: 1,
    pageSize: 20,
    displayedCount: 20,
    DISPLAY_PAGE_SIZE: 20,
    lastSearchKey: null,
    loadingSearch: false,
    loadingMore: false,
    searchError: null,
    filters: {
      maxPrice: null,
      minStars: null,
      mealBasis: '',
      searchName: '',
    },
    sortBy: 'price_asc',
    selectedHotel: null,
    selectedRoom: null,
    evaluationResult: null,
    loadingEvaluation: false,
    bookingConfirmation: null,
    loadingBooking: false,
    bookingError: null,
    myOrders: [],
    currentOrder: null,
    loadingOrders: false,
    ordersError: null,
  }),

  getters: {
    /**
     * Filters + sorts ALL hotels (allHotels if loaded, else initial chunk).
     * This is the master filtered list — used to count results and slice for display.
     */
    filteredHotels: (state) => {
      let list = state.allHotels.length > 0
        ? [...state.allHotels]
        : [...state.searchResults.hotels];

      if (state.filters.searchName && state.filters.searchName.trim()) {
        const term = state.filters.searchName.trim().toLowerCase();
        list = list.filter((h) => {
          const name = (h.name || h.hotel_name || '').toLowerCase();
          const city = (h.city || h.hotel_city || '').toLowerCase();
          return name.includes(term) || city.includes(term);
        });
      }

      if (state.filters.maxPrice) {
        list = list.filter((h) => (h.lowest_price_dzd || h.final_price_dzd || 0) <= state.filters.maxPrice);
      }
      if (state.filters.minStars) {
        const stars = state.filters.minStars;
        list = list.filter((h) => {
          const cat = h.stars || parseInt(h.hotel_category) || 0;
          return cat >= stars;
        });
      }
      if (state.filters.mealBasis) {
        list = list.filter((h) => h.meal_basis_code === state.filters.mealBasis);
      }

      switch (state.sortBy) {
        case 'price_asc':
          list.sort((a, b) => (a.lowest_price_dzd || a.final_price_dzd || 0) - (b.lowest_price_dzd || b.final_price_dzd || 0));
          break;
        case 'price_desc':
          list.sort((a, b) => (b.lowest_price_dzd || b.final_price_dzd || 0) - (a.lowest_price_dzd || a.final_price_dzd || 0));
          break;
        case 'stars_desc':
          list.sort((a, b) => ((b.stars || parseInt(b.hotel_category)) || 0) - ((a.stars || parseInt(a.hotel_category)) || 0));
          break;
        case 'name_asc':
          list.sort((a, b) => (a.hotel_name || '').localeCompare(b.hotel_name || ''));
          break;
      }

      return list;
    },

    totalPages() {
      const size = this.pageSize || 20;
      const count = (this.filteredHotels && this.filteredHotels.length) || 0;
      return Math.max(1, Math.ceil(count / size));
    },

    paginatedHotels() {
      const size = this.pageSize || 20;
      const start = Math.max(0, (this.currentPage - 1) * size);
      return (this.filteredHotels || []).slice(start, start + size);
    },

    hasSearchResults: (state) => (state.searchResults.total > 0 || (Array.isArray(state.searchResults.hotels) && state.searchResults.hotels.length > 0)),
    nights: (state) => {
      if (!state.searchForm.check_in || !state.searchForm.check_out) return 0;
      const diff = new Date(state.searchForm.check_out) - new Date(state.searchForm.check_in);
      return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
    },
  },

  actions: {
    async fetchDestinations(query) {
      if (query.length < 2) { this.destinationSuggestions = []; return; }
      this.loadingDestinations = true;
      try {
        const data = await searchHotelsAutocomplete(query);
        this.destinationSuggestions = data?.data ?? [];
      } catch {
        try {
          const fallback = await searchDestinations(query);
          this.destinationSuggestions = (fallback?.data ?? []).map(d => ({
            ...d, type: 'city', label: d.name + ', ' + d.country_name, code: d.ns_code,
          }));
        } catch { this.destinationSuggestions = []; }
      } finally { this.loadingDestinations = false; }
    },

    selectDestination(destination) {
      const code = destination.code || destination.ns_code || '';
      const name = destination.type === 'hotel'
        ? destination.name + ' — ' + destination.city_name
        : destination.name;
      this.searchForm.destination_code = code;
      this.searchForm.destination_name = name;
      this.searchForm.hotel_id = destination.hotel_id || null;
      this.searchForm.hotel_name = destination.type === 'hotel' ? destination.name : null;
      if (destination.type === 'hotel' && destination.name) {
        this.filters.searchName = destination.name;
      }
      this.destinationSuggestions = [];

      // Fire-and-forget warmup: pre-heat Netstorming cache for this destination
      // so that by the time the user clicks Search, the bedbanks are already warm.
      if (code && destination.type !== 'hotel') {
        warmupDestination(
          code,
          this.searchForm.check_in   || null,
          this.searchForm.check_out  || null,
          this.searchForm.adults     || 2
        );
      }
    },

    clearSearchResults() {
      this.searchResults = { session_id: null, hotels: [], total: 0, criteria: null, page: 1, per_page: 20, displayed: 0, has_more: false };
      this.allHotels = [];
      this.allHotelsLoaded = false;
      this.currentPage = 1;
      this.displayedCount = 20;
      this.lastSearchKey = null;
      this.searchError = null;
      this.loadingSearch = false;
      this.loadingAllHotels = false;
    },

    setPage(page) {
      const total = this.totalPages;
      this.currentPage = Math.max(1, Math.min(page, total));
    },

    resetFilters() {
      this.filters = {
        maxPrice: null,
        minStars: null,
        mealBasis: '',
        searchName: '',
      };
      this.sortBy = 'price_asc';
      this.currentPage = 1;
      this.displayedCount = 20;
    },

    async searchAvailability() {
      const mySeq = ++searchSeq;
      this.loadingSearch = true;
      this.searchError = null;
      this.allHotels = [];
      this.allHotelsLoaded = false;
      this.loadingAllHotels = false;
      this.currentPage = 1;
      this.displayedCount = 20;
      this.searchResults = { session_id: null, hotels: [], total: 0, page: 1, per_page: 20, displayed: 0, has_more: false, criteria: null };

      const currentKey = [
        this.searchForm.destination_code || '',
        this.searchForm.hotel_id || '',
        this.searchForm.check_in || '',
        this.searchForm.check_out || '',
        this.searchForm.adults || 2,
        this.searchForm.children || 0,
        this.searchForm.rooms || 1,
        (this.searchForm.children_ages || []).join(','),
      ].join('|');

      try {
        const data = await searchHotelAvailability(this.searchForm);
        if (mySeq !== searchSeq) return; // a newer search superseded this one
        const res = data?.data ?? {};
        this.searchResults = {
          session_id: res.session_id ?? null,
          hotels: Array.isArray(res.hotels) ? res.hotels : [],
          total: res.total ?? (res.hotels ? res.hotels.length : 0),
          page: res.page ?? 1,
          per_page: res.per_page ?? 50,
          displayed: res.displayed ?? (res.hotels ? res.hotels.length : 0),
          has_more: res.has_more ?? false,
          criteria: res.criteria ?? null,
        };
        this.lastSearchKey = currentKey;

        // Instantly populate allHotels with the full dataset from res.all_hotels
        if (Array.isArray(res.all_hotels) && res.all_hotels.length > 0) {
          this.allHotels = res.all_hotels;
          this.allHotelsLoaded = true;
        } else if (res.session_id && res.has_more) {
          this._backgroundLoadAllHotels(res.session_id, Array.isArray(res.hotels) ? res.hotels : []);
        } else {
          // All results already in first chunk
          this.allHotels = Array.isArray(res.hotels) ? [...res.hotels] : [];
          this.allHotelsLoaded = true;
        }
      } catch (err) {
        if (mySeq !== searchSeq) return;
        this.searchError = err?.response?.data?.message ?? 'حدث خطأ أثناء البحث';
        this.lastSearchKey = null;
      } finally {
        if (mySeq === searchSeq) this.loadingSearch = false;
      }
    },

    /**
     * Background-loads the ENTIRE result set from the backend cache.
     * Called immediately after the initial 50-hotel chunk is displayed.
     * Once loaded, filteredHotels operates over the full dataset.
     */
    async _backgroundLoadAllHotels(sessionId, initialChunk = []) {
      if (this.loadingAllHotels) return;
      this.loadingAllHotels = true;
      try {
        const data = await getAllHotelSearchResults(sessionId);
        const res = data?.data ?? {};
        if (Array.isArray(res.hotels) && res.hotels.length > 0) {
          this.allHotels = res.hotels;
        } else {
          this.allHotels = [...initialChunk];
        }
        this.allHotelsLoaded = true;
      } catch (err) {
        console.warn('[HotelStore] Full-load fallback to initial chunk:', err?.message);
        this.allHotels = [...initialChunk];
        this.allHotelsLoaded = true;
      } finally {
        this.loadingAllHotels = false;
      }
    },

    /**
     * Show the next batch of filtered hotels.
     * If allHotels is loaded: purely client-side (no network call).
     * If not yet loaded: falls back to server-side chunk pagination.
     */
    async loadMoreHotels() {
      if (this.loadingMore) return;

      // Fast path: full dataset loaded — just bump display cursor
      if (this.allHotelsLoaded && this.allHotels.length > 0) {
        this.displayedCount += this.DISPLAY_PAGE_SIZE;
        return;
      }

      // No more pages available
      if (!this.searchResults.has_more || !this.searchResults.session_id) {
        this.displayedCount += this.DISPLAY_PAGE_SIZE;
        return;
      }

      // Slow path: fetch next backend chunk
      this.loadingMore = true;
      const nextPage = (this.searchResults.page || 1) + 1;
      try {
        const data = await getHotelSearchPage(this.searchResults.session_id, nextPage, this.searchResults.per_page || 50);
        const res = data?.data ?? {};
        if (Array.isArray(res.hotels) && res.hotels.length > 0) {
          this.searchResults.hotels = [...this.searchResults.hotels, ...res.hotels];
          this.searchResults.page = res.page ?? nextPage;
          this.searchResults.displayed = this.searchResults.hotels.length;
          this.searchResults.has_more = res.has_more ?? false;
          this.displayedCount += this.DISPLAY_PAGE_SIZE;
        } else {
          this.searchResults.has_more = false;
        }
      } catch (err) {
        console.error('[HotelStore] Failed to load more hotels:', err);
      } finally {
        this.loadingMore = false;
      }
    },

    async searchHotels() { return await this.searchAvailability(); },

    async evaluateRoom(hotel, room) {
      this.selectedHotel = hotel;
      this.selectedRoom = room;
      this.evaluationResult = null;
      this.loadingEvaluation = true;
      const agreementCode = room?.agreement_id || room?.room_code || hotel?.room_code;
      const cIn = this.searchForm.check_in || hotel?.check_in;
      const cOut = this.searchForm.check_out || hotel?.check_out;
      const ad = this.searchForm.adults || 2;
      const pr = room?.raw_price || room?.final_price_dzd || 0;
      try {
        const data = await evaluateHotelRoom(
          this.searchResults.session_id || hotel.session_id || '',
          hotel.hotel_code, agreementCode,
          { check_in: cIn, check_out: cOut, adults: ad, price: pr }
        );
        this.evaluationResult = data?.data ?? null;
        if (this.evaluationResult?.search_number) {
          if (this.selectedRoom) this.selectedRoom.search_number = this.evaluationResult.search_number;
          if (this.selectedHotel) this.selectedHotel.search_number = this.evaluationResult.search_number;
        }
        return this.evaluationResult;
      } catch (err) {
        console.warn('Evaluation fallback:', err);
        this.evaluationResult = {
          status: 'ok', is_available: true,
          price: room?.final_price_dzd || hotel?.lowest_price_dzd || 0,
          cancellation_deadline: room?.deadline,
        };
        return this.evaluationResult;
      } finally { this.loadingEvaluation = false; }
    },

    async bookRoom(paxList, extraData = {}) {
      if (!this.selectedHotel || !this.selectedRoom) return null;
      this.loadingBooking = true;
      this.bookingError = null;
      this.bookingConfirmation = null;
      const roomCode = this.selectedRoom.agreement_id || this.selectedRoom.room_code || this.selectedHotel.room_code;
      const roomBasisCode = this.selectedRoom.room_basis || this.selectedRoom.room_basis_code || this.selectedHotel.room_basis_code;
      const roomBasisName = this.selectedRoom.room_type || this.selectedRoom.room_basis_name || this.selectedHotel.room_basis_name;
      const mealBasisCode = this.selectedRoom.meal_basis || this.selectedRoom.meal_basis_code || this.selectedHotel.meal_basis_code;
      const evaluatedSessionId = this.evaluationResult?.search_number
        || this.selectedRoom?.search_number
        || this.selectedRoom?.session_id
        || this.searchResults?.session_id
        || this.selectedHotel?.session_id;
      const payload = {
        session_id: evaluatedSessionId,
        hotel_code: this.selectedHotel.hotel_code,
        hotel_name: this.selectedHotel.hotel_name,
        hotel_category: this.selectedHotel.hotel_category || this.selectedHotel.stars,
        hotel_city: this.selectedHotel.hotel_city || this.selectedHotel.city,
        room_code: roomCode,
        room_basis_code: roomBasisCode,
        room_basis_name: roomBasisName,
        meal_basis_code: mealBasisCode,
        meal_basis_name: this.selectedRoom.meal_basis_name,
        check_in: this.searchForm.check_in || extraData.check_in,
        check_out: this.searchForm.check_out || extraData.check_out,
        destination_code: this.searchForm.destination_code || this.selectedHotel.destination_code || this.selectedHotel.city || this.selectedHotel.hotel_city || 'DZ',
        destination_name: this.searchForm.destination_name || this.selectedHotel.destination_name || this.selectedHotel.hotel_city || 'Alger',
        adults: this.searchForm.adults,
        children: this.searchForm.children,
        children_ages: this.searchForm.children_ages,
        nationality: this.searchForm.nationality || 'DZ',
        room_type: this.searchForm.room_type || 'dbl',
        ns_price: Number(this.selectedRoom.raw_price || this.selectedRoom.ns_price || this.evaluationResult?.raw_price || (this.selectedRoom?.final_price_dzd ? (this.selectedRoom.final_price_dzd / (this.selectedRoom.exchange_rate || 1)) : 100)),
        ns_currency: this.selectedRoom.currency || this.selectedRoom.ns_currency || this.evaluationResult?.currency || 'DZD',
        exchange_rate: Number(this.selectedRoom.exchange_rate || 1),
        markup_percent: Number(this.selectedRoom.markup_percent || 10),
        cancellation_deadline: this.selectedRoom?.deadline || this.evaluationResult?.cancellation_deadline || null,
        cancellation_policy: this.selectedRoom?.is_fully_refundable !== false ? 'refundable' : 'non_refundable',
        pax: paxList,
        ...extraData,
      };
      try {
        const data = await createHotelBooking(payload);
        this.bookingConfirmation = data?.data ?? null;
        return this.bookingConfirmation;
      } catch (err) {
        this.bookingError = err?.response?.data?.message ?? 'فشل إتمام الحجز';
        return null;
      } finally { this.loadingBooking = false; }
    },

    async fetchMyOrders(perPage = 10) {
      this.loadingOrders = true;
      this.ordersError = null;
      try {
        const data = await getMyHotelOrders(perPage);
        this.myOrders = data?.data?.data ?? [];
      } catch { this.ordersError = 'تعذّر تحميل طلباتك'; }
      finally { this.loadingOrders = false; }
    },

    async fetchOrder(id) {
      try {
        const data = await getHotelOrder(id);
        this.currentOrder = data?.data ?? null;
      } catch { this.currentOrder = null; }
    },

    async trackOrder(id) {
      try { const data = await trackHotelOrder(id); return data?.data ?? null; }
      catch { return null; }
    },

    async cancelOrder(id) {
      try {
        const data = await cancelHotelOrder(id);
        const idx = this.myOrders.findIndex((o) => o.id === id);
        if (idx !== -1) this.myOrders[idx].status = 'cancelled';
        return data?.data ?? null;
      } catch { return null; }
    },

    resetSearch() {
      this.loadingSearch = false;
      this.searchResults = { session_id: null, hotels: [], total: 0, criteria: null, page: 1, per_page: 50, displayed: 0, has_more: false };
      this.allHotels = [];
      this.allHotelsLoaded = false;
      this.loadingAllHotels = false;
      this.displayedCount = 50;
      this.selectedHotel = null;
      this.selectedRoom = null;
      this.evaluationResult = null;
      this.searchError = null;
    },

    resetFilters() {
      this.filters = { maxPrice: null, minStars: null, mealBasis: '' };
      this.sortBy = 'price_asc';
      this.displayedCount = 50;
    },
  },
  persist: {
    paths: ['searchForm', 'searchResults', 'selectedHotel', 'selectedRoom', 'evaluationResult'],
  },
});
