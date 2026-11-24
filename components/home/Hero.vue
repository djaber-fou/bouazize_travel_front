<template>
    <div id="hero" class="relative bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <!-- Hero & Banners Carousel -->
        <swiper-container 
            ref="heroSwiper" 
            navigation="true" 
            pagination="true" 
            class="w-full h-auto"
        >
            <!-- Slide 1: Static Hero (Light in Light Mode, Dark in Dark Mode + Compact 4-Photo Collage & Airplane Animation) -->
            <swiper-slide class="h-auto">
                <div class="relative w-full min-h-[400px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex items-center bg-gray-50 dark:bg-slate-950 overflow-hidden pt-4 sm:pt-6 pb-16 sm:pb-20">
                    <!-- Decorative background blur -->
                    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div class="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                        <!-- Text Content -->
                        <div class="flex flex-col justify-center gap-3 md:gap-5">
                            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-5xl font-extrabold text-secondary dark:text-white leading-tight md:leading-[1.12] tracking-tight uppercase">
                                Des expériences
                                <span class="inline-block whitespace-nowrap">
                                    <span class="text-primary italic font-serif relative inline-block">
                                        inoubliables
                                        <!-- Underline decoration -->
                                        <svg class="absolute w-full h-2.5 -bottom-1 left-0 text-primary opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="4" fill="none" />
                                        </svg>
                                    </span>,
                                </span> <br class="hidden xl:block"/>
                                des destinations de <span class="text-secondary dark:text-white relative z-10">rêve</span>.
                            </h1>
                            <p class="text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-300 max-w-lg leading-relaxed font-light">
                                Découvrez le monde avec Bouazize Travel. Nous organisons vos voyages sur mesure avec passion, sécurité et confort. L'excellence est notre standard depuis plus de 5 ans.
                            </p>
                            
                            <!-- Buttons -->
                            <div class="flex flex-wrap items-center gap-2.5 pt-1">
                                <nuxt-link to="/services">
                                    <button class="bg-primary hover:bg-primary-hover text-white px-4 py-2 md:px-6 md:py-3 font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2.5 shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 rounded-xl cursor-pointer">
                                        Nos Services
                                        <Icon name="i-heroicons-arrow-right" class="w-4 h-4"/>
                                    </button>
                                </nuxt-link>
                                <button class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary text-secondary dark:text-white px-4 py-2 md:px-6 md:py-3 font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2.5 rounded-xl hover:-translate-y-0.5 cursor-pointer" @click="scrollDown">
                                    Découvrir
                                    <Icon name="i-heroicons-arrow-down" class="w-4 h-4 text-primary"/>
                                </button>
                            </div>

                            <!-- Analytics / Stats (Compact) -->
                            <div class="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-gray-200 dark:border-slate-800 max-w-lg">
                                <div class="flex flex-col items-start gap-0.5 group">
                                    <h3 class="text-lg sm:text-2xl md:text-3xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">5+</h3>
                                    <p class="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider leading-tight">Années d'expérience</p>
                                </div>
                                <div class="flex flex-col items-start gap-0.5 group">
                                    <h3 class="text-lg sm:text-2xl md:text-3xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.clients }}+</h3>
                                    <p class="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider leading-tight">Clients satisfaits</p>
                                </div>
                                <div class="flex flex-col items-start gap-0.5 group">
                                    <h3 class="text-lg sm:text-2xl md:text-3xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.destinations }}+</h3>
                                    <p class="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider leading-tight">Destinations globales</p>
                                </div>
                            </div>
                        </div>

                        <!-- Professional Photo Collage with Animated Flight Path (Scaled Compactly) -->
                        <div class="relative w-full h-[240px] sm:h-[320px] lg:h-[380px] xl:h-[410px] hidden lg:flex items-center justify-center">
                            <!-- Animated Flight Path -->
                            <svg class="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path id="flightPath" d="M 50,50 C 70,20 90,20 90,50 C 90,80 70,80 50,50 C 30,20 10,20 10,50 C 10,80 30,80 50,50 Z" fill="transparent" stroke="url(#gradientPrimary)" stroke-width="0.4" stroke-dasharray="1.5,1.5" class="opacity-60"/>
                                <defs>
                                    <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#E1AF5A" />
                                        <stop offset="100%" stop-color="#C99742" />
                                    </linearGradient>
                                </defs>
                                <!-- The Airplane -->
                                <g>
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#E1AF5A" transform="scale(0.2) translate(-12, -12) rotate(90)" />
                                    <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
                                        <mpath href="#flightPath"/>
                                    </animateMotion>
                                </g>
                            </svg>

                            <!-- Image 1: Paris (Top Left) -->
                            <div class="absolute left-2 top-0 w-[38%] h-[42%] rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 z-10 animate-[float_6s_ease-in-out_infinite]">
                                <img src="/images/travel_collage_3.png" alt="Paris" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Image 2: Beach (Top Right) -->
                            <div class="absolute right-2 top-4 w-[46%] h-[43%] rounded-2xl overflow-hidden shadow-xl border-2 border-white dark:border-slate-800 z-30 animate-[float_5s_ease-in-out_infinite_0.5s]">
                                <img src="/images/travel_collage_1.png" alt="Plage Tropicale" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Image 3: Mecca (Bottom Left) -->
                            <div class="absolute left-6 bottom-4 w-[42%] h-[42%] rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 z-20 animate-[float_7s_ease-in-out_infinite_1s]">
                                <img src="/images/travel_collage_2.png" alt="Omra" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Image 4: Algeria (Bottom Right) -->
                            <div class="absolute right-4 bottom-0 w-[40%] h-[45%] rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 z-10 animate-[float_6s_ease-in-out_infinite_1.5s]">
                                <img src="/images/travel_collage_4.png" alt="Algérie" class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Decorative Elements -->
                            <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                            <div class="absolute bottom-1/4 right-1/4 w-28 h-28 bg-secondary/10 rounded-full blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </swiper-slide>

            <!-- Dynamic Banners Slides (Bright, clear photography with light gradient overlay) -->
            <swiper-slide v-for="banner in banners" :key="banner.id" class="h-auto">
                <div class="relative w-full min-h-[400px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex items-center justify-center bg-[#0C1C39] text-white overflow-hidden pt-4 sm:pt-6 pb-16 sm:pb-20">
                    <!-- Background Image: 100% full brightness + light directional gradient -->
                    <div v-if="banner.image_url" class="absolute inset-0 z-0">
                        <img :src="getFullImageUrl(banner.image_url)" class="w-full h-full object-cover opacity-100" alt="Banner Background" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0C1C39]/50 via-[#0C1C39]/15 to-transparent"></div>
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

        <!-- ─── Booking.com-Style Docked Fast Hotel Search Bar (Thin 2px Gold Border + Full Occupancy Popover) ─── -->
        <div class="relative z-30 container mx-auto px-4 sm:px-6 lg:px-12 -mt-8 sm:-mt-10 pb-6">
            <!-- Thin Gold Frame (2px border/gap like Booking.com) -->
            <div class="bg-primary p-[2px] rounded-lg shadow-xl relative overflow-visible">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-[2px] items-stretch">
                    
                    <!-- 1. Destination Cell (with live autocomplete dropdown) -->
                    <div class="relative sm:col-span-2 lg:col-span-4 bg-white dark:bg-[#0C1C39] rounded-t-md lg:rounded-tr-none lg:rounded-l-md px-3.5 py-2 flex items-center gap-2.5">
                        <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-slate-400 dark:text-slate-400 shrink-0" />
                        <div class="flex-1 min-w-0">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                                Choisissez votre destination
                            </label>
                            <input
                                v-model="destinationInput"
                                type="text"
                                placeholder="Où allez-vous ? (Ville, pays, hôtel...)"
                                class="w-full h-6 bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:outline-none truncate"
                                @input="onDestinationInput"
                                @focus="onDestinationFocus"
                            />
                        </div>
                        <button
                            v-if="destinationInput"
                            type="button"
                            class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer"
                            @click="destinationInput = ''; destinationCode = ''; selectedHotelId = null"
                        >
                            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                        </button>

                        <!-- Autocomplete Suggestions Dropdown -->
                        <div
                            v-if="showSuggestions && (hotelStore.destinationSuggestions.length || destinationInput.length >= 2)"
                            class="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
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

                    <!-- 2. Dates Cell (Arrivée — Départ + Nuits badge) -->
                    <div class="sm:col-span-2 lg:col-span-4 bg-white dark:bg-[#0C1C39] px-3.5 py-2 flex items-center gap-2">
                        <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-slate-400 shrink-0" />
                        <div class="grid grid-cols-2 gap-2 flex-1 min-w-0">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                                    Arrivée
                                </label>
                                <input
                                    type="date"
                                    v-model="checkIn"
                                    :min="minDate"
                                    class="w-full h-6 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                                />
                            </div>
                            <div class="border-l border-slate-200 dark:border-slate-700 pl-2">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                                    Départ ({{ computedNights }} nuit{{ computedNights > 1 ? 's' : '' }})
                                </label>
                                <input
                                    type="date"
                                    v-model="checkOut"
                                    :min="minCheckOut"
                                    :max="maxCheckOut"
                                    class="w-full h-6 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- 3. Booking.com-Style Interactive Occupancy & Multi-Room Popover Trigger -->
                    <div class="relative sm:col-span-2 lg:col-span-3 bg-white dark:bg-[#0C1C39] px-3.5 py-2 flex items-center">
                        <button
                            type="button"
                            class="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
                            @click="showGuestsPopover = !showGuestsPopover"
                        >
                            <div class="flex items-center gap-2.5 min-w-0">
                                <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-slate-400 shrink-0" />
                                <div class="min-w-0">
                                    <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                                        Sélectionner l'occupation
                                    </span>
                                    <span class="block text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                        {{ totalAdultsCount }} adulte{{ totalAdultsCount > 1 ? 's' : '' }} · {{ totalChildrenCount }} enfant{{ totalChildrenCount > 1 ? 's' : '' }} · {{ roomsConfig.length }} chambre{{ roomsConfig.length > 1 ? 's' : '' }}
                                    </span>
                                </div>
                            </div>
                            <UIcon
                                name="i-heroicons-chevron-down"
                                class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
                                :class="{ 'rotate-180 text-primary': showGuestsPopover }"
                            />
                        </button>

                        <!-- Booking.com-Style Occupancy & Rooms Configuration Dropdown Popover -->
                        <div
                            v-if="showGuestsPopover"
                            class="absolute top-full right-0 sm:left-0 lg:left-auto lg:right-0 mt-2 w-full sm:w-[370px] z-50 bg-white dark:bg-[#0C1C39] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 space-y-3.5 text-slate-900 dark:text-white"
                            @click.stop
                        >
                            <!-- Chambres Count Row (+ / -) -->
                            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <span class="text-xs font-extrabold text-slate-900 dark:text-white">Chambres</span>
                                    <span class="block text-[10px] text-slate-400">Max 5 chambres (9 voyageurs)</span>
                                </div>
                                <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded-md overflow-hidden">
                                    <button
                                        type="button"
                                        class="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                                        :disabled="roomsConfig.length <= 1"
                                        @click="changeRoomsCount(-1)"
                                    >−</button>
                                    <span class="w-9 text-center text-xs font-extrabold">{{ roomsConfig.length }}</span>
                                    <button
                                        type="button"
                                        class="w-8 h-8 flex items-center justify-center text-sm font-bold text-primary hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                                        :disabled="roomsConfig.length >= 5 || totalPaxCount >= 9"
                                        @click="changeRoomsCount(1)"
                                    >+</button>
                                </div>
                            </div>

                            <!-- Per-Room Configuration List -->
                            <div class="max-h-64 overflow-y-auto space-y-3 pr-1">
                                <div
                                    v-for="(rm, rIdx) in roomsConfig"
                                    :key="rIdx"
                                    class="p-3 rounded-lg bg-slate-50 dark:bg-[#071124] border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                                >
                                    <div class="flex items-center justify-between">
                                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                                            Chambre {{ rIdx + 1 }}
                                        </span>
                                        <!-- Double / Twin selector when 2 adults -->
                                        <div v-if="rm.adults === 2" class="inline-flex rounded border border-slate-300 dark:border-slate-700 overflow-hidden text-[10px] font-bold">
                                            <button
                                                type="button"
                                                class="px-2 py-0.5 cursor-pointer transition-colors"
                                                :class="rm.type === 'dbl' ? 'bg-primary text-[#0C1C39]' : 'bg-white dark:bg-slate-800 text-slate-500'"
                                                @click="rm.type = 'dbl'"
                                            >Double</button>
                                            <button
                                                type="button"
                                                class="px-2 py-0.5 cursor-pointer transition-colors"
                                                :class="rm.type === 'twn' ? 'bg-primary text-[#0C1C39]' : 'bg-white dark:bg-slate-800 text-slate-500'"
                                                @click="rm.type = 'twn'"
                                            >Twin</button>
                                        </div>
                                        <span v-else class="text-[10px] font-semibold text-slate-400">
                                            {{ rm.adults === 1 ? 'Simple' : (rm.adults === 3 ? 'Triple' : 'Quadruple+') }}
                                        </span>
                                    </div>

                                    <!-- Adultes Stepper -->
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Adultes</span>
                                        <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-[#0C1C39] overflow-hidden">
                                            <button
                                                type="button"
                                                class="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                                                :disabled="rm.adults <= 1"
                                                @click="changeRoomAdults(rIdx, -1)"
                                            >−</button>
                                            <span class="w-8 text-center text-xs font-extrabold">{{ rm.adults }}</span>
                                            <button
                                                type="button"
                                                class="w-7 h-7 flex items-center justify-center text-sm font-bold text-primary hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                                                :disabled="rm.adults >= 6 || totalPaxCount >= 9"
                                                @click="changeRoomAdults(rIdx, 1)"
                                            >+</button>
                                        </div>
                                    </div>

                                    <!-- Enfants Stepper -->
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Enfants</span>
                                            <span class="block text-[10px] text-slate-400">0 à 17 ans</span>
                                        </div>
                                        <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-[#0C1C39] overflow-hidden">
                                            <button
                                                type="button"
                                                class="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                                                :disabled="rm.children <= 0"
                                                @click="changeRoomChildren(rIdx, -1)"
                                            >−</button>
                                            <span class="w-8 text-center text-xs font-extrabold">{{ rm.children }}</span>
                                            <button
                                                type="button"
                                                class="w-7 h-7 flex items-center justify-center text-sm font-bold text-primary hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 cursor-pointer"
                                                :disabled="rm.children >= 4 || totalPaxCount >= 9"
                                                @click="changeRoomChildren(rIdx, 1)"
                                            >+</button>
                                        </div>
                                    </div>

                                    <!-- Child Ages Selectors -->
                                    <div v-if="rm.children > 0" class="pt-1.5 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-2 gap-1.5">
                                        <div v-for="(cAge, cIdx) in rm.children_ages" :key="cIdx" class="flex items-center justify-between bg-white dark:bg-[#0C1C39] border border-slate-200 dark:border-slate-700 rounded px-2 py-1">
                                            <span class="text-[10px] font-semibold text-slate-500">Enfant {{ cIdx + 1 }}</span>
                                            <select
                                                v-model.number="rm.children_ages[cIdx]"
                                                class="text-[11px] font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                                            >
                                                <option v-for="a in 18" :key="a - 1" :value="a - 1" class="bg-white dark:bg-[#0C1C39]">{{ a - 1 }} an{{ a - 1 > 1 ? 's' : '' }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Berceau (Cot) Toggle for 2 or 3 adults -->
                                    <label v-if="rm.adults >= 2 && rm.adults <= 3" class="flex items-center justify-between pt-1 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
                                        <span>Ajouter un berceau bébé (lit bébé)</span>
                                        <input type="checkbox" v-model="rm.berceau" class="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer" />
                                    </label>
                                </div>
                            </div>

                            <!-- Pro Search Filters (Refundable & Immediate Confirmation toggles like Booking.com switches) -->
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                <label class="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <span>Annulation gratuite uniquement</span>
                                    <input type="checkbox" v-model="refundableOnly" class="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                                </label>
                                <label class="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <span>Confirmation immédiate uniquement</span>
                                    <input type="checkbox" v-model="immediateOnly" class="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                                </label>
                            </div>

                            <!-- Done Button ("Terminé" / "تم") -->
                            <button
                                type="button"
                                class="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-[#0C1C39] font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                                @click="showGuestsPopover = false"
                            >
                                Terminé
                            </button>
                        </div>
                    </div>

                    <!-- 4. Search CTA Button Cell -->
                    <div class="sm:col-span-2 lg:col-span-1 flex">
                        <button
                            type="button"
                            :disabled="isNavigating"
                            class="w-full min-h-[50px] bg-[#0C1C39] hover:bg-[#162D56] text-white rounded-b-md lg:rounded-bl-none lg:rounded-r-md font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 px-3 cursor-pointer disabled:opacity-60"
                            @click="triggerHotelSearch"
                        >
                            <UIcon v-if="isNavigating" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin text-primary" />
                            <span v-else>Rechercher</span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- Compact Quick Destinations Strip Below Bar -->
            <div class="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap mr-1">Top Destinations :</span>
                    <button
                        v-for="chip in popularChips"
                        :key="chip.code"
                        type="button"
                        class="px-2.5 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap transition-colors border cursor-pointer"
                        :class="destinationCode === chip.code
                            ? 'bg-primary text-[#0C1C39] border-primary font-bold'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary'"
                        @click="selectQuickChip(chip)"
                    >
                        {{ chip.name }}
                    </button>
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
const showGuestsPopover = ref(false)
const refundableOnly = ref(false)
const immediateOnly = ref(false)

// Multi-room configuration matching the dedicated hotel portal (up to 5 rooms, max 9 total pax)
const roomsConfig = ref([
    { adults: 2, children: 0, children_ages: [], type: 'dbl', berceau: false }
])

const totalAdultsCount = computed(() => roomsConfig.value.reduce((s, r) => s + (Number(r.adults) || 1), 0))
const totalChildrenCount = computed(() => roomsConfig.value.reduce((s, r) => s + (Number(r.children) || 0), 0))
const totalPaxCount = computed(() => totalAdultsCount.value + totalChildrenCount.value)
const computedNights = computed(() => {
    if (!checkIn.value || !checkOut.value) return 1
    const diff = Math.round((new Date(checkOut.value) - new Date(checkIn.value)) / 86400000)
    return Math.max(1, diff)
})

function changeRoomsCount(delta) {
    const nextCount = roomsConfig.value.length + delta
    if (nextCount < 1 || nextCount > 5) return
    if (delta > 0) {
        if (totalPaxCount.value >= 9) return
        roomsConfig.value.push({ adults: 1, children: 0, children_ages: [], type: 'sgl', berceau: false })
    } else {
        roomsConfig.value.pop()
    }
}

function changeRoomAdults(rIdx, delta) {
    const rm = roomsConfig.value[rIdx]
    if (!rm) return
    const next = rm.adults + delta
    if (next < 1 || next > 6) return
    if (delta > 0 && totalPaxCount.value >= 9) return
    rm.adults = next
    if (next === 1) rm.type = 'sgl'
    else if (next === 2 && rm.type !== 'twn') rm.type = 'dbl'
    else if (next === 3) rm.type = 'trp'
    else if (next >= 4) rm.type = 'qud'
    if (next < 2 || next > 3) rm.berceau = false
}

function changeRoomChildren(rIdx, delta) {
    const rm = roomsConfig.value[rIdx]
    if (!rm) return
    const next = rm.children + delta
    if (next < 0 || next > 4) return
    if (delta > 0 && totalPaxCount.value >= 9) return
    rm.children = next
    const ages = []
    for (let i = 0; i < next; i++) {
        ages.push(rm.children_ages[i] ?? 5)
    }
    rm.children_ages = ages
}

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
        warmupDestination(destinationCode.value, checkIn.value, checkOut.value, totalAdultsCount.value)
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
    warmupDestination(chip.code, checkIn.value, checkOut.value, totalAdultsCount.value)
}

function triggerHotelSearch() {
    showGuestsPopover.value = false
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

    const normalizedRooms = roomsConfig.value.map(r => {
        const ad = Math.max(1, Math.min(6, Number(r.adults) || 1))
        const ch = Math.max(0, Math.min(4, Number(r.children) || 0))
        const ages = Array.from({ length: ch }, (_, i) => Math.max(0, Math.min(17, Number(r.children_ages?.[i] ?? 5))))
        return {
            adults: ad,
            children: ch,
            children_ages: ages,
            type: ad === 2 && r.type === 'twn' ? 'twn' : (ad === 1 ? 'sgl' : (ad === 3 ? 'trp' : (ad >= 4 ? 'qud' : 'dbl'))),
            berceau: Boolean(r.berceau && ad >= 2 && ad <= 3),
        }
    })

    const safeAdults = normalizedRooms.reduce((s, r) => s + r.adults, 0)
    const safeChildren = normalizedRooms.reduce((s, r) => s + r.children, 0)
    const safeAges = normalizedRooms.flatMap(r => r.children_ages)

    hotelStore.searchForm.adults = safeAdults
    hotelStore.searchForm.children = safeChildren
    hotelStore.searchForm.children_ages = safeAges
    hotelStore.searchForm.rooms = normalizedRooms.length
    hotelStore.searchForm.room_type = normalizedRooms[0]?.type || 'dbl'
    hotelStore.searchForm.rooms_config = normalizedRooms
    if (typeof sessionStorage !== 'undefined') {
        try { sessionStorage.setItem('hotel_rooms_config', JSON.stringify(normalizedRooms)) } catch {}
    }

    hotelStore.clearSearchResults()
    if (refundableOnly.value) {
        hotelStore.filters.cancellationPolicy = 'refundable'
    }
    if (immediateOnly.value) {
        hotelStore.filters.availabilityType = 'immediate'
    }
    isNavigating.value = true

    const query = {
        destination_code: destinationCode.value,
        destination_name: destinationName.value,
        check_in: checkIn.value,
        check_out: checkOut.value,
        adults: safeAdults,
        children: safeChildren,
        rooms: normalizedRooms.length,
        rooms_config: JSON.stringify(normalizedRooms),
        ...(safeAges.length ? { children_ages: safeAges.join(',') } : {}),
        ...(refundableOnly.value ? { refundable_only: '1' } : {}),
        ...(immediateOnly.value ? { avail_only: '1' } : {}),
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