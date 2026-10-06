<template>
    <div id="hero" class="relative bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <!-- Remove key to prevent destroying the swiper instance -->
        <swiper-container 
            ref="heroSwiper" 
            navigation="true" 
            pagination="true" 
            class="w-full h-auto md:min-h-[75vh]"
        >
            
            <!-- Slide 1: Static Hero -->
            <swiper-slide class="h-auto">
                <div class="relative w-full min-h-[65vh] md:min-h-[80vh] lg:min-h-[88vh] flex items-center bg-gray-50 dark:bg-slate-950 overflow-hidden pt-6 sm:pt-10 pb-32 sm:pb-36 md:pb-40 lg:pb-48">
                    <!-- Decorative background blur -->
                    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div class="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <!-- Text Content -->
                        <div class="flex flex-col justify-center gap-2 md:gap-8">
                            <h1 class="text-2xl sm:text-4xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-secondary dark:text-white leading-tight md:leading-[1.1] tracking-tight uppercase">
                                Des expériences
                                <span class="inline-block whitespace-nowrap">
                                    <span class="text-primary italic font-serif relative inline-block">
                                        inoubliables
                                        <!-- Underline decoration -->
                                        <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="4" fill="none" />
                                        </svg>
                                    </span>,
                                </span> <br class="hidden xl:block"/>
                                des destinations de <span class="text-secondary dark:text-white relative z-10">rêve</span>.
                            </h1>
                            <p class="text-xs sm:text-sm md:text-lg text-gray-600 dark:text-slate-300 max-w-lg leading-snug md:leading-relaxed font-light">
                                Découvrez le monde avec Bouazize Travel. Nous organisons vos voyages sur mesure avec passion, sécurité et confort. L'excellence est notre standard depuis plus de 10 ans.
                            </p>
                            
                            <!-- Buttons -->
                            <div class="flex flex-wrap items-center gap-2 pt-1 md:gap-4 md:pt-2">
                                <nuxt-link to="/services">
                                    <button class="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 md:px-8 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300 flex items-center gap-3 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 rounded-xl">
                                        Nos Services
                                        <Icon name="i-heroicons-arrow-right" class="w-5 h-5"/>
                                    </button>
                                </nuxt-link>
                                <button class="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary text-secondary dark:text-white px-3 py-1.5 md:px-8 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300 flex items-center gap-3 rounded-xl hover:-translate-y-1" @click="scrollDown">
                                    Découvrir
                                    <Icon name="i-heroicons-arrow-down" class="w-5 h-5 text-primary"/>
                                </button>
                            </div>

                            <!-- Analytics / Stats -->
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 sm:pt-8 pb-3 sm:pb-4 mt-6 border-t border-gray-200 dark:border-slate-800">
                                <div class="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-1 group">
                                    <h3 class="text-xl md:text-4xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.years }}+</h3>
                                    <p class="text-[10px] leading-tight md:text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">Années <br class="hidden sm:block"/>d'expérience</p>
                                </div>
                                <div class="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-1 group">
                                    <h3 class="text-xl md:text-4xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.clients }}+</h3>
                                    <p class="text-[10px] leading-tight md:text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">Clients <br class="hidden sm:block"/>satisfaits</p>
                                </div>
                                <div class="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-1 group">
                                    <h3 class="text-xl md:text-4xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.destinations }}+</h3>
                                    <p class="text-[10px] leading-tight md:text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">Destinations <br class="hidden sm:block"/>globales</p>
                                </div>
                            </div>
                        </div>

                        <!-- Professional Photo Collage with Flight Path -->
                        <div class="relative w-full h-[250px] sm:h-[400px] lg:h-[600px] hidden lg:flex items-center justify-center mt-10 lg:mt-0">
                            
                            <!-- Animated Flight Path -->
                            <svg class="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <!-- Dashed loop connecting the images -->
                                <path id="flightPath" d="M 50,50 C 70,20 90,20 90,50 C 90,80 70,80 50,50 C 30,20 10,20 10,50 C 10,80 30,80 50,50 Z" fill="transparent" stroke="url(#gradientPrimary)" stroke-width="0.4" stroke-dasharray="1.5,1.5" class="opacity-50"/>
                                <defs>
                                    <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#CA8A04" />
                                        <stop offset="100%" stop-color="#FCD34D" />
                                    </linearGradient>
                                </defs>
                                <!-- The Airplane -->
                                <g>
                                    <!-- Rotated 90 degrees because SVG paths align with X axis initially for animateMotion -->
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#CA8A04" transform="scale(0.2) translate(-12, -12) rotate(90)" />
                                    <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
                                        <mpath href="#flightPath"/>
                                    </animateMotion>
                                </g>
                            </svg>

                            <!-- Image 1: Paris (Top Left) -->
                            <div class="absolute left-0 top-0 w-2/5 h-[40%] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 z-10 animate-[float_6s_ease-in-out_infinite]">
                                <img src="/images/travel_collage_3.png" alt="Paris" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Image 2: Beach (Top Right) -->
                            <div class="absolute right-0 top-6 w-1/2 h-[42%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 z-30 animate-[float_5s_ease-in-out_infinite_0.5s]">
                                <img src="/images/travel_collage_1.png" alt="Plage Tropicale" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Image 3: Mecca (Bottom Left) -->
                            <div class="absolute left-6 bottom-8 w-[45%] h-[40%] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 z-20 animate-[float_7s_ease-in-out_infinite_1s]">
                                <img src="/images/travel_collage_2.png" alt="Omra" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Image 4: Algeria (Bottom Right) -->
                            <div class="absolute right-4 bottom-0 w-[42%] h-[45%] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 z-10 animate-[float_6s_ease-in-out_infinite_1.5s]">
                                <img src="/images/travel_collage_4.png" alt="Algérie" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Decorative Elements -->
                            <div class="absolute top-1/2 left-1/4 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                            <div class="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </swiper-slide>

            <!-- Dynamic Banners Slides -->
            <swiper-slide v-for="banner in banners" :key="banner.id" class="h-auto">
                <div class="relative w-full min-h-[65vh] md:min-h-[80vh] lg:min-h-[88vh] flex items-center justify-center bg-secondary text-white overflow-hidden pt-6 sm:pt-10 pb-32 sm:pb-36 md:pb-40 lg:pb-48">
                    <!-- Background Image -->
                    <div v-if="banner.image_url" class="absolute inset-0 z-0">
                        <!-- Increased opacity and lighter overlay to make image visible -->
                        <img :src="getFullImageUrl(banner.image_url)" class="w-full h-full object-cover opacity-80" alt="Banner Background" />
                        <div class="absolute inset-0 bg-secondary/50"></div>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 container mx-auto px-6 py-8 md:py-10 flex flex-col gap-6 w-full"
                         :class="getAlignmentClasses(banner.alignment)">
                        <div class="max-w-3xl">
                            <h2 v-if="banner.title" class="text-2xl md:text-5xl lg:text-6xl font-extrabold mb-2 md:mb-4 tracking-wide text-white uppercase leading-tight">
                                {{ banner.title }}
                            </h2>
                            <p v-if="banner.information" class="hidden md:block text-lg md:text-xl text-gray-300 font-light mt-4">
                                {{ banner.information }}
                            </p>
                        </div>

                        <div v-if="banner.button_text && banner.button_link" class="mt-6">
                            <UButton
                                :to="banner.button_link"
                                size="md"
                                class="bg-primary hover:bg-primary-hover text-secondary font-bold uppercase tracking-wider px-6 py-2 md:px-10 md:py-4 rounded-none transition-colors duration-300 shadow-xl"
                            >
                                {{ banner.button_text }}
                            </UButton>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper-container>

        <!-- ─── Floating Quick Hotel Search Widget ───────────────────────────── -->
        <div class="relative z-30 container mx-auto px-4 sm:px-6 lg:px-12 -mt-[104px] sm:-mt-[112px] md:-mt-[190px] pb-10">
            <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-800/90 relative overflow-visible transition-all duration-300">
                
                <!-- Ambient decorative glow -->
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Top Row: Title Badge + Quick Destination Chips -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div class="flex items-center gap-2.5">
                        <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                            <UIcon name="i-heroicons-building-office-2" class="w-4 h-4" />
                        </span>
                        <div>
                            <h3 class="text-sm md:text-base font-extrabold text-secondary dark:text-white uppercase tracking-wider">
                                Réservez Votre Hôtel
                            </h3>
                            <p class="text-[11px] text-slate-400 font-medium">
                                Moteur Netstorming en direct · {{ destinationsTotalLabel }} destinations dans le monde
                            </p>
                        </div>
                    </div>

                    <!-- Quick Destination Chips -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
                        <span class="text-[11px] font-semibold text-slate-400 whitespace-nowrap mr-1 hidden sm:inline">Top Villes :</span>
                        <button
                            v-for="chip in popularChips"
                            :key="chip.code"
                            type="button"
                            class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center border cursor-pointer"
                            :class="destinationCode === chip.code
                                ? 'bg-primary text-white border-primary shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary'"
                            @click="selectQuickChip(chip)"
                        >
                            <span>{{ chip.name }}</span>
                        </button>
                    </div>
                </div>

                <!-- Inputs Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                    
                    <!-- Destination (with live autocomplete dropdown) -->
                    <div class="relative sm:col-span-2 lg:col-span-4 flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-primary" />
                            <span>Destination</span>
                        </label>
                        <UInput
                            v-model="destinationInput"
                            placeholder="Quelle ville ou pays ?"
                            icon="i-heroicons-magnifying-glass"
                            size="lg"
                            class="w-full !h-12"
                            :ui="{ root: '!h-12', base: '!h-12 text-sm' }"
                            @input="onDestinationInput"
                            @focus="onDestinationFocus"
                        />

                        <!-- Autocomplete Suggestions Dropdown -->
                        <div
                            v-if="showSuggestions && (hotelStore.destinationSuggestions.length || destinationInput.length >= 2)"
                            class="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
                        >
                            <div
                                v-for="dest in hotelStore.destinationSuggestions"
                                :key="dest.hotel_id ? ('h-' + dest.hotel_id) : (dest.code || dest.ns_code)"
                                class="px-4 py-2.5 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between"
                                @click="chooseDestination(dest)"
                            >
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <UIcon
                                        :name="dest.type === 'hotel' ? 'i-heroicons-building-office-2' : 'i-heroicons-map-pin'"
                                        class="w-4 h-4 shrink-0"
                                        :class="dest.type === 'hotel' ? 'text-amber-500' : 'text-primary'"
                                    />
                                    <div class="truncate">
                                        <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {{ dest.name }}
                                        </p>
                                        <p class="text-[11px] text-slate-400 flex items-center gap-1.5">
                                            <span v-if="dest.type === 'hotel'" class="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold rounded text-[10px]">Hôtel</span>
                                            <span>{{ dest.type === 'hotel' && dest.city_name ? (dest.city_name + ', ') : '' }}{{ dest.country_name || dest.country_code }}</span>
                                            <span v-if="dest.stars" class="text-amber-400 font-bold">★ {{ dest.stars }}</span>
                                        </p>
                                    </div>
                                </div>
                                <span class="text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0 ml-2">
                                    {{ dest.type === 'hotel' ? 'Voir l\'offre' : (dest.hotel_count > 1 ? Number(dest.hotel_count).toLocaleString() + ' hôtels' : (dest.code || dest.ns_code)) }}
                                </span>
                            </div>
                            <div v-if="!hotelStore.destinationSuggestions.length" class="p-3 text-center text-xs text-slate-400">
                                Recherche en cours...
                            </div>
                        </div>
                    </div>

                    <!-- Check-in Date -->
                    <div class="lg:col-span-2 flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-primary" />
                            <span>Arrivée</span>
                        </label>
                        <UInput
                            type="date"
                            v-model="checkIn"
                            size="lg"
                            :min="minDate"
                            class="w-full !h-12 font-medium"
                            :ui="{ root: '!h-12', base: '!h-12 font-medium text-sm' }"
                        />
                    </div>

                    <!-- Check-out Date -->
                    <div class="lg:col-span-2 flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-primary" />
                            <span>Départ</span>
                        </label>
                        <UInput
                            type="date"
                            v-model="checkOut"
                            size="lg"
                            :min="checkIn || minDate"
                            class="w-full !h-12 font-medium"
                            :ui="{ root: '!h-12', base: '!h-12 font-medium text-sm' }"
                        />
                    </div>

                    <!-- Guests (Adults & Children) -->
                    <div class="lg:col-span-2 flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <UIcon name="i-heroicons-users" class="w-4 h-4 text-primary" />
                            <span>Voyageurs</span>
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            <UInput
                                type="number"
                                v-model.number="adults"
                                min="1"
                                max="8"
                                placeholder="Adultes"
                                size="lg"
                                class="!h-12 text-center font-bold"
                                :ui="{ root: '!h-12', base: '!h-12 text-center font-bold text-sm' }"
                            />
                            <UInput
                                type="number"
                                v-model.number="children"
                                min="0"
                                max="6"
                                placeholder="Enfants"
                                size="lg"
                                class="!h-12 text-center font-bold"
                                :ui="{ root: '!h-12', base: '!h-12 text-center font-bold text-sm' }"
                            />
                        </div>
                    </div>

                    <!-- Search CTA Button -->
                    <div class="sm:col-span-2 lg:col-span-2">
                        <UButton
                            block
                            size="lg"
                            color="primary"
                            icon="i-heroicons-magnifying-glass"
                            class="!h-12 font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center"
                            :ui="{ base: '!h-12' }"
                            :loading="isNavigating"
                            @click="triggerHotelSearch"
                        >
                            Rechercher
                        </UButton>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#imports'
import { useHotelStore } from '~/stores/hotel'
import { getHotelStats, warmupDestination } from '~/services/hotel'

const router = useRouter()
const toast = useToast()
const hotelStore = useHotelStore()

const destinationsTotal = ref(0)
const destinationsTotalLabel = computed(() =>
    destinationsTotal.value ? Number(destinationsTotal.value).toLocaleString('fr-FR') : '…'
)
onMounted(async () => {
    try {
        const res = await getHotelStats()
        destinationsTotal.value = res?.data?.destinations_count || 0
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

const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
const defaultIn = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
const defaultOut = new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0]

const minDate = ref(tomorrow)
const checkIn = ref(defaultIn)
const checkOut = ref(defaultOut)
const adults = ref(2)
const children = ref(0)

const popularChips = [
    { name: 'La Mecque', code: 'MAC1' },
    { name: 'Médine', code: 'MAD2' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Tunis', code: 'TUN' },
    { name: 'Dubaï', code: 'DXB' },
    { name: 'Paris', code: 'PAR' },
]

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
    destinationCode.value = dest.ns_code || dest.code
    destinationName.value = dest.name || dest.label || ''
    showSuggestions.value = false
    // Pre-warm Netstorming cache for this destination so the first search is fast
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
    // Pre-warm Netstorming cache for popular destinations
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
    hotelStore.searchForm.adults = adults.value
    hotelStore.searchForm.children = children.value

    hotelStore.clearSearchResults()
    isNavigating.value = true

    const query = {
        destination_code: destinationCode.value,
        destination_name: destinationName.value,
        check_in: checkIn.value,
        check_out: checkOut.value,
        adults: adults.value,
        children: children.value,
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