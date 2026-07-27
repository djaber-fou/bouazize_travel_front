<template>
    <div class="w-full flex flex-col gap-24 py-16 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
        <!-- Section 1: Qui Sommes Nous -->
        <div class="flex flex-col lg:flex-row gap-12 items-center">
            <div class="flex flex-col gap-6 w-full lg:w-1/2">
                <div class="flex flex-col gap-2">
                    <h1 class="text-secondary text-3xl font-extrabold uppercase">Qui sommes nous ?</h1>
                    <div class="w-16 h-1 bg-primary"></div>
                </div>
                <p class="text-secondary/80 text-lg leading-relaxed">
                    <span class="text-primary font-bold">Bouazize Travel</span> est une agence de voyage spécialisée dans l'organisation de séjours sur mesure et l'obtention simplifiée de visas en ligne. Forts de notre expertise et de notre engagement envers un service de qualité, nous vous accompagnons à chaque étape de votre voyage, en vous offrant des solutions rapides, sécurisées et adaptées à vos besoins.
                </p>
            </div>
            <div class="w-full lg:w-1/2">
                <div class="overflow-hidden shadow-lg border border-gray-100">
                    <swiper-container ref="containerRef" :init="false">
                        <swiper-slide
                            v-for="(slide, idx) in slides"
                            :key="idx"
                            class="flex justify-center"
                        >
                            <img :src="slide" class="w-full aspect-[4/3] object-cover"/>
                        </swiper-slide>
                    </swiper-container>
                </div>
            </div>
        </div>

        <!-- Section 2: Pourquoi choisir -->
        <div class="flex flex-col gap-10 items-center">
            <div class="flex flex-col gap-2 items-center text-center">
                <h2 class="text-secondary text-3xl font-extrabold uppercase">Pourquoi choisir Bouazize Travel ?</h2>
                <div class="w-16 h-1 bg-primary"></div>
            </div>
            <div class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                <div class="flex flex-col gap-4 p-6 bg-gray-50 items-center text-center hover:bg-gray-100 transition-colors" v-for="(item, index) in whyUsItems" :key="index">
                    <div class="w-16 h-16 bg-white flex justify-center items-center shadow-sm">
                        <UIcon :name="item.icon" class="text-primary w-8 h-8"/>
                    </div>
                    <div class="text-secondary font-bold">
                        {{ item.description }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 3: Un service complet -->
        <div class="flex flex-col lg:flex-row gap-12 items-center pt-8 border-t border-gray-100">
            <div class="flex flex-col gap-8 w-full lg:w-1/2">
                <div class="flex flex-col gap-2">
                    <h2 class="text-secondary text-3xl font-extrabold uppercase leading-snug">Un service complet pour des voyages sans souci</h2>
                    <div class="w-16 h-1 bg-primary"></div>
                </div>
                <div class="flex flex-col gap-6">
                    <div class="text-secondary/80 text-lg leading-relaxed">
                        Vous pouvez désormais faire votre demande de visa en quelques clics, sans tracas ni déplacements inutiles. Notre site vous permet de :
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-4" v-for="(item, index) in servicesIrems" :key="index">
                            <UIcon :name="item.icon" class="text-primary w-6 h-6 flex-shrink-0"/>
                            <div class="text-secondary font-bold text-lg">
                                {{ item.description }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <img src="/images/illustrations/about_us.png" class="w-full max-w-sm aspect-[4/5] object-cover rounded-none shadow-xl"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NuxtImg } from '#components';

definePageMeta({
    layout:'second'
})

const containerRef = ref(null)
const swiper = useSwiper(containerRef, {
  effect: 'fade',
  loop: true,
  autoplay: {
    delay: 2000,
  },
})

const slides = [
  '/images/landmarks/dubai.jpg',
  '/images/landmarks/jordan.webp',
  '/images/landmarks/poland2.webp',
  '/images/landmarks/turkey.jpg',
]

const whyUsItems = [
    {
        icon:"i-streamline-travel-airport-earth-airplane-travel-plane-trip-airplane-international-adventure-globe-world",
        description:"Expérience et expertise dans le secteur du voyage"
    },
    {
        icon:"i-material-symbols-question-exchange-rounded",
        description:"Support client réactif et assistance dédiée"
    },
    {
        icon:"i-tdesign-money-filled",
        description:"Tarifs compétitifs et transparence totale"
    },
    {
        icon:"i-uil-transaction",
        description:"Sécurité et fiabilité pour toutes vos démarches"
    }
]

const servicesIrems = [
    {
        icon:"i-material-symbols-airplane-ticket",
        description:"Réservation de billets d’avion aux meilleurs tarif"
    },
    {
        icon:"i-bxs-building-house",
        description:"Séjours personnalisés et circuits organisés"
    },
    {
        icon:"i-mdi-passport",
        description:"Assistance pour l’obtention de visas en ligne"
    },
    {
        icon:"i-streamline-insurance-hand-solid",
        description:"Assurance voyage et conseils pratique"
    },
]

</script>

<style lang="scss" scoped>

</style>
