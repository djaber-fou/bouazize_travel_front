<template>
    <div id="services-section" class="px-6 md:px-12 py-24 bg-white">
        <div class="max-w-7xl mx-auto">
            <!-- Section Header -->
            <div class="flex flex-col gap-4 items-center mb-16 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-widest">Destinations Visa</h2>
                <div class="h-1 w-16 bg-primary"></div>
                <p class="text-gray-500 mt-4 max-w-2xl text-md font-light">Choisissez votre prochaine destination et laissez-nous nous occuper de vos démarches en toute sérénité.</p>
            </div>

            <!-- Carousel -->
            <div class="relative px-2">
                <swiper-container ref="containerRef" class="pb-10">
                    <swiper-slide v-for="(country, index) in countries" :key="index" class="py-4">
                        <nuxt-link :to="`services/visa/${country.id}`" class="block group relative overflow-hidden bg-gray-50 aspect-[3/4] border border-gray-100 hover:shadow-lg transition-all duration-300">
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
                        <nuxt-link :to="`/services/visa`" class="block group relative overflow-hidden bg-secondary aspect-[3/4] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center border border-secondary-light">
                            <div class="w-10 h-10 md:w-12 md:h-12 rounded-none border border-primary/30 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-secondary text-primary transition-all duration-300">
                                <Icon name="i-heroicons-arrow-right" class="w-5 h-5"/>
                            </div>
                            <h3 class="text-sm md:text-lg font-bold text-white uppercase tracking-widest text-center px-4 leading-relaxed break-words">Toutes nos<br/>destinations</h3>
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

onMounted(() => {
    getCountries()
})

const getCountries = async() => {
    try {
        const response = await sendApi(`/guest/countries`, null, 'GET')
        if(response?.data) {
            countries.value = response.data.slice(0, 3)
        }
    } catch (e) {
        console.error(e)
    }
}
</script>