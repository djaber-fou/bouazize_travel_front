<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col antialiased">
        <Header class="sticky top-0 left-0 right-0 z-50"/>
        <main class="flex-1">
            <slot/>
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue';
import Header from '~/components/Header.vue';
</script>

<style scoped>
</style>