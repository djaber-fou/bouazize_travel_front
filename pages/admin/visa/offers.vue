<template>
    <div class="w-full space-y-4 pb-4">
        <div class="flex flex-col gap-5">
            <div class="flex justify-between">
                <UInput 
                v-model="search"
                icon="i-lucide-search" 
                size="md" 
                variant="outline" 
                placeholder="Rechercher..."
                @update:model-value="getOffers"
                />
                <UButton @click="openForm" :ui="{leadingIcon:'text-neutral'}" class="font-bold" icon="i-material-symbols-add-2" label="Ajouter"/>
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
                class="flex-1 h-full"
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
        :title="action==='Ajouter'?'Ajouter un Pay':'Modifier le Pay'" 
        close-icon="i-lucide-arrow-right" :close="{
        color: 'secondary',
        class:'cursor-pointer',
        }">
            <template #body>
                <div class="flex flex-col gap-10">
                    <UFormField v-if="action=='Modifier'" :ui="{label:'text-secondary'}" label="Disponibilité" name="available">
                        <USwitch v-model="offer.available" />
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Pay" name="country">
                        <USelectMenu placeholder="Pay" @change="()=>offer.country_id = country.value" v-model:search-term="searchCountry" v-model="country" :avatar="country?.avatar" :items="countries" class="lg:w-100 md:w-80 w-60" />
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Fournisseur" name="country_id">
                        <USelectMenu placeholder="Fournisseur" @change="()=>offer.provider_id = provider.value" v-model:search-term="searchProvider" v-model="provider" :avatar="provider?.avatar" :items="providers" class="lg:w-100 md:w-80 w-60" />
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Nom" name="name">
                        <UInput placeholder="Nom" v-model="offer.offer_name" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Durée" name="duration">
                        <UInput placeholder="Durée" v-model="offer.duration" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Garantie" name="guarantee">
                        <USelect placeholder="Type" v-model="offer.guarantee" :items="guaranteeTypes" class="lg:w-100 md:w-80 w-60" />
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Prix d'achat" name="purchase_price">
                        <UInput placeholder="0.00" v-model="offer.purchase_price" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Prix entreprise" name="business_price">
                        <UInput placeholder="0.00" v-model="offer.b2b_price" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Prix individuel" name="individual_price">
                        <UInput placeholder="0.00" v-model="offer.b2c_price" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Documents" name="documents">
                        <div class="flex flex-col gap-3">
                            <UInput placeholder="Document" v-model="newDocument" class="lg:w-100 md:w-80 w-60">
                                <template #trailing>
                                    <UButton
                                        color=""
                                        class="bg-primary text-white"
                                        variant=""
                                        size="sm"
                                        icon="i-lucide-plus"
                                        aria-label="Clear input"
                                        @click="addDocument"
                                    />
                                </template>
                            </UInput>
                            <div class="w-full flex gap-3">
                                <div class="" v-for="(newDocument, index) in offer.documents" :key="index">
                                    <div class="flex gap-1 items-center bg-secondary py-1 px-2 rounded-none text-white font-bold">
                                        <div>
                                            {{ newDocument}}
                                        </div>
                                        <UIcon @click="removeDocument(index)" name="i-material-symbols-close"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UFormField>
                    <UButton @click="()=>{
                        if(action === 'Modifier'){
                            console.log('true')
                            updateOffer(offer.id)
                        }else{
                            console.log('false')
                            addOffer()
                        }
                    }" :loading="loading" loading-icon="i-lucide-loader-circle" :label="action" class="w-fit font-bold"/>
                </div>
            </template>
        </USlideover>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import { refDebounced } from '#imports'
import { UIcon } from '#components'
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
definePageMeta({
    layout:"admin",
    // 
})


const open = ref(false)

const openForm = ()=>{
    action.value = "Ajouter"
    open.value = true
    offer.value = {
        id:null,
        country_id:null,
        provider_id:null,
        offer_name:null,
        duration:null,
        available:false,
        guarantee:null,
        purchase_price:null,
        b2b_price:null,
        b2c_price:null,
        documents:[],
    }
}
const offer = ref({
    id:null,
    country_id:null,
    provider_id:null,
    offer_name:null,
    duration:null,
    available:false,
    guarantee:null,
    purchase_price:null,
    b2b_price:null,
    b2c_price:null,
    documents:[],
})

const guaranteeTypes = ref([
    {
        label:"Totale",
        value:"with"
    },
    {
        label:"Demi",
        value:"half"
    },
    {
        label:"Sans",
        value:"without"
    }
])
const newDocument = ref(null)

const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'name',
        header: 'Offre',
        cell:({row})=>{
            return h('div',{class:'flex items-center gap-3'},[
                h(UAvatar,{
                    src:row.original.country.flag,
                    size: 'xl',
                }),
                h('div',{class:'font-bold'},row.original.name)
            ])
        }
    },
    {
        accessorKey: 'duration',
        header: 'Durée',
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
        accessorKey: 'purchase_price',
        header: "Prix d'achat",
    },
    {
        accessorKey: 'available',
        header: 'Disponibilité',
        cell:({row})=>{
            const color = {
                true: 'success',
                false: 'error',
            }[row.getValue('available')]
            const availabilityType = {
                true: 'Disponible',
                false: 'Non disponible',
            }[row.getValue('available')]
            return h(UBadge,{ class: 'capitalize font-bold', variant: 'soft', color }, availabilityType)
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
                    size:"17",
                    class:"cursor-pointer text-primary",
                    onClick:()=>{getOffer(row.original.id)}
                },
            ),
        )}
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
const loading = ref(false)
const emptyTable = ref('')
const action = ref(null)

const search = ref('')
const searchDebounce = refDebounced(search,200)
const searchCountry = ref('')
const searchProvider = ref('')

onMounted(()=>{
    getOffers(1);
    getCountries()
    getProviders()
})

const addDocument = ()=>{
    if(newDocument.value){
        offer.value.documents.push(newDocument.value)
        newDocument.value = null
    }
}
const removeDocument = (index)=>{
    offer.value.documents.splice(index,1)
}


const getCountries = async ()=>{
    loading.value = true
    countries.value = []
    sendApi(`/admin/countries?per_page=100&is_visa=1&search=${searchCountry.value}`,null,'GET').then(response=>{
        response.data.data.forEach(country=>{
            countries.value.push(
                {
                    label:country.country, 
                    value:country.id, 
                    avatar:{
                        src:country.flag
                    }
                })
        })
        loading.value = false
    })
}

const getProviders = async ()=>{
    loading.value = true
    providers.value = []
    sendApi(`/admin/providers?per_page=2&search=${searchProvider.value}`,null,'GET').then(response=>{
        // console.log(response)
        response.data.forEach(provider=>{
            // console.log(provider.name)
            providers.value.push({
                label:provider.name, 
                value:provider.id, 
            })
        })
        console.log(providers.value)
        loading.value = false
    })
}

const getOffers = async (page=1)=>{
    loading.value = true
    sendApi(`/admin/visa/offers?page=${page}&per_page=10&search=${search.value}`,null,'GET').then(response=>{
        data.value = response.data.data
        pagination.value = {
            pageIndex:response.pagination.current_page - 1,
            pageSize:response.pagination.per_page,
            totalItems:response.pagination.total_items,
            totalPages:response.pagination.total_pages
        }
        console.log(response)
        loading.value = false
    })
}

const getOffer = async (id)=>{
    action.value = "Modifier"
    open.value = true
    loading.value = true
    offer.value.documents = []
    sendApi(`/admin/visa/offers/${id}`,null,'GET').then(response=>{
        console.log(response)
        console.log(offer.value.documents)
        console.log(offer.value)
        offer.value.id=response.data.id,
        offer.value.country_id=response.data.country.id
        offer.value.offer_name=response.data.name,
        offer.value.duration=response.data.duration,
        offer.value.available=response.data.available,
        offer.value.guarantee=response.data.guarantee,
        offer.value.purchase_price=response.data.purchase_price,
        offer.value.b2b_price=response.data.business_price,
        offer.value.b2c_price=response.data.individual_price,
        response.data.documents.forEach(doc => {
            offer.value.documents.push(doc.name)
        });
        country.value={
            label:response.data.country.name, 
            value:response.data.country.id, 
            avatar:{
                src:response.data.country.flag
            }
        },
        offer.value.provider_id = response.data.provider.value,
        provider.value = response.data.provider
        console.log(offer.value.country)
        
        loading.value = false
    })
}

const addOffer = async ()=>{
    loading.value = true
    sendApi('/admin/visa/offers/add',offer.value,'POST').then(response=>{
        getOffers()
        open.value = false
        loading.value = false
    })
}

const updateOffer = async(id)=>{
    loading.value = true
    console.log(offer.value)
    sendApi(`/admin/visa/offers/${id}/update`,offer.value,'PUT').then(response=>{
        console.log(response)
        getOffers(pagination.value.pageIndex + 1)
        open.value = false
        loading.value = false
    })
}

const onPageChange = async (page)=>{
    await getOffers(page)
}

watch(searchCountry,(newVal)=>{
    getCountries()
})
watch(searchProvider,(newVal)=>{
    getProviders()
})
</script>

<style scoped>

</style>
