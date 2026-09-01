<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { sendApi } from '@/composables/api';

// ============================================================
//  PAGE STATE
// ============================================================
const currentView = ref('search'); // 'search' | 'results' | 'prebooking' | 'confirmation'

// ============================================================
//  CITY DATABASE (real names -> Netstorming codes)
// ============================================================
const allCities = [
  { name: 'Dubai', code: 'DXB', country: 'Emirats Arabes Unis' },
  { name: 'Abu Dhabi', code: 'AUH', country: 'Emirats Arabes Unis' },
  { name: 'Sharjah', code: 'SHJ', country: 'Emirats Arabes Unis' },
  { name: 'Istanbul', code: 'IST', country: 'Turquie' },
  { name: 'Antalya', code: 'AYT', country: 'Turquie' },
  { name: 'Bodrum', code: 'BJV', country: 'Turquie' },
  { name: 'Ankara', code: 'ANK', country: 'Turquie' },
  { name: 'Trabzon', code: 'TZX', country: 'Turquie' },
  { name: 'Bursa', code: 'YEI', country: 'Turquie' },
  { name: 'Paris', code: 'PAR', country: 'France' },
  { name: 'Nice', code: 'NCE', country: 'France' },
  { name: 'Lyon', code: 'LYS', country: 'France' },
  { name: 'Marseille', code: 'MRS', country: 'France' },
  { name: 'Londres', code: 'LON', country: 'Royaume-Uni' },
  { name: 'Rome', code: 'ROM', country: 'Italie' },
  { name: 'Milan', code: 'MIL', country: 'Italie' },
  { name: 'Venise', code: 'VCE', country: 'Italie' },
  { name: 'Florence', code: 'FLR', country: 'Italie' },
  { name: 'Barcelone', code: 'BCN', country: 'Espagne' },
  { name: 'Madrid', code: 'MAD', country: 'Espagne' },
  { name: 'Kuala Lumpur', code: 'KUL', country: 'Malaisie' },
  { name: 'Bangkok', code: 'BKK', country: 'Thailande' },
  { name: 'Singapour', code: 'SIN', country: 'Singapour' },
  { name: 'Doha', code: 'DOH', country: 'Qatar' },
  { name: 'Le Caire', code: 'CAI', country: 'Egypte' },
  { name: 'Charm el-Cheikh', code: 'SSH', country: 'Egypte' },
  { name: 'Hurghada', code: 'HRG', country: 'Egypte' },
  { name: 'Djeddah', code: 'JED', country: 'Arabie Saoudite' },
  { name: 'La Mecque', code: 'MEC', country: 'Arabie Saoudite' },
  { name: 'Medine', code: 'MED', country: 'Arabie Saoudite' },
  { name: 'Riyad', code: 'RUH', country: 'Arabie Saoudite' },
  { name: 'Alger', code: 'ALG', country: 'Algerie' },
  { name: 'Oran', code: 'ORN', country: 'Algerie' },
  { name: 'Constantine', code: 'CZL', country: 'Algerie' },
  { name: 'Tunis', code: 'TUN', country: 'Tunisie' },
  { name: 'Casablanca', code: 'CAS', country: 'Maroc' },
  { name: 'Marrakech', code: 'RAK', country: 'Maroc' },
  { name: 'Amman', code: 'AMM', country: 'Jordanie' },
  { name: 'Beyrouth', code: 'BEY', country: 'Liban' },
  { name: 'Bali', code: 'DPS', country: 'Indonesie' },
  { name: 'Maldives', code: 'MLE', country: 'Maldives' },
  { name: 'Zanzibar', code: 'ZNZ', country: 'Tanzanie' },
  { name: 'Prague', code: 'PRG', country: 'Republique Tcheque' },
  { name: 'Vienne', code: 'VIE', country: 'Autriche' },
  { name: 'Amsterdam', code: 'AMS', country: 'Pays-Bas' },
  { name: 'Munich', code: 'MUC', country: 'Allemagne' },
  { name: 'Berlin', code: 'BER', country: 'Allemagne' },
  { name: 'Geneve', code: 'GVA', country: 'Suisse' },
  { name: 'Lisbonne', code: 'LIS', country: 'Portugal' },
  { name: 'Athenes', code: 'ATH', country: 'Grece' },
  { name: 'Tbilissi', code: 'TBS', country: 'Georgie' },
  { name: 'Bakou', code: 'GYD', country: 'Azerbaidjan' },
  { name: 'Moscou', code: 'MOW', country: 'Russie' },
];

// ============================================================
//  SEARCH FORM STATE
// ============================================================
const destinationQuery = ref('');
const showCitySuggestions = ref(false);
const selectedCityObj = ref(null);

const filteredCities = computed(() => {
  if (!destinationQuery.value) return allCities.slice(0, 15);
  const q = destinationQuery.value.toLowerCase();
  return allCities.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.country.toLowerCase().includes(q)
  );
});

const selectCity = (city) => {
  destinationQuery.value = city.name + ', ' + city.country;
  selectedCityObj.value = city;
  form.value.city_code = (city.code === 'SHJ') ? 'DXB' : city.code;
  if (city.type === 'hotel') {
    filters.value.hotelName = city.name;
  } else {
    filters.value.hotelName = '';
  }
  showCitySuggestions.value = false;
};

// Set default dates
const today = new Date();
const d10 = new Date(today.getTime() + 10 * 86400000);
const d12 = new Date(today.getTime() + 12 * 86400000);
const fmt = (d) => d.toISOString().split('T')[0];

const form = ref({
  checkin: fmt(d10),
  checkout: fmt(d12),
  nationality: 'DZ',
  city_code: '',
  rooms: [{ type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] }],
  geocoding: '',
  geocoding_km: 5,
  stars: '',
  budget_currency: 'DZD',
  criteria: '',
  refundable_only: false,
  available_only: true,
});

const calculateNights = computed(() => {
  if (!form.value.checkin || !form.value.checkout) return 1;
  const diff = Math.ceil((new Date(form.value.checkout) - new Date(form.value.checkin)) / 86400000);
  return diff > 0 ? diff : 1;
});

const totalAdults = computed(() => {
  return form.value.rooms.reduce((sum, r) => {
    const t = (r.type || 'DBL').toUpperCase();
    if (t === 'SGL') return sum + 1;
    if (t === 'TRP') return sum + 3;
    if (t === 'QUD') return sum + 4;
    return sum + 2;
  }, 0);
});

const addRoom = () => {
  form.value.rooms.push({ type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] });
};

const removeRoom = (idx) => {
  if (form.value.rooms.length > 1) form.value.rooms.splice(idx, 1);
};

const showAdvanced = ref(false);

// ============================================================
//  SEARCH API
// ============================================================
const results = ref([]);
const loading = ref(false);
const error = ref(null);
const rawLogs = ref(null);
const searchNumber = ref('');

const searchHotels = async () => {
  if (!form.value.city_code) {
    error.value = 'Veuillez selectionner une destination.';
    return;
  }
  loading.value = true;
  error.value = null;
  results.value = [];
  rawLogs.value = null;

  try {
    const response = await sendApi('/hotels/search', {
      checkin: form.value.checkin,
      checkout: form.value.checkout,
      nationality: form.value.nationality,
      rooms: form.value.rooms,
      hotel_ids: [],
      city_code: form.value.city_code
    }, 'POST');

    if (response && (response.status === 'success' || response.success === true)) {
      results.value = response.data || [];
      rawLogs.value = response.logs;
      searchNumber.value = response.search_number || '';
      currentView.value = 'results';
      currentPage.value = 1;
    } else if (response) {
      error.value = response.message || 'Erreur lors de la recherche';
      rawLogs.value = response.logs;
    } else {
      error.value = 'Erreur reseau ou reponse inattendue.';
    }
  } catch (e) {
    error.value = e.data?.message || e.message || 'Une erreur est survenue lors de la recherche';
  } finally {
    loading.value = false;
  }
};

// ============================================================
//  SIDEBAR FILTERS (applied client-side on results)
// ============================================================
const filters = ref({
  hotelName: '',
  stars: [],
  categories: [],
  positions: [],
  quartiers: [],
  priceMin: 0,
  priceMax: 99999999,
  cancellation: [],
  meals: [],
  showFavorites: false,
  showBestHotels: false,
});

const getMinPrice = (hotel) => {
  if (!hotel.arrangements || hotel.arrangements.length === 0) return 0;
  return Math.min(...hotel.arrangements.map(a => a.price || 0));
};

const boardTypeLabel = (bt) => {
  const map = {
    'RO': 'Chambre Seulement',
    'BB': 'Hebergement et Petit Dejeuner',
    'HB': 'Demi-Pension',
    'FB': 'Pension Complete',
    'AI': 'All Inclusive',
  };
  return map[bt?.toUpperCase()] || bt || 'Chambre Seulement';
};

const filteredResults = computed(() => {
  let data = [...results.value];
  if (filters.value.hotelName.trim()) {
    const q = filters.value.hotelName.toLowerCase();
    data = data.filter(h => h.name?.toLowerCase().includes(q) || h.address?.toLowerCase().includes(q));
  }
  if (filters.value.stars.length > 0) {
    data = data.filter(h => filters.value.stars.includes(String(h.stars)));
  }
  data = data.filter(h => {
    const mp = getMinPrice(h);
    return mp >= filters.value.priceMin && mp <= filters.value.priceMax;
  });
  if (filters.value.cancellation.length > 0) {
    data = data.filter(h => {
      return h.arrangements?.some(a => {
        if (filters.value.cancellation.includes('refundable') && a.refundable) return true;
        if (filters.value.cancellation.includes('non_refundable') && !a.refundable) return true;
        return false;
      });
    });
  }
  if (filters.value.meals.length > 0) {
    data = data.filter(h => {
      return h.arrangements?.some(a => filters.value.meals.includes(a.board_type?.toUpperCase()));
    });
  }
  if (filters.value.showBestHotels) {
    data = data.filter(h => h.promo);
  }
  return data;
});

// ============================================================
//  SORTING
// ============================================================
const sortBy = ref('prix');
const sortedResults = computed(() => {
  const data = [...filteredResults.value];
  switch (sortBy.value) {
    case 'etoiles':
      data.sort((a, b) => (parseInt(b.stars) || 0) - (parseInt(a.stars) || 0));
      break;
    case 'prix':
      data.sort((a, b) => getMinPrice(a) - getMinPrice(b));
      break;
    case 'nom':
      data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'offres':
      data.sort((a, b) => (b.promo ? 1 : 0) - (a.promo ? 1 : 0));
      break;
    default:
      break;
  }
  return data;
});

// ============================================================
//  PAGINATION
// ============================================================
const currentPage = ref(1);
const perPage = 10;

const totalPages = computed(() => Math.ceil(sortedResults.value.length / perPage));
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return sortedResults.value.slice(start, start + perPage);
});

const paginationRange = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const cur = currentPage.value;
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (cur > 3) pages.push('...');
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push('...');
    pages.push(total);
  }
  return pages;
});

const goToPage = (p) => {
  if (typeof p === 'number' && p >= 1 && p <= totalPages.value) {
    currentPage.value = p;
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};

// ============================================================
//  HOTEL CARD STATE
// ============================================================
const expandedHotels = ref({});
const toggleHotelRooms = (hotelId) => {
  expandedHotels.value[hotelId] = !expandedHotels.value[hotelId];
};

// ============================================================
//  PRE-BOOKING & BOOKING
// ============================================================
const selectedHotel = ref(null);
const selectedArrangement = ref(null);
const bookingStep = ref('form');
const bookingLoading = ref(false);
const bookingError = ref(null);
const bookingResponse = ref(null);
const copiedRef = ref(false);

const bookingForm = ref({
  holder: {
    title: 'MR',
    name: '',
    surname: '',
    email: 'contact@bouazizetravel.com',
    phone: '+213550000000'
  },
  agent_ref: '',
  rooms: []
});

const openBookingModal = (hotel, arrangement) => {
  selectedHotel.value = hotel;
  selectedArrangement.value = arrangement;
  bookingStep.value = 'form';
  bookingError.value = null;
  bookingResponse.value = null;
  copiedRef.value = false;

  const roomsToBook = [];
  const sourceRooms = (arrangement.rooms && arrangement.rooms.length > 0) ? arrangement.rooms : form.value.rooms;
  sourceRooms.forEach((r, idx) => {
    const type = (r.type || 'DBL').toUpperCase();
    let paxCount = 2;
    if (type === 'SGL') paxCount = 1;
    else if (type === 'TRP') paxCount = 3;
    else if (type === 'QUD') paxCount = 4;

    const paxList = [];
    for (let i = 0; i < paxCount; i++) {
      paxList.push({ title: i % 2 === 0 ? 'MR' : 'MRS', name: '', surname: '' });
    }
    roomsToBook.push({ type: type.toLowerCase(), required: r.required || 1, passengers: paxList });
  });

  bookingForm.value.rooms = roomsToBook;
  currentView.value = 'prebooking';
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const executePrebookAndBook = async () => {
  bookingLoading.value = true;
  bookingError.value = null;
  bookingStep.value = 'prebooking';

  try {
    const payload = {
      hotel_id: selectedHotel.value.id,
      agreement_id: selectedArrangement.value.id || '1',
      checkin: form.value.checkin,
      checkout: form.value.checkout,
      nationality: form.value.nationality,
      rooms: bookingForm.value.rooms,
      holder: bookingForm.value.holder
    };

    const prebookRes = await sendApi('/hotels/prebook', payload, 'POST');
    if (!prebookRes || (prebookRes.status !== 'success' && prebookRes.success !== true)) {
      bookingStep.value = 'error';
      bookingError.value = prebookRes?.message || 'Echec de l evaluation (Prebooking Netstorming).';
      return;
    }

    bookingStep.value = 'confirming';
    const bookRes = await sendApi('/hotels/book', payload, 'POST');
    if (bookRes && (bookRes.status === 'success' || bookRes.success === true)) {
      bookingStep.value = 'success';
      bookingResponse.value = bookRes;
      currentView.value = 'confirmation';
      nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    } else {
      bookingStep.value = 'error';
      bookingError.value = bookRes?.message || 'Echec de la confirmation finale.';
    }
  } catch (e) {
    bookingStep.value = 'error';
    bookingError.value = e.data?.message || e.message || 'Erreur lors de la reservation';
  } finally {
    bookingLoading.value = false;
  }
};

const copyReference = (text) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  copiedRef.value = true;
  setTimeout(() => { copiedRef.value = false; }, 2500);
};

const goBackToResults = () => {
  currentView.value = 'results';
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const goBackToSearch = () => {
  currentView.value = 'search';
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const formatPrice = (price) => {
  if (!price) return '0,00';
  return Number(price).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const starString = (n) => {
  const num = parseInt(n) || 0;
  let s = '';
  for (let i = 0; i < num; i++) s += '\u2605';
  return s;
};

const starCounts = computed(() => {
  const counts = {};
  results.value.forEach(h => {
    const s = String(h.stars || '0');
    counts[s] = (counts[s] || 0) + 1;
  });
  return counts;
});

const mealCounts = computed(() => {
  const counts = {};
  results.value.forEach(h => {
    (h.arrangements || []).forEach(a => {
      const bt = (a.board_type || 'RO').toUpperCase();
      counts[bt] = (counts[bt] || 0) + 1;
    });
  });
  return counts;
});

const cancellationCounts = computed(() => {
  let refundable = 0;
  let nonRefundable = 0;
  results.value.forEach(h => {
    (h.arrangements || []).forEach(a => {
      if (a.refundable) refundable++;
      else nonRefundable++;
    });
  });
  return { refundable, non_refundable: nonRefundable };
});

const priceRange = computed(() => {
  if (!results.value || results.value.length === 0) return { min: 0, max: 0 };
  let min = Infinity, max = 0;
  results.value.forEach(h => {
    const p = getMinPrice(h);
    if (p > 0 && p < min) min = p;
    if (p > max) max = p;
  });
  return { min: min === Infinity ? 0 : Math.floor(min), max: Math.ceil(max) };
});

watch(results, (newVal) => {
  if (newVal.length > 0) {
    filters.value.priceMin = priceRange.value.min;
    filters.value.priceMax = priceRange.value.max;
  }
});

const toggleFilter = (arr, val) => {
  const idx = arr.indexOf(val);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(val);
};

const sidebarOpen = ref(true);
</script>
<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

    <!-- SEARCH FORM VIEW -->
    <div v-if="currentView === 'search'" class="max-w-5xl mx-auto px-4 py-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
          Reservation d'Hotel en Ligne
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Recherchez et reservez parmi des milliers d'hotels a travers le monde</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/30 border border-slate-200 dark:border-slate-800 p-6 md:p-8">

        <div class="flex justify-end mb-4">
          <button type="button" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            RECHERCHES RECENTES
          </button>
        </div>

        <!-- Destination + Geocoding Row -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 mb-5">
          <div class="relative">
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Choisissez votre destination</label>
            <input
              v-model="destinationQuery"
              @focus="showCitySuggestions = true"
              @blur="setTimeout(() => showCitySuggestions = false, 200)"
              type="text"
              placeholder="Ville, pays ou code..."
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            />
            <div v-if="showCitySuggestions && filteredCities.length > 0" class="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-black/40">
              <button
                v-for="city in filteredCities" :key="city.code"
                @mousedown.prevent="selectCity(city)"
                class="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
              >
                <span class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                    <Icon v-if="city.type === 'hotel'" name="i-heroicons-building-office-2" class="w-4 h-4" />
                    <Icon v-else name="i-heroicons-map-pin" class="w-4 h-4" />
                  </span>
                <div>
                  <div class="text-sm font-semibold text-slate-800 dark:text-white">{{ city.name }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ city.country }}</div>
                </div>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Geocodage</label>
            <input v-model="form.geocoding" type="text" placeholder="Lieu..." class="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Km</label>
            <input v-model.number="form.geocoding_km" type="number" min="1" max="100" class="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
        </div>

        <!-- Dates + Nights + Rooms Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">De</label>
            <input v-model="form.checkin" type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Au</label>
            <input v-model="form.checkout" type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nuits</label>
            <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-center text-slate-700 dark:text-slate-300">{{ calculateNights }}</div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Chambres</label>
            <div class="flex items-center gap-2">
              <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-center text-slate-700 dark:text-slate-300 flex-1">{{ form.rooms.length }}</div>
              <button @click="addRoom" type="button" class="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-lg font-bold cursor-pointer transition-colors shadow-md shadow-blue-600/20">+</button>
            </div>
          </div>
        </div>

        <!-- Room Details -->
        <div v-for="(room, index) in form.rooms" :key="index" class="mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="flex flex-wrap items-end gap-4">
            <div class="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider w-28">CHAMBRE {{ index + 1 }}</div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Adultes</label>
              <select class="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm text-center text-slate-800 dark:text-slate-200 focus:outline-none rounded-lg cursor-pointer">
                <option>1</option><option selected>2</option><option>3</option><option>4</option>
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
              <input type="checkbox" v-model="room.cots" :true-value="1" :false-value="0" class="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
            </div>
            <div class="flex gap-4 ml-2">
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" v-model="room.type" value="DBL" class="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />Double
              </label>
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" v-model="room.type" value="TWN" class="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />Chambre Twin
              </label>
            </div>
            <button v-if="form.rooms.length > 1" @click="removeRoom(index)" type="button" class="ml-auto w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors">x</button>
          </div>
          <div v-if="room.children.length > 0" class="flex flex-wrap items-center gap-3 mt-3 ml-[132px]">
            <div v-for="(childAge, cIdx) in room.children" :key="cIdx">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Age enf {{ cIdx+1 }}</label>
              <input type="number" v-model="room.children[cIdx]" min="0" max="17" class="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-xs text-center text-slate-900 dark:text-white focus:outline-none rounded-lg" />
            </div>
          </div>
        </div>

        <!-- Advanced Options -->
        <div class="mb-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div @click="showAdvanced = !showAdvanced" class="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">OPTIONS AVANCEES</span>
            </div>
            <span class="w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-lg leading-none font-medium">{{ showAdvanced ? '-' : '+' }}</span>
          </div>
          <div v-if="showAdvanced" class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Etoiles</label>
                <select v-model="form.stars" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="">Indifferent</option>
                  <option value="5">5 Etoiles</option><option value="4">4 Etoiles</option><option value="3">3 Etoiles</option><option value="2">2 Etoiles</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Criteres de selection</label>
                <select v-model="form.criteria" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="">Tous</option>
                </select>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Budget</label>
                <select v-model="form.budget_currency" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="DZD">Algerian Dinar</option><option value="EUR">Euro (EUR)</option><option value="USD">US Dollar (USD)</option>
                </select>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" v-model="form.refundable_only" class="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
                  Tarifs remboursables uniquement
                </label>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Nationalite de passage</label>
              <select v-model="form.nationality" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                <option value="DZ">ALGERIA</option><option value="FR">FRANCE</option><option value="GB">UNITED KINGDOM</option><option value="SA">SAUDI ARABIA</option><option value="AE">UAE</option><option value="TR">TURKEY</option>
              </select>
            </div>
            <div class="flex items-center gap-3 pt-4">
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" v-model="form.available_only" class="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
                Hotels disponibles uniquement
              </label>
            </div>
          </div>
        </div>

        <div v-if="error && currentView === 'search'" class="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">{{ error }}</div>

        <button @click="searchHotels" :disabled="loading" class="w-full md:w-auto md:min-w-[280px] mx-auto block px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 cursor-pointer">
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            Recherche en cours...
          </span>
          <span v-else>RECHERCHER</span>
        </button>
      </div>
    </div>
    <!-- RESULTS VIEW -->
    <div v-if="currentView === 'results'" class="max-w-[1440px] mx-auto px-4 py-6">
      <div class="mb-4">
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase">
          {{ selectedCityObj?.name || 'Resultats' }}<span v-if="selectedCityObj?.country" class="text-slate-400 dark:text-slate-500">, {{ selectedCityObj.country }}</span>
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hotels disponibles <strong class="text-slate-800 dark:text-white">{{ results.length }}</strong>
          (Immediate: {{ results.length }} - Sur demande: 0)
        </p>
      </div>

      <!-- Summary Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-300">
          <span><strong>Nuits: {{ calculateNights }}</strong> ({{ form.checkin }} - {{ form.checkout }})</span>
          <span class="text-slate-300 dark:text-slate-600">|</span>
          <span>Chambres: <strong>{{ form.rooms.length }}</strong></span>
          <span class="text-slate-300 dark:text-slate-600">|</span>
          <span>Adultes: <strong>{{ totalAdults }}</strong></span>
        </div>
        <button @click="goBackToSearch" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all cursor-pointer">
          MODIFIER LA RECHERCHE
        </button>
      </div>

      <!-- Sorting Tabs -->
      <div class="flex flex-wrap items-center gap-1 mb-5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 uppercase">Tries par</span>
        <button v-for="tab in [{key:'etoiles',label:'Etoiles'},{key:'position',label:'Position'},{key:'prix',label:'Prix'},{key:'nom',label:'Nom'},{key:'offres',label:'Offres speciales'},{key:'favoris',label:'Favoris'}]" :key="tab.key"
          @click="sortBy = tab.key"
          :class="sortBy === tab.key ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
          class="px-3 py-2 text-sm cursor-pointer transition-colors"
        >{{ tab.label }}</button>
        <div class="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          ( Resultats: {{ (currentPage - 1) * perPage + 1 }}-{{ Math.min(currentPage * perPage, sortedResults.length) }} de {{ sortedResults.length }} )
        </div>
      </div>

      <!-- 2-Column Layout -->
      <div class="flex gap-6">
        <!-- LEFT SIDEBAR FILTERS -->
        <aside class="w-64 shrink-0 hidden lg:block space-y-6">
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">NOM DE L'HOTEL</h3>
            <div class="flex gap-1">
              <input v-model="filters.hotelName" type="text" placeholder="Tapez le nom et appuyez sur Entr..." class="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button class="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors">GO</button>
            </div>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">DIVERS</h3>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" v-model="filters.showFavorites" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              afficher les hotels favoris (0)
            </label>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" v-model="filters.showBestHotels" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              Afficher les meilleurs hotels ({{ results.filter(h => h.promo).length }})
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">PRIX</h3>
            <div class="flex items-center gap-1.5 mb-2">
              <span class="text-[10px] text-slate-500">Prix:</span>
              <input v-model.number="filters.priceMin" type="number" class="w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" />
              <span class="text-[10px] text-slate-500">-</span>
              <input v-model.number="filters.priceMax" type="number" class="w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" />
              <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400">DZD</span>
            </div>
            <input type="range" :min="priceRange.min" :max="priceRange.max" v-model.number="filters.priceMax" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">POLITIQUE D'ANNULATION</h3>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.cancellation.includes('non_refundable')" @change="toggleFilter(filters.cancellation, 'non_refundable')" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              Non remboursable ({{ cancellationCounts.non_refundable }})
            </label>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.cancellation.includes('refundable')" @change="toggleFilter(filters.cancellation, 'refundable')" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              Remboursable ({{ cancellationCounts.refundable }})
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">ETOILES</h3>
            <label v-for="s in ['5','4','3','2','1']" :key="s" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.stars.includes(s)" @change="toggleFilter(filters.stars, s)" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              <span class="text-amber-500">{{ starString(s) }}</span> ({{ starCounts[s] || 0 }})
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">CATEGORIE</h3>
            <label v-for="cat in ['Touristique','Touristique superieure','Premiere','Premiere superieure','De luxe']" :key="cat" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.categories.includes(cat)" @change="toggleFilter(filters.categories, cat)" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              {{ cat }}
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">REPAS</h3>
            <label v-for="meal in [{code:'RO',label:'Chambre Seulement'},{code:'BB',label:'Hebergement et Petit Dejeuner'},{code:'HB',label:'Demi-Pension'},{code:'FB',label:'Pension Complete'},{code:'AI',label:'All Inclusive'}]" :key="meal.code" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.meals.includes(meal.code)" @change="toggleFilter(filters.meals, meal.code)" class="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
              {{ meal.label }} ({{ mealCounts[meal.code] || 0 }})
            </label>
          </div>
        </aside>

        <!-- MAIN RESULTS AREA -->
        <div class="flex-1 min-w-0 space-y-5">
          <div v-if="loading" class="text-center py-20">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Recherche en cours...</p>
          </div>
          <div v-else-if="paginatedResults.length === 0" class="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <p class="text-lg font-bold text-slate-500 dark:text-slate-400">Aucun hotel trouve</p>
            <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Essayez de modifier vos criteres de recherche</p>
          </div>          <div v-for="hotel in paginatedResults" :key="hotel.id" class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

            <div class="flex flex-col md:flex-row">
              <div class="w-full md:w-56 h-44 md:h-auto flex items-center justify-center relative shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60" class="absolute inset-0 w-full h-full object-cover" />
                <div v-if="hotel.promo" class="absolute top-3 left-3 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-md shadow-lg flex items-center gap-1">
                  <Icon name="i-heroicons-sparkles" class="w-3.5 h-3.5" /> OFFRE SPECIALE!
                </div>
              </div>

              <div class="flex-1 p-4 md:p-5">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {{ hotel.name }}
                      <span class="text-amber-500 text-sm ml-1">{{ starString(hotel.stars) }}</span>
                    </h3>
                    <p v-if="hotel.address" class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                      {{ hotel.address }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                    <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    </button>
                    <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </button>
                  </div>
                </div>

                <div class="flex gap-2 mt-3">
                  <button @click="toggleHotelRooms(hotel.id)" class="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">{{ expandedHotels[hotel.id] ? "CACHER DETAILS" : "DETAILS" }}</button>
                  <button class="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">CARTE</button>
                </div>

                <div class="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p v-if="hotel.city"><strong>Quartier:</strong> {{ hotel.city }}</p>
                  <p><strong>Position:</strong> Pres du centre</p>
                </div>

                <div class="flex gap-2 mt-3">
                  <div class="w-7 h-7 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center" title="Wi-Fi">
                    <Icon name="i-heroicons-wifi" class="w-4 h-4" />
                  </div>
                  <div class="w-7 h-7 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center" title="Piscine">
                    <Icon name="i-heroicons-sun" class="w-4 h-4" />
                  </div>
                  <div class="w-7 h-7 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center" title="Restaurant">
                    <Icon name="i-heroicons-cake" class="w-4 h-4" />
                  </div>
                  <div class="w-7 h-7 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center" title="Parking">
                    <Icon name="i-heroicons-truck" class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div class="p-4 md:p-5 text-right md:w-52 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                <div>
                  <div class="text-[10px] text-slate-400 dark:text-slate-500 italic">Prix a partir de:</div>
                  <div class="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {{ formatPrice(getMinPrice(hotel)) }}
                    <span class="text-sm font-bold text-slate-500">DZD</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-800">
              <div class="grid grid-cols-[1fr_200px_180px_140px_auto] gap-0 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <div class="px-4 py-3 flex items-center gap-1">Type de chambre <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                <div class="px-4 py-3">Traitement</div>
                <div class="px-4 py-3">Conditions d'annulation</div>
                <div class="px-4 py-3 text-right">Total</div>
                <div class="px-4 py-3"></div>
              </div>

              <div v-for="(arr, arrIdx) in hotel.arrangements" :key="arrIdx" v-show="arrIdx < 2 || expandedHotels[hotel.id]" class="grid grid-cols-[1fr_200px_180px_140px_auto] gap-0 items-center border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
                <div class="px-4 py-3">
                  <div class="text-sm font-bold text-slate-800 dark:text-white uppercase">{{ arr.room_type || 'Standard Room' }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    1 x Double [ {{ arr.rooms && arr.rooms[0] ? arr.rooms[0].occupancy || 2 : 2 }} Adultes ]
                  </div>
                  <button class="mt-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800 rounded-md px-2 py-0.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-colors">
                    OFFRES SPECIALES - REMARQUES
                  </button>
                </div>
                <div class="px-4 py-3">
                  <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ boardTypeLabel(arr.board_type) }}</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Petit-dejeuner: Continental</div>
                </div>
                <div class="px-4 py-3">
                  <span v-if="!arr.refundable" class="text-xs font-bold text-red-600 dark:text-red-400 uppercase">NON REMBOURSABLE</span>
                  <div v-else class="text-xs text-green-600 dark:text-green-400">
                    <span class="font-semibold">Annulation sans frais</span>
                    <div v-if="arr.deadline" class="text-[11px] mt-0.5">jusqu'au <strong>{{ arr.deadline }}</strong></div>
                  </div>
                </div>
                <div class="px-4 py-3 text-right">
                  <div class="text-base font-black text-slate-900 dark:text-white">{{ formatPrice(arr.price) }}</div>
                  <div class="text-[11px] font-bold text-slate-500">{{ arr.currency || 'DZD' }}</div>
                </div>
                <div class="px-4 py-3">
                  <button @click="openBookingModal(hotel, arr)" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-green-600/20 cursor-pointer transition-all whitespace-nowrap">
                    SELECTIONNER
                  </button>
                </div>
              </div>
            </div>

            <div v-if="hotel.arrangements.length > 2" class="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-200 dark:border-slate-800">
              <button @click="toggleHotelRooms(hotel.id)" class="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer transition-all">
                {{ expandedHotels[hotel.id] ? "MASQUER LES OFFRES" : "AFFICHER PLUS D'OFFRES" }}
              </button>
            </div>
          </div>

          <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 pt-4 pb-8">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              PRECEDENT
            </button>
            <template v-for="page in paginationRange" :key="page">
              <button v-if="page !== '...'" @click="goToPage(page)" :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'" class="w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center cursor-pointer transition-all">
                {{ page }}
              </button>
              <span v-else class="px-1 text-slate-400">?</span>
            </template>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              SUIVANT
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- PRE-BOOKING VIEW -->
    <div v-if="currentView === 'prebooking'" class="max-w-5xl mx-auto px-4 py-6">
      <button @click="goBackToResults" class="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer mb-4 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        PAGE PRECEDENTE
      </button>

      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-52 h-36 md:h-auto flex items-center justify-center shrink-0 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60" class="absolute inset-0 w-full h-full object-cover" />
          </div>

          <div class="flex-1 p-5">
            <h2 class="text-xl font-black text-slate-900 dark:text-white">
              {{ selectedHotel?.name }}
              <span class="text-amber-500 text-sm ml-1">{{ starString(selectedHotel?.stars) }}</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
              {{ selectedHotel?.address || selectedHotel?.city }}
            </p>

            <div class="mt-4">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase">VOTRE RESERVATION</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span class="font-bold text-slate-500 dark:text-slate-500 block">Jour d'arrivee:</span>
                  {{ form.checkin }}
                </div>
                <div>
                  <span class="font-bold text-slate-500 dark:text-slate-500 block">Jour de depart:</span>
                  {{ form.checkout }} (Nuits: {{ calculateNights }})
                </div>
                <div>
                  <span class="font-bold text-slate-500 dark:text-slate-500 block">Type de chambre:</span>
                  {{ selectedArrangement?.room_type || 'Standard Room' }}
                </div>
                <div>
                  <span class="font-bold text-slate-500 dark:text-slate-500 block">Traitement:</span>
                  {{ boardTypeLabel(selectedArrangement?.board_type) }}
                </div>
                <div>
                  <span class="font-bold text-slate-500 dark:text-slate-500 block">Disponibilite:</span>
                  <span class="text-green-600 dark:text-green-400 font-bold">Immediate</span>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-56 shrink-0 p-5 bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
            <div class="text-xs text-slate-500 dark:text-slate-400">Chambres: {{ form.rooms.length }}</div>
            <div class="mt-2 px-4 py-3 border-2 border-slate-800 dark:border-white rounded-lg text-center">
              <div class="text-xs text-slate-500 dark:text-slate-400">Prix total:</div>
              <div class="text-xl font-black text-slate-900 dark:text-white">{{ formatPrice(selectedArrangement?.price) }} DZD</div>
            </div>
            <div class="mt-2 w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-black">DZD</div>
            <div v-if="selectedArrangement?.refundable && selectedArrangement?.deadline" class="mt-2 text-[10px] text-red-600 dark:text-red-400 text-center font-semibold">
              Attention: Annulation sans frais jusqu'au {{ selectedArrangement.deadline }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 p-5">
        <h3 class="text-sm font-black text-red-600 dark:text-red-400 uppercase mb-4">OFFRES SPECIALES - REMARQUES</h3>
        <div class="mb-4">
          <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">remarques - Annulation</h4>
          <div class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
            <p>Les conditions d'annulation sont definies par le fournisseur. Veuillez verifier les conditions specifiques avant de confirmer votre reservation.</p>
          </div>
        </div>
        <div class="mb-4">
          <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">remarques - myGO</h4>
          <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
            <li class="text-red-600 dark:text-red-400">ATTENTION : merci de reserver une chambre double pour garantir la reservation d'une chambre double a usage single.</li>
            <li class="text-red-600 dark:text-red-400">Veuillez noter que cette ville a une taxe de sejour a payer sur place.</li>
            <li class="text-red-600 dark:text-red-400">Les berceaux sont toujours SUR DEMANDE aupres de l'hotel et necessitent une confirmation ulterieure.</li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">remarques - Fournisseur</h4>
          <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
            <li>Supplier meal plan: Room Only</li>
            <li>Supplier has not specified bed type</li>
          </ul>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-6">
        <h3 class="text-sm font-black text-red-600 dark:text-red-400 uppercase mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">DONNEES DE RESERVATION</h3>
        <div class="mb-5">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Agent:</label>
          <input v-model="bookingForm.agent_ref" type="text" placeholder="Reference agent..." class="w-64 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
        </div>
        <div class="mb-5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
          Attention! Merci d'entrer le nom des passagers pour votre reservation
        </div>
        <div v-for="(room, rIdx) in bookingForm.rooms" :key="rIdx" class="mb-6 last:mb-0">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 pb-1 border-b border-slate-200 dark:border-slate-700">
            {{ room.type.toUpperCase() }} ( Berceau )
          </div>
          <div v-for="(pax, pIdx) in room.passengers" :key="pIdx" class="flex items-center gap-3 mb-2">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" :class="pIdx === 0 ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-white'">{{ pIdx + 1 }}</span>
            <select v-model="pax.title" class="w-20 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
              <option>MR</option><option>MRS</option><option>MS</option><option>MISS</option>
            </select>
            <input v-model="pax.surname" type="text" placeholder="Nom de famille" class="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <input v-model="pax.name" type="text" placeholder="Prenom" class="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div v-if="bookingError" class="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
        {{ bookingError }}
      </div>

      <div class="flex gap-3">
        <button
          @click="executePrebookAndBook"
          :disabled="bookingLoading"
          class="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-green-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <svg v-if="bookingLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          {{ bookingStep === 'prebooking' ? 'Evaluation en cours...' : (bookingStep === 'confirming' ? 'Confirmation finale...' : 'CONFIRMATION') }}
        </button>
        <button @click="goBackToResults" class="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all cursor-pointer">
          ANNULER
        </button>
      </div>
    </div>
    <!-- CONFIRMATION VIEW -->
    <div v-if="currentView === 'confirmation'" class="max-w-4xl mx-auto px-4 py-10">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Reservation Confirmee !</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Votre reservation a ete traitee avec succes par le systeme.</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 class="text-white font-black text-lg uppercase tracking-wider">Details de la reservation</h2>
          <div class="flex items-center gap-2">
            <span class="text-blue-100 text-xs font-bold uppercase">Reference :</span>
            <div class="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-white font-mono font-bold">
              {{ bookingResponse?.data?.reference || 'REF-XXX' }}
              <button @click="copyReference(bookingResponse?.data?.reference)" class="hover:text-blue-200 cursor-pointer transition-colors" title="Copier">
                <svg v-if="copiedRef" class="w-4 h-4 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">Hotel</h3>
              <p class="text-lg font-bold text-slate-800 dark:text-slate-200">{{ selectedHotel?.name }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ selectedHotel?.address || selectedHotel?.city }}</p>

              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800 mt-6">Sejour</h3>
              <div class="flex gap-4">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Arrivee</p>
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ form.checkin }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Depart</p>
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ form.checkout }}</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Re�u de paiement</h3>
              <div class="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
                <span>Chambre {{ selectedArrangement?.room_type }}</span>
                <span>{{ formatPrice(selectedArrangement?.price) }} DZD</span>
              </div>
              <div class="flex justify-between text-sm mb-4 text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-700">
                <span>Taxes & Frais</span>
                <span>Inclus</span>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase">Total Paye</span>
                <span class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ formatPrice(selectedArrangement?.price) }} DZD</span>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-center gap-4">
            <button @click="goBackToSearch" class="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase transition-colors cursor-pointer">
              NOUVELLE RECHERCHE
            </button>
            <button class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase shadow-lg shadow-blue-600/20 transition-colors cursor-pointer flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              IMPRIMER LE VOUCHER
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>













