<template>
    <div class="w-full flex flex-col gap-5 min-h-[calc(100vh-80px)] py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-6 md:px-12">
            <div v-for="(offer, index) in offers" :key="index">
                <UCard :ui="{
                    base: 'group overflow-hidden rounded-none border border-gray-100 dark:border-slate-800 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-white dark:bg-slate-900',
                    header: { padding: 'p-0 sm:p-0' },
                    body: { padding: 'p-5 sm:p-5' },
                    footer: { padding: 'px-5 py-4 sm:px-5 sm:py-4 bg-gray-50/50 dark:bg-slate-800/50' }
                }">
                    <template #header>
                        <div class="relative overflow-hidden aspect-[4/3]">
                            <img :src="offer?.country_flag" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
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
                            
                            <!-- Rooms List -->
                            <div v-if="offer?.rooms && offer.rooms.length > 0" class="pt-2 border-t border-gray-100 dark:border-slate-800">
                                <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <UIcon name="i-heroicons-home-modern" class="w-3.5 h-3.5 text-primary"/>
                                    Chambres disponibles :
                                </div>
                                <ul class="space-y-1.5">
                                    <li v-for="(rm, rIdx) in offer.rooms.slice(0, 3)" :key="rIdx" class="text-xs bg-gray-50/80 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-none flex items-center justify-between border border-gray-100 dark:border-slate-700/60">
                                        <span class="font-medium text-secondary dark:text-gray-200 truncate pr-2 flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                            <span class="truncate">{{ rm.name || `${rm.capacity || rm.type} Places` }}</span>
                                        </span>
                                        <span class="font-bold text-primary flex-shrink-0 text-[11px]">
                                            {{ (rm.b2c_price || rm.purchase_price) ? `${Number(rm.b2c_price || rm.purchase_price).toLocaleString('fr-FR')} DZD` : '' }}
                                        </span>
                                    </li>
                                    <li v-if="offer.rooms.length > 3" class="text-[11px] text-gray-400 italic pl-1">
                                        + {{ offer.rooms.length - 3 }} autre(s) chambre(s)
                                    </li>
                                </ul>
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
                            <UButton block class="font-bold rounded-none shadow-md hover:shadow-lg transition-all" size="lg" color="primary" label="Voir les détails" @click="openForm(offer?.id)">
                                <template #trailing>
                                    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </template>
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>
        <div class="w-full flex justify-center">
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
import { useAuthStore } from '#imports'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const authorization = authStore.Authorization
const {id} = useRoute().params
const offers = ref([])

const overlay = useOverlay()

const openForm = async(id)=> {
    const form = overlay.create(OrderForm, {
        props:{
            id:id,
            service: 'voyage_organise'
        },
    })
    const instance = form.open()
}

const pagination = ref({
  pageIndex: undefined,
  pageSize: undefined,
  totalItems:undefined,
  totalPages:undefined
})

onMounted(()=>{
    getOffers()
})

const truncate= (string, value)=>{
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
    const url = authorization?.token ? '/client/voyage_organise':'/voyage_organise'
    sendApi(`${url}/${id}/offers?page=${page}&per_page=12`,null,'GET').then(response=>{
        offers.value = response.data.data
        pagination.value = {
            pageIndex:response.pagination.current_page - 1,
            pageSize:response.pagination.per_page,
            totalItems:response.pagination.total_items,
            totalPages:response.pagination.total_pages
        }
    })
}

const onPageChange = async (page)=>{
    await getOffers(page)
}
</script>

<style lang="scss" scoped>
</style>
