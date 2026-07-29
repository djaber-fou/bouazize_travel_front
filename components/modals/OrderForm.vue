<template>
    <UModal fullscreen>
        <template #header>
            <div class="w-full flex justify-between items-center">
                <div class="flex gap-4 items-center">
                    <UButton color="gray" variant="ghost" icon="i-lucide-arrow-left" @click="emit('close',true)" class="rounded-none w-10 h-10 flex justify-center items-center hover:bg-gray-100 transition-colors"/>
                    <div class="font-bold text-2xl text-secondary">{{ offer?.name }}</div>
                </div>
            </div>
        </template>
        <template #body>
            <div class="grid md:grid-cols-2 grid-cols-1 gap-12 px-6 md:px-12 lg:px-24 py-8 max-w-7xl mx-auto">
                <!-- Left: Offer Details -->
                <div class="flex flex-col gap-8 items-center md:items-start bg-gray-50/50 dark:bg-slate-900 p-8 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm h-fit">
                    <img :src="offer?.country_flag" class="w-full aspect-[4/3] object-cover rounded-none shadow-lg hover:shadow-xl transition-shadow duration-500"/>
                    <div class="flex flex-col gap-4 w-full">
                        <div class="flex flex-wrap gap-3">
                            <UBadge size="lg" class="font-bold shadow-sm" variant="subtle" :color="guaranteeColor(offer?.guarantee)">
                                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" v-if="offer?.guarantee !== 'without'" />
                                {{ guaranteeValue(offer?.guarantee) }}
                            </UBadge>
                            <UBadge size="lg" color="gray" variant="solid" class="font-medium shadow-sm">
                                <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                                {{ offer?.duration }}
                            </UBadge>
                        </div>
                        <div class="flex flex-col gap-1 mt-4 border-t border-gray-200 pt-6">
                            <span class="text-sm text-gray-500 font-medium uppercase tracking-wider">Prix par personne</span>
                            <div class="text-primary text-4xl font-extrabold flex items-baseline gap-2">
                                {{ offer?.price }} <span class="text-xl text-gray-500 font-bold">DZD</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right: Booking Form -->
                <div class="w-full pb-10 flex flex-col gap-8">
                    <div class="flex flex-col gap-2">
                        <h2 class="text-3xl font-bold text-secondary">Réserver cette offre</h2>
                        <p class="text-gray-500">Veuillez remplir les informations nécessaires pour finaliser votre réservation.</p>
                    </div>

                    <div v-if="!authorization?.token" class="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-none w-full font-medium text-sm flex items-center gap-3 shadow-sm">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-500 flex-shrink-0" />
                        Vous devez vous connecter pour uploader vos documents et réserver.
                    </div>

                    <div class="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <UFormField :ui="{label:'text-secondary font-bold mb-2'}" label="Nombre de personnes">
                            <UInputNumber size="lg" :ui="{base:'text-secondary font-bold text-lg'}" v-model="clientOrder.members" :min="1" class="w-32"/>
                        </UFormField>
                        
                        <div class="flex flex-col gap-3">
                            <div class="font-bold text-secondary text-lg flex items-center gap-2">
                                <UIcon name="i-heroicons-document-text" class="text-primary w-5 h-5"/>
                                Documents requis par personne
                            </div>
                            <div class="bg-gray-50 dark:bg-slate-800 rounded-none p-4 border border-gray-100 dark:border-slate-700">
                                <ul class="flex flex-col gap-2 list-inside">
                                    <li class="flex gap-3 items-center text-secondary font-medium" v-for="(document, index) in offer?.documents" :key="index">
                                        <UIcon name="i-heroicons-check-circle" class="text-green-500 w-5 h-5"/>
                                        {{ document?.name }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div @click.prevent="handleUploadClick" class="relative flex flex-col gap-4 items-center justify-center cursor-pointer w-full h-48 bg-gray-50 dark:bg-slate-800 hover:bg-primary/5 dark:hover:bg-primary/10 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary rounded-none transition-all duration-300 group">
                            <div class="w-16 h-16 rounded-none bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <UIcon name="i-mynaui-upload-solid" size="32" class="text-primary"/>
                            </div>
                            <div v-if="!clientOrder.file.length" class="text-secondary font-semibold text-center px-4">
                                Cliquez pour ajouter les <span class="text-primary">documents PDF</span> requis
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
        </template>
    </UModal>
    
    <UModal v-model:open="openCashModal" prevent-close>
        <template #header>
            <div class="flex items-center gap-2 font-bold text-lg text-primary">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                Commande Confirmée
            </div>
        </template>
        <template #body>
            <div class="flex flex-col gap-4 text-center">
                <p class="text-gray-700 dark:text-gray-300">
                    Votre commande a été créée avec succès. Veuillez vous rendre à notre agence pour effectuer le paiement en espèces et valider votre réservation.
                </p>
                <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col items-center gap-2">
                    <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-primary" />
                    <span class="font-bold">Bouazize Travel</span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                        123 Rue de l'Agence, Alger, Algérie
                    </span>
                    <!-- You can replace the address above with your actual agency location -->
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-center w-full">
                <UButton @click="closeCashModal" color="primary" class="font-bold px-8" label="Compris, OK" />
            </div>
        </template>
    </UModal>
</template>
<script setup>
import { useAuthStore } from '#imports'
import PaymentMethodSelector from '~/components/payment/PaymentMethodSelector.vue'
import { useRouter } from 'vue-router'

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
const clientOrder = ref({
    members:1,
    file:[],
    payment_method: 'ccp' // default to CCP
})
const openCashModal = ref(false)
const authStore = useAuthStore()
const role = computed(() => authStore.User?.role)
const isBusiness = computed(() => ['business', 'Business', 'Entreprise', 'entreprise'].includes(role.value))
const authorization = authStore.Authorization

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
    return guarantee
}
const guaranteeColor = (value)=>{
    const color = {
        with:"success",
        without:"error",
        half:"primary"
    }[value]
    return color
}

const disableCredit = computed(() => {
    const isBusiness = ['business', 'Business', 'Entreprise', 'entreprise'].includes(role.value);
    if (!isBusiness) return false;
    const balanceInfo = authStore.User?.balance;
    if (!balanceInfo) return true;
    
    const totalPrice = (offer.value?.price || 0) * (clientOrder.value.members || 1);
    const available = (balanceInfo.balance || 0) - (balanceInfo.debts || 0);
    return available < totalPrice;
});

watch(disableCredit, (newVal) => {
    if (newVal && clientOrder.value.payment_method === 'credit') {
        clientOrder.value.payment_method = 'ccp';
    }
});

const maxFiles = computed(() => {
    const docsCount = offer.value?.documents?.length || 0
    return docsCount * clientOrder.value.members
})

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
            // Limit file size to 10MB per file to prevent server crash
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
    clientOrder.value.members = 1,
    clientOrder.value.file = []
}
const getOffer = async()=>{
    const endpoint = authorization?.token ? `/client/${props.service}` : `/${props.service}`
    sendApi(`${endpoint}/offers/${props.id}`,null,'GET').then(response=>{
        console.log(response)
        offer.value = response.data
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
        clientOrder.value.file.forEach(file=>{
            formData.append('file[]',file)
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
                console.log(response)
                const orderId = response.data?.order_id
                const amount = offer.value?.price * clientOrder.value.members
                
                if (orderId) {
                    sendApi(`/client/${props.service}/orders/${orderId}/sync`, null, 'POST').catch(()=>{});
                }
                
                reset()
                emit('close')
                
                // Redirect to CCP payment confirmation if it's CCP
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
            title:"Veuillez télécharger tous les fichiers", 
            color:'',
            progress:false,
            close:false,
            ui:{root:'bg-error',title:'text-white', close:'neutral'}
        })
    }
}


</script>  