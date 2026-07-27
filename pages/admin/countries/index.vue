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
                @update:model-value="getCountries"
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
                    <div class="flex flex-col items-center gap-3 justify-center">
                        <div>
                            <div>
                                <img v-if="countryFlag" class="w-30 h-30 object-cover rounded-full" :src="countryFlag"/>
                                <div v-else class="bg-gray-100 rounded-full flex justify-center items-center w-30 h-30">   
                                    <UIcon name="i-material-symbols-flag" size="80"/>
                                </div>
                            </div>
                            <div class="relative">
                                <label class="cursor-pointer absolute inset-0 flex items-end justify-end" for="images">
                                    <div class="bg-primary flex items-center rounded-full p-1">
                                        <UIcon :name="countryFlag ? 'i-material-symbols-edit' :'i-material-symbols-add-2-rounded'" class="text-white"/>
                                    </div>
                                    <UInput @change="onFileChange" class="hidden" type="file" id="images"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    <UFormField :ui="{label:'text-secondary'}" label="Repère">
                        <label for="landmark">
                            <div class="flex gap-3 w-60 md:w-80 lg:w-100 h-8 border-1 border-neutral-300 rounded-none">
                                <div class="w-1/2 bg-neutral-200 h-full flex items-center p-2 border-r-1 border-neutral-300 font-bold text-sm text-secondary">Télécharger une image</div>
                                <div>{{ country?.landmark?.name }}</div>
                            </div>
                            <UInput @change="onLandmarkChange" class="hidden" type="file" id="landmark"/>
                        </label>
                    </UFormField>
                    <UFormField :ui="{label:'text-secondary'}" label="Pay" name="country">
                        <UInput placeholder="Pay" v-model="country.country" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    
                    <div class="flex flex-col gap-3">
                        <div class="text-secondary font-medium">Services assignés</div>
                        <div class="flex gap-4">
                            <UCheckbox v-model="country.is_visa" label="Visa" />
                            <UCheckbox v-if="isOmraCountry" v-model="country.is_omra" label="Omra" />
                            <UCheckbox v-model="country.is_voyage_organise" label="Voyage Organisé" />
                        </div>
                    </div>
                    <UButton @click="()=>{
                        if(action === 'Modifier'){
                            console.log('true')
                            updateCountry(country.id)
                        }else{
                            console.log('false')
                            addCountry()
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


const open = ref(false)

const openForm = ()=>{
    action.value = "Ajouter"
    country.value.flag = null
    country.value.country = null
    country.value.is_visa = true
    country.value.is_omra = true
    country.value.is_voyage_organise = true
    countryFlag.value = null
    open.value = true
}
const country = ref({
    id:null,
    flag:null,
    landmark:null,
    country:null,
    is_visa: true,
    is_omra: true,
    is_voyage_organise: true,
})
const countryFlag = ref(null)

const isOmraCountry = computed(() => {
    if (action.value === 'Modifier' && country.value.is_omra) return true;
    if (!country.value.country) return false;
    const name = country.value.country.toLowerCase();
    return name.includes('arabie') || name.includes('saoudi') || name.includes('saudi') || name.includes('ksa') || name.includes('mecc') || name.includes('makk');
})

definePageMeta({
    layout:"admin",
    // 
})

const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'flag',
        header: 'Drapeau',
        cell:({row})=>{
            return h('div',{class:''},
                h(UAvatar,{
                src:row.original?.flag,
                size: 'xl',
                icon:row.original?.flag ? null : "i-lucide-user-round"
            }))
        }
    },
    {
        accessorKey: 'country',
        header: 'Pay',
    },
    {
        id: 'services',
        header: 'Services',
        cell: ({row}) => {
            const badges = []
            if (row.original.is_visa) badges.push(h('div', { class: 'text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap' }, 'Visa'))
            if (row.original.is_omra) badges.push(h('div', { class: 'text-xs bg-green-100 text-green-800 px-2 py-1 rounded whitespace-nowrap' }, 'Omra'))
            if (row.original.is_voyage_organise) badges.push(h('div', { class: 'text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded whitespace-nowrap' }, 'Voyage'))
            return h('div', { class: 'flex flex-wrap gap-2' }, badges)
        }
    },
    {
        accessorKey: 'offers',
        header: 'Offres',
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
                    onClick:()=>{getCountry(row.original.id)}
                },
            ),
        )}
    }, 
]

const pagination = ref({
  pageIndex: undefined,
  pageSize: undefined,
  totalItems:undefined,
  totalPages:undefined
})
const data = ref([])

const loading = ref(false)
const emptyTable = ref('')
const action = ref(null)

const search = ref('')
const searchDebounce = refDebounced(search,200)

onMounted(()=>{
    getCountries(1);
})

const onFileChange = (event)=> {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        countryFlag.value = URL.createObjectURL(file);
        country.value.flag = file
      } else {
        countryFlag.value = null;
      }
}

const onLandmarkChange = (event)=>{
    const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        country.value.landmark = file
        console.log(file)
      }
}

const getCountries = async (page=1)=>{
    loading.value = true
    sendApi(`/admin/countries?page=${page}&per_page=10&search=${search.value}`,null,'GET').then(response=>{
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

const getCountry = async (id)=>{
    action.value = "Modifier"
    open.value = true
    loading.value = true
    sendApi(`/admin/countries/${id}`,null,'GET').then(response=>{
        console.log(response)
        countryFlag.value = response.data.flag
        country.value.id = response.data.id
        country.value.country = response.data.country
        country.value.is_visa = response.data.is_visa ?? true
        country.value.is_omra = response.data.is_omra ?? true
        country.value.is_voyage_organise = response.data.is_voyage_organise ?? true
        loading.value = false
    })
}

const addCountry = async ()=>{
    const formData = new FormData()
    formData.append('flag',country.value.flag)
    formData.append('landmark',country.value.landmark)
    formData.append('country',country.value.country)
    formData.append('is_visa', country.value.is_visa)
    formData.append('is_omra', isOmraCountry.value ? country.value.is_omra : false)
    formData.append('is_voyage_organise', country.value.is_voyage_organise)
    loading.value = true
    sendApi('/admin/countries/add',formData,'POST').then(response=>{
        getCountries()
        open.value = false
        loading.value = false
        country.value.flag = null
        country.value.country = null
        countryFlag.value = null
    })
}

const updateCountry = async(id)=>{
    const formData = new FormData()
    if(country.value.flag){
        formData.append('flag',country.value.flag)
    }
    if(country.value.landmark){
        formData.append('landmark',country.value.landmark)
    }
    formData.append('country',country.value.country)
    formData.append('is_visa', country.value.is_visa)
    formData.append('is_omra', isOmraCountry.value ? country.value.is_omra : false)
    formData.append('is_voyage_organise', country.value.is_voyage_organise)
    formData.append('_method','PUT')
    loading.value = true
    sendApi(`/admin/countries/${id}/update`,formData,'POST').then(response=>{
        getCountries(pagination.value.pageIndex + 1)
        open.value = false
        loading.value = false
        country.value.flag = null
        country.value.country = null
        countryFlag.value = null
    })
}

const onPageChange = async (page)=>{
    await getCountries(page)
}
</script>

<style scoped>

</style>
