<template>
    <div class="w-full flex flex-col gap-5 min-h-[calc(100vh-80px)] py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full px-12">
            <div v-for="(offer, index) in offers" :key="index">
                <UCard :ui="{
                    base: 'group overflow-hidden rounded-none border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1',
                    header: { padding: 'p-0 sm:p-0' },
                    body: { padding: 'p-5 sm:p-5' },
                    footer: { padding: 'px-5 py-4 sm:px-5 sm:py-4 bg-gray-50/50' }
                }">
                    <template #header>
                        <div class="relative overflow-hidden aspect-[4/3]">
                            <img :src="getFullImageUrl(offer?.country_flag)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </template>
                    <template #default>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-xl font-bold text-secondary line-clamp-2 leading-tight group-hover:text-primary transition-colors" :title="offer?.name">{{ truncate(offer?.name ,50) }}</h3>
                            <div class="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                <Icon name="i-heroicons-clock" class="w-4 h-4" />
                                <span>{{ truncate(offer?.duration, 30) }}</span>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col-reverse xl:flex-row justify-between items-start xl:items-center gap-3">
                                <UBadge class="w-fit shadow-sm" variant="subtle" :color="guaranteeColor(offer?.guarantee)">
                                    <div class="font-bold flex items-center gap-1">
                                        <Icon name="i-heroicons-shield-check" class="w-4 h-4" v-if="offer?.guarantee !== 'without'" />
                                        {{ guaranteeValue(offer?.guarantee) }}
                                    </div>
                                </UBadge>
                                <div class="text-primary font-bold text-xl flex items-baseline gap-1">
                                    {{ offer?.price }} <span class="text-sm text-gray-500 font-medium">DZD</span>
                                </div>
                            </div>
                            <UButton block class="font-bold rounded-none shadow-md hover:shadow-lg transition-all" size="lg" color="primary" label="Voir les détails" @click="openForm(offer?.id)">
                                <template #trailing>
                                    <Icon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

const authStore = useAuthStore()
const authorization = authStore.Authorization
console.log(useRoute())
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

const getFullImageUrl = (url) => {
    if (!url) return ''
    try {
        const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/api$/, '')
        const urlObj = new URL(url)
        return `${baseUrl}${urlObj.pathname}`
    } catch (e) {
        return url
    }
}


onMounted(()=>{
    getOffers()
})
const truncate= (string, value)=>{
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

const getOffers = async(page=1)=>{
    const url = authorization?.token ? '/client/voyage_organise':'/voyage_organise'
    sendApi(`${url}/${id}/offers?page=${page}&per_page=12`,null,'GET').then(response=>{
        console.log(response)
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
