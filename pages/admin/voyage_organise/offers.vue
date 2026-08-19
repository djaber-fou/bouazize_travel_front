<template>
    <!--tt-->
    <div class="w-full space-y-4 pb-4">
        <div class="flex flex-col gap-5">
            <div class="flex justify-between items-center">
                <UInput 
                v-model="search"
                icon="i-lucide-search" 
                size="md" 
                variant="outline" 
                placeholder="Rechercher un voyage organisé..."
                @update:model-value="getOffers"
                class="w-72"
                />
                <UButton @click="openForm" :ui="{leadingIcon:'text-neutral'}" class="font-bold shadow-md" icon="i-material-symbols-add-2" label="Ajouter un Voyage Organisé"/>
            </div>
            <div>
                <UTable
                :sticky="true"
                ref="table"
                v-model:pagination="pagination"
                :data="data"
                :columns="columns"
                :loading="loading && !data.length"
                :empty="loading?'chargement en cours...':'Données non trouvées'"
                class="flex-1 h-full shadow-sm rounded-none border border-gray-100 dark:border-slate-800"
                />
        
                <div class="flex justify-center border-t border-default pt-4">
                    <UPagination
                    :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getState().pagination.totalItems"
                    @update:page="onPageChange"
                    />
                </div>
            </div>
        </div>

        <USlideover fullscreen v-model:open="open" 
        :title="action==='Ajouter'?'Ajouter un Voyage Organisé':'Modifier le Voyage Organisé'" 
        close-icon="i-lucide-arrow-right" :close="{
        color: 'secondary',
        class:'cursor-pointer',
        }"
        :ui="{
            content: 'w-screen max-w-6xl lg:max-w-7xl max-w-full',
            width: 'max-w-6xl lg:max-w-7xl',
            body: 'p-6 sm:p-8'
        }">
            <template #body>
                <div class="flex flex-col gap-8 w-full max-w-6xl lg:max-w-7xl mx-auto pb-16">
                    <!-- General Information Card -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div class="font-bold text-lg text-secondary border-b pb-2 flex items-center gap-2">
                            <UIcon name="i-heroicons-information-circle" class="text-primary w-5 h-5"/>
                            Informations Générales
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UFormField v-if="action=='Modifier'" :ui="{label:'text-secondary font-bold'}" label="Disponibilité" name="available">
                                <USwitch v-model="offer.available" />
                            </UFormField>
                            <div v-else></div>

                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Pays de destination" name="country">
                                <USelectMenu placeholder="Sélectionner le pays" @change="()=>offer.country_id = country.value" v-model:search-term="searchCountry" v-model="country" :avatar="country?.avatar" :items="countries" class="w-full" />
                            </UFormField>

                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Fournisseur" name="provider_id">
                                <USelectMenu placeholder="Sélectionner le fournisseur" @change="()=>offer.provider_id = provider.value" v-model:search-term="searchProvider" v-model="provider" :avatar="provider?.avatar" :items="providers" class="w-full" />
                            </UFormField>

                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Nom du voyage" name="name">
                                <UInput placeholder="Ex: Voyage Istanbul & Antalya - 15 Août" v-model="offer.offer_name" class="w-full"/>
                            </UFormField>

                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Garantie" name="guarantee">
                                <USelect placeholder="Type de garantie" v-model="offer.guarantee" :items="guaranteeTypes" class="w-full" />
                            </UFormField>

                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Photo personnalisée du voyage" name="image" class="md:col-span-2">
                                <div class="flex flex-col gap-3">
                                    <input type="file" @change="onFileChange" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"/>
                                    <div v-if="previewImage || offer.image" class="relative w-full sm:w-64 h-36 border border-gray-200 dark:border-slate-700 overflow-hidden group rounded-sm shadow-xs">
                                        <img :src="previewImage || offer.image" class="w-full h-full object-cover" alt="Aperçu de l'offre" />
                                        <button type="button" @click="removeImage" class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition shadow cursor-pointer">
                                            <UIcon name="i-material-symbols-close" class="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p class="text-xs text-gray-400">Si aucune image n'est choisie, l'image / drapeau du pays sera utilisé par défaut.</p>
                                </div>
                            </UFormField>
                        </div>

                        
                        <!-- National / International Toggle -->
                        <div class="pt-4 border-t border-gray-100 dark:border-slate-800">
                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Type de voyage" name="is_national">
                                <div class="flex items-center gap-3">
                                    <span class="text-sm font-medium" :class="offer.is_national ? 'text-gray-400' : 'text-primary'">International</span>
                                    <UToggle v-model="offer.is_national" size="lg" color="primary" />
                                    <span class="text-sm font-medium" :class="offer.is_national ? 'text-primary' : 'text-gray-400'">National (Local)</span>
                                </div>
                                <span class="text-xs text-gray-500 mt-1 block">Si le pays contient "Algérie", ce bouton s'activera automatiquement.</span>
                            </UFormField>
                        </div>
                        
                        <!-- Departure & Return Dates with Auto-Duration -->
                        <div class="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                                <div class="font-bold text-secondary">Dates de départ disponibles</div>
                                <UButton @click="addDatePair" color="gray" variant="ghost" icon="i-heroicons-plus" size="sm" label="Ajouter une date" />
                            </div>
                            
                            <div v-for="(dateObj, index) in offer.dates" :key="index" class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end bg-gray-50 dark:bg-slate-800/50 p-3 rounded-md">
                                <UFormField :ui="{label:'text-secondary font-bold text-sm'}" :label="`Date de départ ${index + 1}`" :name="`dates_${index}_departure`">
                                    <UInput type="date" v-model="dateObj.departure_date" @change="autoCalculateDuration(index)" class="w-full"/>
                                </UFormField>

                                <UFormField :ui="{label:'text-secondary font-bold text-sm'}" :label="`Date de retour ${index + 1}`" :name="`dates_${index}_return`">
                                    <UInput type="date" v-model="dateObj.return_date" @change="autoCalculateDuration(index)" class="w-full"/>
                                </UFormField>

                                <div class="pb-1" v-if="offer.dates.length > 1">
                                    <UButton @click="removeDatePair(index)" color="red" variant="soft" icon="i-heroicons-trash" size="sm" />
                                </div>
                            </div>

                            <UFormField :ui="{label:'text-secondary font-bold'}" label="Durée du séjour (Calculée automatiquement si vide)" name="duration">
                                <UInput placeholder="Ex: 8 Jours / 7 Nuits" v-model="offer.duration" class="w-full"/>
                            </UFormField>
                        </div>
                    </div>

                    <!-- Dynamic Rooms & Pricing Management (1 to 5 Places) -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                            <div>
                                <div class="font-bold text-lg text-secondary flex items-center gap-2">
                                    <UIcon name="i-heroicons-home-modern" class="text-primary w-5 h-5"/>
                                    Configuration des Chambres & Tarifs Dynamiques
                                </div>
                                <p class="text-sm text-gray-500">Ajoutez les types de chambres disponibles (1, 2, 3, 4, 5 places) avec tarifs adultes, enfants et bébés.</p>
                            </div>
                            
                            <!-- Quick Room Add Buttons -->
                            <div class="flex flex-wrap gap-2">
                                <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" label="1 Place (Simple)" @click="addPredefinedRoom(1)"/>
                                <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" label="2 Places (Double)" @click="addPredefinedRoom(2)"/>
                                <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" label="3 Places (Triple)" @click="addPredefinedRoom(3)"/>
                                <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" label="4 Places (Quadruple)" @click="addPredefinedRoom(4)"/>
                                <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" label="5 Places (Quintuple)" @click="addPredefinedRoom(5)"/>
                            </div>
                        </div>

                        <!-- Room Cards List -->
                        <div v-if="offer.rooms && offer.rooms.length > 0" class="space-y-4">
                            <div v-for="(room, index) in offer.rooms" :key="room.id || index" 
                                 class="p-5 bg-gray-50/70 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-none relative transition-all hover:border-primary/40">
                                
                                <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <UBadge color="primary" variant="solid" class="font-bold text-sm px-3 py-1">
                                            Chambre {{ room.capacity || room.type }} Place{{ (room.capacity > 1 || room.type > 1) ? 's' : '' }}
                                        </UBadge>
                                        <span class="font-bold text-secondary text-base">{{ room.name }}</span>
                                    </div>
                                    <UButton size="xs" color="error" variant="ghost" icon="i-heroicons-trash" label="Supprimer" @click="removeRoom(index)"/>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <UFormField :ui="{label:'text-xs font-bold text-gray-600'}" label="Nom d'affichage">
                                        <UInput size="sm" v-model="room.name" placeholder="Ex: Chambre Double Standard"/>
                                    </UFormField>

                                    <UFormField :ui="{label:'text-xs font-bold text-gray-600'}" label="Capacité (Places)">
                                        <UInput size="sm" type="number" min="1" max="10" v-model.number="room.capacity" @change="() => room.type = String(room.capacity)"/>
                                    </UFormField>

                                    <UFormField :ui="{label:'text-xs font-bold text-gray-600'}" label="Remarques / Options">
                                        <UInput size="sm" v-model="room.notes" placeholder="Ex: Vue sur mer / lit d'appoint"/>
                                    </UFormField>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-none mb-3">
                                    <UFormField :ui="{label:'text-xs font-bold text-primary'}" label="Prix d'achat (DZD)">
                                        <UInput size="sm" type="number" placeholder="0.00" v-model.number="room.purchase_price" @input="syncMinPrices"/>
                                    </UFormField>
                                    <UFormField :ui="{label:'text-xs font-bold text-primary'}" label="Prix Entreprise / B2B (DZD)">
                                        <UInput size="sm" type="number" placeholder="0.00" v-model.number="room.b2b_price" @input="syncMinPrices"/>
                                    </UFormField>
                                    <UFormField :ui="{label:'text-xs font-bold text-primary'}" label="Prix Client / B2C (DZD)">
                                        <UInput size="sm" type="number" placeholder="0.00" v-model.number="room.b2c_price" @input="syncMinPrices"/>
                                    </UFormField>
                                </div>

                                <!-- Children and Babies Pricing for this room -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-none mb-3">
                                    <UFormField :ui="{label:'text-xs font-medium text-amber-900 dark:text-amber-300'}" label="Max Bébés (0-2 ans)">
                                        <UInput size="sm" type="number" min="0" max="3" v-model.number="room.max_babies"/>
                                    </UFormField>
                                    <UFormField :ui="{label:'text-xs font-medium text-amber-900 dark:text-amber-300'}" label="Prix Bébé (DZD)">
                                        <UInput size="sm" type="number" min="0" placeholder="0.00" v-model.number="room.baby_price"/>
                                    </UFormField>
                                    <UFormField :ui="{label:'text-xs font-medium text-amber-900 dark:text-amber-300'}" label="Max Enfants (2-12 ans)">
                                        <UInput size="sm" type="number" min="0" max="5" v-model.number="room.max_children"/>
                                    </UFormField>
                                    <UFormField :ui="{label:'text-xs font-medium text-amber-900 dark:text-amber-300'}" label="Prix Enfant (DZD)">
                                        <UInput size="sm" type="number" min="0" placeholder="0.00" v-model.number="room.child_price"/>
                                    </UFormField>
                                </div>

                                <!-- Active Adult Places Selection - ONLY for 4 and 5 Places Rooms -->
                                <div v-if="Number(room.capacity || room.type) >= 4" class="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-none flex items-center justify-between gap-4">
                                    <div class="space-y-0.5">
                                        <div class="font-bold text-xs text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                                            <UIcon name="i-heroicons-user-group" class="w-4 h-4 text-primary" />
                                            Activer la sélection des places adultes (Réservation par place)
                                        </div>
                                        <p class="text-[11px] text-blue-800/80 dark:text-blue-300">
                                            Permet au client de choisir le nombre de places adultes (1 à {{ room.capacity || room.type }}). Si désactivé, le client doit obligatoirement réserver les {{ room.capacity || room.type }} places adultes de la chambre.
                                        </p>
                                    </div>
                                    <USwitch v-model="room.allow_custom_adults" />
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-none">
                            <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 text-gray-400 mx-auto mb-2"/>
                            <div class="text-secondary font-bold">Aucune chambre configurée</div>
                            <div class="text-xs text-gray-500 mb-4">Utilisez les boutons ci-dessus pour ajouter des chambres 1, 2, 3, 4 ou 5 places.</div>
                            <UButton size="sm" color="primary" icon="i-heroicons-plus" label="Ajouter la première chambre (Double - 2 places)" @click="addPredefinedRoom(2)"/>
                        </div>

                        <!-- Summary Base Prices (fallback / minimum) -->
                        <div class="pt-4 border-t border-gray-100 dark:border-slate-800">
                            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Prix de base affichés (Calculés automatiquement depuis le minimum des chambres)</div>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <UFormField :ui="{label:'text-secondary font-bold'}" label="Prix d'achat de base" name="purchase_price">
                                    <UInput placeholder="0.00" v-model="offer.purchase_price" class="w-full"/>
                                </UFormField>
                                <UFormField :ui="{label:'text-secondary font-bold'}" label="Prix entreprise de base" name="business_price">
                                    <UInput placeholder="0.00" v-model="offer.b2b_price" class="w-full"/>
                                </UFormField>
                                <UFormField :ui="{label:'text-secondary font-bold'}" label="Prix individuel de base" name="individual_price">
                                    <UInput placeholder="0.00" v-model="offer.b2c_price" class="w-full"/>
                                </UFormField>
                            </div>
                        </div>
                    </div>

                    <!-- Required Documents Card -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div class="font-bold text-lg text-secondary border-b pb-2 flex items-center gap-2">
                            <UIcon name="i-heroicons-document-check" class="text-primary w-5 h-5"/>
                            Documents Requis par Voyageur
                        </div>

                        <div class="flex flex-col gap-4">
                            <div class="flex gap-3">
                                <UInput placeholder="Ex: Passeport biométrique, Autorisation parentale..." v-model="newDocument" class="flex-1" @keyup.enter="addDocument"/>
                                <UButton color="primary" class="font-bold" icon="i-lucide-plus" label="Ajouter Document" @click="addDocument"/>
                            </div>

                            <div class="flex flex-wrap gap-2 pt-2">
                                <div v-for="(doc, index) in offer.documents" :key="index" class="flex items-center gap-2 bg-secondary/10 dark:bg-slate-800 border border-secondary/20 py-1.5 px-3 rounded-none text-secondary dark:text-white font-medium text-sm">
                                    <span>{{ doc }}</span>
                                    <UIcon @click="removeDocument(index)" name="i-material-symbols-close" class="cursor-pointer hover:text-error"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Action Button -->
                    <div class="flex justify-end gap-4">
                        <UButton variant="soft" color="gray" label="Annuler" @click="open = false" :disabled="loading"/>
                        <UButton @click="()=>{
                            if(action === 'Modifier'){
                                updateOffer(offer.id)
                            }else{
                                addOffer()
                            }
                        }" :loading="loading" loading-icon="i-lucide-loader-circle" :label="action === 'Modifier' ? 'Enregistrer les modifications' : 'Créer le Voyage Organisé'" size="lg" class="font-bold px-8 shadow-md" color="primary"/>
                    </div>
                </div>
            </template>
        </USlideover>
  </div>
</template>

<script setup>
import { h, resolveComponent, ref, watch, onMounted } from 'vue'
import { refDebounced } from '#imports'
import { UIcon } from '#components'
import { uploadToCloudinary } from '~/composables/useCloudinaryUpload'

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

definePageMeta({
    layout:"admin",
})

const open = ref(false)
const loading = ref(false)
const action = ref('Ajouter')

const offer = ref({
    id:null,
    country_id:null,
    provider_id:null,
    offer_name:null,
    dates: [{ departure_date: '', return_date: '' }],
    is_national: false,
    duration:null,
    available:true,
    guarantee:null,
    purchase_price:null,
    b2b_price:null,
    b2c_price:null,
    image:null,
    rooms:[],
    documents:[],
})

const imageFile = ref(null)
const previewImage = ref(null)

const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
        previewImage.value = URL.createObjectURL(file)
        imageFile.value = file
    }
}

const removeImage = () => {
    imageFile.value = null
    previewImage.value = null
    offer.value.image = null
}

const guaranteeTypes = ref([
    { label:"Avec garantie de retour", value:"with" },
    { label:"Demi garantie", value:"half" },
    { label:"Sans garantie", value:"without" }
])
const newDocument = ref(null)

const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'name',
        header: 'Voyage Organisé',
        cell:({row})=>{
            const offerImg = row.original.image || row.original.country?.flag
            return h('div',{class:'flex items-center gap-3'},[
                h(UAvatar,{
                    src: offerImg,
                    size: 'xl',
                }),
                h('div',{},[
                    h('div',{class:'font-bold text-base'},row.original.name),
                    h('div',{class:'text-xs text-gray-500'}, row.original.country?.name || '')
                ])
            ])
        }
    },
    {
        accessorKey: 'departure_date',
        header: 'Dates',
        cell:({row})=>{
            const dep = row.original.departure_date;
            const ret = row.original.return_date;
            if (dep) {
                return h('div', {class: 'text-xs flex flex-col gap-0.5'}, [
                    h('span', {class: 'font-semibold text-secondary'}, `Départ: ${dep}`),
                    ret ? h('span', {class: 'text-gray-500'}, `Retour: ${ret}`) : null
                ]);
            }
            return h('span', {class: 'text-xs text-gray-400'}, row.original.duration || '-');
        }
    },
    {
        accessorKey: 'rooms_count',
        header: 'Chambres',
        cell:({row})=>{
            const rooms = row.original.rooms || [];
            if (rooms.length > 0) {
                return h(UBadge, {class:'font-bold', variant:'soft', color:'primary'}, `${rooms.length} type(s)`);
            }
            return h('span', {class: 'text-xs text-gray-400'}, 'Standard');
        }
    },
    {
        accessorKey: 'guarantee',
        header: 'Garantie',
        cell:({row})=>{
            const color = {
                with: 'success',
                without: 'error',
                half:'warning'
            }[row.getValue('guarantee')]
            const guaranteeType = {
                with: 'Totale',
                without: 'Sans',
                half:'Demi'
            }[row.getValue('guarantee')]
            return h(UBadge,{ class: 'capitalize font-bold', variant: 'soft', color }, guaranteeType)
        }
    },
    {
        accessorKey: 'business_price',
        header: "Prix B2B (Min)",
        cell:({row})=>{
            return h('span', {class: 'font-bold text-primary'}, `${row.original.business_price || row.original.purchase_price || 0} DZD`)
        }
    },
    {
        accessorKey: 'available',
        header: 'Disponibilité',
        cell:({row})=>{
            const isAvailable = row.original.available
            return h(UBadge,{ 
                class: 'capitalize font-bold', 
                variant: 'soft', 
                color: isAvailable ? 'success' : 'error' 
            }, isAvailable ? 'Disponible' : 'Non disponible')
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'flex gap-3 items-center' },
                h(
                    UIcon,
                    {
                        name:"i-material-symbols-edit-square-outline-rounded",
                        size:"20",
                        class:"cursor-pointer text-primary hover:text-primary/70 transition-colors",
                        onClick:()=>{getOffer(row.original.id)}
                    },
                ),
            )
        }
    }, 
]

const pagination = ref({
  pageIndex:undefined,
  pageSize:undefined,
  totalItems:undefined,
  totalPages:undefined
})
const data = ref([])
const countries = ref([])
const country = ref({})
const providers = ref([])
const provider = ref({})

const search = ref('')
const searchDebounce = refDebounced(search,200)
const searchCountry = ref('')
const searchProvider = ref('')

onMounted(()=>{
    getOffers(1);
    getCountries()
    getProviders()
})

const openForm = ()=>{
    action.value = "Ajouter"
    open.value = true
    imageFile.value = null
    previewImage.value = null
    offer.value = {
        id:null,
        country_id: country.value?.value || null,
        provider_id: provider.value?.value || null,
        offer_name:'',
        dates: [{ departure_date: '', return_date: '' }],
        is_national: false,
        duration:'',
        available:true,
        guarantee:'with',
        purchase_price: null,
        b2b_price: null,
        b2c_price: null,
        image: null,
        rooms:[
            createDefaultRoom(2, "Chambre Double (غرفة ثنائية)")
        ],
        documents:[
            "Passeport biométrique",
            "Photo d'identité sur fond blanc",
            "Certificat de vaccination"
        ],
    }
}

const createDefaultRoom = (capacity, name) => {
    const cap = Number(capacity);
    return {
        id: "room_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
        type: String(cap),
        name: name,
        capacity: cap,
        allow_custom_adults: cap >= 4,
        purchase_price: 130000,
        b2b_price: 145000,
        b2c_price: 160000,
        max_babies: 1,
        baby_price: 30000,
        max_children: 2,
        child_price: 85000,
        notes: ''
    }
}

const addPredefinedRoom = (capacity) => {
    if (!offer.value.rooms) {
        offer.value.rooms = []
    }
    const names = {
        1: "Chambre Simple / Individuelle (غرفة أحادية)",
        2: "Chambre Double (غرفة ثنائية)",
        3: "Chambre Triple (غرفة ثلاثية)",
        4: "Chambre Quadruple (غرفة رباعية)",
        5: "Chambre Quintuple (غرفة خماسية)"
    }
    const roomName = names[capacity] || `Chambre ${capacity} Places`
    offer.value.rooms.push(createDefaultRoom(capacity, roomName))
    syncMinPrices()
}

const removeRoom = (index) => {
    offer.value.rooms.splice(index, 1)
    syncMinPrices()
}

const syncMinPrices = () => {
    if (offer.value.rooms && offer.value.rooms.length > 0) {
        const purchases = offer.value.rooms.map(r => Number(r.purchase_price) || 0).filter(p => p > 0)
        const b2bs = offer.value.rooms.map(r => Number(r.b2b_price) || 0).filter(p => p > 0)
        const b2cs = offer.value.rooms.map(r => Number(r.b2c_price) || 0).filter(p => p > 0)
        
        if (purchases.length) offer.value.purchase_price = Math.min(...purchases)
        if (b2bs.length) offer.value.b2b_price = Math.min(...b2bs)
        if (b2cs.length) offer.value.b2c_price = Math.min(...b2cs)
    }
}

const addDatePair = () => {
    if (!offer.value.dates) offer.value.dates = []
    offer.value.dates.push({ departure_date: '', return_date: '' })
}
const removeDatePair = (index) => {
    offer.value.dates.splice(index, 1)
}

const autoCalculateDuration = (index = 0) => {
    if (offer.value.dates && offer.value.dates[index]) {
        const d = offer.value.dates[index]
        if (d.departure_date && d.return_date) {
            const d1 = new Date(d.departure_date);
            const d2 = new Date(d.return_date);
            const diffTime = d2 - d1;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                offer.value.duration = `${diffDays} Jours / ${diffDays - 1} Nuits`;
            }
        }
    }
}

const addDocument = ()=>{
    if(newDocument.value && newDocument.value.trim()){
        if (!offer.value.documents) offer.value.documents = []
        offer.value.documents.push(newDocument.value.trim())
        newDocument.value = null
    }
}

const removeDocument = (index)=>{
    offer.value.documents.splice(index,1)
}

const getCountries = async ()=>{
    sendApi(`/admin/countries?per_page=100&is_voyage_organise=1&search=${searchCountry.value}`,null,'GET').then(response=>{
        countries.value = []
        response.data.data.forEach(c=>{
            countries.value.push({
                label: c.country, 
                value: c.id, 
                avatar: { src: c.flag }
            })
        })
    })
}

const getProviders = async ()=>{
    sendApi(`/admin/providers?per_page=100&search=${searchProvider.value}`,null,'GET').then(response=>{
        providers.value = []
        response.data.forEach(p=>{
            providers.value.push({
                label: p.name, 
                value: p.id, 
            })
        })
    })
}

const getOffers = async (page=1)=>{
    loading.value = true
    sendApi(`/admin/voyage_organise/offers?page=${page}&per_page=10&search=${search.value}`,null,'GET').then(response=>{
        data.value = response.data.data
        pagination.value = {
            pageIndex: response.pagination.current_page - 1,
            pageSize: response.pagination.per_page,
            totalItems: response.pagination.total_items,
            totalPages: response.pagination.total_pages
        }
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

const getOffer = async (id)=>{
    action.value = "Modifier"
    open.value = true
    loading.value = true
    imageFile.value = null
    previewImage.value = null
    sendApi(`/admin/voyage_organise/offers/${id}`,null,'GET').then(response=>{
        const res = response.data
        offer.value = {
            id: res.id,
            country_id: res.country?.id,
            provider_id: res.provider?.value || res.provider?.id,
            offer_name: res.name,
            dates: (res.dates && res.dates.length > 0) ? res.dates : [{ departure_date: res.departure_date || '', return_date: res.return_date || '' }],
            is_national: Boolean(res.is_national),
            duration: res.duration,
            available: Boolean(res.available),
            guarantee: res.guarantee,
            purchase_price: res.purchase_price,
            b2b_price: res.business_price,
            b2c_price: res.individual_price,
            image: res.image || null,
            rooms: res.rooms && Array.isArray(res.rooms) ? res.rooms : [],
            documents: (res.documents || []).map(doc => doc.name || doc)
        }

        country.value = {
            label: res.country?.name, 
            value: res.country?.id, 
            avatar: { src: res.country?.flag }
        }
        
        provider.value = res.provider || {}
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

const getSelectedId = (val) => {
    if (val === null || val === undefined) return null
    if (typeof val === 'object') return val.value || val.id || null
    return val
}

const buildOfferPayload = (imageUrl) => {
    const fd = new FormData()
    const countryId = getSelectedId(offer.value.country_id) || getSelectedId(country.value)
    if (countryId) fd.append('country_id', countryId)

    const providerId = getSelectedId(offer.value.provider_id) || getSelectedId(provider.value)
    if (providerId) fd.append('provider_id', providerId)

    if (offer.value.offer_name) fd.append('offer_name', offer.value.offer_name)
    if (offer.value.guarantee) fd.append('guarantee', offer.value.guarantee)
    if (offer.value.duration) fd.append('duration', offer.value.duration)
    if (offer.value.dates && offer.value.dates.length > 0) {
        offer.value.dates.forEach((d, i) => {
            if (d.departure_date) fd.append(`dates[${i}][departure_date]`, d.departure_date)
            if (d.return_date) fd.append(`dates[${i}][return_date]`, d.return_date)
        })
    }
    
    // Ensure the main fields are set to something valid for validation
    if (offer.value.dates && offer.value.dates[0]) {
        if (offer.value.dates[0].departure_date) fd.append('departure_date', offer.value.dates[0].departure_date)
        if (offer.value.dates[0].return_date) fd.append('return_date', offer.value.dates[0].return_date)
    }

    fd.append('is_national', offer.value.is_national ? '1' : '0')
    fd.append('available', offer.value.available ? '1' : '0')
    if (offer.value.purchase_price !== null && offer.value.purchase_price !== undefined && offer.value.purchase_price !== '') fd.append('purchase_price', offer.value.purchase_price)
    if (offer.value.b2b_price !== null && offer.value.b2b_price !== undefined && offer.value.b2b_price !== '') fd.append('b2b_price', offer.value.b2b_price)
    if (offer.value.b2c_price !== null && offer.value.b2c_price !== undefined && offer.value.b2c_price !== '') fd.append('b2c_price', offer.value.b2c_price)

    // Image is now always a URL string (from Cloudinary or existing)
    if (imageUrl) {
        fd.append('image', imageUrl)
    } else if (offer.value.image) {
        fd.append('image', offer.value.image)
    }

    (offer.value.rooms || []).forEach((room, index) => {
        Object.keys(room).forEach(key => {
            const val = room[key]
            if (val !== undefined && val !== null) {
                fd.append(`rooms[${index}][${key}]`, typeof val === 'boolean' ? (val ? '1' : '0') : val)
            }
        })
    })

    ;(offer.value.documents || []).forEach((doc, index) => {
        fd.append(`documents[${index}]`, doc)
    })

    return fd
}

/**
 * Upload image to Cloudinary first (if a new file was selected),
 * then send the offer data with the image URL to the backend.
 */
const resolveImageUrl = async () => {
    if (!imageFile.value) return offer.value.image || null

    const toast = useToast()
    toast.add({ title: "Téléchargement de l'image en cours...", color: 'blue', progress: false, close: true, ui: { root: '!bg-blue-600 !text-white', title: 'text-white font-medium', close: 'text-white' } })

    const url = await uploadToCloudinary(imageFile.value, 'voyages_organises')
    if (!url) {
        toast.add({ title: "Échec du téléchargement de l'image. Veuillez réessayer.", color: 'red', progress: false, close: true, ui: { root: '!bg-rose-600 !text-white', title: 'text-white font-medium', close: 'text-white' } })
        return null
    }
    return url
}

const addOffer = async () => {
    loading.value = true
    syncMinPrices()
    try {
        const imageUrl = await resolveImageUrl()
        if (imageFile.value && !imageUrl) { loading.value = false; return }

        const payload = buildOfferPayload(imageUrl)
        const response = await sendApi('/admin/voyage_organise/offers/add', payload, 'POST')
        if (response && (response.success || response.status === 'success' || response.message)) {
            await getOffers()
            open.value = false
        }
    } catch (err) {
        console.error('Error creating Voyage Organisé offer:', err)
    } finally {
        loading.value = false
    }
}

const updateOffer = async (id) => {
    loading.value = true
    syncMinPrices()
    try {
        const imageUrl = await resolveImageUrl()
        if (imageFile.value && !imageUrl) { loading.value = false; return }

        const payload = buildOfferPayload(imageUrl)
        const response = await sendApi(`/admin/voyage_organise/offers/${id}/update`, payload, 'POST')
        if (response && (response.success || response.status === 'success' || response.message)) {
            await getOffers(pagination.value.pageIndex + 1)
            open.value = false
        }
    } catch (err) {
        console.error('Error updating Voyage Organisé offer:', err)
    } finally {
        loading.value = false
    }
}

const onPageChange = async (page)=>{
    await getOffers(page)
}

watch(searchCountry, ()=>{
    getCountries()
})

watch(() => offer.value.country_id, (newVal) => {
    // Auto-detect National if country is Algeria
    const selected = countries.value.find(c => c.value === newVal || c.id === newVal)
    if (selected && selected.label && selected.label.toLowerCase().includes('alg')) {
        offer.value.is_national = true
    } else {
        offer.value.is_national = false
    }
})
watch(searchProvider, ()=>{
    getProviders()
})
</script>

<style scoped>
</style>
