<template>
    <div id="hero" class="relative bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <!-- Hero & Banners Carousel (Booking.com-inspired compact viewport proportions) -->
        <swiper-container 
            ref="heroSwiper" 
            navigation="true" 
            pagination="true" 
            class="w-full h-auto"
        >
            <!-- Slide 1: Main Brand Hero Banner -->
            <swiper-slide class="h-auto">
                <div class="relative w-full min-h-[340px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[450px] flex items-center bg-[#0C1C39] text-white overflow-hidden pt-6 sm:pt-8 pb-16 sm:pb-20">
                    <!-- Subtle ambient brand glow -->
                    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div class="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-8 items-center relative z-10">
                        <!-- Text Content (Left / Main) -->
                        <div class="lg:col-span-7 flex flex-col justify-center gap-3 md:gap-4">
                            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/15 w-fit text-[11px] font-bold uppercase tracking-widest text-primary">
                                <span>Bouazize Travel · Agence de Voyages &amp; Tourisme</span>
                            </div>

                            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase">
                                Des expériences
                                <span class="text-primary">inoubliables</span>,
                                des destinations de <span class="text-primary">rêve</span>.
                            </h1>

                            <p class="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed font-normal">
                                Découvrez le monde avec Bouazize Travel. Réservez parmi <strong class="text-primary font-bold">{{ hotelsTotalLabel }} hôtels</strong>, offres Omra, voyages organisés et visas avec confirmation rapide et paiement sécurisé.
                            </p>
                            
                            <!-- CTA Buttons + Inline Key Stats -->
                            <div class="flex flex-wrap items-center gap-3 pt-1">
                                <nuxt-link to="/services">
                                    <button class="bg-primary hover:bg-primary-hover text-[#0C1C39] px-5 py-2.5 md:px-7 md:py-3 font-extrabold uppercase tracking-wider text-xs md:text-sm transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer">
                                        <span>Explorer nos offres</span>
                                        <Icon name="i-heroicons-arrow-right" class="w-4 h-4"/>
                                    </button>
                                </nuxt-link>
                                <button class="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-5 py-2.5 md:px-6 md:py-3 font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer" @click="scrollDown">
                                    <span>Découvrir</span>
                                    <Icon name="i-heroicons-arrow-down" class="w-4 h-4 text-primary"/>
                                </button>

                                <!-- Compact Inline Stats Badges -->
                                <div class="hidden sm:flex items-center gap-5 pl-4 ml-2 border-l border-white/15">
                                    <div>
                                        <span class="text-lg md:text-xl font-black text-primary">5+</span>
                                        <span class="block text-[10px] uppercase tracking-wider text-slate-300">Années d'expérience</span>
                                    </div>
                                    <div>
                                        <span class="text-lg md:text-xl font-black text-white">{{ stats.clients || 500 }}+</span>
                                        <span class="block text-[10px] uppercase tracking-wider text-slate-300">Clients satisfaits</span>
                                    </div>
                                    <div>
                                        <span class="text-lg md:text-xl font-black text-white">{{ stats.destinations || 50 }}+</span>
                                        <span class="block text-[10px] uppercase tracking-wider text-slate-300">Destinations</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Visual Showcase (Compact Booking-banner style collage) -->
                        <div class="lg:col-span-5 relative w-full h-[260px] xl:h-[300px] hidden lg:flex items-center justify-center">
                            <div class="grid grid-cols-2 gap-3 w-full h-full">
                                <div class="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                                    <img src="/images/travel_collage_1.png" alt="Séjours & Hôtels" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div class="grid grid-rows-2 gap-3 h-full">
                                    <div class="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                                        <img src="/images/travel_collage_2.png" alt="Omra" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div class="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                                        <img src="/images/travel_collage_3.png" alt="Voyages Organisés" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </swiper-slide>

            <!-- Dynamic Banners Slides (Bright, clear photography with light gradient overlay) -->
            <swiper-slide v-for="banner in banners" :key="banner.id" class="h-auto">
                <div class="relative w-full min-h-[340px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[450px] flex items-center justify-center bg-[#0C1C39] text-white overflow-hidden pt-6 sm:pt-8 pb-16 sm:pb-20">
                    <!-- Background Image: 100% full brightness + light directional gradient instead of heavy dark veil -->
                    <div v-if="banner.image_url" class="absolute inset-0 z-0">
                        <img :src="getFullImageUrl(banner.image_url)" class="w-full h-full object-cover opacity-100" alt="Banner Background" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0C1C39]/55 via-[#0C1C39]/20 to-black/10"></div>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 container mx-auto px-6 md:px-12 py-6 flex flex-col gap-4 w-full"
                         :class="getAlignmentClasses(banner.alignment)">
                        <div class="max-w-3xl">
                            <h2 v-if="banner.title" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 tracking-wide text-white uppercase leading-tight drop-shadow-md">
                                {{ banner.title }}
                            </h2>
                            <p v-if="banner.information" class="text-sm sm:text-base md:text-lg text-white/95 font-normal mt-2 drop-shadow">
                                {{ banner.information }}
                            </p>
                        </div>

                        <div v-if="banner.button_text && banner.button_link" class="mt-2">
                            <UButton
                                :to="banner.button_link"
                                size="md"
                                class="bg-primary hover:bg-primary-hover text-[#0C1C39] font-extrabold uppercase tracking-wider px-6 py-2.5 md:px-8 md:py-3 rounded-none transition-colors duration-200 shadow-xl"
                            >
                                {{ banner.button_text }}
                            </UButton>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper-container>

        <!-- ─── Booking.com-Style Docked Fast Hotel Search Bar ───────────────────────────── -->
        <div class="relative z-30 container mx-auto px-4 sm:px-6 lg:px-12 -mt-9 sm:-mt-11 md:-mt-12 pb-6">
            <!-- Gold Outer Frame (Booking.com signature search bar architecture) -->
            <div class="bg-primary p-1 sm:p-1.5 shadow-2xl border border-primary/90 relative overflow-visible">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-1 sm:gap-1.5 items-stretch">
                    
                    <!-- 1. Destination Cell (with live autocomplete dropdown) -->
                    <div class="relative sm:col-span-2 lg:col-span-4 bg-white dark:bg-[#0C1C39] px-3.5 py-2 flex flex-col justify-center">
                        <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Destination ou Hôtel</span>
                        </label>
                        <input
                            v-model="destinationInput"
                            type="text"
                            placeholder="Où allez-vous ? (Ville, pays, hôtel...)"
                            class="w-full h-7 bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                            @input="onDestinationInput"
                            @focus="onDestinationFocus"
                        />

                        <!-- Autocomplete Suggestions Dropdown -->
                        <div
                            v-if="showSuggestions && (hotelStore.destinationSuggestions.length || destinationInput.length >= 2)"
                            class="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
                        >
                            <div v-if="groupedSuggestions.length">
                                <div v-for="group in groupedSuggestions" :key="group.title" class="pb-1">
                                    <div class="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <UIcon :name="group.icon" class="w-3.5 h-3.5" :class="group.iconColor" />
                                        <span>{{ group.title }}</span>
                                    </div>
                                    <div
                                        v-for="dest in group.items"
                                        :key="dest.hotel_id ? ('h-' + dest.hotel_id) : ('d-' + (dest.code || dest.ns_code) + '-' + dest.name)"
                                        class="px-4 py-2.5 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between"
                                        @click="chooseDestination(dest)"
                                    >
                                        <div class="flex items-center gap-2.5 min-w-0">
                                            <UIcon
                                                :name="dest.type === 'hotel' ? 'i-heroicons-building-office-2' : (dest.type === 'country' ? 'i-heroicons-globe-alt' : 'i-heroicons-map-pin')"
                                                class="w-4 h-4 shrink-0"
                                                :class="dest.type === 'hotel' ? 'text-amber-500' : (dest.type === 'country' ? 'text-blue-500' : 'text-primary')"
                                            />
                                            <div class="truncate">
                                                <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                                    {{ dest.name }}
                                                </p>
                                                <p class="text-[11px] text-slate-400 flex items-center gap-1.5">
                                                    <span v-if="dest.type === 'hotel'" class="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">Hôtel</span>
                                                    <span>{{ dest.type === 'hotel' && dest.city_name ? (dest.city_name + ', ') : '' }}{{ dest.country_name || dest.country_code }}</span>
                                                    <span v-if="dest.stars" class="text-amber-400 font-bold">★ {{ dest.stars }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <span class="text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 shrink-0 ml-2">
                                            {{ dest.type === 'hotel' ? 'Voir l\'offre' : (dest.hotel_count > 1 ? Number(dest.hotel_count).toLocaleString('fr-FR') + ' hôtels' : (dest.code || dest.ns_code)) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="hotelStore.loadingDestinations" class="p-3 text-center text-xs text-slate-400">
                                Recherche en cours...
                            </div>
                            <div v-else class="p-4 text-center text-xs text-slate-400">
                                Aucune destination ou hôtel trouvé pour "{{ destinationInput }}"
                            </div>
                        </div>
                    </div>

                    <!-- 2. Check-in Date Cell -->
                    <div class="lg:col-span-2 bg-white dark:bg-[#0C1C39] px-3.5 py-2 flex flex-col justify-center">
                        <label class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Arrivée</span>
                        </label>
                        <input
                            type="date"
                            v-model="checkIn"
                            :min="minDate"
                            class="w-full h-7 bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                        />
                    </div>

                    <!-- 3. Check-out Date Cell -->
                    <div class="lg:col-span-2 bg-white dark:bg-[#0C1C39] px-3.5 py-2 flex flex-col justify-center">
                        <label class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Départ</span>
                        </label>
                        <input
                            type="date"
                            v-model="checkOut"
                            :min="minCheckOut"
                            :max="maxCheckOut"
                            class="w-full h-7 bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                        />
                    </div>

                    <!-- 4. Guests (Adults & Children) Cell -->
                    <div class="lg:col-span-2 bg-white dark:bg-[#0C1C39] px-3.5 py-2 flex flex-col justify-center">
                        <label class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <UIcon name="i-heroicons-users" class="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Voyageurs</span>
                        </label>
                        <div class="grid grid-cols-2 gap-2 items-center h-7">
                            <div class="flex items-center gap-1">
                                <input
                                    type="number"
                                    v-model.number="adults"
                                    min="1"
                                    :max="Math.max(1, 9 - children)"
                                    class="w-10 h-6 bg-slate-100 dark:bg-slate-800 text-center text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none"
                                />
                                <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Ad.</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <input
                                    type="number"
                                    v-model.number="children"
                                    min="0"
                                    :max="Math.min(6, Math.max(0, 9 - adults))"
                                    class="w-10 h-6 bg-slate-100 dark:bg-slate-800 text-center text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none"
                                />
                                <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Enf.</span>
                            </div>
                        </div>
                    </div>

                    <!-- 5. Search CTA Button Cell -->
                    <div class="sm:col-span-2 lg:col-span-2 flex">
                        <button
                            type="button"
                            :disabled="isNavigating"
                            class="w-full min-h-[52px] bg-[#0C1C39] hover:bg-[#162D56] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 px-4 cursor-pointer disabled:opacity-60"
                            @click="triggerHotelSearch"
                        >
                            <UIcon v-if="isNavigating" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin text-primary" />
                            <UIcon v-else name="i-heroicons-magnifying-glass" class="w-4 h-4 text-primary" />
                            <span>Rechercher</span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- Compact Quick Destinations Strip & Child Ages Below Bar -->
            <div class="bg-white dark:bg-[#0C1C39] border-x border-b border-slate-200 dark:border-slate-800 px-4 py-2 shadow-md flex flex-wrap items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">Top Villes :</span>
                    <button
                        v-for="chip in popularChips"
                        :key="chip.code"
                        type="button"
                        class="px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors border cursor-pointer"
                        :class="destinationCode === chip.code
                            ? 'bg-primary text-[#0C1C39] border-primary font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'"
                        @click="selectQuickChip(chip)"
                    >
                        {{ chip.name }}
                    </button>
                </div>

                <!-- Child ages selector when children > 0 -->
                <div v-if="children > 0" class="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                    <span class="text-[11px] font-bold text-slate-500 dark:text-slate-300">Âges enfants :</span>
                    <div v-for="(age, cIdx) in childrenAges" :key="cIdx" class="flex items-center gap-1">
                        <span class="text-[10px] text-slate-400">E{{ cIdx + 1 }}</span>
                        <select
                            v-model.number="childrenAges[cIdx]"
                            class="h-6 px-1.5 text-[11px] font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        >
                            <option v-for="a in 18" :key="a - 1" :value="a - 1">{{ a - 1 }} ans</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from '#imports'
import { useHotelStore } from '~/stores/hotel'
import { getHotelStats, warmupDestination } from '~/services/hotel'

const router = useRouter()
const toast = useToast()
const hotelStore = useHotelStore()

const destinationsTotal = ref(0)
const hotelsTotal = ref(838351)
const destinationsTotalLabel = computed(() =>
    destinationsTotal.value ? Number(destinationsTotal.value).toLocaleString('fr-FR') : '50 000+'
)
const hotelsTotalLabel = computed(() =>
    hotelsTotal.value ? '+' + Number(hotelsTotal.value).toLocaleString('fr-FR') : '+838 000'
)
onMounted(async () => {
    try {
        const res = await getHotelStats()
        destinationsTotal.value = res?.data?.destinations_count || 0
        if (res?.data?.worldwide_inventory_count) {
            hotelsTotal.value = res.data.worldwide_inventory_count
        }
        if (res?.data?.min_check_in_date) {
            minDate.value = res.data.min_check_in_date
            if (!checkIn.value || checkIn.value < minDate.value) {
                checkIn.value = minDate.value
                checkOut.value = addDaysYmd(minDate.value, 1)
            }
        }
    } catch { /* keep placeholder */ }
})

// ─── HOTEL QUICK SEARCH STATE ────────────────────────────────────────────────
const isNavigating = ref(false)
const destinationInput = ref('')
const destinationCode = ref('')
const destinationName = ref('')
const selectedHotelId = ref(null)
const selectedHotelName = ref('')
const showSuggestions = ref(false)

function localTodayYmd(offsetDays = 0) {
    const dt = new Date()
    dt.setDate(dt.getDate() + offsetDays)
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

const todayLocal = localTodayYmd(0)
const defaultIn = localTodayYmd(7)
const defaultOut = localTodayYmd(12)

const minDate = ref(todayLocal)
const checkIn = ref(defaultIn)
const checkOut = ref(defaultOut)
const adults = ref(2)
const children = ref(0)
const childrenAges = ref([])

function addDaysYmd(ymd, days) {
    const [y, m, d] = String(ymd || '').split('-').map(Number)
    const dt = (y && m && d) ? new Date(y, m - 1, d) : new Date()
    dt.setDate(dt.getDate() + days)
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

const minCheckOut = computed(() => addDaysYmd(checkIn.value || minDate.value, 1))
const maxCheckOut = computed(() => addDaysYmd(checkIn.value || minDate.value, 30))

watch(checkIn, (newIn) => {
    if (!newIn) return
    if (!checkOut.value || checkOut.value <= newIn) {
        checkOut.value = addDaysYmd(newIn, 1)
    } else if (checkOut.value > addDaysYmd(newIn, 30)) {
        checkOut.value = addDaysYmd(newIn, 30)
    }
})

watch(children, (cnt) => {
    const clamped = Math.max(0, Math.min(6, Math.min(Number(cnt) || 0, Math.max(0, 9 - (Number(adults.value) || 1)))))
    if (clamped !== cnt) children.value = clamped
    const next = []
    for (let i = 0; i < clamped; i++) {
        next.push(childrenAges.value[i] ?? 5)
    }
    childrenAges.value = next
})

watch(adults, (val) => {
    const clamped = Math.max(1, Math.min(9, Number(val) || 1))
    if (clamped !== val) adults.value = clamped
    if (clamped + (Number(children.value) || 0) > 9) {
        children.value = Math.max(0, 9 - clamped)
    }
})

const popularChips = [
    { name: 'Sétif', code: 'QSF' },
    { name: 'Alger', code: 'AXAL' },
    { name: 'Moscou', code: 'MOW' },
    { name: 'Bali', code: 'KUTB' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Dubaï', code: 'DXB' },
    { name: 'Paris', code: 'PAR' },
    { name: 'La Mecque', code: 'MAK' },
]

const groupedSuggestions = computed(() => {
    const list = hotelStore.destinationSuggestions || []
    if (!list.length) return []

    const cities = list.filter(d => d.type === 'city')
    const hotels = list.filter(d => d.type === 'hotel')
    const countries = list.filter(d => d.type === 'country')
    const groups = []

    const firstType = list[0]?.type
    if (firstType === 'hotel') {
        if (hotels.length) groups.push({ title: 'HÔTELS & ÉTABLISSEMENTS', icon: 'i-heroicons-building-office-2', iconColor: 'text-amber-500', items: hotels })
        if (cities.length) groups.push({ title: 'DESTINATIONS & VILLES', icon: 'i-heroicons-map-pin', iconColor: 'text-primary', items: cities })
        if (countries.length) groups.push({ title: 'PAYS', icon: 'i-heroicons-globe-alt', iconColor: 'text-blue-500', items: countries })
    } else {
        if (cities.length) groups.push({ title: 'DESTINATIONS & VILLES', icon: 'i-heroicons-map-pin', iconColor: 'text-primary', items: cities })
        if (hotels.length) groups.push({ title: 'HÔTELS & ÉTABLISSEMENTS', icon: 'i-heroicons-building-office-2', iconColor: 'text-amber-500', items: hotels })
        if (countries.length) groups.push({ title: 'PAYS', icon: 'i-heroicons-globe-alt', iconColor: 'text-blue-500', items: countries })
    }
    return groups
})

let destDebounce = null
function onDestinationInput() {
    destinationCode.value = ''
    destinationName.value = ''
    selectedHotelId.value = null
    selectedHotelName.value = ''
    showSuggestions.value = true
    clearTimeout(destDebounce)
    destDebounce = setTimeout(() => {
        if (destinationInput.value.length >= 2) {
            hotelStore.fetchDestinations(destinationInput.value)
        }
    }, 300)
}

function onDestinationFocus() {
    if (destinationInput.value.length >= 2 && hotelStore.destinationSuggestions.length) {
        showSuggestions.value = true
    }
}

function chooseDestination(dest) {
    if (dest.type === 'hotel') {
        destinationInput.value = dest.name + (dest.city_name ? (' — ' + dest.city_name) : '')
        selectedHotelId.value = dest.hotel_id || null
        selectedHotelName.value = dest.name || ''
    } else {
        destinationInput.value = dest.name || dest.label || ''
        selectedHotelId.value = null
        selectedHotelName.value = ''
    }
    destinationCode.value = dest.ns_code || dest.code || dest.city_code || ''
    destinationName.value = dest.name || dest.label || ''
    showSuggestions.value = false
    // Pre-warm availability cache for this destination so the first search is fast
    if (destinationCode.value && dest.type !== 'hotel') {
        warmupDestination(destinationCode.value, checkIn.value, checkOut.value, adults.value)
    }
}

function selectQuickChip(chip) {
    destinationInput.value = chip.name
    destinationCode.value = chip.code
    destinationName.value = chip.name
    selectedHotelId.value = null
    selectedHotelName.value = ''
    showSuggestions.value = false
    // Pre-warm availability cache for popular destinations
    warmupDestination(chip.code, checkIn.value, checkOut.value, adults.value)
}

function triggerHotelSearch() {
    if (!destinationCode.value) {
        if (destinationInput.value && hotelStore.destinationSuggestions.length) {
            chooseDestination(hotelStore.destinationSuggestions[0])
        } else {
            toast.add({
                title: 'Destination requise',
                description: 'Veuillez sélectionner ou taper une destination pour votre recherche.',
                color: 'amber'
            })
            return
        }
    }

    hotelStore.searchForm.destination_code = destinationCode.value
    hotelStore.searchForm.destination_name = destinationName.value
    hotelStore.searchForm.hotel_id = selectedHotelId.value || null
    hotelStore.searchForm.hotel_name = selectedHotelName.value || null
    hotelStore.searchForm.check_in = checkIn.value
    hotelStore.searchForm.check_out = checkOut.value
    if (!checkIn.value || !checkOut.value || checkOut.value <= checkIn.value) {
        toast.add({
            title: 'Dates invalides',
            description: "La date de départ doit être postérieure à la date d'arrivée.",
            color: 'amber'
        })
        return
    }
    const diffNights = Math.round((new Date(checkOut.value) - new Date(checkIn.value)) / 86400000)
    if (diffNights > 30) {
        toast.add({
            title: 'Durée maximale dépassée',
            description: 'La durée maximale par réservation est de 30 nuits.',
            color: 'amber'
        })
        return
    }
    const safeAdults = Math.max(1, Math.min(9, Number(adults.value) || 2))
    const safeChildren = Math.max(0, Math.min(6, Math.min(Number(children.value) || 0, 9 - safeAdults)))
    const safeAges = Array.from({ length: safeChildren }, (_, i) => Math.max(0, Math.min(17, Number(childrenAges.value[i] ?? 5))))

    hotelStore.searchForm.adults = safeAdults
    hotelStore.searchForm.children = safeChildren
    hotelStore.searchForm.children_ages = safeAges
    hotelStore.searchForm.rooms = 1
    hotelStore.searchForm.room_type = safeAdults === 1 ? 'sgl' : (safeAdults === 3 ? 'trp' : (safeAdults === 4 ? 'qud' : 'dbl'))
    hotelStore.searchForm.rooms_config = [{
        adults: safeAdults,
        children: safeChildren,
        children_ages: safeAges,
        type: hotelStore.searchForm.room_type,
        berceau: false,
    }]
    if (typeof sessionStorage !== 'undefined') {
        try { sessionStorage.removeItem('hotel_rooms_config') } catch {}
    }

    hotelStore.clearSearchResults()
    isNavigating.value = true

    const query = {
        destination_code: destinationCode.value,
        destination_name: destinationName.value,
        check_in: checkIn.value,
        check_out: checkOut.value,
        adults: safeAdults,
        children: safeChildren,
        rooms: 1,
        rooms_config: JSON.stringify(hotelStore.searchForm.rooms_config),
        ...(safeAges.length ? { children_ages: safeAges.join(',') } : {}),
    }
    if (selectedHotelId.value) {
        query.hotel_id = selectedHotelId.value
    }
    if (selectedHotelName.value) {
        query.hotel_name = selectedHotelName.value
    }

    router.push({
        path: '/services/hotels/results',
        query
    }).finally(() => {
        setTimeout(() => { isNavigating.value = false }, 1000)
    })
}

// ─── HERO SLIDER & BANNERS ───────────────────────────────────────────────────
const getFullImageUrl = (path) => {
    if(!path) return '';
    if(path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_BASE_URL || '';
    return baseUrl.replace('/api', '') + (path.startsWith('/') ? path : '/' + path);
}

const getAlignmentClasses = (alignment) => {
    switch(alignment) {
        case 'left':
            return 'items-start text-left'
        case 'right':
            return 'items-end text-right'
        case 'center':
        default:
            return 'items-center text-center'
    }
}

const scrollDown = () => {
    const section = document.getElementById('hotels-section') || document.getElementById('services-section') || document.getElementById('hero')
    window.scrollTo({
        top: section.offsetTop || section.offsetHeight,
        behavior: "smooth"
    });
}

const { data: bannersRes } = await useAsyncData('hero_banners', () => $fetch(import.meta.env.VITE_BASE_URL + '/banner/active', { headers: { 'Accept': 'application/json' } }), { getCachedData(key) { const app = useNuxtApp(); return app.payload.data[key] || app.static.data[key]; }, lazy: import.meta.client })
const banners = computed(() => bannersRes.value?.data || [])

const { data: statsRes } = await useAsyncData('hero_stats', () => $fetch(import.meta.env.VITE_BASE_URL + '/stats', { headers: { 'Accept': 'application/json' } }), { getCachedData(key) { const app = useNuxtApp(); return app.payload.data[key] || app.static.data[key]; }, lazy: import.meta.client })
const stats = computed(() => statsRes.value?.data || {})

const heroSwiper = ref(null)

const swiperOptions = ref({
    slidesPerView: 1,
    loop: true,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        clickable: true,
    },
    navigation: true
})

onMounted(() => {
    hotelStore.loadingSearch = false
    isNavigating.value = false
    if (banners.value && banners.value.length > 0) {
        setTimeout(() => {
            if (heroSwiper.value && heroSwiper.value.swiper) {
                heroSwiper.value.swiper.update()
                heroSwiper.value.swiper.autoplay.start()
            }
        }, 100)
    }
})
</script>

<style scoped>
swiper-container::part(button-prev),
swiper-container::part(button-next) {
    color: #CA8A04; /* Using the primary color roughly */
}

@media (max-width: 768px) {
    swiper-container::part(button-prev),
    swiper-container::part(button-next) {
        display: none;
    }
}

swiper-container::part(pagination-bullet-active) {
    background-color: #CA8A04;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(var(--tw-rotate, 0deg));
    }
    50% {
        transform: translateY(-20px) rotate(var(--tw-rotate, 0deg));
    }
}

.animate-\[float_6s_ease-in-out_infinite\] {
    animation: float 6s ease-in-out infinite;
}
.animate-\[float_5s_ease-in-out_infinite_0\.5s\] {
    animation: float 5s ease-in-out infinite 0.5s;
}
.animate-\[float_7s_ease-in-out_infinite_1s\] {
    animation: float 7s ease-in-out infinite 1s;
}
.animate-\[float_6s_ease-in-out_infinite_1\.5s\] {
    animation: float 6s ease-in-out infinite 1.5s;
}
</style>