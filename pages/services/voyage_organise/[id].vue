<template>
    <div class="w-full flex flex-col gap-6 min-h-[calc(100vh-80px)] py-8 pb-16 bg-gray-50/50 dark:bg-slate-950">
        <!-- Filter & Sorting Bar -->
        <div class="w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
            <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
                <!-- Search & Filters Row -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <!-- Search by name/keywords -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-primary" />
                            Rechercher
                        </label>
                        <UInput 
                            v-model="search" 
                            placeholder="Rechercher une offre..." 
                            icon="i-heroicons-magnifying-glass" 
                            size="md"
                            class="w-full"
                        />
                    </div>

                    <!-- Filter by Start Date -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-primary" />
                            À partir du
                        </label>
                        <UInput 
                            type="date" 
                            v-model="startDate" 
                            size="md"
                            class="w-full"
                        />
                    </div>

                    <!-- Filter by End Date -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-primary" />
                            Jusqu'au
                        </label>
                        <UInput 
                            type="date" 
                            v-model="endDate" 
                            size="md"
                            class="w-full"
                        />
                    </div>

                    <!-- Sort Order Dropdown -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <UIcon name="i-heroicons-arrows-up-down" class="w-4 h-4 text-primary" />
                            Trier par
                        </label>
                        <USelect 
                            v-model="sortBy" 
                            :items="sortOptions" 
                            size="md"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Active Filters & Reset Row -->
                <div v-if="hasActiveFilters" class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-gray-500 font-medium">Filtres actifs :</span>
                        <UBadge v-if="search" color="primary" variant="subtle" class="gap-1">
                            Mot-clé: "{{ search }}"
                            <UIcon name="i-material-symbols-close" class="w-3.5 h-3.5 cursor-pointer" @click="search = ''" />
                        </UBadge>
                        <UBadge v-if="startDate" color="primary" variant="subtle" class="gap-1">
                            Dès le: {{ startDate }}
                            <UIcon name="i-material-symbols-close" class="w-3.5 h-3.5 cursor-pointer" @click="startDate = ''" />
                        </UBadge>
                        <UBadge v-if="endDate" color="primary" variant="subtle" class="gap-1">
                            Jusqu'au: {{ endDate }}
                            <UIcon name="i-material-symbols-close" class="w-3.5 h-3.5 cursor-pointer" @click="endDate = ''" />
                        </UBadge>
                        <UBadge v-if="sortBy !== 'departure_date_asc'" color="gray" variant="subtle" class="gap-1">
                            Tri: {{ currentSortLabel }}
                            <UIcon name="i-material-symbols-close" class="w-3.5 h-3.5 cursor-pointer" @click="sortBy = 'departure_date_asc'" />
                        </UBadge>
                    </div>
                    <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Réinitialiser les filtres" @click="resetFilters" />
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="w-full flex justify-center items-center py-20">
            <div class="flex flex-col items-center gap-3">
                <UIcon name="i-lucide-loader-circle" class="w-10 h-10 text-primary animate-spin" />
                <span class="text-sm text-gray-500">Chargement des offres...</span>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="offers.length === 0" class="w-full max-w-md mx-auto py-16 text-center flex flex-col items-center gap-4 px-4">
            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                <UIcon name="i-heroicons-calendar-days" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-bold text-secondary dark:text-white">Aucune offre disponible</h3>
            <p class="text-sm text-gray-500">Aucune offre ne correspond à vos critères.</p>
            <UButton v-if="hasActiveFilters" color="primary" variant="outline" label="Réinitialiser les filtres" @click="resetFilters" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto">
            <div v-for="(offer, index) in offers" :key="index">
                <UCard :ui="{
                    base: 'group overflow-hidden rounded-none border border-gray-100 dark:border-slate-800 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-white dark:bg-slate-900 flex flex-col h-full',
                    header: { padding: 'p-0 sm:p-0' },
                    body: { padding: 'p-5 sm:p-5 flex-1' },
                    footer: { padding: 'px-5 py-4 sm:px-5 sm:py-4 bg-gray-50/50 dark:bg-slate-800/50' }
                }">
                    <template #header>
                        <div class="relative overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-slate-800">
                            <img :src="offer?.image || offer?.country_flag" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt="Offre Voyage"/>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <!-- Badges in Image -->
                            <div class="absolute top-3 left-3 flex flex-col gap-1">
                                <UBadge v-if="offer?.departure_date" color="primary" variant="solid" class="font-bold text-xs shadow-md">
                                    <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 mr-1" />
                                    Départ: {{ offer.departure_date }}
                                </UBadge>
                            </div>
                        </div>
                    </template>
                    <template #default>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-xl font-bold text-secondary dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors" :title="offer?.name">{{ truncate(offer?.name ,50) }}</h3>
                            <div class="flex items-center gap-2 text-gray-500 text-sm">
                                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary" />
                                <span>{{ truncate(offer?.duration || 'Séjour complet', 30) }}</span>
                            </div>

                            <!-- Multi-dates selection chips -->
                            <div v-if="offer?.dates && offer.dates.length > 0" class="flex flex-col gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800">
                                <div class="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                                    <span class="flex items-center gap-1">
                                        <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5 text-primary" />
                                        Dates de départ :
                                    </span>
                                    <span class="text-[10px] text-primary font-semibold">{{ offer.dates.length }} option{{ offer.dates.length > 1 ? 's' : '' }}</span>
                                </div>
                                <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                                    <button 
                                        type="button"
                                        v-for="(dateEntry, dIdx) in offer.dates" 
                                        :key="dIdx"
                                        @click.stop="selectedDates[offer.id] = dateEntry.departure_date"
                                        :class="[
                                            'px-2 py-1 text-xs font-bold rounded-none border transition-all cursor-pointer flex items-center gap-1',
                                            (selectedDates[offer.id] || (offer.dates[0] && offer.dates[0].departure_date)) === dateEntry.departure_date
                                                ? 'bg-primary text-white border-primary shadow-xs'
                                                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-primary/50'
                                        ]"
                                    >
                                        <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                                        {{ dateEntry.departure_date }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col-reverse xl:flex-row justify-between items-start xl:items-center gap-3">
                                <UBadge class="w-fit shadow-sm" variant="subtle" :color="guaranteeColor(offer?.guarantee)">
                                    <div class="font-bold flex items-center gap-1">
                                        <UIcon name="i-heroicons-shield-check" class="w-4 h-4" v-if="offer?.guarantee !== 'without'" />
                                        {{ guaranteeValue(offer?.guarantee) }}
                                    </div>
                                </UBadge>
                                <div class="text-primary font-bold text-xl flex items-baseline gap-1">
                                    <span class="text-xs text-gray-400 font-normal">À partir de</span>
                                    {{ offer?.price }} <span class="text-xs text-gray-500 font-medium">DZD</span>
                                </div>
                            </div>
                            <UButton block class="font-bold rounded-none shadow-md hover:shadow-lg transition-all cursor-pointer" size="lg" color="primary" label="Voir les détails" @click="openForm(offer)">
                                <template #trailing>
                                    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </template>
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>
        <div class="w-full flex justify-center" v-if="pagination.totalItems > pagination.pageSize">
            <UPagination
            :default-page="(pagination.pageIndex || 0) + 1"
            :items-per-page="pagination.pageSize"
            :total="pagination.totalItems"
            @update:page="onPageChange"
            />
        </div>
    </div>
</template>

<script setup>
import OrderForm from '~/components/modals/OrderForm.vue'
import { useAuthStore, refDebounced } from '#imports'
import { ref, computed, watch, onMounted } from 'vue'

const authStore = useAuthStore()
const authorization = authStore.Authorization
const {id} = useRoute().params
const offers = ref([])
const loading = ref(false)
const selectedDates = ref({})

// Filter & Sort State
const search = ref('')
const searchDebounce = refDebounced(search, 300)
const startDate = ref('')
const endDate = ref('')
const sortBy = ref('departure_date_asc')

const sortOptions = [
    { label: 'Date de départ (Croissant - Plus proche)', value: 'departure_date_asc' },
    { label: 'Date de départ (Décroissant - Plus lointain)', value: 'departure_date_desc' },
    { label: 'Nouveautés (Derniers ajouts)', value: 'newest' },
    { label: 'Prix croissant (Moins cher)', value: 'price_asc' },
    { label: 'Prix décroissant (Plus cher)', value: 'price_desc' }
]

const currentSortLabel = computed(() => {
    return sortOptions.find(o => o.value === sortBy.value)?.label || sortBy.value
})

const hasActiveFilters = computed(() => {
    return Boolean(search.value || startDate.value || endDate.value || sortBy.value !== 'departure_date_asc')
})

const resetFilters = () => {
    search.value = ''
    startDate.value = ''
    endDate.value = ''
    sortBy.value = 'departure_date_asc'
}

const overlay = useOverlay()

const openForm = async(offer)=> {
    // If client hasn't clicked a date explicitly, use the first available one as fallback
    let fallbackDate = null;
    if (offer.dates && offer.dates.length > 0) {
        fallbackDate = offer.dates[0].departure_date;
    } else {
        fallbackDate = offer.departure_date;
    }
    const chosenDate = selectedDates.value[offer.id] || fallbackDate;

    const form = overlay.create(OrderForm, {
        props:{
            id: offer.id,
            service: 'voyage_organise',
            selectedDate: chosenDate
        },
    })
    const instance = form.open()
}

const pagination = ref({
  pageIndex: 0,
  pageSize: 12,
  totalItems: 0,
  totalPages: 1
})

onMounted(()=>{
    getOffers(1)
})

watch([searchDebounce, startDate, endDate, sortBy], () => {
    getOffers(1)
})

const truncate = (string, value)=>{
    if(!string) return ''
    if(string.length > value){
        return string.substring(0, value) + '…';
    }else{
        return string
    }
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

const getOffers = async(page=1)=>{
    loading.value = true
    const url = authorization?.token ? '/client/voyage_organise':'/voyage_organise'
    let query = `${url}/${id}/offers?page=${page}&per_page=12`

    if (searchDebounce.value && searchDebounce.value.trim()) {
        query += `&search=${encodeURIComponent(searchDebounce.value.trim())}`
    }
    if (startDate.value) {
        query += `&start_date=${encodeURIComponent(startDate.value)}`
    }
    if (endDate.value) {
        query += `&end_date=${encodeURIComponent(endDate.value)}`
    }
    if (sortBy.value) {
        query += `&sort_by=${encodeURIComponent(sortBy.value)}`
    }

    sendApi(query, null, 'GET').then(response=>{
        offers.value = response.data?.data || []
        pagination.value = {
            pageIndex: (response.pagination?.current_page || 1) - 1,
            pageSize: response.pagination?.per_page || 12,
            totalItems: response.pagination?.total_items || 0,
            totalPages: response.pagination?.total_pages || 1
        }
        loading.value = false
    }).catch(() => {
        offers.value = []
        loading.value = false
    })
}

const onPageChange = async (page)=>{
    await getOffers(page)
}
</script>

<style lang="scss" scoped>
</style>
