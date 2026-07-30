<template>
    <Hero/>
    <Services/>
    <Hotels />
    <VoyageOrganiseDestinations />
    <OmraOffers />
</template>

<script setup>
import Hero from '~/components/home/Hero.vue';
import Services from '~/components/home/Services.vue';
import Hotels from '~/components/home/Hotels.vue';
import VoyageOrganiseDestinations from '~/components/home/VoyageOrganiseDestinations.vue';
import OmraOffers from '~/components/home/OmraOffers.vue';

definePageMeta({
    layout:'second'
})

</script>

<style scoped>

</style>
