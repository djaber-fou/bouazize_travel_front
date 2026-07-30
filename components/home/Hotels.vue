<template>
    <div id="hotels-section" class="px-6 md:px-12 py-24 bg-gray-50 border-t border-gray-100">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            
            <!-- Text Content -->
            <div class="lg:w-1/2 flex flex-col gap-6">
                <div class="inline-block px-3 py-1 bg-primary/10 text-primary font-medium text-sm tracking-widest uppercase mb-2 self-start">
                    Hébergement
                </div>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary uppercase tracking-tight leading-tight">
                    Trouvez l'hôtel <br/><span class="text-primary">Idéal</span>
                </h2>
                <p class="text-gray-500 text-lg font-light leading-relaxed max-w-xl">
                    Découvrez une sélection d'hôtels prestigieux dans le monde entier. Que ce soit pour un voyage d'affaires ou des vacances en famille, nous avons la chambre qu'il vous faut.
                </p>
                
                <ul class="space-y-4 my-4">
                    <li class="flex items-center gap-3 text-gray-700">
                        <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <Icon name="i-heroicons-check" class="w-5 h-5"/>
                        </div>
                        <span class="font-medium">Réservation instantanée</span>
                    </li>
                    <li class="flex items-center gap-3 text-gray-700">
                        <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <Icon name="i-heroicons-check" class="w-5 h-5"/>
                        </div>
                        <span class="font-medium">Tarifs exclusifs</span>
                    </li>
                    <li class="flex items-center gap-3 text-gray-700">
                        <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <Icon name="i-heroicons-check" class="w-5 h-5"/>
                        </div>
                        <span class="font-medium">Large choix de destinations</span>
                    </li>
                </ul>

                <div class="mt-4">
                    <nuxt-link to="/hotels" class="inline-flex items-center justify-center px-8 py-4 bg-secondary text-white font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-primary/30">
                        Rechercher un hôtel
                        <Icon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2"/>
                    </nuxt-link>
                </div>
            </div>

            <!-- Image/Visual -->
            <div class="lg:w-1/2 w-full relative">
                <div class="absolute inset-0 bg-primary/20 transform translate-x-4 translate-y-4 -z-10"></div>
                <img src="/images/services/hotels.jpg" alt="Luxury Hotel" class="w-full h-auto object-cover aspect-video shadow-2xl" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'" />
                
                <!-- Floating Badge -->
                <div class="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl border-l-4 border-primary">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center">
                            <Icon name="i-heroicons-star-solid" class="w-6 h-6"/>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-secondary">+10k</p>
                            <p class="text-sm text-gray-500 font-medium">Hôtels Disponibles</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
// Composant simple pour la section Hôtellerie
</script>
