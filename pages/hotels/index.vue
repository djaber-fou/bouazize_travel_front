<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PaymentMethodSelector from '~/components/payment/PaymentMethodSelector.vue';
import { sendApi } from '@/composables/api';
import { resolveHotelGallery, resolveHotelImage, onHotelImageError } from '@/composables/useHotelImages';
import { searchWorldwidePlaces, searchLocalLocations, staticWorldwideLocations } from '@/composables/useWorldwideLocations';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const disableCredit = computed(() => {
  if (!isBusinessUser.value) return true;
  const balance = authStore.User?.account_balance || authStore.User?.accountBalance;
  if (!balance) return true;
  const authorized = Number(balance.account_balance || 0);
  const consumed = Number(balance.consumed_amount || 0);
  const debts = Number(balance.debts || 0);
  const availableCredit = authorized - (debts + consumed);
  const currentPrice = calculateClientPrice(selectedArrangement.value?.price || 0);
  return availableCredit < currentPrice;
});

// ============================================================
//  BUSINESS ACCOUNT MARKUP ENGINE
// ============================================================
const isBusinessUser = computed(() => {
  const u = authStore.User;
  return u?.role === 'business' || u?.type === 'business';
});

const businessMarkup = computed(() => {
  const u = authStore.User;
  let val = Number(u?.markup_hotel || 0);
  const type = u?.markup_type_hotel || 'percentage';
  // If percentage is stored as decimal fraction (e.g. 0.15 for 15%), normalize to percentage points
  if (type === 'percentage' && val > 0 && val <= 1) {
    val = Number((val * 100).toFixed(2));
  }
  return { val, type };
});

const calculateClientPrice = (netWholesalePrice) => {
  const net = Number(netWholesalePrice) || 0;
  if (!isBusinessUser.value || !businessMarkup.value.val) {
    return net;
  }
  if (businessMarkup.value.type === 'percentage') {
    return Math.round(net * (1 + businessMarkup.value.val / 100));
  }
  return Math.round(net + businessMarkup.value.val);
};

const calculateAgencyMargin = (netWholesalePrice) => {
  const net = Number(netWholesalePrice) || 0;
  return calculateClientPrice(net) - net;
};

// ============================================================
//  CLIENT FAVORITES SYSTEM (Persistent Array & Instant Modal)
// ============================================================
const favorites = ref(new Set());
const savedFavoriteHotels = ref([]);
const isFavoritesModalOpen = ref(false);

onMounted(() => {
  try {
    const savedHotels = localStorage.getItem('bouazize_saved_favorite_hotels');
    if (savedHotels) {
      savedFavoriteHotels.value = JSON.parse(savedHotels);
      favorites.value = new Set(savedFavoriteHotels.value.map(h => String(h.id || h.code || h.name)));
    } else {
      savedFavoriteHotels.value = [];
      favorites.value = new Set();
      localStorage.removeItem('bouazize_hotel_favorites');
    }
  } catch (e) {
    savedFavoriteHotels.value = [];
    favorites.value = new Set();
  }
});

const isFavorite = (hotelOrId) => {
  if (!hotelOrId) return false;
  const id = typeof hotelOrId === 'object' ? String(hotelOrId.id || hotelOrId.code || hotelOrId.name) : String(hotelOrId);
  return favorites.value.has(id);
};

const toggleFavorite = (hotel) => {
  if (!hotel) return;
  const id = String(hotel.id || hotel.code || hotel.name);
  if (favorites.value.has(id)) {
    favorites.value.delete(id);
    savedFavoriteHotels.value = savedFavoriteHotels.value.filter(h => String(h.id || h.code || h.name) !== id);
    toast.add({ title: 'Hôtel retiré de vos favoris', color: 'gray' });
  } else {
    favorites.value.add(id);
    const item = {
      id: hotel.id || id,
      code: hotel.code || id,
      name: hotel.name,
      stars: hotel.stars,
      city: hotel.city || form.value.destination || form.value.city_code || 'Destination',
      address: hotel.address || '',
      promo: hotel.promo || false,
      min_price: getMinPrice(hotel) || 0,
      image: getHotelImage(hotel),
      arrangements: hotel.arrangements || []
    };
    savedFavoriteHotels.value = [item, ...savedFavoriteHotels.value.filter(h => String(h.id || h.code || h.name) !== id)];
    toast.add({ title: 'Hôtel ajouté à vos favoris avec succès', color: 'amber' });
  }
  try {
    localStorage.setItem('bouazize_hotel_favorites', JSON.stringify([...favorites.value]));
    localStorage.setItem('bouazize_saved_favorite_hotels', JSON.stringify(savedFavoriteHotels.value));
  } catch (e) {}
};

const favoritesCount = computed(() => {
  return results.value.filter(h => isFavorite(h)).length;
});

const openFavoritesView = () => {
  isFavoritesModalOpen.value = true;
};

const searchFavoriteHotel = (hotel) => {
  isFavoritesModalOpen.value = false;
  if (hotel.city) {
    destinationQuery.value = hotel.city;
    form.value.destination = hotel.city;
    const matched = allCities.find(c => c.name.toLowerCase().includes(hotel.city.toLowerCase()) || hotel.city.toLowerCase().includes(c.name.toLowerCase()));
    if (matched) {
      selectedCityObj.value = matched;
      form.value.city_code = matched.code;
    }
  }
  if (hotel.name) {
    filters.value.hotelName = hotel.name;
  }
  searchHotels();
};

// ============================================================
//  SHARE HOTEL MODAL STATE & ACTIONS
// ============================================================
const isShareModalOpen = ref(false);
const shareActiveHotel = ref(null);

const openShareModal = (hotel) => {
  shareActiveHotel.value = hotel;
  isShareModalOpen.value = true;
};

const getShareUrl = (hotel) => {
  if (process.client) {
    const u = new URL(window.location.origin + '/hotels');
    if (form.value.destination) u.searchParams.set('dest', form.value.destination);
    if (form.value.checkin) u.searchParams.set('in', form.value.checkin);
    if (form.value.checkout) u.searchParams.set('out', form.value.checkout);
    if (hotel?.name) u.searchParams.set('hotel', hotel.name);
    return u.toString();
  }
  return 'https://bouazizetravel.com/hotels';
};

const copyShareLink = async () => {
  const url = getShareUrl(shareActiveHotel.value);
  try {
    await navigator.clipboard.writeText(url);
    toast.add({ title: 'Lien copié dans le presse-papier !', color: 'green' });
  } catch (e) {
    toast.add({ title: 'Lien de partage: ' + url, color: 'blue' });
  }
};

const shareOnWhatsApp = () => {
  const h = shareActiveHotel.value;
  const url = getShareUrl(h);
  const text = `Découvrez l'hôtel *${h?.name || ''}* (${starString(h?.stars)} à ${h?.city || form.value.destination || ''}) sur Bouazize Travel !
${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};

// ============================================================
//  PRINT FACTSHEET MODAL & ACTIONS
// ============================================================
const isPrintModalOpen = ref(false);
const printActiveHotel = ref(null);

const openPrintModal = (hotel) => {
  printActiveHotel.value = hotel;
  isPrintModalOpen.value = true;
};

const executePrint = () => {
  window.print();
};


// ============================================================
//  PAGE STATE
// ============================================================
const currentView = ref('search'); // 'search' | 'results' | 'prebooking' | 'confirmation'

// ============================================================
//  CITY DATABASE (with aliases & keywords for multi-token search)
// ============================================================
const allCities = [
  // Famous Hotels
  { name: 'Atlantis The Palm', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', keywords: ['dubai', 'uae', 'palm', 'atlantis'] },
  { name: 'Burj Al Arab', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', keywords: ['dubai', 'uae', 'burj', 'arab', 'jumeirah'] },
  { name: 'Donatello Hotel Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', keywords: ['dubai', 'uae', 'donatello', 'barsha'] },
  { name: 'Ghaya Grand Hotel', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', keywords: ['dubai', 'uae', 'ghaya', 'grand'] },
  { name: 'London Crown Hotel', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', keywords: ['dubai', 'uae', 'london', 'crown'] },
  { name: 'Pullman Paris Tour Eiffel', code: 'PAR', country: 'Paris (France)', type: 'hotel', keywords: ['paris', 'france', 'pullman', 'eiffel'] },
  { name: 'Hôtel Plaza Athénée', code: 'PAR', country: 'Paris (France)', type: 'hotel', keywords: ['paris', 'france', 'plaza', 'athenee', 'montaigne'] },
  { name: 'Ritz Paris', code: 'PAR', country: 'Paris (France)', type: 'hotel', keywords: ['paris', 'france', 'ritz', 'vendome'] },
  { name: 'The Peninsula', code: 'PAR', country: 'Paris (France)', type: 'hotel', keywords: ['paris', 'france', 'peninsula', 'kleber'] },
  { name: 'Hilton Bosphorus', code: 'IST', country: 'Istanbul (Turquie)', type: 'hotel', keywords: ['istanbul', 'turkey', 'turquie', 'turky', 'hilton', 'bosphorus'] },

  // Émirats Arabes Unis
  { name: 'Dubaï', code: 'DXB', country: 'Émirats Arabes Unis', keywords: ['dubai', 'doubai', 'uae', 'emirats', 'emirates', 'dxb', 'burj', 'marina', 'deira'] },
  { name: 'Abu Dhabi', code: 'AUH', country: 'Émirats Arabes Unis', keywords: ['abu dhabi', 'aboudabi', 'uae', 'emirats', 'emirates', 'auh', 'yas'] },
  { name: 'Sharjah', code: 'DXB', country: 'Émirats Arabes Unis', keywords: ['sharjah', 'uae', 'emirats', 'emirates', 'shj'] },

  // Turquie
  { name: 'Istanbul', code: 'IST', country: 'Turquie', keywords: ['istanbul', 'turquie', 'turkey', 'turky', 'turkiye', 'constantinople', 'ist', 'saw', 'taksim', 'sultanahmet', 'bosphore', 'bosphorus', 'fatih', 'sisli', 'kadikoy'] },
  { name: 'Antalya', code: 'AYT', country: 'Turquie', keywords: ['antalya', 'turquie', 'turkey', 'turky', 'turkiye', 'ayt', 'lara', 'kemer', 'belek', 'alanya', 'side'] },
  { name: 'Bodrum', code: 'BJV', country: 'Turquie', keywords: ['bodrum', 'turquie', 'turkey', 'turky', 'turkiye', 'bjv', 'yalikavak', 'gumbet', 'turgutreis'] },
  { name: 'Ankara', code: 'ANK', country: 'Turquie', keywords: ['ankara', 'turquie', 'turkey', 'turky', 'ank'] },
  { name: 'Trabzon', code: 'TZX', country: 'Turquie', keywords: ['trabzon', 'turquie', 'turkey', 'turky', 'mer noire', 'tzx', 'uzungol'] },
  { name: 'Bursa', code: 'YEI', country: 'Turquie', keywords: ['bursa', 'turquie', 'turkey', 'turky', 'yei', 'uludag'] },

  // France
  { name: 'Paris', code: 'PAR', country: 'France', keywords: ['paris', 'france', 'par', 'eiffel', 'champs elysees', 'montmartre', 'louvre', 'ile de france', 'orly', 'roissy', 'cdg'] },
  { name: 'Nice', code: 'NCE', country: 'France', keywords: ['nice', 'france', 'nce', 'cote d\'azur', 'cannes', 'monaco'] },
  { name: 'Lyon', code: 'LYS', country: 'France', keywords: ['lyon', 'france', 'lys', 'rhone'] },
  { name: 'Marseille', code: 'MRS', country: 'France', keywords: ['marseille', 'france', 'mrs', 'provence'] },

  // Italie
  { name: 'Rome', code: 'ROM', country: 'Italie', keywords: ['rome', 'roma', 'italie', 'italy', 'italia', 'rom', 'vatican', 'colisee'] },
  { name: 'Milan', code: 'MIL', country: 'Italie', keywords: ['milan', 'milano', 'italie', 'italy', 'italia', 'mil', 'duomo'] },
  { name: 'Venise', code: 'VCE', country: 'Italie', keywords: ['venise', 'venice', 'venezia', 'italie', 'italy', 'italia', 'vce', 'vcei', 'grand canal'] },
  { name: 'Florence', code: 'FLR', country: 'Italie', keywords: ['florence', 'firenze', 'italie', 'italy', 'italia', 'flr', 'toscane'] },

  // Espagne
  { name: 'Barcelone', code: 'BCN', country: 'Espagne', keywords: ['barcelone', 'barcelona', 'espagne', 'spain', 'espana', 'bcn', 'rambla', 'cataluna'] },
  { name: 'Madrid', code: 'MAD', country: 'Espagne', keywords: ['madrid', 'espagne', 'spain', 'espana', 'mad'] },

  // Royaume-Uni
  { name: 'Londres', code: 'LON', country: 'Royaume-Uni', keywords: ['londres', 'london', 'royaume-uni', 'uk', 'angleterre', 'england', 'lon', 'big ben'] },

  // Moyen-Orient & Golfe
  { name: 'Doha', code: 'DOH', country: 'Qatar', keywords: ['doha', 'qatar', 'doh', 'corniche'] },
  { name: 'Djeddah', code: 'JED', country: 'Arabie Saoudite', keywords: ['djeddah', 'jeddah', 'arabie saoudite', 'saudi arabia', 'saudi', 'jed'] },
  { name: 'La Mecque', code: 'MEC', country: 'Arabie Saoudite', keywords: ['la mecque', 'makkah', 'mecca', 'omra', 'hajj', 'arabie saoudite', 'saudi', 'mec', 'haram'] },
  { name: 'Médine', code: 'MED', country: 'Arabie Saoudite', keywords: ['medine', 'medina', 'madinah', 'arabie saoudite', 'saudi', 'med', 'nabawi'] },
  { name: 'Riyad', code: 'RUH', country: 'Arabie Saoudite', keywords: ['riyad', 'riyadh', 'arabie saoudite', 'saudi', 'ruh'] },
  { name: 'Amman', code: 'AMM', country: 'Jordanie', keywords: ['amman', 'jordanie', 'jordan', 'amm', 'petra'] },
  { name: 'Beyrouth', code: 'BEY', country: 'Liban', keywords: ['beyrouth', 'beirut', 'liban', 'lebanon', 'bey'] },

  // Afrique du Nord
  { name: 'Alger', code: 'ALG', country: 'Algérie', keywords: ['alger', 'algiers', 'algerie', 'algeria', 'alg', 'centre', 'hamma', 'aurassi'] },
  { name: 'Oran', code: 'ORN', country: 'Algérie', keywords: ['oran', 'algerie', 'algeria', 'wahran', 'orn'] },
  { name: 'Constantine', code: 'CZL', country: 'Algérie', keywords: ['constantine', 'algerie', 'algeria', 'czl'] },
  { name: 'Annaba', code: 'AAE', country: 'Algérie', keywords: ['annaba', 'algerie', 'algeria', 'bone', 'aae'] },
  { name: 'Tunis', code: 'TUN', country: 'Tunisie', keywords: ['tunis', 'tunisie', 'tunisia', 'tun', 'gammarth', 'carthage'] },
  { name: 'Sousse', code: 'SUS', country: 'Tunisie', keywords: ['sousse', 'sousa', 'tunisie', 'tunisia', 'kantaoui', 'khalef', 'marhaba', 'sus'] },
  { name: 'Hammamet', code: 'HAM', country: 'Tunisie', keywords: ['hammamet', 'tunisie', 'tunisia', 'yasmine', 'badira', 'ham'] },
  { name: 'Djerba', code: 'DJE', country: 'Tunisie', keywords: ['djerba', 'tunisie', 'tunisia', 'zarzis', 'midoun', 'dje'] },
  { name: 'Casablanca', code: 'CAS', country: 'Maroc', keywords: ['casablanca', 'maroc', 'morocco', 'casa', 'cas'] },
  { name: 'Marrakech', code: 'RAK', country: 'Maroc', keywords: ['marrakech', 'marrakesh', 'maroc', 'morocco', 'rak', 'jamaa el fna'] },

  // Égypte
  { name: 'Le Caire', code: 'CAI', country: 'Égypte', keywords: ['le caire', 'cairo', 'egypte', 'egypt', 'pyramides', 'cai', 'nil'] },
  { name: 'Charm el-Cheikh', code: 'SSH', country: 'Égypte', keywords: ['charm el-cheikh', 'sharm el sheikh', 'sharm', 'egypte', 'egypt', 'mer rouge', 'ssh'] },
  { name: 'Hurghada', code: 'HRG', country: 'Égypte', keywords: ['hurghada', 'egypte', 'egypt', 'mer rouge', 'hrg'] },

  // Asie & Océan Indien
  { name: 'Kuala Lumpur', code: 'KUL', country: 'Malaisie', keywords: ['kuala lumpur', 'malaisie', 'malaysia', 'kl', 'kul', 'petronas'] },
  { name: 'Bangkok', code: 'BKK', country: 'Thaïlande', keywords: ['bangkok', 'thailande', 'thailand', 'bkk', 'siam'] },
  { name: 'Singapour', code: 'SIN', country: 'Singapour', keywords: ['singapour', 'singapore', 'sin', 'marina bay'] },
  { name: 'Bali', code: 'DPS', country: 'Indonésie', keywords: ['bali', 'indonesie', 'indonesia', 'denpasar', 'dps', 'kuta', 'ubud'] },
  { name: 'Maldives', code: 'MLE', country: 'Maldives', keywords: ['maldives', 'mle', 'male', 'atoll'] },
  { name: 'Zanzibar', code: 'ZNZ', country: 'Tanzanie', keywords: ['zanzibar', 'tanzanie', 'tanzania', 'znz'] },

  // Autres Destinations Européennes
  { name: 'Amsterdam', code: 'AMS', country: 'Pays-Bas', keywords: ['amsterdam', 'pays-bas', 'netherlands', 'hollande', 'ams'] },
  { name: 'Prague', code: 'PRG', country: 'République Tchèque', keywords: ['prague', 'praha', 'republique tcheque', 'czech', 'prg'] },
  { name: 'Vienne', code: 'VIE', country: 'Autriche', keywords: ['vienne', 'vienna', 'autriche', 'austria', 'vie'] },
  { name: 'Munich', code: 'MUC', country: 'Allemagne', keywords: ['munich', 'munchen', 'allemagne', 'germany', 'muc', 'baviere'] },
  { name: 'Berlin', code: 'BER', country: 'Allemagne', keywords: ['berlin', 'allemagne', 'germany', 'ber'] },
  { name: 'Genève', code: 'GVA', country: 'Suisse', keywords: ['geneve', 'geneva', 'suisse', 'switzerland', 'gva'] },
  { name: 'Lisbonne', code: 'LIS', country: 'Portugal', keywords: ['lisbonne', 'lisbon', 'lisboa', 'portugal', 'lis'] },
  { name: 'Athènes', code: 'ATH', country: 'Grèce', keywords: ['athenes', 'athens', 'grece', 'greece', 'ath', 'acropole'] },
  { name: 'Tbilissi', code: 'TBS', country: 'Géorgie', keywords: ['tbilissi', 'tbilisi', 'georgie', 'georgia', 'tbs'] },
  { name: 'Bakou', code: 'GYD', country: 'Azerbaïdjan', keywords: ['bakou', 'baku', 'azerbaidjan', 'azerbaijan', 'gyd'] },

  // Asie de l'Est
  { name: 'Tokyo', code: 'TYO', country: 'Japon', keywords: ['tokyo', 'tyo', 'japon', 'japan', 'shinjuku', 'shibuya', 'ginza'] },
  { name: 'Kyoto', code: 'UKY', country: 'Japon', keywords: ['kyoto', 'uky', 'japon', 'japan', 'gion'] },
  { name: 'Osaka', code: 'OSA', country: 'Japon', keywords: ['osaka', 'osa', 'japon', 'japan', 'dotonbori'] },
  { name: 'Séoul', code: 'SEL', country: 'Corée du Sud', keywords: ['seoul', 'sel', 'korea', 'coree', 'gangnam'] },
  { name: 'Pékin', code: 'BJS', country: 'Chine', keywords: ['pekin', 'beijing', 'bjs', 'chine', 'china'] },
  { name: 'Shanghai', code: 'SHA', country: 'Chine', keywords: ['shanghai', 'sha', 'chine', 'china', 'bund'] },
  { name: 'Hong Kong', code: 'HKG', country: 'Hong Kong', keywords: ['hong kong', 'hkg', 'kowloon'] },

  // Amériques
  { name: 'New York', code: 'NYC', country: 'États-Unis', keywords: ['new york', 'nyc', 'manhattan', 'times square', 'broadway', 'usa', 'etats-unis'] },
  { name: 'Miami', code: 'MIA', country: 'États-Unis', keywords: ['miami', 'mia', 'south beach', 'florida', 'floride', 'usa'] },
  { name: 'Orlando', code: 'MCO', country: 'États-Unis', keywords: ['orlando', 'mco', 'disney', 'florida', 'usa'] },
  { name: 'Los Angeles', code: 'LAX', country: 'États-Unis', keywords: ['los angeles', 'lax', 'hollywood', 'beverly hills', 'californie', 'usa'] },
  { name: 'Las Vegas', code: 'LAS', country: 'États-Unis', keywords: ['las vegas', 'las', 'vegas', 'nevada', 'strip', 'usa'] },
  { name: 'San Francisco', code: 'SFO', country: 'États-Unis', keywords: ['san francisco', 'sfo', 'golden gate', 'californie', 'usa'] },
  { name: 'Chicago', code: 'CHI', country: 'États-Unis', keywords: ['chicago', 'chi', 'usa'] },
  { name: 'Toronto', code: 'YTO', country: 'Canada', keywords: ['toronto', 'yto', 'canada', 'ontario'] },
  { name: 'Montréal', code: 'YUL', country: 'Canada', keywords: ['montreal', 'yul', 'canada', 'quebec'] },
  { name: 'Cancun', code: 'CUN', country: 'Mexique', keywords: ['cancun', 'cun', 'mexique', 'mexico', 'riviera maya'] },
  { name: 'Rio de Janeiro', code: 'RIO', country: 'Brésil', keywords: ['rio', 'rio de janeiro', 'copacabana', 'bresil', 'brazil'] },
  { name: 'Buenos Aires', code: 'BUE', country: 'Argentine', keywords: ['buenos aires', 'bue', 'argentine', 'argentina'] },

  // Océanie & Asie du Sud
  { name: 'Sydney', code: 'SYD', country: 'Australie', keywords: ['sydney', 'syd', 'australie', 'australia', 'opera'] },
  { name: 'Melbourne', code: 'MEL', country: 'Australie', keywords: ['melbourne', 'mel', 'australie', 'australia'] },
  { name: 'Phuket', code: 'HKT', country: 'Thaïlande', keywords: ['phuket', 'hkt', 'thailande', 'thailand', 'patong'] },
  { name: 'Chiang Mai', code: 'CNX', country: 'Thaïlande', keywords: ['chiang mai', 'cnx', 'thailande', 'thailand'] },
  { name: 'Colombo', code: 'CMB', country: 'Sri Lanka', keywords: ['colombo', 'cmb', 'sri lanka'] },

  // Afrique & Îles
  { name: 'Tlemcen', code: 'TLE', country: 'Algérie', keywords: ['tlemcen', 'algerie', 'algeria', 'tle'] },
  { name: 'Béjaïa', code: 'BJA', country: 'Algérie', keywords: ['bejaia', 'bougie', 'algerie', 'algeria', 'bja'] },
  { name: 'Sétif', code: 'QSF', country: 'Algérie', keywords: ['setif', 'algerie', 'algeria', 'qsf'] },
  { name: 'Monastir', code: 'MIR', country: 'Tunisie', keywords: ['monastir', 'tunisie', 'tunisia', 'mir'] },
  { name: 'Tanger', code: 'TNG', country: 'Maroc', keywords: ['tanger', 'tangier', 'maroc', 'morocco', 'tng'] },
  { name: 'Fès', code: 'FEZ', country: 'Maroc', keywords: ['fes', 'fez', 'maroc', 'morocco'] },
  { name: 'Agadir', code: 'AGA', country: 'Maroc', keywords: ['agadir', 'maroc', 'morocco', 'aga'] },
  { name: 'Rabat', code: 'RBA', country: 'Maroc', keywords: ['rabat', 'maroc', 'morocco', 'rba'] },
  { name: 'Louxor', code: 'LXR', country: 'Égypte', keywords: ['louxor', 'luxor', 'egypte', 'egypt', 'lxr'] },
  { name: 'Alexandrie', code: 'ALY', country: 'Égypte', keywords: ['alexandrie', 'alexandria', 'egypte', 'egypt', 'aly'] },
  { name: 'Mascate', code: 'MCT', country: 'Oman', keywords: ['mascate', 'muscat', 'oman', 'mct'] },
  { name: 'Koweït', code: 'KWI', country: 'Koweït', keywords: ['koweit', 'kuwait', 'kwi'] },
  { name: 'Manama', code: 'BAH', country: 'Bahreïn', keywords: ['manama', 'bahrein', 'bahrain', 'bah'] },
  { name: 'Dammam', code: 'DMM', country: 'Arabie Saoudite', keywords: ['dammam', 'khobar', 'arabie saoudite', 'saudi', 'dmm'] },
  { name: 'Le Cap', code: 'CPT', country: 'Afrique du Sud', keywords: ['le cap', 'cape town', 'afrique du sud', 'south africa', 'cpt'] },
  { name: 'Johannesburg', code: 'JNB', country: 'Afrique du Sud', keywords: ['johannesburg', 'afrique du sud', 'south africa', 'jnb'] },
  { name: 'Nairobi', code: 'NBO', country: 'Kenya', keywords: ['nairobi', 'kenya', 'nbo'] },
  { name: 'Maurice', code: 'MRU', country: 'Île Maurice', keywords: ['maurice', 'ile maurice', 'mauritius', 'mru'] },
  { name: 'Seychelles', code: 'SEZ', country: 'Seychelles', keywords: ['seychelles', 'sez', 'mahe'] },

  // Autres Destinations Européennes
  { name: 'Bruxelles', code: 'BRU', country: 'Belgique', keywords: ['bruxelles', 'brussels', 'belgique', 'belgium', 'bru'] },
  { name: 'Francfort', code: 'FRA', country: 'Allemagne', keywords: ['francfort', 'frankfurt', 'allemagne', 'germany', 'fra'] },
  { name: 'Zurich', code: 'ZRH', country: 'Suisse', keywords: ['zurich', 'suisse', 'switzerland', 'zrh'] },
  { name: 'Budapest', code: 'BUD', country: 'Hongrie', keywords: ['budapest', 'hongrie', 'hungary', 'bud'] },
  { name: 'Varsovie', code: 'WAW', country: 'Pologne', keywords: ['varsovie', 'warsaw', 'pologne', 'poland', 'waw'] },
  { name: 'Santorin', code: 'JTR', country: 'Grèce', keywords: ['santorin', 'santorini', 'grece', 'greece', 'jtr', 'oia'] },
  { name: 'Mykonos', code: 'JMK', country: 'Grèce', keywords: ['mykonos', 'grece', 'greece', 'jmk'] },
  { name: 'Séville', code: 'SVQ', country: 'Espagne', keywords: ['seville', 'sevilla', 'espagne', 'spain', 'svq', 'andalousie'] },
  { name: 'Valence', code: 'VLC', country: 'Espagne', keywords: ['valence', 'valencia', 'espagne', 'spain', 'vlc'] },
  { name: 'Malaga', code: 'AGP', country: 'Espagne', keywords: ['malaga', 'espagne', 'spain', 'agp', 'marbella'] },
  { name: 'Palma de Majorque', code: 'PMI', country: 'Espagne', keywords: ['majorque', 'mallorca', 'palma', 'espagne', 'spain', 'pmi'] },
  { name: 'Porto', code: 'OPO', country: 'Portugal', keywords: ['porto', 'portugal', 'opo'] },
];

// ============================================================
//  TEXT NORMALIZATION & TOKENIZED SEARCH
// ============================================================
const normalizeText = (text) => {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

// ============================================================
//  SEARCH FORM STATE
// ============================================================
const destinationQuery = ref('');
const showCitySuggestions = ref(false);
const citySuggestions = ref(staticWorldwideLocations.slice(0, 15));
let searchPlacesTimer = null;

const onDestinationInput = () => {
  showCitySuggestions.value = true;
  const q = destinationQuery.value.trim();
  citySuggestions.value = searchLocalLocations(q, 15);
  if (searchPlacesTimer) clearTimeout(searchPlacesTimer);
  if (q.length >= 3) {
    searchPlacesTimer = setTimeout(async () => {
      const places = await searchWorldwidePlaces(q);
      if (destinationQuery.value.trim() === q && places.length > 0) {
        citySuggestions.value = places;
      }
    }, 280);
  }
};

const onDestinationBlur = () => {
  setTimeout(() => {
    showCitySuggestions.value = false;
  }, 250);
};
const selectedCityObj = ref(null);

const filteredCities = computed(() => {
  if (!destinationQuery.value.trim()) return allCities.slice(0, 15);
  const q = normalizeText(destinationQuery.value);
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return allCities.slice(0, 15);

  return allCities.filter(c => {
    const searchable = normalizeText(
      `${c.name} ${c.code} ${c.country} ${(c.keywords || []).join(' ')}`
    );
    return tokens.every(token => searchable.includes(token));
  });
});

const selectCity = (city) => {
  destinationQuery.value = city.country ? `${city.name}, ${city.country}` : city.name;
  selectedCityObj.value = city;
  form.value.city_code = (city.code === 'SHJ') ? 'DXB' : (city.code || 'ALG');
  if (city.type === 'hotel') {
    filters.value.hotelName = city.name;
  } else {
    filters.value.hotelName = '';
  }
  showCitySuggestions.value = false;
};

// Auto-resolve city when user types and directly triggers search/enter
const resolveCityIfTyped = () => {
  if (!destinationQuery.value.trim()) return null;

  // 1. If city_code is already set and matches current query
  if (form.value.city_code && selectedCityObj.value) {
    const normQ = normalizeText(destinationQuery.value);
    const normSelected = normalizeText(`${selectedCityObj.value.name} ${selectedCityObj.value.country}`);
    if (normSelected.includes(normQ) || normQ.includes(normalizeText(selectedCityObj.value.name))) {
      return selectedCityObj.value;
    }
  }

  // 2. Otherwise auto-select the best match from filteredCities
  if (filteredCities.value.length > 0) {
    const topCity = filteredCities.value[0];
    selectCity(topCity);
    return topCity;
  }
  return null;
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
  budget_cœurrency: 'DZD',
  criteria: '',
  refundable_only: false,
  available_only: true,
});

const nightsCount = ref(2);

const updateNights = (n) => {
  const val = Math.max(1, parseInt(n) || 1);
  nightsCount.value = val;
  if (form.value.checkin) {
    const d = new Date(form.value.checkin);
    d.setDate(d.getDate() + val);
    form.value.checkout = d.toISOString().split('T')[0];
  }
};

const incrementNights = () => {
  updateNights((nightsCount.value || 1) + 1);
};

const decrementNights = () => {
  updateNights(Math.max(1, (nightsCount.value || 1) - 1));
};

const onCheckinChange = () => {
  if (form.value.checkin) {
    const d = new Date(form.value.checkin);
    d.setDate(d.getDate() + (nightsCount.value || 1));
    form.value.checkout = d.toISOString().split('T')[0];
  }
};

const onCheckoutChange = () => {
  if (form.value.checkin && form.value.checkout) {
    const t1 = new Date(form.value.checkin).getTime();
    const t2 = new Date(form.value.checkout).getTime();
    const diff = Math.round((t2 - t1) / 86400000);
    if (diff > 0) {
      nightsCount.value = diff;
    } else {
      updateNights(1);
    }
  }
};

const calculateNights = computed(() => {
  if (!form.value.checkin || !form.value.checkout) return nightsCount.value || 1;
  const diff = Math.round((new Date(form.value.checkout) - new Date(form.value.checkin)) / 86400000);
  return diff > 0 ? diff : (nightsCount.value || 1);
});

// Flexible stay interval (e.g. 8 nights anywhere between 12/09 and 12/10)
const isFlexibleIntervalOpen = ref(false);
const flexRangeStart = ref('2026-09-12');
const flexRangeEnd = ref('2026-10-12');
const flexNights = ref(8);

const formatShortDate = (dStr) => {
  if (!dStr) return '';
  const parts = dStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dStr;
};

const flexibleSlots = computed(() => {
  const slots = [];
  if (!flexRangeStart.value || !flexRangeEnd.value) return slots;
  const start = new Date(flexRangeStart.value);
  const end = new Date(flexRangeEnd.value);
  const dur = Math.max(1, parseInt(flexNights.value) || 8);
  
  let cœur = new Date(start);
  while (true) {
    const checkoutDate = new Date(cœur);
    checkoutDate.setDate(checkoutDate.getDate() + dur);
    if (checkoutDate > end) break;
    
    const cin = cœur.toISOString().split('T')[0];
    const cout = checkoutDate.toISOString().split('T')[0];
    slots.push({
      checkin: cin,
      checkout: cout,
      nights: dur,
      label: `${formatShortDate(cin)} au ${formatShortDate(cout)} (${dur} nuits)`
    });
    cœur.setDate(cœur.getDate() + 3);
  }
  return slots;
});

const applyFlexibleSlot = (slot) => {
  form.value.checkin = slot.checkin;
  form.value.checkout = slot.checkout;
  nightsCount.value = slot.nights;
  isFlexibleIntervalOpen.value = false;
};

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
//  RECENT SEARCHES (Stockage Local & Modal)
// ============================================================
const isRecentSearchesOpen = ref(false);
const recentSearches = ref([]);
const RECENT_SEARCHES_KEY = 'bouazize_recent_hotel_searches';

const loadRecentSearches = () => {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      recentSearches.value = JSON.parse(saved);
    }
  } catch (e) {
    recentSearches.value = [];
  }
};

const saveCurrentSearchToRecent = () => {
  if (typeof window === 'undefined') return;
  try {
    const city = selectedCityObj.value || {
      name: destinationQuery.value.split(',')[0]?.trim() || form.value.city_code,
      country: destinationQuery.value.split(',')[1]?.trim() || '',
      code: form.value.city_code
    };
    const newEntry = {
      id: Date.now().toString(),
      city_name: city.name,
      city_country: city.country,
      city_code: form.value.city_code,
      destination_text: destinationQuery.value,
      checkin: form.value.checkin,
      checkout: form.value.checkout,
      nights: calculateNights.value,
      rooms_count: form.value.rooms.length,
      adults_count: totalAdults.value,
      rooms: JSON.parse(JSON.stringify(form.value.rooms)),
      nationality: form.value.nationality,
      timestamp: Date.now()
    };
    // Deduplicate same city_code and dates
    recentSearches.value = [
      newEntry,
      ...recentSearches.value.filter(s => !(s.city_code === newEntry.city_code && s.checkin === newEntry.checkin && s.checkout === newEntry.checkout))
    ].slice(0, 10);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value));
  } catch (e) {}
};

const applyRecentSearch = (item) => {
  destinationQuery.value = item.destination_text || `${item.city_name}, ${item.city_country}`;
  form.value.city_code = item.city_code;
  form.value.checkin = item.checkin;
  form.value.checkout = item.checkout;
  if (item.rooms && item.rooms.length > 0) {
    form.value.rooms = JSON.parse(JSON.stringify(item.rooms));
  }
  if (item.nationality) {
    form.value.nationality = item.nationality;
  }
  const found = allCities.find(c => c.code === item.city_code);
  if (found) {
    selectedCityObj.value = found;
  } else {
    selectedCityObj.value = { name: item.city_name, country: item.city_country, code: item.city_code };
  }
  isRecentSearchesOpen.value = false;
  searchHotels();
};

const removeRecentSearch = (id) => {
  recentSearches.value = recentSearches.value.filter(s => s.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value));
  }
};

const clearRecentSearches = () => {
  recentSearches.value = [];
  if (typeof window !== 'undefined') {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Récemment';
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `Il y a ${diffDay} j`;
  if (diffHour > 0) return `Il y a ${diffHour} h`;
  if (diffMin > 0) return `Il y a ${diffMin} min`;
  return 'À l\'instant';
};

onMounted(() => {
  loadRecentSearches();
});

// ============================================================
//  SEARCH API
// ============================================================
const results = ref([]);
const loading = ref(false);
const error = ref(null);
const rawLogs = ref(null);
const searchNumber = ref('');

const searchHotels = async () => {
  // Auto-resolve city if user typed without clicking autocomplete item
  const resolved = resolveCityIfTyped();
  if (!form.value.city_code && !resolved) {
    if (destinationQuery.value.trim()) {
      form.value.city_code = 'IST'; // Fallback city, backend will match hotel name
    } else {
      error.value = 'Veuillez saisir ou sélectionner une destination ou un hôtel valide (ex: Istanbul, Paris, Hilton...).';
      return;
    }
  }

  // Save to recent searches
  saveCurrentSearchToRecent();

  const rawQuery = destinationQuery.value.trim();
  const cleanName = rawQuery.split(',')[0].trim();
  const normQ = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const pureCities = [
    'alger', 'oran', 'constantine', 'annaba', 'setif', 'tlemcen', 'bejaia',
    'istanbul', 'paris', 'dubai', 'tunis', 'sousse', 'hammamet', 'djerba',
    'rome', 'madrid', 'barcelone', 'barcelona', 'london', 'londres', 'doha', 'riyadh', 'le caire', 'cairo'
  ];
  const isPureCity = pureCities.includes(normQ);

  if (cleanName && !isPureCity && (selectedCityObj.value?.type === 'hotel' || !selectedCityObj.value || selectedCityObj.value.type !== 'city')) {
    filters.value.hotelName = cleanName;
  } else if (isPureCity) {
    filters.value.hotelName = '';
  }

  loading.value = true;
  error.value = null;
  results.value = [];
  rawLogs.value = null;

  try {
    const response = await sendApi('/hotels/search', {
      checkin: form.value.checkin,
      checkout: form.value.checkout,
      nationality: form.value.nationality || 'DZ',
      rooms: form.value.rooms,
      hotel_ids: [],
      city_code: form.value.city_code,
      destination: destinationQuery.value.trim(),
      hotel_name: destinationQuery.value.trim()
    }, 'POST');

    if (response && (response.status === 'success' || response.success === true)) {
      const hotelList = (response.data || []).map(h => {
        if (Array.isArray(h.arrangements)) {
          h.arrangements.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        }
        return h;
      });
      results.value = hotelList;
      rawLogs.value = response.logs;
      searchNumber.value = response.search_number || '';
      currentView.value = 'results';
      currentPage.value = 1;
    } else if (response) {
      error.value = response.message || 'Erreur lors de la recherche';
      rawLogs.value = response.logs;
    } else {
      error.value = 'Erreur réseau ou réponse inattendue.';
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
  const rawMin = Math.min(...hotel.arrangements.map(a => a.price || 0));
  return calculateClientPrice(rawMin);
};

const getRawMinPrice = (hotel) => {
  if (!hotel || !hotel.arrangements || hotel.arrangements.length === 0) return 0;
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
  if (filters.value.hotelName && filters.value.hotelName.trim()) {
    const qNorm = normalizeSearchText(filters.value.hotelName);
    const qAlnum = qNorm.replace(/[^a-z0-9]/g, '');
    const tokens = qNorm.split(/\s+/).filter(t => t.length >= 2);

    data = data.filter(h => {
      const nameNorm = normalizeSearchText(h.name || '');
      const addrNorm = normalizeSearchText(h.address || '');
      const cityNorm = normalizeSearchText(h.city || '');
      const combined = `${nameNorm} ${addrNorm} ${cityNorm}`;
      const combinedAlnum = combined.replace(/[^a-z0-9]/g, '');

      // 1. Direct match or alphanumeric sequence containment
      if (combined.includes(qNorm) || (qAlnum && combinedAlnum.includes(qAlnum))) return true;

      // 2. Token-based matching: all words entered by user must match anywhere in hotel details
      if (tokens.length > 0 && tokens.every(t => combined.includes(t) || combinedAlnum.includes(t))) {
        return true;
      }
      return false;
    });
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
  if (filters.value.showFavorites) {
    data = data.filter(h => isFavorite(h));
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
    case 'favoris':
      data.sort((a, b) => (isFavorite(b) ? 1 : 0) - (isFavorite(a) ? 1 : 0));
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
  const cœur = currentPage.value;
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (cœur > 3) pages.push('...');
    for (let i = Math.max(2, cœur - 1); i <= Math.min(total - 1, cœur + 1); i++) pages.push(i);
    if (cœur < total - 2) pages.push('...');
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
    email: '',
    phone: ''
  },
  agency_name: 'Agence Bouazize Travel',
  agent_ref: 'BOUAZIZE25',
  agency_email: 'contact@bouazizetravel.com',
  agency_phone: '+213 550 00 00 00',
  payment_method: 'ccp',
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

  // Initialize Role-based Agency & Client Information
  if (authStore.isAdmin) {
    // Admin: Pre-filled with Bouazize Travel admin info, editable
    bookingForm.value.agency_name = 'Agence Bouazize Travel';
    bookingForm.value.agent_ref = 'BOUAZIZE25';
    bookingForm.value.agency_email = authStore.User?.email || 'contact@bouazizetravel.com';
    bookingForm.value.agency_phone = authStore.User?.phone || '+213 550 00 00 00';
  } else if (authStore.isAgency) {
    // Business account: Pre-filled with business user profile, editable
    bookingForm.value.agency_name = authStore.User?.agency_name || authStore.User?.name || 'Mon Agence Partenaire';
    bookingForm.value.agent_ref = authStore.User?.username || authStore.User?.agency_code || `B2B_${authStore.User?.id || 'AGENCY'}`;
    bookingForm.value.agency_email = authStore.User?.email || '';
    bookingForm.value.agency_phone = authStore.User?.phone || '';
  } else {
    // Guest / Regular Client: Static Bouazize Travel agency behind the scenes (form hidden)
    bookingForm.value.agency_name = 'Agence Bouazize Travel';
    bookingForm.value.agent_ref = 'BOUAZIZE25';
    bookingForm.value.agency_email = 'contact@bouazizetravel.com';
    bookingForm.value.agency_phone = '+213 550 00 00 00';
    if (authStore.User?.email) {
      bookingForm.value.holder.email = authStore.User.email;
      bookingForm.value.holder.name = authStore.User.name || '';
      bookingForm.value.holder.phone = authStore.User.phone || '';
    }
  }

  currentView.value = 'prebooking';
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const executePrebookAndBook = async () => {
  bookingLoading.value = true;
  bookingError.value = null;
  bookingStep.value = 'prebooking';

  try {
    const totalPrice = calculateClientPrice(selectedArrangement.value?.price);
    const payload = {
      hotel_id: selectedHotel.value.id || selectedHotel.value.code,
      agreement_id: selectedArrangement.value.id || '1',
      checkin: form.value.checkin,
      checkout: form.value.checkout,
      nationality: form.value.nationality || 'DZ',
      rooms: bookingForm.value.rooms,
      holder: bookingForm.value.holder,
      agent_ref: bookingForm.value.agent_ref || 'BOUAZIZE25',
      agency_name: bookingForm.value.agency_name || 'Agence Bouazize Travel',
      agency_email: bookingForm.value.agency_email || 'contact@bouazizetravel.com',
      agency_phone: bookingForm.value.agency_phone || '+213 550 00 00 00',
      payment_method: bookingForm.value.payment_method || 'ccp',
      hotel_name: selectedHotel.value?.name || 'Hôtel',
      hotel_image: getHotelImage(selectedHotel.value),
      city: selectedHotel.value?.city || selectedHotel.value?.address || 'Alger',
      total_price: totalPrice
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

      const orderId = bookRes.data?.order_id || bookRes.data?.id;

      if (bookingForm.value.payment_method === 'credit') {
        toast.add({ title: 'Réservation confirmée avec succès (Crédit Agence B2B)', color: 'green' });
        currentView.value = 'confirmation';
        nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      } else {
        toast.add({ title: 'Réservation enregistrée en option ! Redirection vers le paiement électronique...', color: 'green' });
        router.push(`/payment/confirm?order_id=${orderId}&type=hotel&amount=${totalPrice}`);
      }
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

// ============================================================
//  AUTHENTIC HIGH-RES HOTEL IMAGE ENGINE (useHotelImages.js)
// ============================================================

const getHotelImage = (hotelOrId) => {
  if (!hotelOrId) return resolveHotelImage(null);
  const hotel = typeof hotelOrId === 'object' ? hotelOrId : { id: String(hotelOrId), name: String(hotelOrId) };
  return resolveHotelImage(hotel);
};

const getHotelGallery = (hotel) => {
  return resolveHotelGallery(hotel);
};

const handleImageError = (event, hotel) => {
  onHotelImageError(event);
};

// Gallery Viewer Modal State
const isGalleryModalOpen = ref(false);
const galleryActiveHotel = ref(null);
const galleryActiveIndex = ref(0);

const openGalleryModal = (hotel) => {
  galleryActiveHotel.value = hotel;
  galleryActiveIndex.value = 0;
  isGalleryModalOpen.value = true;
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
  if (!results.value || results.value.length === 0) return { min: 0, max: 99999999 };
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

watch(
  () => [
    filters.value.hotelName,
    filters.value.stars,
    filters.value.priceMin,
    filters.value.priceMax,
    filters.value.cancellation,
    filters.value.meals,
    filters.value.showFavorites,
    filters.value.showBestHotels,
    filters.value.categories
  ],
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

const toggleFilter = (arr, val) => {
  const idx = arr.indexOf(val);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(val);
};

const sidebarOpen = ref(true);
const isMobileFilterOpen = ref(false);

const normalizeSearchText = (str) => {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0131\u0130]/g, 'i')
    .replace(/[\u011f\u011e]/g, 'g')
    .replace(/[\u015f\u015e]/g, 's')
    .toLowerCase()
    .trim();
};

const applyHotelNameFilter = () => {
  currentPage.value = 1;
  nextTick(() => {
    const resultsArea = document.querySelector('#hotel-results-area') || document.querySelector('.main-results-area');
    if (resultsArea) {
      resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

const clearHotelNameFilter = () => {
  filters.value.hotelName = '';
  currentPage.value = 1;
};

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.value.hotelName && filters.value.hotelName.trim()) count++;
  count += (filters.value.stars || []).length;
  count += (filters.value.categories || []).length;
  count += (filters.value.meals || []).length;
  count += (filters.value.cancellation || []).length;
  if (filters.value.showFavorites) count++;
  if (filters.value.showBestHotels) count++;
  if (priceRange.value && (filters.value.priceMin > priceRange.value.min || filters.value.priceMax < priceRange.value.max)) {
    count++;
  }
  return count;
});

const resetAllFilters = () => {
  filters.value.hotelName = '';
  filters.value.stars = [];
  filters.value.categories = [];
  filters.value.cancellation = [];
  filters.value.meals = [];
  filters.value.showFavorites = false;
  filters.value.showBestHotels = false;
  if (priceRange.value) {
    filters.value.priceMin = priceRange.value.min;
    filters.value.priceMax = priceRange.value.max;
  }
};

// ============================================================
//  ROOM SORTING (Strict Ascending Price Guarantee)
// ============================================================
const getSortedArrangements = (arrangements) => {
  if (!Array.isArray(arrangements)) return [];
  return [...arrangements].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
};

// ============================================================
//  CLIENT RESERVATIONS & DATABASE DOSSIERS
// ============================================================
const clientBookings = ref([]);
const loadingClientBookings = ref(false);
const clientBookingsFilter = ref('all'); // 'all' | 'confirmed' | 'cancelled'
const clientBookingsSearch = ref('');

const loadClientBookings = async () => {
  loadingClientBookings.value = true;
  try {
    const res = await sendApi('/hotels/bookings', {}, 'GET');
    if (res && res.status === 'success' && Array.isArray(res.data)) {
      clientBookings.value = res.data;
    }
  } catch (e) {
    console.error('Error loading client bookings:', e);
  } finally {
    loadingClientBookings.value = false;
  }
};

const filteredClientBookings = computed(() => {
  let list = clientBookings.value || [];
  if (clientBookingsFilter.value !== 'all') {
    list = list.filter(b => b.status === clientBookingsFilter.value);
  }
  if (clientBookingsSearch.value.trim()) {
    const q = clientBookingsSearch.value.toLowerCase().trim();
    list = list.filter(b =>
      (b.reference || '').toLowerCase().includes(q) ||
      (b.booking_number || '').toLowerCase().includes(q) ||
      (b.hotel_name || '').toLowerCase().includes(q) ||
      (b.holder_name || '').toLowerCase().includes(q) ||
      (b.city || '').toLowerCase().includes(q)
    );
  }
  return list;
});

const openMyBookingsView = () => {
  currentView.value = 'my-bookings';
  loadClientBookings();
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ============================================================
//  OFFICIAL BOUAZIZE TRAVEL VOUCHER MODAL
// ============================================================
const isVoucherModalOpen = ref(false);
const selectedVoucherBooking = ref(null);
const hideVoucherPrice = ref(false);

const openVoucherModal = (booking) => {
  if (booking.status !== 'confirmed' || booking.paiment_status !== 'paid') {
    toast.add({
      title: 'Voucher non accessible',
      description: "Le voucher officiel certifié sera débloqué dès que l'administration aura vérifié et validé votre paiement.",
      color: 'amber'
    });
    return;
  }
  selectedVoucherBooking.value = booking;
  isVoucherModalOpen.value = true;
};

const closeVoucherModal = () => {
  isVoucherModalOpen.value = false;
  selectedVoucherBooking.value = null;
};

const printVoucher = () => {
  window.print();
};

const openVoucherFromConfirmation = () => {
  if (!bookingResponse.value?.data) return;
  const d = bookingResponse.value.data;
  if (d.paiment_status !== 'paid' && d.status !== 'confirmed') {
    toast.add({
      title: 'Voucher non disponible',
      description: "Le voucher officiel sera débloqué dès confirmation définitive du paiement par l'administrateur.",
      color: 'amber'
    });
    return;
  }
  selectedVoucherBooking.value = {
    reference: d.reference,
    booking_number: d.booking_number || d.reference,
    hotel_name: selectedHotel.value?.name || 'Hôtel',
    stars: selectedHotel.value?.stars || 5,
    address: selectedHotel.value?.address || '',
    city: selectedHotel.value?.city || form.value.city_code,
    checkin: form.value.checkin,
    checkout: form.value.checkout,
    nights: calculateNights.value || 1,
    room_type: selectedArrangement.value?.room_type || 'Standard',
    board_type: selectedArrangement.value?.board_type || 'RO',
    holder_name: `${bookingForm.value.holder.name} ${bookingForm.value.holder.surname}`,
    holder_email: bookingForm.value.holder.email,
    holder_phone: bookingForm.value.holder.phone,
    passengers: bookingForm.value.rooms?.flatMap(r => r.passengers) || [],
    total_price: calculateClientPrice(selectedArrangement.value?.price) || 0,
    currency: selectedArrangement.value?.currency || 'DZD',
    status: 'confirmed',
    cancellation_deadline: selectedArrangement.value?.deadline || null,
    created_at: new Date().toISOString()
  };
  isVoucherModalOpen.value = true;
};

// ============================================================
//  CLIENT CANCELLATION MODAL & ACTION
// ============================================================
const cancellationModalOpen = ref(false);
const bookingToCancel = ref(null);
const cancellationReason = ref('');
const isCancellingBooking = ref(false);
const cancellationError = ref('');

const promptCancelBooking = (booking) => {
  bookingToCancel.value = booking;
  cancellationReason.value = 'Annulation demandée par le client';
  cancellationError.value = '';
  cancellationModalOpen.value = true;
};

const executeClientCancelBooking = async () => {
  if (!bookingToCancel.value) return;
  isCancellingBooking.value = true;
  cancellationError.value = '';
  try {
    const res = await sendApi('/hotels/cancel', {
      booking_number: bookingToCancel.value.booking_number || bookingToCancel.value.reference,
      reference: bookingToCancel.value.reference,
      reason: cancellationReason.value || 'Annulation client'
    }, 'POST');

    if (res && (res.status === 'success' || res.success === true)) {
      cancellationModalOpen.value = false;
      bookingToCancel.value = null;
      await loadClientBookings();
    } else {
      cancellationError.value = res?.message || 'Impossible d\'annuler la réservation.';
    }
  } catch (e) {
    cancellationError.value = e.data?.message || e.message || 'Erreur lors de l\'annulation.';
  } finally {
    isCancellingBooking.value = false;
  }
};

onMounted(() => {
  loadClientBookings();
});
</script>
<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

    <!-- TOP GLOBAL NAVIGATION BAR: SEARCH vs MY BOOKINGS -->
    <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
      <div class="max-w-[1440px] mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 lg:gap-4">
        <div class="flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-black shrink-0">
            <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider truncate">
              BOUAZIZE TRAVEL <span class="text-primary font-normal text-[11px] sm:text-xs">| Portail Hôtellerie</span>
            </h1>
            <p class="text-[10px] sm:text-[11px] text-slate-400 truncate">Réservations en direct & Vouchers officiels certifiés</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-0.5 flex-nowrap">
          <button
            @click="currentView = (results.length > 0 ? 'results' : 'search')"
            type="button"
            class="flex-1 lg:flex-none justify-center whitespace-nowrap px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            :class="currentView !== 'my-bookings' ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
          >
            <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 shrink-0" />
            <span class="hidden sm:inline">Rechercher des Hôtels</span>
            <span class="sm:hidden">Hôtels</span>
          </button>

          <button
            @click="openMyBookingsView"
            type="button"
            class="flex-1 lg:flex-none justify-center whitespace-nowrap px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 relative shrink-0"
            :class="currentView === 'my-bookings' ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
          >
            <UIcon name="i-heroicons-ticket" class="w-4 h-4 shrink-0" />
            <span class="hidden sm:inline">Mes Réservations & Vouchers</span>
            <span class="sm:hidden">Réservations</span>
            <span v-if="clientBookings.length > 0" class="px-1.5 py-0.2 text-[10px] font-bold rounded-full shrink-0" :class="currentView === 'my-bookings' ? 'bg-white text-slate-900' : 'bg-primary text-white'">
              {{ clientBookings.length }}
            </span>
          </button>

          <button
            @click="openFavoritesView"
            type="button"
            class="flex-1 lg:flex-none justify-center whitespace-nowrap px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 relative shrink-0"
            :class="isFavoritesModalOpen ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
            title="Afficher mes hôtels favoris"
          >
            <UIcon name="i-heroicons-heart" class="w-4 h-4 shrink-0 text-rose-500" :class="isFavoritesModalOpen ? 'text-white' : ''" />
            <span class="hidden sm:inline">Mes Favoris</span>
            <span class="sm:hidden">Favoris</span>
            <span v-if="savedFavoriteHotels.length > 0" class="px-1.5 py-0.2 text-[10px] font-bold rounded-full shrink-0" :class="isFavoritesModalOpen ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'">
              {{ savedFavoriteHotels.length }}
            </span>
          </button>
        </div>
      </div>
    </div>

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
          <button
            type="button"
            @click="isRecentSearchesOpen = true"
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>RECHERCHES RÉCENTES</span>
            <span v-if="recentSearches.length > 0" class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-primary text-white">
              {{ recentSearches.length }}
            </span>
          </button>
        </div>

        <!-- Destination + Geocoding Row -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 mb-5">
          <div class="relative">
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Choisissez votre destination</label>
            <input
              v-model="destinationQuery"
              @input="onDestinationInput"
              @focus="onDestinationInput"
              @blur="onDestinationBlur"
              @keydown.enter.prevent="searchHotels"
              type="text"
              placeholder="Destination, Wilaya, Commune ou Hôtel (ex: El Aurassi, Alger, Oran, Hilton...)"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <div v-if="showCitySuggestions && citySuggestions.length > 0" class="absolute z-50 w-full mt-1 max-h-72 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-black/40">
              <button
                v-for="(city, cIdx) in citySuggestions" :key="city.code + '_' + cIdx"
                @mousedown.prevent="selectCity(city)"
                class="w-full text-left px-4 py-2.5 hover:bg-primary/10 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
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
          <div class="grid grid-cols-2 md:flex md:items-center gap-3">
            <div class="flex-1">
              <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Geocodage</label>
              <input v-model="form.geocoding" type="text" placeholder="Lieu..." class="w-full md:w-32 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
            </div>
            <div class="w-full md:w-20">
              <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Km</label>
              <input v-model.number="form.geocoding_km" type="number" min="1" max="100" class="w-full md:w-20 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
            </div>
          </div>
        </div>

        <!-- Dates + Nights + Rooms Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">De</label>
            <input v-model="form.checkin" @change="onCheckinChange" type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Au</label>
            <input v-model="form.checkout" @change="onCheckoutChange" type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer" />
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
              <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-center text-slate-700 dark:text-slate-300 flex-1">{{ form.rooms.length }}</div>
              <button @click="addRoom" type="button" class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center text-lg font-bold cursor-pointer transition-colors shadow-md shadow-primary/20">+</button>
            </div>
          </div>
        </div>

        <!-- Flexible Dates Interval Bar (Assistant Séjour Flexible) -->
        <div class="mb-5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <button
            @click="isFlexibleIntervalOpen = !isFlexibleIntervalOpen"
            type="button"
            class="flex items-center gap-1.5 font-bold text-primary hover:text-primary-hover cursor-pointer select-none"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>{{ isFlexibleIntervalOpen ? 'Fermer le mode période flexible' : 'Période de dates flexible (ex: 8 nuits dans l\'intervalle 12/09 au 12/10)' }}</span>
            <span class="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-bold">Nouveau</span>
          </button>
          <span class="text-slate-400 text-[11px]">Séjour configuré : <strong class="text-primary">{{ nightsCount }} nuits</strong> (du {{ form.checkin }} au {{ form.checkout }})</span>
        </div>

        <!-- Flexible Interval Expandable Box -->
        <div v-if="isFlexibleIntervalOpen" class="mb-5 p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
          <div>
            <h4 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
              <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span>Assistant Période Flexible (ex: 8 nuits entre deux dates)</span>
            </h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Indiquez votre intervalle de disponibilité et la durée du séjour souhaitée :</p>
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
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                <span>{{ slot.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Room Details -->
        <div v-for="(room, index) in form.rooms" :key="index" class="mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="flex flex-wrap items-end gap-4">
            <div class="text-xs font-extrabold text-primary uppercase tracking-wider w-28">CHAMBRE {{ index + 1 }}</div>
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
              <input type="checkbox" v-model="room.cots" :true-value="1" :false-value="0" class="w-4 h-4 accent-primary rounded cursor-pointer" />
            </div>
            <div class="flex gap-4 ml-2">
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" v-model="room.type" value="DBL" class="w-3.5 h-3.5 accent-primary cursor-pointer" />Double
              </label>
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" v-model="room.type" value="TWN" class="w-3.5 h-3.5 accent-primary cursor-pointer" />Chambre Twin
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
                <select v-model="form.budget_cœurrency" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none rounded-xl cursor-pointer">
                  <option value="DZD">Algerian Dinar</option><option value="EUR">Euro (EUR)</option><option value="USD">US Dollar (USD)</option>
                </select>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" v-model="form.refundable_only" class="w-4 h-4 accent-primary rounded cursor-pointer" />
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
                <input type="checkbox" v-model="form.available_only" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                Hotels disponibles uniquement
              </label>
            </div>
          </div>
        </div>

        <div v-if="error && currentView === 'search'" class="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">{{ error }}</div>

        <button @click="searchHotels" :disabled="loading" class="w-full md:w-auto md:min-w-[280px] mx-auto block px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-base uppercase tracking-wider shadow-lg shadow-primary/30 transition-all disabled:opacity-50 cursor-pointer">
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

      <!-- Summary Bar (Sticky Header on Scroll) -->
      <div class="sticky top-[60px] z-30 flex flex-wrap items-center justify-between gap-3 mb-5 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-md transition-all">
        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-300">
          <span><strong>Nuits: {{ calculateNights }}</strong> ({{ form.checkin }} - {{ form.checkout }})</span>
          <span class="text-slate-300 dark:text-slate-600">|</span>
          <span>Chambres: <strong>{{ form.rooms.length }}</strong></span>
          <span class="text-slate-300 dark:text-slate-600">|</span>
          <span>Adultes: <strong>{{ totalAdults }}</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="isRecentSearchesOpen = true"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Historique</span>
            <span v-if="recentSearches.length > 0" class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-primary text-white">
              {{ recentSearches.length }}
            </span>
          </button>
          <button @click="goBackToSearch" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/20 transition-all cursor-pointer">
            MODIFIER LA RECHERCHE
          </button>
        </div>
      </div>

      <!-- Mobile Filter & Sorting Bar (< lg) -->
      <div class="lg:hidden mb-4 space-y-3">
        <div class="flex items-center gap-2">
          <!-- Mobile Filter Drawer Trigger -->
          <button
            type="button"
            @click="isMobileFilterOpen = true"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100 shadow-xs hover:border-primary transition-all cursor-pointer"
          >
            <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filtres</span>
            <span v-if="activeFilterCount > 0" class="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-black">
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- Mobile Sort Dropdown -->
          <div class="flex-1 relative">
            <select
              v-model="sortBy"
              class="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary shadow-xs cursor-pointer"
            >
              <option value="prix">Trier: Prix croissant</option>
              <option value="etoiles">Trier: Étoiles</option>
              <option value="nom">Trier: Nom</option>
              <option value="offres">Trier: Offres spéciales</option>
              <option value="favoris">Trier: Favoris</option>
            </select>
            <svg class="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Active Filter Chips (Mobile) -->
        <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-1.5 pt-1">
          <span class="text-[11px] font-bold text-slate-400">Actifs :</span>
          <span v-if="filters.hotelName" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold">
            "{{ filters.hotelName }}"
            <button @click="filters.hotelName = ''" class="hover:text-red-500 cursor-pointer ml-0.5">✕</button>
          </span>
          <span v-for="s in filters.stars" :key="'mob_chip_s_'+s" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
            {{ starString(s) }}
            <button @click="toggleFilter(filters.stars, s)" class="hover:text-red-500 cursor-pointer ml-0.5">✕</button>
          </span>
          <span v-if="priceRange && filters.priceMax < priceRange.max" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
            Max {{ formatPrice(filters.priceMax) }} DZD
            <button @click="filters.priceMax = priceRange.max" class="hover:text-red-500 cursor-pointer ml-0.5">✕</button>
          </span>
          <span v-for="m in filters.meals" :key="'mob_chip_m_'+m" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-bold">
            {{ m }}
            <button @click="toggleFilter(filters.meals, m)" class="hover:text-red-500 cursor-pointer ml-0.5">✕</button>
          </span>
          <span v-for="c in filters.cancellation" :key="'mob_chip_c_'+c" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold">
            {{ c === 'refundable' ? 'Remboursable' : 'Non remb.' }}
            <button @click="toggleFilter(filters.cancellation, c)" class="hover:text-red-500 cursor-pointer ml-0.5">✕</button>
          </span>
          <span v-if="filters.showFavorites" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
            Favoris
            <button @click="filters.showFavorites = false" class="hover:text-red-500 cursor-pointer ml-0.5">✕</button>
          </span>
          <button @click="resetAllFilters" class="text-[11px] font-bold text-rose-500 hover:underline ml-1 cursor-pointer">
            Effacer tout
          </button>
        </div>
      </div>

      <!-- Sorting Tabs (Desktop lg+) -->
      <div class="hidden lg:flex flex-wrap items-center gap-1 mb-5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 uppercase">Tries par</span>
        <button v-for="tab in [{key:'etoiles',label:'Etoiles'},{key:'position',label:'Position'},{key:'prix',label:'Prix'},{key:'nom',label:'Nom'},{key:'offres',label:'Offres speciales'},{key:'favoris',label:'Favoris'}]" :key="tab.key"
          @click="sortBy = tab.key"
          :class="sortBy === tab.key ? 'text-primary dark:text-primary border-b-2 border-primary dark:border-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
          class="px-3 py-2 text-sm cursor-pointer transition-colors"
        >{{ tab.label }}</button>
        <div class="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          ( Resultats: {{ (currentPage - 1) * perPage + 1 }}-{{ Math.min(currentPage * perPage, sortedResults.length) }} de {{ sortedResults.length }} )
        </div>
      </div>

      <!-- 2-Column Layout -->
      <div class="flex gap-6">
        <!-- LEFT SIDEBAR FILTERS (Sticky on Scroll) -->
        <aside class="w-64 shrink-0 hidden lg:block space-y-6 lg:sticky lg:top-[135px] lg:self-start lg:max-h-[calc(100vh-150px)] lg:overflow-y-auto pr-2 pb-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">NOM DE L'HÔTEL</h3>
              <span v-if="filters.hotelName && filters.hotelName.trim()" class="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all" :class="filteredResults.length > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'">
                {{ filteredResults.length }} trouvé(s)
              </span>
            </div>
            <div class="relative flex gap-1">
              <div class="relative flex-1">
                <input
                  v-model="filters.hotelName"
                  @keydown.enter.prevent="applyHotelNameFilter"
                  type="text"
                  placeholder="Tapez le nom et appuyez sur Entrée..."
                  class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-3 pr-7 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                <button
                  v-if="filters.hotelName"
                  type="button"
                  @click="clearHotelNameFilter"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer p-0.5"
                  title="Effacer le filtre"
                >
                  ✕
                </button>
              </div>
              <button
                type="button"
                @click="applyHotelNameFilter"
                class="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-hover active:scale-95 transition-all shadow-xs shrink-0 flex items-center justify-center"
                title="Filtrer"
              >
                GO
              </button>
            </div>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">DIVERS</h3>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" v-model="filters.showFavorites" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
              Afficher les hôtels favoris ({{ favoritesCount }})
            </label>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" v-model="filters.showBestHotels" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
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
            <input type="range" :min="priceRange.min" :max="priceRange.max" v-model.number="filters.priceMax" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">POLITIQUE D'ANNULATION</h3>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.cancellation.includes('non_refundable')" @change="toggleFilter(filters.cancellation, 'non_refundable')" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
              Non remboursable ({{ cancellationCounts.non_refundable }})
            </label>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.cancellation.includes('refundable')" @change="toggleFilter(filters.cancellation, 'refundable')" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
              Remboursable ({{ cancellationCounts.refundable }})
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">ETOILES</h3>
            <label v-for="s in ['5','4','3','2','1']" :key="s" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.stars.includes(s)" @change="toggleFilter(filters.stars, s)" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
              <span class="text-amber-500">{{ starString(s) }}</span> ({{ starCounts[s] || 0 }})
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">CATEGORIE</h3>
            <label v-for="cat in ['Touristique','Touristique superieure','Premiere','Premiere superieure','De luxe']" :key="cat" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.categories.includes(cat)" @change="toggleFilter(filters.categories, cat)" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
              {{ cat }}
            </label>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">REPAS</h3>
            <label v-for="meal in [{code:'RO',label:'Chambre Seulement'},{code:'BB',label:'Hebergement et Petit Dejeuner'},{code:'HB',label:'Demi-Pension'},{code:'FB',label:'Pension Complete'},{code:'AI',label:'All Inclusive'}]" :key="meal.code" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mb-1.5">
              <input type="checkbox" :checked="filters.meals.includes(meal.code)" @change="toggleFilter(filters.meals, meal.code)" class="w-3.5 h-3.5 accent-primary rounded cursor-pointer" />
              {{ meal.label }} ({{ mealCounts[meal.code] || 0 }})
            </label>
          </div>
        </aside>

        <!-- MAIN RESULTS AREA -->
        <div class="flex-1 min-w-0 space-y-5">
          <div v-if="loading" class="text-center py-20">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Recherche en cours...</p>
          </div>
          <div v-else-if="paginatedResults.length === 0" class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div v-if="filters.showFavorites" class="max-w-md mx-auto">
              <UIcon name="i-heroicons-heart" class="w-16 h-16 mx-auto text-rose-300 dark:text-rose-800 mb-4 animate-bounce" />
              <p class="text-lg font-bold text-slate-700 dark:text-slate-300">Aucun hôtel dans vos favoris</p>
              <p class="text-sm text-slate-400 dark:text-slate-500 mt-2">
                Cliquez sur le bouton cœur d'un hôtel dans vos recherches pour le retrouver ici immédiatement.
              </p>
              <button
                type="button"
                @click="filters.showFavorites = false"
                class="mt-5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Afficher tous les hôtels
              </button>
            </div>
            <div v-else>
              <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <p class="text-lg font-bold text-slate-500 dark:text-slate-400">Aucun hôtel trouvé</p>
              <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Essayez de modifier vos critères de recherche</p>
            </div>
          </div>          <div v-for="hotel in paginatedResults" :key="hotel.id" class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

            <div class="flex flex-col md:flex-row">
              <div class="w-full md:w-56 h-48 md:h-auto flex items-center justify-center relative shrink-0 overflow-hidden group">
                <img
                  :src="getHotelImage(hotel)"
                  @error="handleImageError($event, hotel)"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Photo hotel"
                />
                <div v-if="hotel.promo" class="absolute top-3 left-3 px-3 py-1.5 bg-primary text-white text-[10px] font-black uppercase rounded-md shadow-lg flex items-center gap-1">
                  <Icon name="i-heroicons-sparkles" class="w-3.5 h-3.5" /> OFFRE SPECIALE!
                </div>
                <button
                  v-if="getHotelGallery(hotel).length > 1"
                  type="button"
                  @click.stop="openGalleryModal(hotel)"
                  class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur text-white text-[11px] font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span>{{ getHotelGallery(hotel).length }} photos</span>
                </button>
              </div>

              <div class="flex-1 p-4 md:p-5">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {{ hotel.name }}
                      <span class="text-amber-500 text-sm ml-1">{{ starString(hotel.stars) }}</span>
                    </h3>
                    <p v-if="hotel.address" class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                      {{ hotel.address }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click.stop="openShareModal(hotel)"
                      class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/40 cursor-pointer transition-colors"
                      title="Partager cet hôtel (WhatsApp, Lien, Email)"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                    <button
                      type="button"
                      @click.stop="openPrintModal(hotel)"
                      class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/40 cursor-pointer transition-colors"
                      title="Imprimer la fiche officielle de l'hôtel"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    </button>
                    <button
                      type="button"
                      @click.stop="toggleFavorite(hotel)"
                      class="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all"
                      :class="isFavorite(hotel) ? 'text-rose-500 border-rose-300 bg-rose-50 dark:bg-rose-950/40 scale-105' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200'"
                      :title="isFavorite(hotel) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    >
                      <svg v-if="isFavorite(hotel)" class="w-4 h-4 fill-rose-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
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
                  <div class="w-7 h-7 rounded bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center" title="Wi-Fi">
                    <Icon name="i-heroicons-wifi" class="w-4 h-4" />
                  </div>
                  <div class="w-7 h-7 rounded bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center" title="Piscine">
                    <Icon name="i-heroicons-sun" class="w-4 h-4" />
                  </div>
                  <div class="w-7 h-7 rounded bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center" title="Restaurant">
                    <Icon name="i-heroicons-cake" class="w-4 h-4" />
                  </div>
                  <div class="w-7 h-7 rounded bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center" title="Parking">
                    <Icon name="i-heroicons-truck" class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div class="p-4 md:p-5 text-right md:w-52 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                <div>
                  <div class="text-[10px] text-slate-400 dark:text-slate-500 italic">Prix à partir de:</div>
                  <div class="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {{ formatPrice(getMinPrice(hotel)) }}
                    <span class="text-sm font-bold text-slate-500">DZD</span>
                  </div>
                  <!-- Business Account Margin Breakdown -->
                  <div v-if="isBusinessUser && businessMarkup.val > 0" class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5 text-left">
                    <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                      <span>Prix Net :</span>
                      <span class="font-bold">{{ formatPrice(getRawMinPrice(hotel)) }} DZD</span>
                    </div>
                    <div class="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      <span>Marge ({{ businessMarkup.type === 'percentage' ? '+' + businessMarkup.val + '%' : '+' + formatPrice(businessMarkup.val) + ' DZD' }}) :</span>
                      <span>+{{ formatPrice(calculateAgencyMargin(getRawMinPrice(hotel))) }} DZD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-800">
              <!-- Desktop Arrangements Table (md+) -->
              <div class="hidden md:grid grid-cols-[1fr_200px_180px_140px_auto] gap-0 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <div class="px-4 py-3 flex items-center gap-1">Type de chambre <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                <div class="px-4 py-3">Traitement</div>
                <div class="px-4 py-3">Conditions d'annulation</div>
                <div class="px-4 py-3 text-right">Total</div>
                <div class="px-4 py-3"></div>
              </div>

              <div v-for="(arr, arrIdx) in getSortedArrangements(hotel.arrangements)" :key="'desk_arr_'+arrIdx" v-show="arrIdx < 2 || expandedHotels[hotel.id]" class="hidden md:grid grid-cols-[1fr_200px_180px_140px_auto] gap-0 items-center border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-primary/5 dark:hover:bg-slate-800/30 transition-colors">
                <div class="px-4 py-3">
                  <div class="text-sm font-bold text-slate-800 dark:text-white uppercase">{{ arr.room_type || 'Standard Room' }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    1 x Double [ {{ arr.rooms && arr.rooms[0] ? arr.rooms[0].occupancy || 2 : 2 }} Adultes ]
                  </div>
                  <button class="mt-1.5 text-[11px] text-primary font-semibold border border-primary/30 rounded-md px-2 py-0.5 hover:bg-primary/10 cursor-pointer transition-colors">
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
                  <div class="text-base font-black text-slate-900 dark:text-white">{{ formatPrice(calculateClientPrice(arr.price)) }}</div>
                  <div class="text-[11px] font-bold text-slate-500">{{ arr.currency || 'DZD' }}</div>
                  <div v-if="isBusinessUser && businessMarkup.val > 0" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 whitespace-nowrap">
                    Net: {{ formatPrice(arr.price) }} | +{{ formatPrice(calculateAgencyMargin(arr.price)) }}
                  </div>
                </div>
                <div class="px-4 py-3">
                  <button @click="openBookingModal(hotel, arr)" class="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/20 cursor-pointer transition-all whitespace-nowrap">
                    SELECTIONNER
                  </button>
                </div>
              </div>

              <!-- Mobile Arrangements Cards (< md) -->
              <div class="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                <div
                  v-for="(arr, arrIdx) in getSortedArrangements(hotel.arrangements)"
                  :key="'mob_arr_' + arrIdx"
                  v-show="arrIdx < 2 || expandedHotels[hotel.id]"
                  class="p-4 space-y-3 bg-white dark:bg-slate-900/40"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase leading-snug">
                        {{ arr.room_type || 'Standard Room' }}
                      </h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        <span>1 x Double [ {{ arr.rooms && arr.rooms[0] ? arr.rooms[0].occupancy || 2 : 2 }} Adultes ]</span>
                      </p>
                    </div>
                    <span
                      class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0"
                      :class="arr.refundable ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'"
                    >
                      {{ arr.refundable ? 'Remboursable' : 'Non remb.' }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ boardTypeLabel(arr.board_type) }}</span>
                    </div>
                    <span v-if="arr.refundable && arr.deadline" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Jusqu'au {{ arr.deadline }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between gap-3 pt-1">
                    <div>
                      <div class="text-[10px] uppercase font-bold text-slate-400">Total séjour</div>
                      <div class="text-base font-black text-slate-900 dark:text-white leading-none">
                        {{ formatPrice(calculateClientPrice(arr.price)) }}
                        <span class="text-xs font-bold text-primary">{{ arr.currency || 'DZD' }}</span>
                      </div>
                      <div v-if="isBusinessUser && businessMarkup.val > 0" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        Net: {{ formatPrice(arr.price) }} | +{{ formatPrice(calculateAgencyMargin(arr.price)) }}
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="openBookingModal(hotel, arr)"
                      class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-primary/25 cursor-pointer transition-all active:scale-95"
                    >
                      Sélectionner
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="hotel.arrangements.length > 2" class="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-200 dark:border-slate-800">
              <button @click="toggleHotelRooms(hotel.id)" class="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer transition-all">
                {{ expandedHotels[hotel.id] ? "MASQUER LES OFFRES" : `AFFICHER PLUS D'OFFRES (${hotel.arrangements.length} CHAMBRES DISPONIBLES)` }}
              </button>
            </div>
          </div>

          <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 pt-4 pb-8">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              PRECEDENT
            </button>
            <template v-for="page in paginationRange" :key="page">
              <button v-if="page !== '...'" @click="goToPage(page)" :class="page === currentPage ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'" class="w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center cursor-pointer transition-all">
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
          <div class="w-full md:w-52 h-44 md:h-auto flex items-center justify-center shrink-0 relative overflow-hidden group">
            <img
              :src="getHotelImage(selectedHotel)"
              @error="handleImageError($event, selectedHotel)"
              class="absolute inset-0 w-full h-full object-cover"
              alt="Photo hotel"
            />
            <button
              v-if="selectedHotel && getHotelGallery(selectedHotel).length > 1"
              type="button"
              @click.stop="openGalleryModal(selectedHotel)"
              class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur text-white text-[11px] font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>{{ getHotelGallery(selectedHotel).length }} photos</span>
            </button>
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
                  <span class="font-bold text-slate-500 dark:text-slate-500 block">Disponibilitée:</span>
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

        <!-- B2B Agency / Admin Agency Form (ONLY displayed for Business & Admin accounts, completely REMOVED for Clients/Guests) -->
        <div v-if="authStore.isAdmin || authStore.isAgency" class="mb-6 p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-black uppercase text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              <span>{{ authStore.isAdmin ? "Informations Agence Bouazize Travel (Admin)" : "Informations Agence Partenaire (B2B)" }}</span>
            </h4>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">Modifiable</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Nom de l'Agence</label>
              <input v-model="bookingForm.agency_name" type="text" placeholder="Agence Bouazize Travel" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Référence / Code Agent</label>
              <input v-model="bookingForm.agent_ref" type="text" placeholder="BOUAZIZE25" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Email Agence</label>
              <input v-model="bookingForm.agency_email" type="email" placeholder="contact@bouazizetravel.com" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Téléphone Agence</label>
              <input v-model="bookingForm.agency_phone" type="text" placeholder="+213 550 00 00 00" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>
        </div>

        <!-- Guest / Client Contact Information (Clean, direct, without agency clutter) -->
        <div class="mb-5">
          <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-3">Coordonnées du Voyageur (Client principal)</h4>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <input v-model="bookingForm.holder.name" type="text" placeholder="Prénom" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            <input v-model="bookingForm.holder.surname" type="text" placeholder="Nom" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input v-model="bookingForm.holder.email" type="email" placeholder="Email (ex: client@gmail.com)" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            <input v-model="bookingForm.holder.phone" type="text" placeholder="Téléphone (ex: 0550...)" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>
        </div>
        <div class="mb-5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
          Attention! Merci d'entrer le nom des passagers pour votre reservation
        </div>
        <div v-for="(room, rIdx) in bookingForm.rooms" :key="rIdx" class="mb-6 last:mb-0">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 pb-1 border-b border-slate-200 dark:border-slate-700">
            {{ room.type.toUpperCase() }} ( Berceau )
          </div>
          <div v-for="(pax, pIdx) in room.passengers" :key="pIdx" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 p-3 sm:p-0 bg-slate-50 dark:bg-slate-800/40 sm:bg-transparent rounded-xl border border-slate-100 dark:border-slate-800 sm:border-0">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="pIdx === 0 ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-white'">{{ pIdx + 1 }}</span>
              <select v-model="pax.title" class="w-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
                <option>MR</option><option>MRS</option><option>MS</option><option>MISS</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-2 flex-1">
              <input v-model="pax.surname" type="text" placeholder="Nom de famille" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <input v-model="pax.name" type="text" placeholder="Prénom" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- PAYMENT METHOD SELECTOR -->
      <div class="mb-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <PaymentMethodSelector
          v-model="bookingForm.payment_method"
          :disableCredit="disableCredit"
          :showCredit="isBusinessUser"
          :showCash="false"
        />
      </div>

      <div v-if="bookingError" class="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
        {{ bookingError }}
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="executePrebookAndBook"
          :disabled="bookingLoading"
          class="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-green-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <svg v-if="bookingLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          {{ bookingStep === 'prebooking' ? 'Evaluation en cours...' : (bookingStep === 'confirming' ? 'Confirmation finale...' : 'CONFIRMATION') }}
        </button>
        <button @click="goBackToResults" class="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all cursor-pointer">
          ANNULER
        </button>
      </div>
    </div>
    <!-- CONFIRMATION VIEW -->
    <div v-if="currentView === 'confirmation'" class="max-w-4xl mx-auto px-4 py-10">
      <div class="text-center mb-10">
        <div v-if="bookingResponse?.data?.paiment_status === 'paid' || bookingResponse?.data?.status === 'confirmed'" class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div v-else class="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-clock" class="w-10 h-10" />
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
          {{ (bookingResponse?.data?.paiment_status === 'paid' || bookingResponse?.data?.status === 'confirmed') ? 'Réservation Confirmée !' : 'Réservation Enregistrée (En attente de paiement)' }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
          {{ (bookingResponse?.data?.paiment_status === 'paid' || bookingResponse?.data?.status === 'confirmed') ? 'Votre réservation a été validée avec succès par le système.' : 'Votre réservation est actuellement en option. Le voucher certifié sera activé dès la confirmation définitive de votre paiement par l\'administration.' }}
        </p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
        <div class="bg-gradient-to-r from-[#0A0B25] to-[#151740] px-6 py-4 flex items-center justify-between border-b-2 border-primary">
          <h2 class="text-white font-black text-lg uppercase tracking-wider">Details de la reservation</h2>
          <div class="flex items-center gap-2">
            <span class="text-primary text-xs font-bold uppercase">Reference :</span>
            <div class="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-white font-mono font-bold">
              {{ bookingResponse?.data?.reference || 'REF-XXX' }}
              <button @click="copyReference(bookingResponse?.data?.reference)" class="hover:text-primary cursor-pointer transition-colors" title="Copier">
                <svg v-if="copiedRef" class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
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
              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Reu de paiement</h3>
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
                <span class="text-2xl font-black text-primary">{{ formatPrice(selectedArrangement?.price) }} DZD</span>
              </div>
            </div>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button @click="goBackToSearch" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase transition-colors cursor-pointer">
              NOUVELLE RECHERCHE
            </button>

            <!-- If paid and confirmed: active voucher button -->
            <button
              v-if="bookingResponse?.data?.paiment_status === 'paid' || bookingResponse?.data?.status === 'confirmed'"
              @click="openVoucherFromConfirmation"
              class="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase shadow-lg shadow-primary/25 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              IMPRIMER LE VOUCHER
            </button>

            <!-- If pending payment: Action to pay electronically and locked voucher indicator -->
            <template v-else>
              <NuxtLink
                :to="`/payment/confirm?order_id=${bookingResponse?.data?.order_id || bookingResponse?.data?.id}&type=hotel&amount=${calculateClientPrice(selectedArrangement?.price)}`"
                class="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm uppercase shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <UIcon name="i-heroicons-credit-card" class="w-4 h-4" />
                <span>Finaliser le Paiement Électronique</span>
              </NuxtLink>
              <div
                class="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                title="Le voucher sera accessible dès confirmation du paiement par l'administrateur"
              >
                <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-amber-500" />
                <span>Voucher bloqué (Validation requise)</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- CLIENT DOSSIERS / MY BOOKINGS VIEW -->
    <div v-if="currentView === 'my-bookings'" class="max-w-[1440px] mx-auto px-4 py-8">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase flex items-center gap-2.5">
            <UIcon name="i-heroicons-ticket" class="w-7 h-7 text-primary" />
            <span>Mes Réservations Hôtelières</span>
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consultez le statut de vos dossiers en temps réel, imprimez vos vouchers certifiés ou gérez vos annulations.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="loadClientBookings"
            :disabled="loadingClientBookings"
            type="button"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" :class="{ 'animate-spin': loadingClientBookings }" />
            <span>Actualiser</span>
          </button>
          <button
            @click="currentView = 'search'"
            type="button"
            class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UIcon name="i-heroicons-plus" class="w-4 h-4" />
            <span>Nouvelle Recherche</span>
          </button>
        </div>
      </div>

      <!-- Controls & Filter Tabs -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <button
            @click="clientBookingsFilter = 'all'"
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="clientBookingsFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
          >
            Tous ({{ clientBookings.length }})
          </button>
          <button
            @click="clientBookingsFilter = 'confirmed'"
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="clientBookingsFilter === 'confirmed' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
          >
            Confirmés ({{ clientBookings.filter(b => b.status === 'confirmed').length }})
          </button>
          <button
            @click="clientBookingsFilter = 'cancelled'"
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="clientBookingsFilter === 'cancelled' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
          >
            Annulés ({{ clientBookings.filter(b => b.status === 'cancelled').length }})
          </button>
        </div>

        <div class="relative w-full md:w-80">
          <input
            v-model="clientBookingsSearch"
            type="text"
            placeholder="Rechercher par référence, hôtel, nom..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingClientBookings" class="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Chargement de vos dossiers...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredClientBookings.length === 0" class="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-document-text" class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">Aucune réservation trouvée</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Vous n'avez pas encore de réservations correspondant à ce filtre. Réservez votre prochain séjour dès maintenant.
        </p>
        <button
          @click="currentView = 'search'"
          type="button"
          class="mt-5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          Rechercher un hôtel
        </button>
      </div>

      <!-- Bookings Cards Grid -->
      <div v-else class="space-y-4">
        <div
          v-for="b in filteredClientBookings"
          :key="b.id || b.reference"
          class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Card Header Bar -->
          <div class="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-primary/15 text-primary border border-primary/30">
                {{ b.reference }}
              </span>
              <span v-if="b.booking_number && b.booking_number !== b.reference" class="text-xs text-slate-400 font-mono">
                N° {{ b.booking_number }}
              </span>
              <span class="text-slate-400 text-xs">|</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">
                Réservé le {{ new Date(b.created_at || Date.now()).toLocaleDateString('fr-FR') }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Payment and Booking Status Badges -->
              <span
                v-if="b.status === 'confirmed' && b.paiment_status === 'paid'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Confirmé & Payé
              </span>
              <span
                v-else-if="b.paiment_status === 'verification_pending'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40"
              >
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                Paiement en vérification admin
              </span>
              <span
                v-else-if="b.status === 'cancelled'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300/40"
              >
                <span class="w-2 h-2 rounded-full bg-red-500"></span>
                Annulé
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40"
              >
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                En attente de paiement
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <!-- Left Info -->
            <div class="flex items-start gap-4 flex-1">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                <img
                  :src="b.hotel_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'"
                  class="w-full h-full object-cover"
                  alt="Hôtel"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <h3 class="font-black text-base text-slate-900 dark:text-white">
                    {{ b.hotel_name }}
                  </h3>
                  <span class="text-amber-500 text-xs font-bold">{{ starString(b.stars || 5) }}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary" />
                  <span>{{ b.address || b.city || 'Centre-ville' }}</span>
                </p>
                <div class="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                    {{ b.room_type || 'Chambre Standard' }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                    {{ boardTypeLabel(b.board_type) }}
                  </span>
                  <span class="text-slate-500">
                    Titulaire: <strong class="text-slate-700 dark:text-slate-200">{{ b.holder_name }}</strong>
                  </span>
                </div>
              </div>
            </div>

            <!-- Middle: Stay Dates -->
            <div class="bg-slate-50 dark:bg-slate-800/40 px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60 min-w-[200px]">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Période du séjour</div>
              <div class="text-xs font-bold text-slate-800 dark:text-slate-200">
                Du {{ b.checkin }} au {{ b.checkout }}
              </div>
              <div class="text-[11px] text-primary font-extrabold mt-0.5">
                {{ b.nights || 1 }} nuits
              </div>
            </div>

            <!-- Right: Price & Actions -->
            <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
              <div class="text-left lg:text-right">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Montant Total Réglé</div>
                <div class="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {{ formatPrice(b.total_price) }} <span class="text-sm font-bold text-primary">{{ b.cœurrency || 'DZD' }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <!-- E-Payment action if not paid -->
                <NuxtLink
                  v-if="b.paiment_status === 'pending_payment'"
                  :to="`/payment/confirm?order_id=${b.id || ''}&type=hotel&amount=${b.total_price || ''}`"
                  class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UIcon name="i-heroicons-credit-card" class="w-4 h-4" />
                  <span>Payer par BaridiMob / CCP</span>
                </NuxtLink>

                <!-- If verification pending, show badge -->
                <div
                  v-else-if="b.paiment_status === 'verification_pending'"
                  class="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 animate-spin" />
                  <span>En cours de validation admin</span>
                </div>

                <!-- Print Voucher Button (Only active when confirmed and paid) -->
                <button
                  v-if="b.status === 'confirmed' && b.paiment_status === 'paid'"
                  @click="openVoucherModal(b)"
                  type="button"
                  class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UIcon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  <span>Voucher Officiel</span>
                </button>
                <div
                  v-else
                  class="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-not-allowed"
                  :title="b.paiment_status === 'verification_pending' ? 'Paiement en cours de vérification par l\'administration' : 'Paiement requis pour débloquer le voucher'"
                >
                  <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" />
                  <span>Voucher bloqué</span>
                </div>

                <!-- Cancel Booking Button -->
                <button
                  v-if="b.status !== 'cancelled'"
                  @click="promptCancelBooking(b)"
                  type="button"
                  class="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Annuler cette réservation"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Cancellation Details Footer (if cancelled) -->
          <div v-if="b.status === 'cancelled'" class="px-5 py-2.5 bg-red-50/70 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50 flex items-center justify-between text-xs text-red-700 dark:text-red-300">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
              <span>Dossier annulé {{ b.cancelled_at ? `le ${new Date(b.cancelled_at).toLocaleString('fr-FR')}` : '' }}. Raison: {{ b.cancellation_reason || 'Demande client' }}</span>
            </div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-red-600">Aucun frais supplémentaire</span>
          </div>
        </div>
      </div>
    </div>

    <!-- OFFICIAL BOUAZIZE TRAVEL VOUCHER MODAL -->
    <div
      v-if="isVoucherModalOpen && selectedVoucherBooking"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      @click.self="closeVoucherModal"
    >
      <div class="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-primary/40 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
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

          <div class="text-right sm:text-right">
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
                <span>Éétablissement & Séjour</span>
              </h3>
              <div>
                <h4 class="font-black text-base text-slate-900 dark:text-white">
                  {{ selectedVoucherBooking.hotel_name }}
                </h4>
                <div class="text-amber-500 text-xs font-bold mt-0.5">
                  {{ starString(selectedVoucherBooking.stars || 5) }}
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {{ selectedVoucherBooking.address || selectedVoucherBooking.city }}
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
                  <span class="font-black text-slate-800 dark:text-slate-200 uppercase">{{ selectedVoucherBooking.room_type || 'Chambre Standard' }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Traitement / Repas</span>
                  <span class="font-bold text-primary">{{ boardTypeLabel(selectedVoucherBooking.board_type) }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase font-bold">Titulaire du dossier</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedVoucherBooking.holder_name }}</span>
                </div>
                <div v-if="selectedVoucherBooking.holder_phone || selectedVoucherBooking.holder_email" class="text-slate-500">
                  {{ selectedVoucherBooking.holder_phone }} {{ selectedVoucherBooking.holder_email ? `| ${selectedVoucherBooking.holder_email}` : '' }}
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Montant Total Enregistré</div>
                <div v-if="!hideVoucherPrice" class="text-xl font-black text-primary">
                  {{ formatPrice(selectedVoucherBooking.total_price) }} {{ selectedVoucherBooking.cœurrency || 'DZD' }}
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">(RÉGLÉ)</span>
                </div>
                <div v-else class="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  PRESTATIONS RÉGLÉES   VOUCHER CLIENT
                </div>
              </div>
            </div>
          </div>

          <!-- QR & Check-in Verification Box -->
          <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 bg-white p-1 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                <!-- Graphic SVG QR representation -->
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
        <div class="p-4 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 print:hidden">
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
              <span>Masquer le prix sur le voucher</span>
            </label>
          </div>
          <button
            @click="printVoucher"
            type="button"
            class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UIcon name="i-heroicons-printer" class="w-4 h-4" />
            <span>Imprimer le Voucher</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CLIENT CANCELLATION MODAL -->
    <div
      v-if="cancellationModalOpen && bookingToCancel"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      @click.self="cancellationModalOpen = false"
    >
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-red-200 dark:border-red-900/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
          </div>

          <h3 class="text-lg font-black text-center text-slate-900 dark:text-white uppercase">
            Confirmer l'annulation
          </h3>
          <p class="text-xs text-center text-slate-500 dark:text-slate-400 mt-1">
            Êtes-vous sûr de vouloir annuler la réservation pour <strong>{{ bookingToCancel.hotel_name }}</strong> (Réf: <span class="font-mono text-primary font-bold">{{ bookingToCancel.reference }}</span>) ?
          </p>

          <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div class="font-bold flex items-center gap-1">
              <UIcon name="i-heroicons-shield-exclamation" class="w-4 h-4 text-amber-600" />
              <span>Conditions d'annulation :</span>
            </div>
            <p>Cette opération annulera le dossier auprès de l'hôtel et de Netstorming.</p>
          </div>

          <div class="mt-4">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
              Motif d'annulation :
            </label>
            <input
              v-model="cancellationReason"
              type="text"
              placeholder="Ex: Changement de dates, empêchement..."
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />
          </div>

          <div v-if="cancellationError" class="mt-3 p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
            {{ cancellationError }}
          </div>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              @click="cancellationModalOpen = false"
              type="button"
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Conserver la réservation
            </button>
            <button
              @click="executeClientCancelBooking"
              :disabled="isCancellingBooking"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UIcon v-if="isCancellingBooking" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
              <span>{{ isCancellingBooking ? 'Annulation en cours...' : 'Confirmer l\'annulation' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: RECENT SEARCHES -->
    <div v-if="isRecentSearchesOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="isRecentSearchesOpen = false">
      <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900 dark:text-white">Recherches Récentes</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Vos dernières destinations et critères de séjour</p>
            </div>
          </div>
          <button @click="isRecentSearchesOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 max-h-[60vh] overflow-y-auto">
          <div v-if="recentSearches.length === 0" class="text-center py-10">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">Aucune recherche récente</p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Vos recherches d'hôtels s'afficheront ici automatiquement pour un accès rapide.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in recentSearches"
              :key="item.id"
              class="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all"
            >
              <div class="flex items-center gap-3 cursor-pointer flex-1 min-w-0" @click="applyRecentSearch(item)">
                <div class="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {{ item.city_name || item.destination_query || item.city_code }}
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                    <span>{{ item.checkin }} → {{ item.checkout }}</span>
                    <span>•</span>
                    <span>{{ item.rooms?.length || 1 }} ch.</span>
                    <span>•</span>
                    <span class="text-slate-400 dark:text-slate-500">{{ formatTimeAgo(item.timestamp) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  @click="applyRecentSearch(item)"
                  class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Relancer
                </button>
                <button
                  type="button"
                  @click.stop="removeRecentSearch(item.id)"
                  class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="recentSearches.length > 0" class="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button type="button" @click="clearRecentSearches" class="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer">
            Vider l'historique
          </button>
          <button type="button" @click="isRecentSearchesOpen = false" class="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: PHOTO GALLERY VIEWER -->
    <div v-if="isGalleryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" @click.self="isGalleryModalOpen = false">
      <div class="w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div class="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div class="min-w-0 pr-4">
            <h3 class="text-base font-bold text-white truncate">{{ galleryActiveHotel?.name || "Galerie Photos" }}</h3>
            <p class="text-xs text-slate-400 truncate">{{ galleryActiveHotel?.address || galleryActiveHotel?.city || "" }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {{ galleryActiveIndex + 1 }} / {{ getHotelGallery(galleryActiveHotel).length }}
            </span>
            <button type="button" @click="isGalleryModalOpen = false" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="relative bg-black flex items-center justify-center min-h-[340px] md:min-h-[460px] max-h-[60vh] overflow-hidden group">
          <img
            :src="getHotelGallery(galleryActiveHotel)[galleryActiveIndex]"
            class="max-w-full max-h-[60vh] object-contain select-none"
            alt="Photo hotel"
            @error="handleImageError($event, galleryActiveHotel)"
          />

          <button
            v-if="getHotelGallery(galleryActiveHotel).length > 1"
            type="button"
            @click="galleryActiveIndex = (galleryActiveIndex - 1 + getHotelGallery(galleryActiveHotel).length) % getHotelGallery(galleryActiveHotel).length"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            v-if="getHotelGallery(galleryActiveHotel).length > 1"
            type="button"
            @click="galleryActiveIndex = (galleryActiveIndex + 1) % getHotelGallery(galleryActiveHotel).length"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Thumbnails -->
        <div class="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            v-for="(photo, idx) in getHotelGallery(galleryActiveHotel)"
            :key="idx"
            type="button"
            @click="galleryActiveIndex = idx"
            class="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer"
            :class="galleryActiveIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
          >
            <img :src="photo" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </div>
  </div>

    <!-- MODAL: PARTAGER L'HOTEL -->
    <div v-if="isShareModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="isShareModalOpen = false">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-share" class="w-5 h-5 text-primary" />
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Partager cet hôtel</h3>
          </div>
          <button @click="isShareModalOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <img :src="getHotelImage(shareActiveHotel)" class="w-16 h-16 rounded-lg object-cover shrink-0" alt="Hotel" />
            <div class="min-w-0 flex-1">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ shareActiveHotel?.name }}</h4>
              <p class="text-xs text-slate-400 truncate">{{ shareActiveHotel?.city || form.destination }}</p>
              <div class="text-xs text-amber-500 mt-0.5">{{ starString(shareActiveHotel?.stars) }}</div>
            </div>
          </div>

          <div class="space-y-2">
            <!-- WhatsApp -->
            <button
              type="button"
              @click="shareOnWhatsApp"
              class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
              <span>Partager sur WhatsApp</span>
            </button>

            <!-- Copy Link -->
            <button
              type="button"
              @click="copyShareLink"
              class="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <UIcon name="i-heroicons-link" class="w-5 h-5 text-primary" />
              <span>Copier le lien direct</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: IMPRIMER LA FICHE HOTEL -->
    <div v-if="isPrintModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" @click.self="isPrintModalOpen = false">
      <div class="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:m-0 print:border-0 print:shadow-none animate-in fade-in zoom-in-95 duration-200">
        <!-- Top Action Bar (hidden on print) -->
        <div class="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Aperçu avant impression</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="executePrint"
              class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <UIcon name="i-heroicons-printer" class="w-4 h-4" />
              <span>Imprimer maintenant</span>
            </button>
            <button
              type="button"
              @click="isPrintModalOpen = false"
              class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition-all"
            >
              Fermer
            </button>
          </div>
        </div>

        <!-- Printable Document Body -->
        <div class="p-8 space-y-6 print:p-6" id="hotel-factsheet-print">
          <!-- Agency Header -->
          <div class="flex items-center justify-between border-b-2 border-slate-200 pb-4">
            <div>
              <h1 class="text-2xl font-black tracking-tight text-slate-900">BOUAZIZE TRAVEL</h1>
              <p class="text-xs text-slate-500 mt-0.5">Agence de Voyages & Tourisme • Licence A n° 2024/DZ/ALG/0892</p>
              <p class="text-xs text-slate-500">Tél: +213 (0) 23 45 67 89 / +213 (0) 550 12 34 56 • contact@bouazizetravel.com</p>
            </div>
            <div class="text-right">
              <span class="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300">FICHE HÔTEL OFFICIELLE</span>
              <div class="text-[10px] text-slate-400 mt-1 font-mono">Date d'édition: {{ new Date().toLocaleDateString('fr-FR') }}</div>
            </div>
          </div>

          <!-- Hotel Title & Address -->
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-black text-slate-900">{{ printActiveHotel?.name }}</h2>
              <div class="text-amber-500 text-lg font-bold mt-0.5">{{ starString(printActiveHotel?.stars) }}</div>
              <p class="text-xs text-slate-600 mt-1 flex items-center gap-1">
                <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary" />
                {{ printActiveHotel?.address || printActiveHotel?.city || form.destination }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <div class="text-xs text-slate-400 font-medium">ÀÀ partir de</div>
              <div class="text-2xl font-black text-slate-900">{{ formatPrice(getMinPrice(printActiveHotel)) }} <span class="text-sm font-bold text-slate-500">DZD</span></div>
              <div class="text-[10px] text-slate-400">Taxes incluses</div>
            </div>
          </div>

          <!-- Photos Grid -->
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2 h-56 rounded-xl overflow-hidden border border-slate-200">
              <img :src="getHotelImage(printActiveHotel)" class="w-full h-full object-cover" alt="Cover" />
            </div>
            <div class="flex flex-col gap-3 h-56">
              <div v-for="(pic, pIdx) in getHotelGallery(printActiveHotel).slice(1, 3)" :key="pIdx" class="flex-1 rounded-xl overflow-hidden border border-slate-200">
                <img :src="pic" class="w-full h-full object-cover" alt="Gallery" />
              </div>
            </div>
          </div>

          <!-- Room Options -->
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Options d'Hébergement Disponibles</h3>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600 text-[10px]">
                  <tr>
                    <th class="p-3">Type de Chambre</th>
                    <th class="p-3">Pension</th>
                    <th class="p-3">Conditions</th>
                    <th class="p-3 text-right">Tarif Séjour (DZD)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(arr, aIdx) in (printActiveHotel?.arrangements || []).slice(0, 5)" :key="aIdx">
                    <td class="p-3 font-bold text-slate-800">{{ arr.room_type || 'Chambre Standard' }}</td>
                    <td class="p-3">{{ arr.board_type || 'RO' }}</td>
                    <td class="p-3">
                      <span :class="arr.refundable ? 'text-emerald-600 font-bold' : 'text-slate-500'">
                        {{ arr.refundable ? 'Remboursable' : 'Non remboursable' }}
                      </span>
                    </td>
                    <td class="p-3 text-right font-black font-mono text-slate-900">{{ formatPrice(calculateClientPrice(arr.price)) }} DZD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Amenities & Notice -->
          <div class="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-200 text-slate-600">
            <div>
              <span class="font-bold text-slate-800 block mb-1">ÉÉquipements & Services :</span>
              <p>Wi-Fi gratuit, Réception 24h/24, Climatisation, Service de conciergerie, Personnel multilingue.</p>
            </div>
            <div class="text-right">
              <span class="font-bold text-slate-800 block mb-1">Assistance Bouazize Travel :</span>
              <p>Ligne directe réservations : +213 550 12 34 56<br />Disponibilitéé sous réserve de confirmation finale.</p>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- MODAL: MES HOTELS FAVORIS (TOP-LEVEL ACCESSIBLE)      -->
    <!-- ==================================================== -->
    <div
      v-if="isFavoritesModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      @click.self="isFavoritesModalOpen = false"
    >
      <div class="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center text-rose-500 shadow-sm">
              <UIcon name="i-heroicons-heart" class="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Mes Hôtels Favoris</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ savedFavoriteHotels.length }} éétablissement{{ savedFavoriteHotels.length > 1 ? 's' : '' }} enregistréé{{ savedFavoriteHotels.length > 1 ? 's' : '' }} dans votre sélection
              </p>
            </div>
          </div>
          <button
            @click="isFavoritesModalOpen = false"
            type="button"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <!-- Empty state if 0 favorites -->
          <div v-if="savedFavoriteHotels.length === 0" class="text-center py-16 px-4">
            <div class="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-heart" class="w-8 h-8" />
            </div>
            <h4 class="text-lg font-black text-slate-800 dark:text-white">Votre liste de favoris est vide</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              Lors de vos recherches d'hôtels, cliquez sur l'icône de cœur sur n'importe quelle fiche d'hôtel pour l'ajouter à vos favoris et y accéder directement à tout moment.
            </p>
            <button
              @click="isFavoritesModalOpen = false; currentView = 'search'"
              type="button"
              class="mt-6 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-primary/20 cursor-pointer"
            >
              Rechercher des Hôtels
            </button>
          </div>

          <!-- Cards Grid if favorites exist -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="fav in savedFavoriteHotels"
              :key="fav.id"
              class="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start gap-3">
                <img :src="fav.image || getHotelImage(fav)" class="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" alt="Hotel" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1 text-amber-400 text-xs mb-1">
                    <UIcon v-for="s in (parseInt(fav.stars) || 4)" :key="s" name="i-heroicons-star" class="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <h4 class="font-black text-sm text-slate-900 dark:text-white truncate">{{ fav.name }}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{{ fav.city }} {{ fav.address ? '  ' + fav.address : '' }}</span>
                  </p>
                  <div v-if="fav.min_price" class="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    ÀÀ partir de <span class="text-primary font-black font-mono text-sm">{{ formatPrice(calculateClientPrice(fav.min_price)) }} DZD</span>
                  </div>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                <button
                  @click="toggleFavorite(fav)"
                  type="button"
                  class="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Retirer des favoris"
                >
                  <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
                  <span>Retirer</span>
                </button>

                <div class="flex items-center gap-2">
                  <button
                    @click="searchFavoriteHotel(fav)"
                    type="button"
                    class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <UIcon name="i-heroicons-magnifying-glass" class="w-3.5 h-3.5" />
                    <span>Voir les Offres</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="savedFavoriteHotels.length > 0" class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            @click="isFavoritesModalOpen = false; filters.showFavorites = true; currentView = 'results'"
            type="button"
            class="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1.5 cursor-pointer"
          >
            <UIcon name="i-heroicons-funnel" class="w-4 h-4" />
            <span>Filtrer les résultats avec mes favoris</span>
          </button>
          <button
            @click="isFavoritesModalOpen = false"
            type="button"
            class="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>


  <!-- TELEPORTED MOBILE FILTER SLIDE-OVER DRAWER -->
  <Teleport to="body">
    <div
      v-if="isMobileFilterOpen"
      class="fixed inset-0 z-9999 flex justify-end"
    >
      <!-- Backdrop -->
      <div
        @click="isMobileFilterOpen = false"
        class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      ></div>

      <!-- Drawer Panel -->
      <div class="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Filtres</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ filteredResults.length }} hôtels disponibles</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="activeFilterCount > 0"
              type="button"
              @click="resetAllFilters"
              class="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 rounded cursor-pointer"
            >
              Réinitialiser
            </button>
            <button
              type="button"
              @click="isMobileFilterOpen = false"
              class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6">
          <!-- Live Hotel Name Filter -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Nom de l'hôtel</h4>
              <span v-if="filters.hotelName && filters.hotelName.trim()" class="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all" :class="filteredResults.length > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'">
                {{ filteredResults.length }} trouvé(s)
              </span>
            </div>
            <div class="relative">
              <input
                v-model="filters.hotelName"
                @keydown.enter.prevent="applyHotelNameFilter"
                type="text"
                placeholder="Rechercher un hôtel..."
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                v-if="filters.hotelName"
                type="button"
                @click="clearHotelNameFilter"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
                title="Effacer le filtre"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Price Range Slider & Inputs -->
          <div v-if="priceRange">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Fourchette de Prix</h4>
            <div class="flex items-center gap-2 mb-2">
              <input v-model.number="filters.priceMin" type="number" class="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none" />
              <span class="text-xs text-slate-400">-</span>
              <input v-model.number="filters.priceMax" type="number" class="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none" />
              <span class="text-[11px] font-bold text-slate-500">DZD</span>
            </div>
            <input type="range" :min="priceRange.min" :max="priceRange.max" v-model.number="filters.priceMax" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary" />
            <div class="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Min: {{ formatPrice(priceRange.min) }} DZD</span>
              <span>Max: {{ formatPrice(priceRange.max) }} DZD</span>
            </div>
          </div>

          <!-- Star Ratings (1-5) -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Étoiles</h4>
            <div class="space-y-1.5">
              <label v-for="s in ['5','4','3','2','1']" :key="'mob_star_'+s" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="filters.stars.includes(s)" @change="toggleFilter(filters.stars, s)" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span class="text-amber-500 text-xs">{{ starString(s) }}</span>
                </div>
                <span class="text-xs font-bold text-slate-400">({{ starCounts[s] || 0 }})</span>
              </label>
            </div>
          </div>

          <!-- Board Type / Meals -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Pension / Repas</h4>
            <div class="space-y-1.5">
              <label v-for="meal in [{code:'RO',label:'Chambre Seule'},{code:'BB',label:'Petit Déjeuner'},{code:'HB',label:'Demi-Pension'},{code:'FB',label:'Pension Complète'},{code:'AI',label:'All Inclusive'}]" :key="'mob_m_'+meal.code" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="filters.meals.includes(meal.code)" @change="toggleFilter(filters.meals, meal.code)" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span class="text-xs text-slate-700 dark:text-slate-300">{{ meal.label }}</span>
                </div>
                <span class="text-xs font-bold text-slate-400">({{ mealCounts[meal.code] || 0 }})</span>
              </label>
            </div>
          </div>

          <!-- Cancellation Conditions -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Conditions d'annulation</h4>
            <div class="space-y-1.5">
              <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="filters.cancellation.includes('refundable')" @change="toggleFilter(filters.cancellation, 'refundable')" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span class="text-xs text-slate-700 dark:text-slate-300">Remboursable</span>
                </div>
                <span class="text-xs font-bold text-emerald-600">({{ cancellationCounts.refundable }})</span>
              </label>
              <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="filters.cancellation.includes('non_refundable')" @change="toggleFilter(filters.cancellation, 'non_refundable')" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span class="text-xs text-slate-700 dark:text-slate-300">Non remboursable</span>
                </div>
                <span class="text-xs font-bold text-rose-500">({{ cancellationCounts.non_refundable }})</span>
              </label>
            </div>
          </div>

          <!-- Categories -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Catégorie</h4>
            <div class="space-y-1.5">
              <label v-for="cat in ['Touristique','Touristique superieure','Premiere','Premiere superieure','De luxe']" :key="'mob_cat_'+cat" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="filters.categories.includes(cat)" @change="toggleFilter(filters.categories, cat)" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                  <span class="text-xs text-slate-700 dark:text-slate-300">{{ cat }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Special Options -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Options spéciales</h4>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <input type="checkbox" v-model="filters.showFavorites" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                <span class="text-xs text-slate-700 dark:text-slate-300">Hôtels favoris seulement ({{ favoritesCount }})</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <input type="checkbox" v-model="filters.showBestHotels" class="w-4 h-4 accent-primary rounded cursor-pointer" />
                <span class="text-xs text-slate-700 dark:text-slate-300">Offres spéciales seulement</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <button
            type="button"
            @click="isMobileFilterOpen = false"
            class="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 cursor-pointer text-center"
          >
            Afficher les {{ filteredResults.length }} hôtels
          </button>
          <button
            v-if="activeFilterCount > 0"
            type="button"
            @click="resetAllFilters"
            class="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Effacer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>