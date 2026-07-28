<template>
    <div class="min-h-[calc(100vh-80px)] px-6 md:px-15 flex flex-col gap-10 items-center justify-items-center py-8 pb-16">
        <div class="py-8 flex flex-col md:flex-row justify-between items-center gap-6 w-full border-b border-gray-100 mb-2">
            <div class="flex flex-col gap-2 w-full md:w-auto">
                <h1 class="text-secondary text-2xl md:text-3xl font-extrabold uppercase">Choisissez votre destination</h1>
                <div class="w-16 h-1 bg-primary"></div>
            </div>
            
            <div class="w-full md:w-80">
                <UInput 
                    v-model="search"
                    icon="i-lucide-search" 
                    size="lg" 
                    placeholder="Rechercher un pays..."
                    @update:model-value="getCountries"
                    :ui="{ base: 'shadow-sm rounded-none' }"
                />
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-6">
            <div class="relative group cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500" v-for="(country, index) in countries" :key="index">
                <nuxt-link :to="`visa/${country.id}`">
                    <img :src="country.landmark ? getFullImageUrl(country.landmark) : '/images/illustrations/landmark.png'" class="aspect-[3/4] w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                        <div class="flex items-center gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <UAvatar :src="getFullImageUrl(country.flag)" size="md" :ui="{image:'object-cover', rounded: 'rounded-none'}" class="ring-2 ring-white/50 shadow-xl"/>
                            <div class="text-white text-2xl font-bold tracking-wide drop-shadow-md">
                                {{ country.country }}
                            </div>
                        </div>
                    </div>
                </nuxt-link>
            </div>
        </div>
        <UPagination
        :default-page="(pagination.pageIndex || 0) + 1"
        :items-per-page="pagination.pageSize"
        :total="pagination.totalItems"
        @update:page="onPageChange"
            
        />
    </div>
</template>

<script setup>

const search = ref("")
const countries = ref([])

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  return `${rootUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

const pagination = ref({
  pageIndex: localStorage.getItem('current_page') ? localStorage.getItem('current_page') - 1 : undefined,
  pageSize: undefined,
  totalItems:undefined,
  totalPages:undefined
})

onMounted(()=>{
    getCountries()
})

const getCountries = async (page=1)=>{
    console.log(`page index: ${pagination.value.pageIndex}`)
    if(localStorage.getItem('current_page')){
        console.log("localstorage")
        page = localStorage.getItem('current_page')
    }
    sendApi(`/visa?page=${page}&per_page=12&search=${search.value}`,null,'GET').then(response=>{
        console.log(response)
        countries.value = response.data.data
        pagination.value = {
            pageIndex:response.pagination.current_page - 1,
            pageSize:response.pagination.per_page,
            totalItems:response.pagination.total_items,
            totalPages:response.pagination.total_pages
        }
    });
}

const onPageChange = async (page)=>{
    console.log(page)
    localStorage.setItem('current_page',page)
    await getCountries(page)
}
</script>

<style lang="scss" scoped>

</style>
