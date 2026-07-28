<template>
    <div id="voyage-organise-section" class="px-6 md:px-12 py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto">
            <!-- Section Header -->
            <div class="flex flex-col gap-4 items-center mb-16 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-widest">Voyage Organisé</h2>
                <div class="h-1 w-16 bg-primary"></div>
                <p class="text-gray-500 mt-4 max-w-2xl text-md font-light">Découvrez nos voyages organisés soigneusement conçus pour vous offrir des expériences inoubliables aux quatre coins du monde.</p>
            </div>

            <!-- Carousel -->
            <div class="relative px-2">
                <swiper-container slides-per-view="3" ref="containerRef" class="pb-10">
                    <swiper-slide v-for="(country, index) in countries" :key="index" class="py-4">
                        <nuxt-link :to="`/services/voyage_organise/${country.id}`" class="block group relative overflow-hidden bg-gray-50 aspect-[3/4] border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <!-- Image -->
                            <img :src="country.landmark ? getFullImageUrl(country.landmark) : '/images/illustrations/landmark.png'" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Landmark" />
                            
                            <!-- Gradient Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                            
                            <!-- Content -->
                            <div class="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
                                <UAvatar :src="getFullImageUrl(country.flag)" size="md" :ui="{image:'object-cover border-2 border-white'}" class="mb-3 shadow-md"/>
                                <h3 class="text-xl font-bold text-white uppercase tracking-wider">{{ country.country }}</h3>
                                <div class="w-0 h-0.5 bg-primary mt-3 group-hover:w-12 transition-all duration-300"></div>
                            </div>
                        </nuxt-link>
                    </swiper-slide>

                    <!-- See More Slide -->
                    <swiper-slide class="py-4">
                        <nuxt-link to="/services/voyage_organise" class="block group relative overflow-hidden bg-secondary aspect-[3/4] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center border border-secondary-light">
                            <div class="w-12 h-12 rounded-none border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-secondary text-primary transition-all duration-300">
                                <Icon name="i-heroicons-arrow-right" class="w-5 h-5"/>
                            </div>
                            <h3 class="text-lg font-bold text-white uppercase tracking-widest text-center px-4 leading-relaxed">Toutes nos<br/>destinations</h3>
                        </nuxt-link>
                    </swiper-slide>
                </swiper-container>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NuxtImg, UAvatar } from '#components';

const containerRef = ref(null)
const swiper = useSwiper(containerRef, {
  effect: 'creative',
  loop: false,
  slidesPerView: 4,
  spaceBetween: 30,
  breakpoints: {
    320: { slidesPerView: 1.2, spaceBetween: 20 },
    640: { slidesPerView: 2.2, spaceBetween: 20 },
    1024: { slidesPerView: 3.2, spaceBetween: 30 },
    1280: { slidesPerView: 4, spaceBetween: 30 },
  }
})

const countries = ref([])

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  return `${rootUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

onMounted(() => {
    getCountries()
})

const getCountries = async() => {
    try {
        const response = await sendApi(`/voyage_organise?page=1&per_page=12`, null, 'GET')
        if(response?.data?.data) {
            countries.value = response.data.data.slice(0, 3)
        }
    } catch (e) {
        console.error(e)
    }
}
</script>
