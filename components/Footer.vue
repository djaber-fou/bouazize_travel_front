<template>
    <footer class="bg-secondary text-gray-400 pt-20 pb-10 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <!-- Brand Info -->
                <div class="space-y-6">
                    <img src="/images/logo/bouazize-logo.png" alt="Bouazize Travel" class="w-20 object-contain grayscale brightness-200 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"/>
                    <p class="text-sm leading-relaxed text-gray-500 font-light">
                        Bouazize Travel est une société spécialisée dans l’organisation de voyages à travers le monde. Nous faisons de vos rêves de voyage une réalité.
                    </p>
                    <div class="flex items-center gap-4 pt-2">
                        <a href="https://www.facebook.com/p/Bouazize-travel-100093667666118" target="_blank" rel="noopener noreferrer" class="w-10 h-10 border border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-sm">
                            <Icon name="i-mdi-facebook" class="w-5 h-5"/>
                        </a>
                        <a href="https://www.instagram.com/bouazize_travel" target="_blank" rel="noopener noreferrer" class="w-10 h-10 border border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-sm">
                            <Icon name="i-mdi-instagram" class="w-5 h-5"/>
                        </a>
                    </div>
                </div>

                <!-- Services Links -->
                <div>
                    <h3 class="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div class="w-2 h-2 bg-primary"></div> Services
                    </h3>
                    <ul class="space-y-3">
                        <li v-for="(service, index) in services" :key="index">
                            <nuxt-link v-if="service.link !== '#'" :to="service.link" class="text-sm text-gray-500 hover:text-primary hover:translate-x-1 transform transition-all duration-300 inline-block">
                                {{ service.text }}
                            </nuxt-link>
                            <span v-else class="text-sm text-gray-600 cursor-not-allowed inline-block">
                                {{ service.text }}
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- About Links -->
                <div>
                    <h3 class="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div class="w-2 h-2 bg-primary"></div> L'Agence
                    </h3>
                    <ul class="space-y-3">
                        <li v-for="(item, index) in about" :key="index">
                            <nuxt-link :to="item.link" class="text-sm text-gray-500 hover:text-primary hover:translate-x-1 transform transition-all duration-300 inline-block">
                                {{ item.text }}
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h3 class="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div class="w-2 h-2 bg-primary"></div> Contact
                    </h3>
                    <ul class="space-y-4">
                        <li class="flex items-start gap-3 text-sm text-gray-500 group">
                            <Icon name="i-heroicons-map-pin" class="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform"/>
                            <span class="group-hover:text-gray-400 transition-colors">bt 01 local, 09 cite 35 logts dradra,<br/> Sétif 19000</span>
                        </li>
                        <li class="flex items-center gap-3 text-sm text-gray-500 group">
                            <Icon name="i-heroicons-envelope" class="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform"/>
                            <a href="mailto:bouazizetravel@gmail.com" class="hover:text-primary transition-colors">bouazizetravel@gmail.com</a>
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-500 group">
                            <Icon name="i-heroicons-phone" class="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform"/>
                            <div class="flex flex-col gap-1">
                                <a href="tel:0793572728" class="hover:text-primary transition-colors font-medium tracking-wide">0793 57 27 28</a>
                                <a href="tel:0770202084" class="hover:text-primary transition-colors font-medium tracking-wide">0770 20 20 84</a>
                                <a href="tel:0770640830" class="hover:text-primary transition-colors font-medium tracking-wide">0770 64 08 30</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>&copy; {{ new Date().getFullYear() }} <span class="text-white font-semibold">Bouazize Travel</span>. Tous droits réservés.</p>
                <p class="flex items-center gap-1">
                    Conçu avec passion par <a href="mailto:boukthirdjaber@gmail.com" class="text-primary hover:underline">boukthirdjaber@gmail.com</a>
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const services = ref([
    {link:"/services/visa", text:"Visa & Démarches"},
    {link:"/services/voyage_organise", text:"Voyages Organisés"},
    {link:"/services/omra", text:"Nos Offres Omra"},
    {link:"#", text:"Hôtellerie (Bientôt)"},
]);

const about = ref([
    {link:"/about", text:"À Propos de Nous"},
    {link:"/auth/login", text:"Espace Client"},
]);

onMounted(()=>{
    if(process.client) {
        localStorage.removeItem('current_page')
    }
})
</script>
