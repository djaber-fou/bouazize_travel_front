<script setup>
import { ref, computed } from 'vue';
import { sendApi } from '@/composables/api';

// Search Form State
const form = ref({
    checkin: '',
    checkout: '',
    nationality: 'DZ',
    hotel_ids: '25846, 12296',
    city_code: '',
    rooms: [
        { type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] }
    ]
});

// Set default dates (10 days from today to 12 days from today)
const today = new Date();
const d10 = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
const d12 = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000);
form.value.checkin = d10.toISOString().split('T')[0];
form.value.checkout = d12.toISOString().split('T')[0];

const results = ref([]);
const loading = ref(false);
const error = ref(null);
const rawLogs = ref(null);

// Certification Flow Test State
const certLoading = ref(false);
const certResult = ref(null);
const certError = ref(null);
const activeTab = ref('availability');

// Booking Modal State
const showBookingModal = ref(false);
const selectedHotel = ref(null);
const selectedArrangement = ref(null);
const bookingStep = ref('form'); // 'form', 'prebooking', 'confirming', 'success', 'error'
const bookingLoading = ref(false);
const bookingError = ref(null);
const bookingResponse = ref(null);
const prebookLogs = ref(null);
const bookLogs = ref(null);
const showTechLogs = ref(false);
const copiedRef = ref(false);

const bookingForm = ref({
    holder: {
        title: 'MR',
        name: 'DJABER',
        surname: 'BOUAZIZE',
        email: 'contact@bouazizetravel.com',
        phone: '+213550000000'
    },
    rooms: [
        {
            type: 'dbl',
            required: 1,
            passengers: [
                { title: 'MR', name: 'DJABER', surname: 'BOUAZIZE' },
                { title: 'MRS', name: 'FATIMA', surname: 'BOUAZIZE' }
            ]
        }
    ]
});

const calculateNights = computed(() => {
    if (!form.value.checkin || !form.value.checkout) return 1;
    const cin = new Date(form.value.checkin);
    const cout = new Date(form.value.checkout);
    const diff = Math.ceil((cout - cin) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
});

const addRoom = () => {
    form.value.rooms.push({ type: 'SGL', required: 1, extrabeds: 0, cots: 0, children: [] });
};

const removeRoom = (index) => {
    form.value.rooms.splice(index, 1);
};

const addChild = (roomIndex) => {
    form.value.rooms[roomIndex].children.push(0);
};

const searchHotels = async () => {
    loading.value = true;
    error.value = null;
    results.value = [];
    rawLogs.value = null;
    
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

        if (response && (response.status === 'success' || response.success === true)) {
            results.value = response.data || [];
            rawLogs.value = response.logs;
        } else if (response) {
            error.value = response.message || 'Erreur lors de la recherche';
            rawLogs.value = response.logs;
        } else {
            error.value = 'Erreur réseau ou réponse inattendue.';
        }
    } catch (e) {
        error.value = e.data?.message || e.message || 'Une erreur est survenue lors de la recherche';
    } finally {
        loading.value = false;
    }
};

const runCertificationFlow = async () => {
    certLoading.value = true;
    certError.value = null;
    certResult.value = null;

    try {
        const response = await sendApi('/hotels/test-flow', {
            checkin: form.value.checkin,
            checkout: form.value.checkout,
            hotel_id: '25846'
        }, 'POST');

        if (response && response.flow) {
            certResult.value = response.flow;
            activeTab.value = 'availability';
        } else {
            certError.value = response?.message || 'Erreur lors du test de certification';
        }
    } catch (e) {
        certError.value = e.data?.message || e.message || 'Une erreur est survenue';
    } finally {
        certLoading.value = false;
    }
};

const openBookingModal = (hotel, arrangement) => {
    selectedHotel.value = hotel;
    selectedArrangement.value = arrangement;
    bookingStep.value = 'form';
    bookingError.value = null;
    bookingResponse.value = null;
    prebookLogs.value = null;
    bookLogs.value = null;
    showTechLogs.value = false;
    copiedRef.value = false;

    // Dynamically prepare rooms and passengers based on arrangement or form
    const roomsToBook = [];
    const sourceRooms = (arrangement.rooms && arrangement.rooms.length > 0) ? arrangement.rooms : form.value.rooms;
    
    sourceRooms.forEach((r, idx) => {
        const type = (r.type || 'DBL').toUpperCase();
        let paxCount = 2;
        if (type === 'SGL') paxCount = 1;
        else if (type === 'TRP') paxCount = 3;
        else if (type === 'QUD') paxCount = 4;
        
        const paxList = [];
        for (let i = 0; i < paxCount; i++) {
            if (idx === 0 && i === 0) {
                paxList.push({ 
                    title: bookingForm.value.holder.title || 'MR', 
                    name: bookingForm.value.holder.name || 'DJABER', 
                    surname: bookingForm.value.holder.surname || 'BOUAZIZE' 
                });
            } else {
                paxList.push({ title: i % 2 === 1 ? 'MRS' : 'MR', name: '', surname: '' });
            }
        }

        roomsToBook.push({
            type: type.toLowerCase(),
            required: r.required || 1,
            passengers: paxList
        });
    });

    bookingForm.value.rooms = roomsToBook;
    showBookingModal.value = true;
};

const executePrebookAndBook = async () => {
    bookingLoading.value = true;
    bookingError.value = null;
    bookingStep.value = 'prebooking';

    try {
        // Step 1: Prebooking (Evaluation)
        const payload = {
            hotel_id: selectedHotel.value.id,
            agreement_id: selectedArrangement.value.id || '1',
            checkin: form.value.checkin,
            checkout: form.value.checkout,
            nationality: form.value.nationality,
            rooms: bookingForm.value.rooms,
            holder: bookingForm.value.holder
        };

        const prebookRes = await sendApi('/hotels/prebook', payload, 'POST');
        prebookLogs.value = prebookRes?.logs;

        if (!prebookRes || (prebookRes.status !== 'success' && prebookRes.success !== true)) {
            bookingStep.value = 'error';
            bookingError.value = prebookRes?.message || 'Échec de l\'évaluation (Prebooking Netstorming).';
            return;
        }

        // Step 2: Final Confirmed Booking
        bookingStep.value = 'confirming';
        const bookRes = await sendApi('/hotels/book', payload, 'POST');
        bookLogs.value = bookRes?.logs;

        if (bookRes && (bookRes.status === 'success' || bookRes.success === true)) {
            bookingStep.value = 'success';
            bookingResponse.value = bookRes;
        } else {
            bookingStep.value = 'error';
            bookingError.value = bookRes?.message || 'Échec de la confirmation finale Netstorming.';
        }

    } catch (e) {
        bookingStep.value = 'error';
        bookingError.value = e.data?.message || e.message || 'Erreur lors de la réservation';
    } finally {
        bookingLoading.value = false;
    }
};

const copyReference = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    copiedRef.value = true;
    setTimeout(() => {
        copiedRef.value = false;
    }, 2500);
};

const printVoucher = () => {
    window.print();
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <!-- Header -->
            <div class="text-center">
                
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                    Réservation d'Hôtels
                </h1>
                
            </div>

            
                <form @submit.prevent="searchHotels" class="relative max-w-4xl mx-auto bg-[#cdd5de]/95 backdrop-blur-sm rounded-md shadow-2xl p-5 border border-white/30 text-slate-800 font-sans">
                    <!-- Top Right Button -->
                    <div class="absolute top-4 right-4">
                        <button type="button" class="bg-[#6b7c93] hover:bg-[#5b6a7e] text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer">
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            RECHERCHES RÉCENTES
                        </button>
                    </div>

                    <!-- Row 1: Destination -->
                    <div class="flex flex-wrap md:flex-nowrap items-end gap-3 mb-4 mt-2">
                        <div class="flex-1">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1">Choisissez votre destination</label>
                            <input type="text" v-model="form.city_code" class="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#4caf50] rounded-sm" placeholder="ex: DXB, PAR, IST">
                        </div>
                        <div class="flex items-center gap-2 mb-1">
                            <label class="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold cursor-pointer">
                                <span>Géocodage</span>
                                <input type="checkbox" class="w-3.5 h-3.5 accent-[#4caf50]">
                            </label>
                        </div>
                        <div class="w-16">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1 text-center">Km</label>
                            <input type="number" value="5" class="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs text-center text-slate-700 focus:outline-none focus:border-[#4caf50] rounded-sm">
                        </div>
                    </div>

                    <!-- Row 2: Dates and Config -->
                    <div class="flex flex-wrap md:flex-nowrap items-end gap-3 mb-4">
                        <div class="w-40">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1">De</label>
                            <div class="relative">
                                <input type="date" v-model="form.checkin" class="w-full bg-[#f8f9fa] border border-slate-300 pl-8 pr-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#4caf50] rounded-sm" required>
                                <svg class="w-4 h-4 text-[#d9a05b] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
                            </div>
                        </div>
                        <div class="w-40">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1">au</label>
                            <div class="relative">
                                <input type="date" v-model="form.checkout" class="w-full bg-[#f8f9fa] border border-slate-300 pl-8 pr-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#4caf50] rounded-sm" required>
                                <svg class="w-4 h-4 text-[#d9a05b] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
                            </div>
                        </div>
                        
                        <div class="flex-1"></div>
                        
                        <div class="w-24">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1 text-center">Nuits</label>
                            <select class="w-full bg-[#f8f9fa] border border-slate-300 px-2 py-1.5 text-xs text-center text-slate-700 focus:outline-none focus:border-[#4caf50] rounded-sm appearance-none cursor-pointer">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                            </select>
                        </div>
                        <div class="w-24">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1 text-center">Chambres</label>
                            <select class="w-full bg-[#f8f9fa] border border-slate-300 px-2 py-1.5 text-xs text-center text-slate-700 focus:outline-none focus:border-[#4caf50] rounded-sm appearance-none cursor-pointer" @change="form.rooms = Array.from({length: parseInt($event.target.value)}, () => ({ type: 'DBL', required: 1, extrabeds: 0, cots: 0, children: [] }))">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                    </div>

                    <!-- Room Loop (like CHAMBRE 1, CHAMBRE 2) -->
                    <div class="bg-[#bfc8d3] p-3 mb-4 border-t border-[#aeb8c4] space-y-3">
                        <div v-for="(room, index) in form.rooms" :key="index" class="flex flex-wrap items-center gap-4">
                            <div class="text-[11px] font-bold text-slate-700 uppercase tracking-wider w-24">
                                CHAMBRE {{ index + 1 }}
                            </div>
                            
                            <div>
                                <label class="block text-[10px] font-bold text-slate-600 mb-1">Adultes</label>
                                <select class="w-16 bg-white border border-slate-300 px-2 py-1 text-xs text-center text-slate-700 focus:outline-none rounded-sm cursor-pointer">
                                    <option>1</option>
                                    <option selected>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-[10px] font-bold text-slate-600 mb-1">Nombre d'enfants</label>
                                <select :value="room.children.length" @change="room.children = Array.from({length: parseInt($event.target.value)}, () => 0)" class="w-16 bg-white border border-slate-300 px-2 py-1 text-xs text-center text-slate-700 focus:outline-none rounded-sm cursor-pointer">
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            
                            <div class="flex flex-col items-center justify-end h-[42px]">
                                <label class="block text-[10px] font-bold text-slate-600 mb-1">Berceau</label>
                                <input type="checkbox" v-model="room.cots" :true-value="1" :false-value="0" class="w-3.5 h-3.5 accent-[#4caf50] cursor-pointer">
                            </div>
                            
                            <div class="flex flex-col justify-end h-[42px] ml-4">
                                <label class="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                                    <input type="radio" v-model="room.type" value="DBL" class="w-3 h-3 accent-[#d9a05b] cursor-pointer">
                                    <span>Double</span>
                                </label>
                                <label class="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer mt-1">
                                    <input type="radio" v-model="room.type" value="TWN" class="w-3 h-3 accent-[#d9a05b] cursor-pointer">
                                    <span>Chambre Twin</span>
                                </label>
                            </div>

                            <!-- Child ages row if any children -->
                            <div v-if="room.children.length > 0" class="w-full flex flex-wrap items-center gap-2 mt-2 ml-[112px]">
                                <div v-for="(childAge, cIdx) in room.children" :key="cIdx">
                                    <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Âge enf {{ cIdx+1 }}</label>
                                    <input type="number" v-model="room.children[cIdx]" min="0" max="17" class="w-14 bg-white border border-slate-300 px-1 py-1 text-xs text-center focus:outline-none rounded-sm">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Advanced Options Accordion -->
                    <div class="mb-4 bg-[#c5cfd9] rounded-sm overflow-hidden border border-[#aeb8c4]">
                        <div class="flex items-center justify-between px-3 py-1.5 bg-[#aab5c2] cursor-pointer" onclick="document.getElementById('advanced_opts').classList.toggle('hidden'); document.getElementById('adv_btn_text').innerText = document.getElementById('advanced_opts').classList.contains('hidden') ? '+' : '-'">
                            <div class="flex items-center gap-2">
                                <span class="text-[#d9a05b] font-bold">|</span>
                                <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">OPTIONS AVANCÉES</span>
                            </div>
                            <button type="button" class="w-4 h-4 bg-white flex items-center justify-center border border-slate-300 text-slate-500 text-xs font-bold hover:bg-slate-50 cursor-pointer">
                                <span id="adv_btn_text">-</span>
                            </button>
                        </div>
                        
                        <div id="advanced_opts" class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-700 mb-1">Etoiles</label>
                                    <select class="w-full bg-[#f8f9fa] border border-slate-300 px-2 py-1.5 text-xs text-slate-700 focus:outline-none rounded-sm cursor-pointer appearance-none">
                                        <option>Sélect/ment...</option>
                                        <option>5 Etoiles</option>
                                        <option>4 Etoiles</option>
                                        <option>3 Etoiles</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-700 mb-1">Critères de sélection</label>
                                    <select class="w-full bg-[#f8f9fa] border border-slate-300 px-2 py-1.5 text-xs text-slate-700 focus:outline-none rounded-sm cursor-pointer appearance-none">
                                        <option>Sélect/ment...</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-700 mb-1">Budget</label>
                                    <select class="w-full bg-[#f8f9fa] border border-slate-300 px-2 py-1.5 text-xs text-slate-700 focus:outline-none rounded-sm cursor-pointer appearance-none">
                                        <option>Algerian Dinar</option>
                                        <option>Euro</option>
                                        <option>US Dollar</option>
                                    </select>
                                </div>
                                <div class="pt-5">
                                    <label class="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold cursor-pointer">
                                        <input type="checkbox" class="w-3 h-3 accent-[#4caf50]">
                                        <span>Tarifs remboursables uniquement</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Row: Nationality & Submit -->
                    <div class="flex flex-wrap md:flex-nowrap items-end justify-between gap-4">
                        <div class="w-48">
                            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nationalité de passager</label>
                            <select v-model="form.nationality" class="w-full bg-[#f8f9fa] border border-slate-300 px-2 py-1.5 text-xs text-slate-700 focus:outline-none rounded-sm uppercase cursor-pointer appearance-none">
                                <option value="DZ">ALGERIA</option>
                                <option value="FR">FRANCE</option>
                                <option value="TR">TURKEY</option>
                                <option value="AE">UAE</option>
                            </select>
                            <label class="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold cursor-pointer mt-2">
                                <input type="checkbox" class="w-3 h-3 accent-[#4caf50]">
                                <span>hôtels disponibles uniquement</span>
                            </label>
                        </div>
                        
                        <button type="submit" :disabled="loading" class="bg-[#3a913f] hover:bg-[#327d36] text-white text-sm font-bold tracking-wider px-10 py-2.5 rounded-sm shadow-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2">
                            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                            RECHERCHER
                        </button>
                    </div>
                </form>

            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-red-800 dark:text-red-300">{{ error }}</p>
                    </div>
                </div>
            </div>

            <!-- Search Results -->
            <div v-if="results.length > 0">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                    <span>Résultats disponibles ({{ results.length }} Hôtels)</span>
                </h2>
                <div class="grid gap-6">
                    <div v-for="hotel in results" :key="hotel.id" class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                        <div class="p-6 md:flex justify-between items-start gap-6">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ hotel.name }}</h3>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                        ★ {{ hotel.stars }} Étoiles
                                    </span>
                                </div>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                    <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    {{ hotel.address || 'Adresse disponible sur voucher' }} • {{ hotel.city }}
                                </p>
                                <span class="inline-block text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                    ID Hôtel: {{ hotel.id }}
                                </span>
                            </div>
                            
                            <div class="mt-4 md:mt-0 flex flex-col gap-3 min-w-[320px]">
                                <div v-for="(arr, aIdx) in hotel.arrangements" :key="aIdx" class="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                                                {{ arr.board_type === 'RO' ? 'Hébergement Seul (RO)' : (arr.board_type === 'BB' ? 'Petit Déjeuner Inclus (BB)' : arr.board_type) }}
                                            </span>
                                            <div class="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">{{ arr.room_type }}</div>
                                        </div>
                                        <div class="text-right">
                                            <span class="text-xl font-black text-blue-600 dark:text-blue-400">{{ arr.price }} {{ arr.currency }}</span>
                                            <div class="text-[10px] text-slate-400">Total séjour</div>
                                        </div>
                                    </div>

                                    <!-- Policy / Refundable status -->
                                    <div class="mb-3">
                                        <span v-if="arr.refundable" class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                            Annulation sans frais {{ arr.deadline ? 'jusqu\'au ' + arr.deadline.split(' ')[0] : '' }}
                                        </span>
                                        <span v-else class="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                                            Tarif spécial Netstorming
                                        </span>
                                    </div>

                                    <button 
                                        @click="openBookingModal(hotel, arr)"
                                        class="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span>Réserver cette option</span>
                                        &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="!loading && results.length === 0 && !error && rawLogs" class="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p class="text-slate-500 dark:text-slate-400 font-medium">Aucun hôtel disponible pour ces dates ou critères.</p>
            </div>

            <!-- BOOKING MODAL (PREBOOKING -> CONFIRMATION FLOW) -->
            <div v-if="showBookingModal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-900 dark:text-slate-100">
                    <!-- Close button -->
                    <button @click="showBookingModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>

                    <!-- Modal Header -->
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold">Réservation d'Hôtel</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {{ selectedHotel?.name }} • {{ selectedArrangement?.room_type }} ({{ selectedArrangement?.price }} {{ selectedArrangement?.currency }})
                        </p>
                    </div>

                    <!-- Flow Visualizer in Modal -->
                    <div class="flex items-center justify-between mb-6 px-4 py-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div class="flex items-center gap-2">
                            <span :class="bookingStep === 'prebooking' ? 'bg-blue-600 text-white animate-pulse' : (bookingStep === 'confirming' || bookingStep === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')" class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">1</span>
                            <span class="text-xs font-semibold">1. Évaluation (Prebook)</span>
                        </div>
                        <span class="text-slate-300 dark:text-slate-600">&rarr;</span>
                        <div class="flex items-center gap-2">
                            <span :class="bookingStep === 'confirming' ? 'bg-blue-600 text-white animate-pulse' : (bookingStep === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')" class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">2</span>
                            <span class="text-xs font-semibold">2. Confirmation Finale</span>
                        </div>
                    </div>

                    <!-- Form Content -->
                    <div v-if="bookingStep === 'form' || bookingStep === 'prebooking' || bookingStep === 'confirming'">
                        <!-- Holder Info -->
                        <div class="mb-6">
                            <h4 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Informations du Titulaire (Holder)</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Civilité</label>
                                    <select v-model="bookingForm.holder.title" class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs">
                                        <option value="MR">MR</option>
                                        <option value="MRS">MRS</option>
                                        <option value="MS">MS</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Prénom</label>
                                    <input type="text" v-model="bookingForm.holder.name" required class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs uppercase font-medium">
                                </div>
                                <div>
                                    <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nom</label>
                                    <input type="text" v-model="bookingForm.holder.surname" required class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs uppercase font-medium">
                                </div>
                            </div>
                        </div>

                        <!-- Passengers Info per Room -->
                        <div class="mb-6 space-y-4">
                            <h4 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Passagers par Chambre</h4>
                            <div v-for="(room, rIdx) in bookingForm.rooms" :key="rIdx" class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div class="text-xs font-bold uppercase mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                    <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                    Chambre {{ rIdx + 1 }} ({{ room.type.toUpperCase() }})
                                </div>
                                <div v-for="(pax, pIdx) in room.passengers" :key="pIdx" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div>
                                        <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Passager {{ pIdx + 1 }}</label>
                                        <select v-model="pax.title" class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                            <option value="MR">MR</option>
                                            <option value="MRS">MRS</option>
                                            <option value="CHD">CHD (Enfant)</option>
                                            <option value="INF">INF (Bébé)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Prénom</label>
                                        <input type="text" v-model="pax.name" class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nom</label>
                                        <input type="text" v-model="pax.surname" class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button @click="showBookingModal = false" type="button" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                Annuler
                            </button>
                            <button 
                                @click="executePrebookAndBook" 
                                :disabled="bookingLoading"
                                class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                                <svg v-if="bookingLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>{{ bookingStep === 'prebooking' ? 'Évaluation en cours...' : (bookingStep === 'confirming' ? 'Confirmation finale...' : 'Confirmer la Réservation Séquentielle') }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Booking Success Screen (Professional Voucher UI) -->
                    <div v-else-if="bookingStep === 'success'" class="space-y-6">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-inner ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                                ✓
                            </div>
                            <h4 class="text-2xl font-black mt-3">Réservation Confirmée !</h4>
                            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Le cycle séquentiel Netstorming a été validé avec succès. Votre bon d'échange (Voucher) est prêt.
                            </p>
                        </div>

                        <!-- Reference Code Highlight -->
                        <div class="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Code Référence Netstorming</span>
                                <div class="text-lg sm:text-xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
                                    {{ bookingResponse?.data?.reference || bookingResponse?.data?.booking_code || 'BK_CONFIRMED' }}
                                </div>
                            </div>
                            <button 
                                @click="copyReference(bookingResponse?.data?.reference || bookingResponse?.data?.booking_code)"
                                class="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                                <span v-if="copiedRef" class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                    Copié !
                                </span>
                                <span v-else class="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                    Copier
                                </span>
                            </button>
                        </div>

                        <!-- Structured Voucher Card -->
                        <div class="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-3.5 text-xs">
                            <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
                                <div>
                                    <div class="text-base font-bold text-slate-900 dark:text-white">{{ selectedHotel?.name }}</div>
                                    <div class="text-slate-500 dark:text-slate-400 mt-0.5">★ {{ selectedHotel?.stars }} Étoiles • {{ selectedHotel?.city }}</div>
                                </div>
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                                    Statut : Confirmé
                                </span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div>
                                    <span class="text-slate-400 dark:text-slate-500 uppercase font-bold text-[10px]">Dates du séjour</span>
                                    <div class="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                                        Du {{ form.checkin }} au {{ form.checkout }} ({{ calculateNights }} Nuits)
                                    </div>
                                </div>
                                <div>
                                    <span class="text-slate-400 dark:text-slate-500 uppercase font-bold text-[10px]">Chambre & Formule</span>
                                    <div class="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                                        {{ selectedArrangement?.room_type }} • {{ selectedArrangement?.board_type === 'RO' ? 'Hébergement Seul' : selectedArrangement?.board_type }}
                                    </div>
                                </div>
                                <div>
                                    <span class="text-slate-400 dark:text-slate-500 uppercase font-bold text-[10px]">Titulaire</span>
                                    <div class="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                                        {{ bookingForm.holder.title }} {{ bookingForm.holder.name }} {{ bookingForm.holder.surname }}
                                    </div>
                                </div>
                                <div>
                                    <span class="text-slate-400 dark:text-slate-500 uppercase font-bold text-[10px]">Montant Total</span>
                                    <div class="font-black text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                        {{ selectedArrangement?.price }} {{ selectedArrangement?.currency }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Technical XML Details Accordion -->
                        <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                            <button 
                                @click="showTechLogs = !showTechLogs"
                                type="button" 
                                class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                                    Inspecteur Technique XML Netstorming
                                </span>
                                <span>{{ showTechLogs ? '▲ Masquer' : '▼ Afficher' }}</span>
                            </button>
                            <div v-if="showTechLogs" class="p-3 bg-slate-950 text-slate-300 font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto">
                                <div class="text-emerald-400 font-bold">Réponse XML finale :</div>
                                <pre class="whitespace-pre-wrap">{{ bookingResponse?.logs?.response || bookingResponse?.data?.raw_response || 'Aucun log XML disponible' }}</pre>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-2 flex flex-wrap justify-end gap-3">
                            <button @click="printVoucher" type="button" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                                Imprimer Voucher
                            </button>
                            <button @click="showBookingModal = false; searchHotels()" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer">
                                Terminer & Nouvelle recherche
                            </button>
                        </div>
                    </div>

                    <!-- Booking Error Screen -->
                    <div v-else-if="bookingStep === 'error'" class="text-center py-6 space-y-4">
                        <div class="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold ring-8 ring-red-50 dark:ring-red-950/30">
                            ✕
                        </div>
                        <h4 class="text-2xl font-bold">Échec de la Réservation</h4>
                        <p class="text-sm text-red-600 dark:text-red-400 font-medium max-w-md mx-auto">
                            {{ bookingError }}
                        </p>
                        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            Conseil : L'accord de réservation a peut-être expiré ou les disponibilités ont changé. Essayez de relancer une recherche ou de choisir un autre tarif.
                        </p>

                        <div class="pt-4 flex justify-center gap-3">
                            <button @click="bookingStep = 'form'" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                Réessayer
                            </button>
                            <button @click="showBookingModal = false" class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer">
                                Fermer
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    
</template>
