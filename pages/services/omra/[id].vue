<template>
    <div class="w-full flex flex-col gap-5 min-h-[calc(100vh-80px)] py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full px-12">
            <div v-for="(offer, index) in offers" :key="index">
                <UCard>
                    <template #header>
                        <div class="">
                            <img :src="getFullImageUrl(offer?.country_flag)" class="object-cover"/>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-col gap-2 font-bold">
                                <div class="">{{ truncate(offer?.name ,25)}}</div>
                                <div class="font-normal">{{ truncate(offer?.duration,25) }}</div>
                                <div class="flex flex-col-reverse gap-2 md:flex-row justify-between">
                                    <UBadge class="w-fit" variant="subtle" :color="guaranteeColor(offer?.guarantee)">
                                        <div class="font-bold">{{ guaranteeValue(offer?.guarantee) }}</div>
                                    </UBadge>
                                    <div class="text-primary">
                                        {{ offer?.price }} DZD
                                    </div>
                                </div>
                            </div>
                            <UButton class="font-bold w-fit" label="Voir plus" @click="openForm(offer?.id)"/>
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
            service: 'omra'
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
    const url = authorization?.token ? '/client/omra':'/omra'
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
