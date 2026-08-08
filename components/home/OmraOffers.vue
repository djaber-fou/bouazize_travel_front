<template>
    <div id="omra-section" class="px-6 md:px-12 py-24 bg-white">
        <div class="max-w-7xl mx-auto">
            <!-- Section Header -->
            <div class="flex flex-col gap-4 items-center mb-16 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-widest">Nos Offres Omra</h2>
                <div class="h-1 w-16 bg-primary"></div>
                <p class="text-gray-500 mt-4 max-w-2xl text-md font-light">Nous vous accompagnons dans votre pèlerinage avec des offres adaptées, incluant hébergement et transport de qualité.</p>
            </div>

            <!-- Carousel -->
            <div class="relative px-2">
                <swiper-container slides-per-view="3" ref="containerRef" class="pb-10">
                    <swiper-slide v-for="(offer, index) in offers" :key="index" class="py-4">
                        <div @click="openForm(offer?.id)" class="block cursor-pointer group relative overflow-hidden bg-gray-50 aspect-[3/4] border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <!-- Image -->
                            <img :src="offer?.image || offer?.country_flag" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Omra" />
                            
                            <!-- Gradient Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent"></div>
                            
                            <!-- Content -->
                            <div class="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                                <div class="mb-auto mt-2">
                                    <UBadge class="w-fit shadow-md font-bold uppercase tracking-wider" variant="solid" :color="guaranteeColor(offer?.guarantee)">
                                        {{ guaranteeValue(offer?.guarantee) }}
                                    </UBadge>
                                </div>

                                <h3 class="text-xl font-bold text-white uppercase tracking-wider mb-2 line-clamp-2" :title="offer?.name">{{ truncate(offer?.name ,50) }}</h3>
                                
                                <div class="flex flex-col gap-1 items-center mt-2 mb-4 text-gray-200 text-sm">
                                    <div class="flex items-center gap-2">
                                        <Icon name="i-heroicons-clock" class="w-4 h-4 text-primary" />
                                        <span>{{ truncate(offer?.duration, 30) }}</span>
                                    </div>
                                </div>

                                <div class="text-primary font-bold text-2xl flex items-baseline gap-1 bg-black/30 px-4 py-2 rounded-none backdrop-blur-sm border border-white/10">
                                    {{ offer?.price }} <span class="text-sm text-gray-300 font-medium">DZD</span>
                                </div>
                                <div class="w-0 h-0.5 bg-primary mt-4 group-hover:w-16 transition-all duration-300"></div>
                            </div>
                        </div>
                    </swiper-slide>

                    <!-- See More Slide -->
                    <swiper-slide class="py-4">
                        <nuxt-link to="/services/omra" class="block group relative overflow-hidden bg-secondary aspect-[3/4] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center border border-secondary-light">
                            <div class="w-12 h-12 rounded-none border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-secondary text-primary transition-all duration-300">
                                <Icon name="i-heroicons-arrow-right" class="w-5 h-5"/>
                            </div>
                            <h3 class="text-lg font-bold text-white uppercase tracking-widest text-center px-4 leading-relaxed">Toutes nos<br/>offres Omra</h3>
                        </nuxt-link>
                    </swiper-slide>
                </swiper-container>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NuxtImg, UAvatar } from '#components';
import OrderForm from '~/components/modals/OrderForm.vue'
import { useAuthStore } from '#imports'

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
    1280: { slidesPerView: 4, spaceBetween: 30 }
  }
})

const authStore = useAuthStore()
const authorization = authStore.Authorization
const offers = ref([])

const overlay = useOverlay()

const openForm = async(id)=> {
    const form = overlay.create(OrderForm, {
        props:{
            id:id,
            service: 'omra'
        },
    })
    const instance = form.open()
}

onMounted(()=>{
    getOffers()
})

const truncate = (string, value)=>{
    if(string && string.length > value){
        return string.substring(0, value) + '…';
    }else{
        return string
    }
}

const guaranteeValue = (value)=>{
    const guarantee = {
        with:"Garantie",
        without:"Sans garantie",
        half:"Demi garantie"
    }[value]
    return guarantee || value
}

const guaranteeColor = (value)=>{
    const color = {
        with:"success",
        without:"error",
        half:"primary"
    }[value]
    return color || "gray"
}

const getOffers = async() => {
    try {
        const url = authorization?.token ? '/client/omra':'/omra'
        const response = await sendApi(`${url}/offers?page=1&per_page=12`, null, 'GET')
        if(response?.data?.data) {
            offers.value = response.data.data
        }
    } catch (e) {
        console.error(e)
    }
}
</script>
