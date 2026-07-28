<template>
    <div id="hero" class="relative bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <!-- Remove key to prevent destroying the swiper instance -->
        <swiper-container 
            ref="heroSwiper" 
            navigation="true" 
            pagination="true" 
            class="w-full min-h-[75vh]"
        >
            
            <!-- Slide 1: Static Hero -->
            <swiper-slide class="h-auto">
                <div class="relative h-full min-h-[75vh] md:min-h-[85vh] flex items-center bg-gray-50 dark:bg-slate-950 overflow-hidden py-20 lg:py-0">
                    <!-- Decorative background blur -->
                    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div class="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <!-- Text Content -->
                        <div class="flex flex-col justify-center gap-8">
                            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-secondary dark:text-white leading-tight tracking-tight uppercase">
                                Des expériences <br class="hidden md:block"/>
                                <span class="text-primary italic font-serif relative">
                                    inoubliables
                                    <!-- Underline decoration -->
                                    <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="4" fill="none" />
                                    </svg>
                                </span>, <br/>
                                des destinations de <span class="text-secondary dark:text-white relative z-10">rêve</span>.
                            </h1>
                            <p class="text-lg text-gray-600 dark:text-slate-300 max-w-lg leading-relaxed font-light">
                                Découvrez le monde avec Bouazize Travel. Nous organisons vos voyages sur mesure avec passion, sécurité et confort. L'excellence est notre standard depuis plus de 10 ans.
                            </p>
                            
                            <!-- Buttons -->
                            <div class="flex flex-wrap items-center gap-4 pt-2">
                                <nuxt-link to="/services">
                                    <button class="bg-primary hover:bg-primary-hover text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-3 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 rounded-xl">
                                        Nos Services
                                        <Icon name="i-heroicons-arrow-right" class="w-5 h-5"/>
                                    </button>
                                </nuxt-link>
                                <button class="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary text-secondary dark:text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-3 rounded-xl hover:-translate-y-1" @click="scrollDown">
                                    Découvrir
                                    <Icon name="i-heroicons-arrow-down" class="w-5 h-5 text-primary"/>
                                </button>
                            </div>

                            <!-- Analytics / Stats -->
                            <div class="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-gray-200 dark:border-slate-800">
                                <div class="flex flex-col gap-1 group">
                                    <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.years }}+</h3>
                                    <p class="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">Années <br/>d'expérience</p>
                                </div>
                                <div class="flex flex-col gap-1 group">
                                    <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.clients }}+</h3>
                                    <p class="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">Clients <br/>satisfaits</p>
                                </div>
                                <div class="flex flex-col gap-1 group">
                                    <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white group-hover:text-primary transition-colors">{{ stats.destinations }}+</h3>
                                    <p class="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">Destinations <br/>globales</p>
                                </div>
                            </div>
                        </div>

                        <!-- Professional Photo Collage with Flight Path -->
                        <div class="relative w-full h-[450px] lg:h-[600px] flex items-center justify-center">
                            
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
                <div class="relative h-full min-h-[75vh] md:min-h-[85vh] w-full flex items-start md:items-center justify-center pt-24 md:pt-0 bg-secondary text-white overflow-hidden">
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
                            <h2 v-if="banner.title" class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-wide text-white uppercase leading-tight">
                                {{ banner.title }}
                            </h2>
                            <p v-if="banner.information" class="text-lg md:text-xl text-gray-300 font-light mt-4">
                                {{ banner.information }}
                            </p>
                        </div>

                        <div v-if="banner.button_text && banner.button_link" class="mt-6">
                            <UButton
                                :to="banner.button_link"
                                size="xl"
                                class="bg-primary hover:bg-primary-hover text-secondary font-bold uppercase tracking-wider px-10 py-4 rounded-none transition-colors duration-300 shadow-xl"
                            >
                                {{ banner.button_text }}
                            </UButton>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper-container>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
    const section = document.getElementById('services-section') || document.getElementById('hero')
    window.scrollTo({
        top: section.offsetHeight,
        behavior: "smooth"
    });
}

const config = useRuntimeConfig()
const banners = ref([])
const heroSwiper = ref(null)

const stats = ref({
    years: '10',
    clients: '50k',
    destinations: '100'
})

const getFullImageUrl = (url) => {
  if (!url) return null;
  let path = url;
  try {
    if (url.startsWith('http')) {
      path = new URL(url).pathname;
    }
  } catch(e) {}
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  return `${rootUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Re-initialize swiper configuration whenever heroSwiper ref changes
useSwiper(heroSwiper, {
    loop: true,
    autoplay: {
        delay: 7000,
        disableOnInteraction: false,
    },
    pagination: {
        clickable: true,
    },
    navigation: true
})

const fetchBanners = async () => {
    try {
        const res = await sendApi('/banner/active', null, 'GET')
        if (res?.data && res.data.length > 0) {
            banners.value = res.data
            
            // Force Swiper to recognize the new slides and restart autoplay
            setTimeout(() => {
                if (heroSwiper.value && heroSwiper.value.swiper) {
                    heroSwiper.value.swiper.update()
                    heroSwiper.value.swiper.autoplay.start()
                }
            }, 100)
        }
    } catch (error) {
        console.error('Failed to load banners', error)
    }
}

const fetchStats = async () => {
    try {
        const res = await sendApi('/stats', null, 'GET')
        if (res?.data) {
            stats.value = res.data
        }
    } catch (error) {
        console.error('Failed to load stats', error)
    }
}

onMounted(() => {
    fetchBanners()
    fetchStats()
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