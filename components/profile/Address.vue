<template>
    <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-5">
            <div class="grid min-[640px]:grid-cols-2 grid-cols-1 gap-5">
                <UFormField :ui="{label:'text-secondary'}" label="Wilaya" name="wilaya_id">
                    <USelectMenu placeholder="Wilaya" @change="changeWilaya" v-model:search-term="searchWilaya" v-model="wilaya" :items="wilayas" class="lg:w-100 md:w-80 w-60" />
                </UFormField>
        
                <UFormField :ui="{label:'text-secondary'}" label="Daira" name="country_id">
                    <USelectMenu placeholder="Daira" @change="()=>address.daira_id = daira.value" v-model:search-term="searchDaira" v-model="daira" :items="dairas" class="lg:w-100 md:w-80 w-60" />
                </UFormField>
        
                <UFormField label="Adresse">
                    <UInput
                        v-model="address.address"
                        placeholder="Adresse"
                        class="lg:w-100 md:w-80 w-60"
                    />
                </UFormField>
        
                <UFormField label="Code postal">
                    <UInput
                        v-model="address.postal_code"
                        placeholder="Code postal"
                        class="lg:w-100 md:w-80 w-60"
                    />
                </UFormField>
        
            </div>
            <div class="flex gap-2">
                <UButton class="font-bold" @click="save" label="Sauvegarder"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { UBadge, UIcon } from '#components'

const address = ref({
    address:null,
    postal_code:null,
    wilaya_id:null,
    daira_id:null
})
const wilayas = ref([])
const dairas = ref([])

const wilaya = ref(null)
const daira = ref(null)

const searchWilaya = ref('')
const searchDaira = ref('')

onMounted(()=>{
    getAddress()
})

const changeWilaya = ()=>{
    address.value.wilaya_id = wilaya.value?.value
    getDaira(wilaya.value?.value) 
}

const getWilaya = async()=>{
    wilayas.value = []
    sendApi(`/wilaya?search=${searchWilaya.value}`,null,'GET').then(response=>{
        console.log(response)
        response.data.forEach(wilaya=>{
            wilayas.value.push({
                label:wilaya.name,
                value:wilaya.id
            })
        })
    })
}

const getDaira = async(id)=>{
    dairas.value = []
    sendApi(`/wilaya/${id}/daira?search=${searchDaira.value}`,null,'GET').then(response=>{
        console.log(response)
        response.data.forEach(daira=>{
            dairas.value.push({
                label:daira.name,
                value:daira.id
            })
        })
    })
}

const getAddress = async ()=>{
    sendApi('/profile',null,'GET').then(response=>{
        console.log(response)
        if(response.data.address){
            address.value.address = response.data.address.address
            address.value.postal_code = response.data.address.postal_code
            address.value.wilaya_id = response.data.address.wilaya.id
            address.value.daira_id = response.data.address.daira.id 
            
            wilaya.value = {
                label:response.data.address.wilaya.name,
                value:response.data.address.wilaya.id
            }
            daira.value = {
                label:response.data.address.daira.name,
                value:response.data.address.daira.id
            }
        }
        getWilaya()
        getDaira(wilaya.value.value)
    })
}
const save = async ()=>{
    sendApi('/profile/address/update',address.value,'PUT').then(()=>{
        getAddress()
    })
}

watch(searchWilaya,(newVal)=>{
    getWilaya()
})

watch(searchDaira,(newVal)=>{
    console.log(wilaya)
    getDaira(wilaya.value.value)
})




</script>

<style scoped>

</style>