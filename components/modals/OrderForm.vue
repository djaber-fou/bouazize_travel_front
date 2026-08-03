<template>
    <UModal fullscreen>
        <template #header>
            <div class="w-full flex justify-between items-center">
                <div class="flex gap-4 items-center">
                    <UButton color="gray" variant="ghost" icon="i-lucide-arrow-left" @click="emit('close',true)" class="rounded-none w-10 h-10 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"/>
                    <div>
                        <div class="font-bold text-2xl text-secondary">{{ offer?.name }}</div>
                        <div v-if="offer?.departure_date" class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-primary"/>
                            <span>Départ: {{ offer?.departure_date }}</span>
                            <span v-if="offer?.return_date">• Retour: {{ offer?.return_date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #body>
            <div v-if="!openCashModal" class="grid md:grid-cols-2 grid-cols-1 gap-12 px-6 md:px-12 lg:px-24 py-8 max-w-7xl mx-auto">
                <!-- Left: Offer Details & Price Summary -->
                <div class="flex flex-col gap-6 items-center md:items-start bg-gray-50/50 dark:bg-slate-900 p-8 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm h-fit">
                    <img :src="offer?.country_flag" class="w-full aspect-[4/3] object-cover rounded-none shadow-lg hover:shadow-xl transition-shadow duration-500"/>
                    
                    <div class="flex flex-col gap-4 w-full">
                        <div class="flex flex-wrap gap-2">
                            <UBadge size="lg" class="font-bold shadow-sm" variant="subtle" :color="guaranteeColor(offer?.guarantee)">
                                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" v-if="offer?.guarantee !== 'without'" />
                                {{ guaranteeValue(offer?.guarantee) }}
                            </UBadge>
                            <UBadge size="lg" color="gray" variant="solid" class="font-medium shadow-sm">
                                <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                                {{ offer?.duration || 'Séjour complet' }}
                            </UBadge>
                        </div>

                        <!-- Real-time Dynamic Pricing Breakdown Box -->
                        <div class="flex flex-col gap-3 mt-2 border-t border-gray-200 dark:border-slate-700 pt-6 w-full">
                            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                <span>Détails de la tarification</span>
                                <span class="text-primary font-semibold text-xs">Temps réel</span>
                            </div>

                            <!-- Breakdown Lines -->
                            <div class="space-y-2 text-sm bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 rounded-none">
                                <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                    <span>Adultes ({{ clientOrder.members }} × {{ formatPrice(unitAdultPrice) }} DZD)</span>
                                    <span class="font-bold text-secondary">{{ formatPrice(totalAdultsPrice) }} DZD</span>
                                </div>
                                <div v-if="hasRooms && clientOrder.children_count > 0" class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                    <span>Enfants ({{ clientOrder.children_count }} × {{ formatPrice(unitChildPrice) }} DZD)</span>
                                    <span class="font-bold text-secondary">{{ formatPrice(totalChildrenPrice) }} DZD</span>
                                </div>
                                <div v-if="hasRooms && clientOrder.babies_count > 0" class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                    <span>Bébés ({{ clientOrder.babies_count }} × {{ formatPrice(unitBabyPrice) }} DZD)</span>
                                    <span class="font-bold text-secondary">{{ formatPrice(totalBabiesPrice) }} DZD</span>
                                </div>
                                
                                <div class="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3 flex justify-between items-baseline">
                                    <span class="font-extrabold text-base text-secondary">Montant Total</span>
                                    <div class="text-primary text-3xl font-black">
                                        {{ formatPrice(grandTotalPrice) }} <span class="text-sm text-gray-500 font-bold">DZD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right: Booking Form -->
                <div class="w-full pb-10 flex flex-col gap-8">
                    <div class="flex flex-col gap-2">
                        <h2 class="text-3xl font-bold text-secondary">Réserver cette offre</h2>
                        <p class="text-gray-500">Configurez votre séjour et sélectionnez le type de chambre souhaité.</p>
                    </div>

                    <div v-if="!authorization?.token" class="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-none w-full font-medium text-sm flex items-center gap-3 shadow-sm">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-500 flex-shrink-0" />
                        Vous devez vous connecter pour uploader vos documents et réserver.
                    </div>

                    <!-- Room Selector (Only for Omra and Voyage Organise when rooms are configured) -->
                    <div v-if="hasRooms" class="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div class="font-bold text-secondary text-lg flex items-center gap-2">
                            <UIcon name="i-heroicons-home-modern" class="text-primary w-5 h-5"/>
                            1. Choisissez le type de chambre
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div v-for="(room, index) in availableRooms" :key="room.id || index"
                                 @click="selectRoom(index)"
                                 :class="[
                                     'p-4 border-2 cursor-pointer transition-all duration-300 rounded-none flex flex-col justify-between gap-2',
                                     selectedRoomIndex === index 
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md' 
                                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-800/50'
                                 ]">
                                <div class="flex justify-between items-start">
                                    <div class="font-bold text-secondary text-sm">{{ room.name }}</div>
                                    <UBadge size="xs" :color="selectedRoomIndex === index ? 'primary' : 'gray'" variant="subtle" class="font-bold">
                                        {{ room.capacity || room.type }} Place{{ (room.capacity > 1 || room.type > 1) ? 's' : '' }}
                                    </UBadge>
                                </div>
                                
                                <div class="flex justify-between items-baseline mt-1">
                                    <span class="text-xs text-gray-500">Par adulte</span>
                                    <span class="font-bold text-primary text-base">{{ formatPrice(getRoomAdultPrice(room)) }} DZD</span>
                                </div>

                                <div v-if="room.notes" class="text-xs text-gray-400 italic">
                                    {{ room.notes }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Passenger Configuration Card -->
                    <div class="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div class="font-bold text-secondary text-lg flex items-center gap-2">
                            <UIcon name="i-heroicons-users" class="text-primary w-5 h-5"/>
                            2. Configuration des Voyageurs
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <!-- Adult Passengers -->
                            <div class="p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-none flex flex-col gap-2">
                                <label class="text-xs font-bold text-secondary">Adultes (Places)</label>
                                <div class="flex items-center gap-2">
                                    <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-minus" @click="decrementAdults" :disabled="clientOrder.members <= 1"/>
                                    <span class="font-black text-lg text-secondary w-8 text-center">{{ clientOrder.members }}</span>
                                    <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-plus" @click="incrementAdults" :disabled="hasRooms && clientOrder.members >= currentMaxAdults"/>
                                </div>
                                <span class="text-xs text-gray-500">{{ formatPrice(unitAdultPrice) }} DZD / pers</span>
                            </div>

                            <!-- Children (2-12 years) -->
                            <div v-if="hasRooms" class="p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-none flex flex-col gap-2">
                                <label class="text-xs font-bold text-secondary">Enfants (2-12 ans)</label>
                                <div class="flex items-center gap-2">
                                    <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-minus" @click="decrementChildren" :disabled="clientOrder.children_count <= 0"/>
                                    <span class="font-black text-lg text-secondary w-8 text-center">{{ clientOrder.children_count }}</span>
                                    <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-plus" @click="incrementChildren" :disabled="clientOrder.children_count >= currentMaxChildren"/>
                                </div>
                                <span class="text-xs text-gray-500">{{ unitChildPrice > 0 ? `${formatPrice(unitChildPrice)} DZD / enf` : 'Non disponible' }}</span>
                            </div>

                            <!-- Babies (0-2 years) -->
                            <div v-if="hasRooms" class="p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-none flex flex-col gap-2">
                                <label class="text-xs font-bold text-secondary">Bébés (0-2 ans)</label>
                                <div class="flex items-center gap-2">
                                    <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-minus" @click="decrementBabies" :disabled="clientOrder.babies_count <= 0"/>
                                    <span class="font-black text-lg text-secondary w-8 text-center">{{ clientOrder.babies_count }}</span>
                                    <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-plus" @click="incrementBabies" :disabled="clientOrder.babies_count >= currentMaxBabies"/>
                                </div>
                                <span class="text-xs text-gray-500">{{ unitBabyPrice > 0 ? `${formatPrice(unitBabyPrice)} DZD / bébé` : 'Non disponible' }}</span>
                            </div>
                        </div>

                        <!-- Documents Required Info -->
                        <div class="flex flex-col gap-3 pt-2">
                            <div class="font-bold text-secondary text-sm flex items-center gap-2">
                                <UIcon name="i-heroicons-document-text" class="text-primary w-4 h-4"/>
                                Documents requis par passager ({{ totalTravelersWithDocs }} voyageur{{ totalTravelersWithDocs > 1 ? 's' : '' }})
                            </div>
                            <div class="bg-gray-50 dark:bg-slate-800 rounded-none p-4 border border-gray-100 dark:border-slate-700">
                                <ul class="flex flex-col gap-2 list-inside">
                                    <li class="flex gap-3 items-center text-secondary font-medium text-sm" v-for="(document, index) in offer?.documents" :key="index">
                                        <UIcon name="i-heroicons-check-circle" class="text-green-500 w-4 h-4"/>
                                        {{ document?.name || document }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- File Upload Box -->
                        <div @click.prevent="handleUploadClick" class="relative flex flex-col gap-4 items-center justify-center cursor-pointer w-full h-48 bg-gray-50 dark:bg-slate-800 hover:bg-primary/5 dark:hover:bg-primary/10 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary rounded-none transition-all duration-300 group">
                            <div class="w-16 h-16 rounded-none bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <UIcon name="i-mynaui-upload-solid" size="32" class="text-primary"/>
                            </div>
                            <div v-if="!clientOrder.file.length" class="text-secondary font-semibold text-center px-4">
                                Cliquez pour ajouter les <span class="text-primary">fichiers requis</span> ({{ maxFiles }} au total)
                            </div>
                            <div v-else class="flex flex-col items-center gap-1">
                                <div class="text-2xl font-extrabold text-primary">
                                    {{ clientOrder.file.length }} <span class="text-gray-400 text-lg">/ {{ maxFiles }}</span>
                                </div>
                                <div class="text-sm font-medium text-gray-500">Fichiers sélectionnés</div>
                            </div>
                        </div>    
                        <input type="file" ref="fileInput" @change="onFileChange" class="hidden" :multiple="maxFiles > 1" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip,.rar"/>
                    </div>
                    
                    <!-- Payment Method Selector -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <PaymentMethodSelector v-model="clientOrder.payment_method" :disableCredit="disableCredit" :showCredit="isBusiness" />
                    </div>

                    <!-- Submission Button -->
                    <div class="flex flex-col gap-2 w-full pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div v-if="loading" class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-2">
                            <div class="bg-primary h-1.5 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                        </div>
                        <div class="flex flex-col sm:flex-row justify-start gap-4">
                            <UButton :loading="loading" loading-icon="i-lucide-loader-circle" @click="submitOrder" class="font-bold text-lg px-8 py-3 rounded-none shadow-md hover:shadow-lg transition-all" color="primary" :label="loadingText">
                                <template #trailing>
                                    <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 ml-2" v-if="!loading" />
                                </template>
                            </UButton>
                            <UButton @click="reset" variant="soft" color="gray" class="font-bold px-6 py-3 rounded-none" label="Réinitialiser" :disabled="loading"/>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="flex flex-col items-center justify-center h-[70vh] gap-6 text-center">
                <UIcon name="i-heroicons-check-circle" class="w-24 h-24 text-green-500" />
                <h2 class="text-3xl font-bold text-primary">Commande Confirmée</h2>
                <p class="text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
                    Votre commande a été créée avec succès. Veuillez vous rendre à notre agence pour effectuer le paiement en espèces et valider votre réservation.
                </p>
                <div class="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col items-center gap-4 mt-4">
                    <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-primary" />
                    <span class="font-bold text-2xl">Bouazize Travel</span>
                    <span class="text-lg text-gray-600 dark:text-gray-400">
                        123 Rue de l'Agence, Alger, Algérie
                    </span>
                </div>
                <UButton @click="closeCashModal" color="primary" class="font-bold px-12 py-4 text-lg mt-8 rounded-none shadow-lg" label="Compris, fermer" />
            </div>
        </template>
    </UModal>
</template>

<script setup>
import { useAuthStore } from '#imports'
import PaymentMethodSelector from '~/components/payment/PaymentMethodSelector.vue'
import { useRouter } from 'vue-router'
import { computed, ref, watch, onMounted } from 'vue'

const router = useRouter()
const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    },
    service: {
        type: String,
        default: 'visa'
    }
})

const emit = defineEmits(['close'])
const toast = useToast()
const loading = ref(false)
const loadingText = ref('Confirmer la réservation')
const uploadProgress = ref(0)
const offer = ref({})
const selectedRoomIndex = ref(0)

const clientOrder = ref({
    members: 1,
    babies_count: 0,
    children_count: 0,
    file: [],
    payment_method: 'ccp'
})

const openCashModal = ref(false)
const authStore = useAuthStore()
const role = computed(() => authStore.User?.role)
const isBusiness = computed(() => ['business', 'Business', 'Entreprise', 'entreprise'].includes(role.value))
const authorization = authStore.Authorization

const formatPrice = (val) => {
    const num = Number(val) || 0
    return num.toLocaleString('fr-FR')
}

const availableRooms = computed(() => {
    if (offer.value?.rooms && Array.isArray(offer.value.rooms) && offer.value.rooms.length > 0) {
        return offer.value.rooms
    }
    return []
})

const hasRooms = computed(() => {
    return (props.service === 'omra' || props.service === 'voyage_organise') && availableRooms.value.length > 0
})

const selectedRoom = computed(() => {
    if (hasRooms.value && availableRooms.value[selectedRoomIndex.value]) {
        return availableRooms.value[selectedRoomIndex.value]
    }
    return null
})

const getRoomAdultPrice = (room) => {
    if (!room) return offer.value?.price || 0
    if (isBusiness.value && room.b2b_price) {
        return Number(room.b2b_price)
    }
    return Number(room.b2c_price || room.purchase_price || offer.value?.price || 0)
}

const unitAdultPrice = computed(() => {
    if (selectedRoom.value) {
        return getRoomAdultPrice(selectedRoom.value)
    }
    return Number(offer.value?.price || 0)
})

const unitChildPrice = computed(() => {
    if (selectedRoom.value && selectedRoom.value.child_price) {
        return Number(selectedRoom.value.child_price)
    }
    return 0
})

const unitBabyPrice = computed(() => {
    if (selectedRoom.value && selectedRoom.value.baby_price) {
        return Number(selectedRoom.value.baby_price)
    }
    return 0
})

const currentMaxAdults = computed(() => {
    if (selectedRoom.value) {
        return Number(selectedRoom.value.capacity || selectedRoom.value.type || 10)
    }
    return 50
})

const currentMaxChildren = computed(() => {
    if (selectedRoom.value && selectedRoom.value.max_children !== undefined) {
        return Number(selectedRoom.value.max_children)
    }
    return 4
})

const currentMaxBabies = computed(() => {
    if (selectedRoom.value && selectedRoom.value.max_babies !== undefined) {
        return Number(selectedRoom.value.max_babies)
    }
    return 2
})

const selectRoom = (index) => {
    selectedRoomIndex.value = index
    const room = availableRooms.value[index]
    if (room) {
        clientOrder.value.members = Number(room.capacity || room.type || 1)
        if (clientOrder.value.children_count > currentMaxChildren.value) {
            clientOrder.value.children_count = currentMaxChildren.value
        }
        if (clientOrder.value.babies_count > currentMaxBabies.value) {
            clientOrder.value.babies_count = currentMaxBabies.value
        }
    }
}

const incrementAdults = () => {
    if (clientOrder.value.members < currentMaxAdults.value) {
        clientOrder.value.members++
    }
}

const decrementAdults = () => {
    if (clientOrder.value.members > 1) {
        clientOrder.value.members--
    }
}

const incrementChildren = () => {
    if (clientOrder.value.children_count < currentMaxChildren.value) {
        clientOrder.value.children_count++
    }
}

const decrementChildren = () => {
    if (clientOrder.value.children_count > 0) {
        clientOrder.value.children_count--
    }
}

const incrementBabies = () => {
    if (clientOrder.value.babies_count < currentMaxBabies.value) {
        clientOrder.value.babies_count++
    }
}

const decrementBabies = () => {
    if (clientOrder.value.babies_count > 0) {
        clientOrder.value.babies_count--
    }
}

const totalAdultsPrice = computed(() => {
    return unitAdultPrice.value * (clientOrder.value.members || 1)
})

const totalChildrenPrice = computed(() => {
    return unitChildPrice.value * (clientOrder.value.children_count || 0)
})

const totalBabiesPrice = computed(() => {
    return unitBabyPrice.value * (clientOrder.value.babies_count || 0)
})

const grandTotalPrice = computed(() => {
    return totalAdultsPrice.value + totalChildrenPrice.value + totalBabiesPrice.value
})

const totalTravelersWithDocs = computed(() => {
    return (clientOrder.value.members || 1) + (clientOrder.value.children_count || 0)
})

const maxFiles = computed(() => {
    const docsCount = offer.value?.documents?.length || 0
    return docsCount * totalTravelersWithDocs.value
})

const disableCredit = computed(() => {
    if (!isBusiness.value) return false;
    const balanceInfo = authStore.User?.balance;
    if (!balanceInfo) return true;
    
    const available = (balanceInfo.balance || 0) - (balanceInfo.debts || 0);
    return available < grandTotalPrice.value;
});

watch(disableCredit, (newVal) => {
    if (newVal && clientOrder.value.payment_method === 'credit') {
        clientOrder.value.payment_method = 'ccp';
    }
});

const closeCashModal = () => {
    openCashModal.value = false
    router.push('/client/orders')
}

const guaranteeValue = (value)=>{
    const guarantee = {
        with:"Avec garantie de retour",
        without:"Sans garantie de retour",
        half:"Demi garantie"
    }[value]
    return guarantee || "Standard"
}

const guaranteeColor = (value)=>{
    const color = {
        with:"success",
        without:"error",
        half:"primary"
    }[value]
    return color || "primary"
}

onMounted(()=>{
    getOffer()
})

const fileInput = ref(null)

const handleUploadClick = () => {
    if (!authorization?.token) {
        toast.add({ title: "Vous devez vous connecter pour réserver", color: 'red' })
        emit('close')
        navigateTo('/auth/login')
        return
    }
    if (fileInput.value) {
        fileInput.value.click()
    }
}

const onFileChange = (event)=> {
    const files = event.target.files;
    if (files && files.length > 0) {
        let remaining = maxFiles.value - clientOrder.value.file.length
        
        for(let i=0; i < files.length; i++){
            if (files[i].size > 10 * 1024 * 1024) {
                toast.add({
                    title: `Le fichier ${files[i].name} est trop volumineux (Max 10MB).`,
                    color: 'orange'
                })
                continue
            }

            if (remaining > 0) {
                clientOrder.value.file.push(files[i])
                remaining--
            } else {
                toast.add({
                    title: `Limite atteinte: ${maxFiles.value} fichier(s) requis maximum.`,
                    color: 'orange'
                })
                break
            }
        }
    }
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const reset = ()=>{
    clientOrder.value.members = selectedRoom.value ? Number(selectedRoom.value.capacity || 1) : 1
    clientOrder.value.children_count = 0
    clientOrder.value.babies_count = 0
    clientOrder.value.file = []
}

const getOffer = async()=>{
    const endpoint = authorization?.token ? `/client/${props.service}` : `/${props.service}`
    sendApi(`${endpoint}/offers/${props.id}`, null, 'GET').then(response=>{
        offer.value = response.data
        if (hasRooms.value) {
            selectRoom(0)
        }
    })
}

const submitOrder = async ()=>{
    if (!authorization?.token) {
        toast.add({
            title: "Vous devez vous connecter pour réserver", 
            color: 'red',
        })
        emit('close')
        return navigateTo('/auth/login')
    }

    if(clientOrder.value.file.length === maxFiles.value){
        loading.value = true
        uploadProgress.value = 0
        loadingText.value = 'Envoi des fichiers (0%)...'
        const formData = new FormData()
        formData.append('members', clientOrder.value.members)
        formData.append('payment_method', clientOrder.value.payment_method)
        
        if (hasRooms.value && selectedRoom.value) {
            formData.append('room_id', selectedRoom.value.id || selectedRoomIndex.value)
            formData.append('room_type', selectedRoom.value.name || selectedRoom.value.type)
            formData.append('babies_count', clientOrder.value.babies_count || 0)
            formData.append('children_count', clientOrder.value.children_count || 0)
        }

        clientOrder.value.file.forEach(file=>{
            formData.append('file[]', file)
        })
        
        const configOpts = {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgress.value = percentCompleted;
                if (percentCompleted < 100) {
                    loadingText.value = `Envoi des fichiers (${percentCompleted}%)...`;
                } else {
                    loadingText.value = 'Traitement en cours (Veuillez patienter)...';
                }
            }
        }
        
        const url = isBusiness.value ? 'business/order': 'individual/order'
        sendApi(`/client/${props.service}/offers/${props.id}/${url}`, formData, 'POST', configOpts).then((response)=>{
            if (response) {
                const orderId = response.data?.order_id
                const amount = grandTotalPrice.value
                
                if (orderId) {
                    sendApi(`/client/${props.service}/orders/${orderId}/sync`, null, 'POST').catch(()=>{});
                }
                
                reset()
                emit('close')
                
                if (clientOrder.value.payment_method === 'ccp') {
                    router.push(`/payment/confirm?order_id=${orderId}&type=${props.service}&amount=${amount}`)
                } else if (clientOrder.value.payment_method === 'cash') {
                    openCashModal.value = true
                } else {
                    toast.add({ title: "Commande créée avec succès (Crédit/Facture)", color: 'green' })
                    router.push('/client/orders')
                }
            }
            loading.value = false
            loadingText.value = 'Confirmer la réservation'
        }).catch(() => {
            loading.value = false
            loadingText.value = 'Confirmer la réservation'
        })
    }else{
        toast.add({
            title:"Veuillez télécharger tous les fichiers requis", 
            color:'',
            progress:false,
            close:false,
            ui:{root:'bg-error',title:'text-white', close:'neutral'}
        })
    }
}
</script>  