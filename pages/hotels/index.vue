<script setup>
import { ref } from 'vue';
import { useFetch } from '#app';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();

const form = ref({
    checkin: '',
    checkout: '',
    nationality: 'DZ',
    hotel_ids: '', // For testing specifically e.g. 25846, 12296
    city_code: '', // For open searches
    rooms: [
        { type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] }
    ]
});

const results = ref([]);
const loading = ref(false);
const error = ref(null);
const rawLogs = ref(null);
const showLogs = ref(false);

const addRoom = () => {
    form.value.rooms.push({ type: 'SGL', required: 1, extrabeds: 0, cots: 0, children: [] });
};

const removeRoom = (index) => {
    form.value.rooms.splice(index, 1);
};

const addChild = (roomIndex) => {
    form.value.rooms[roomIndex].children.push(0); // Default age 0
};

const searchHotels = async () => {
    loading.value = true;
    error.value = null;
    results.value = [];
    rawLogs.value = null;
    
    // Parse hotel IDs
    let parsedHotelIds = [];
    if (form.value.hotel_ids.trim()) {
        parsedHotelIds = form.value.hotel_ids.split(',').map(id => id.trim());
    }

    try {
        const response = await sendApi('/hotels/search', {
            checkin: form.value.checkin,
            checkout: form.value.checkout,
            nationality: form.value.nationality,
            rooms: form.value.rooms,
            hotel_ids: parsedHotelIds,
            city_code: form.value.city_code.trim() || undefined
        }, 'POST');

        if (response && response.status === 'success') {
            results.value = response.data;
            rawLogs.value = response.logs;
        } else if (response) {
            error.value = response.message || 'Erreur lors de la recherche';
            rawLogs.value = response.logs;
        } else {
            error.value = 'Erreur réseau ou fichier trop volumineux.';
        }
    } catch (e) {
        error.value = e.data?.message || e.message || 'An error occurred';
    } finally {
        loading.value = false;
    }
};

</script>

<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Système de Réservation d'Hôtels
                </h1>
                <p class="mt-4 text-xl text-gray-500">
                    Testez l'intégration API Netstorming en direct
                </p>
            </div>

            <!-- Search Form -->
            <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Rechercher des disponibilités</h2>
                
                <form @submit.prevent="searchHotels" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Dates -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Check-in</label>
                            <input type="date" v-model="form.checkin" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Check-out</label>
                            <input type="date" v-model="form.checkout" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        
                        <!-- Nationality & Hotel IDs & City Code -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nationalité (Code ISO)</label>
                            <input type="text" v-model="form.nationality" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="ex: DZ, IT">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">IDs Hôtels (Test: 25846, 12296)</label>
                            <input type="text" v-model="form.hotel_ids" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Séparés par virgule">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Code Ville (ex: PAR, DXB)</label>
                            <input type="text" v-model="form.city_code" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Obligatoire si pas d'ID d'hôtel">
                        </div>
                    </div>

                    <!-- Rooms Configurator -->
                    <div class="border-t pt-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-900">Configuration des Chambres</h3>
                            <button type="button" @click="addRoom" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                                + Ajouter Chambre
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <div v-for="(room, index) in form.rooms" :key="index" class="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                <button v-if="form.rooms.length > 1" @click="removeRoom(index)" type="button" class="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                                
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500">Type de Chambre</label>
                                        <select v-model="room.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                                            <option value="SGL">Single (SGL)</option>
                                            <option value="DBL">Double (DBL)</option>
                                            <option value="TRP">Triple (TRP)</option>
                                            <option value="QUD">Quadruple (QUD)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500">Lits Supplémentaires (Extrabeds)</label>
                                        <input type="number" min="0" v-model="room.extrabeds" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500">Lits Bébés (Cots)</label>
                                        <input type="number" min="0" v-model="room.cots" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Enfants</label>
                                        <button type="button" @click="addChild(index)" class="text-xs text-blue-600 hover:text-blue-800">+ Ajouter Enfant</button>
                                        <div v-for="(child, cIndex) in room.children" :key="cIndex" class="mt-2 flex items-center gap-2">
                                            <span class="text-xs text-gray-500">Age:</span>
                                            <input type="number" min="0" max="17" v-model="room.children[cIndex]" class="block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                                            <button type="button" @click="room.children.splice(cIndex, 1)" class="text-red-500 hover:text-red-700 text-xs">x</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 flex justify-end">
                        <button type="submit" :disabled="loading" class="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                            {{ loading ? 'Recherche en cours...' : 'Rechercher' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{{ error }}</p>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div v-if="results.length > 0">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Résultats ({{ results.length }} Hôtels)</h2>
                <div class="grid gap-6">
                    <div v-for="hotel in results" :key="hotel.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div class="p-6 md:flex justify-between items-start">
                            <div>
                                <div class="flex items-center gap-2 mb-2">
                                    <h3 class="text-xl font-bold text-gray-900">{{ hotel.name }}</h3>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {{ hotel.stars }} Etoiles
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500 mb-1 flex items-center">
                                    <svg class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {{ hotel.address }}, {{ hotel.city }}
                                </p>
                                <p class="text-xs text-gray-400">ID Hotel: {{ hotel.id }}</p>
                            </div>
                            
                            <div class="mt-4 md:mt-0 flex flex-col gap-2">
                                <div v-for="(arr, aIdx) in hotel.arrangements" :key="aIdx" class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm font-semibold text-gray-700">{{ arr.board_type }}</span>
                                        <span class="text-lg font-bold text-blue-600">{{ arr.price }} {{ arr.currency }}</span>
                                    </div>
                                    <div class="space-y-1">
                                        <div v-for="(room, rIdx) in arr.rooms" :key="rIdx" class="text-xs text-gray-500 flex justify-between">
                                            <span>Chambre: {{ room.type }}</span>
                                            <span>{{ room.price }} {{ room.currency }}</span>
                                        </div>
                                    </div>
                                    <button class="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                        Réserver (Test)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="!loading && results.length === 0 && !error && rawLogs" class="text-center py-12">
                <p class="text-gray-500">Aucun hôtel trouvé pour ces critères.</p>
            </div>

        </div>
    </div>
</template>
