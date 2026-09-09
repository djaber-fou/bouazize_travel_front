<template>
    <div id="hotels-section" class="px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            <!-- Text Content -->
            <div class="w-full lg:w-1/2 flex flex-col gap-5 text-center lg:text-left">

                <!-- Badge -->
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary font-bold text-xs tracking-widest uppercase rounded-full self-center lg:self-start border border-primary/20 dark:border-primary/30">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    Hébergement
                </div>

                <!-- Title -->
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary dark:text-white uppercase tracking-tight leading-tight">
                    Trouvez l'hôtel <br/><span class="text-primary">Idéal</span>
                </h2>

                <!-- Description -->
                <p class="text-slate-500 dark:text-slate-400 text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Découvrez une sélection d'hôtels prestigieux dans le monde entier. Que ce soit pour un voyage d'affaires ou des vacances en famille, nous avons la chambre qu'il vous faut.
                </p>

                <!-- Features list -->
                <ul class="space-y-3 my-2 text-left max-w-xs mx-auto lg:mx-0">
                    <li v-for="feat in features" :key="feat" class="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <div class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Icon name="i-heroicons-check" class="w-4 h-4"/>
                        </div>
                        <span class="font-medium text-sm">{{ feat }}</span>
                    </li>
                </ul>

                <!-- CTA Buttons -->
                <div class="mt-2 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <nuxt-link to="/hotels" class="inline-flex items-center justify-center px-7 py-3.5 bg-secondary dark:bg-primary hover:bg-primary dark:hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-lg hover:shadow-primary/30 rounded-xl">
                        Rechercher un hôtel
                        <Icon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2"/>
                    </nuxt-link>
                    <nuxt-link to="/hotels" class="inline-flex items-center justify-center px-7 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-secondary dark:text-white font-bold uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 rounded-xl">
                        Voir les offres
                    </nuxt-link>
                </div>
            </div>

            <!-- Image/Visual -->
            <div class="w-full lg:w-1/2 relative mt-6 lg:mt-0">
                <!-- Decorative shadow box -->
                <div class="absolute inset-0 bg-primary/20 dark:bg-primary/10 transform translate-x-3 translate-y-3 -z-10 rounded-2xl hidden sm:block"></div>

                <img
                    src="/images/services/hotels.jpg"
                    alt="Hôtel de luxe"
                    class="w-full h-56 sm:h-72 lg:h-auto object-cover shadow-2xl rounded-2xl"
                    onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'"
                />

                <!-- Stats Badge bottom-left -->
                <div class="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-xl border-l-4 border-primary rounded-xl">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center rounded-xl">
                            <Icon name="i-heroicons-star-solid" class="w-5 h-5 sm:w-6 sm:h-6"/>
                        </div>
                        <div>
                            <p class="text-xl sm:text-2xl font-black text-secondary dark:text-white">+10k</p>
                            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Hôtels Disponibles</p>
                        </div>
                    </div>
                </div>

                <!-- Second badge top-right -->
                <div class="absolute -top-4 right-4 sm:-top-5 sm:right-5 bg-primary text-white p-3 shadow-xl rounded-xl">
                    <div class="flex items-center gap-2">
                        <Icon name="i-heroicons-globe-europe-africa" class="w-4 h-4"/>
                        <span class="text-xs font-black">180+ Pays</span>
                    </div>
                </div>
            </div>

        </div>
        </div>
    </div>
</template>

<script setup>
const features = [
    'Réservation instantanée en ligne',
    'Tarifs exclusifs B2B & Grand public',
    'Large choix de destinations mondiales',
];
</script>

<style scoped>
@media (max-width: 400px) {
    .absolute.-bottom-4 { bottom: -0.5rem; left: 0.5rem; }
}
</style>
