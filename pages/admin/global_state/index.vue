<template>
    <div class="w-full space-y-4 pb-4 px-6 py-6 bg-slate-50/70 dark:bg-slate-950 min-h-full transition-colors duration-300">
        <div class="flex flex-col gap-5">
            <div class="flex flex-col sm:flex-row gap-5 w-full justify-center items-center">
                <div class="flex items-center gap-2">
                    <div class="text-primary font-bold">De:</div>
                    <UPopover>
                        <UButton class="font-bold w-40" color="primary" variant="subtle" icon="i-lucide-calendar">
                            {{ startDate ? df.format(startDate.toDate(getLocalTimeZone())) : 'Selectionner une date' }}
                        </UButton>
                        <template #content>
                            <UCalendar v-model="startDate" class="p-2" />
                        </template>
                    </UPopover>
                </div>
                <div class="flex items-center gap-2">
                    <div class="text-primary font-bold">À:</div>
                    <UPopover>
                        <UButton class="font-bold w-40" color="primary" variant="subtle" icon="i-lucide-calendar">
                            {{ endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Selectionner une date' }}
                        </UButton>
    
                        <template #content>
                            <UCalendar v-model="endDate" class="p-2" />
                        </template>
                    </UPopover>
                </div>
            </div>
            <div class="flex flex-col gap-5">
                <UTable
                sticky
                ref="table"
                :data="data"
                :columns="columns"
                :loading="loading && !data.length"
                :empty="loading?'chargement en cours...':'Données non trouvées'"
                class="flex-1 h-full"
                />
                <div v-if="total" class="w-full flex justify-end">
                    <div class="w-fit flex items-center justify-start gap-5 w-sm h-10 border font-bold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs">
                        <div class="flex items-center justify-center h-full w-1/2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">Total</div>
                        <div class="flex justify-end w-full px-2 text-primary font-bold">{{ total }} DZD</div>
                    </div>
                </div>
            </div>
        </div>
        
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import { refDebounced } from '#imports'
import { UIcon } from '#components'
const UAvatar = resolveComponent('UAvatar')
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const df = new DateFormatter('fr-FR', {
  dateStyle: 'medium'
})

const currentDate = ref({
    day:new Date().getDate(),
    month:new Date().getMonth() + 1,
    year:new Date().getFullYear()
})
const startDate = shallowRef(new CalendarDate(currentDate.value.year, currentDate.value.month, currentDate.value.day))
const endDate = shallowRef(new CalendarDate(currentDate.value.year, currentDate.value.month, currentDate.value.day))

definePageMeta({
    layout:"admin",
    // 
})

const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'offer',
        header: 'Titre',
    },
    {
        accessorKey: 'purchase_price',
        header: "Prix d'Achat",
    },
    {
        accessorKey: 'quantity',
        header: 'Quantité',
    },
    {
        accessorKey: 'unit_price',
        header: "Prix Unitaire",
    },
    {
        accessorKey: 'selling_price',
        header: "Prix de Vente",
    },
    {
        accessorKey: 'commission',
        header: "Commission",
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

const data = ref([])
const total=ref(null)

const loading = ref(false)
const emptyTable = ref('')

const search = ref('')
const searchDebounce = refDebounced(search,200)

onMounted(()=>{
    getStates(1);
})


const getStates = async (page=1)=>{
    total.value = null
    const start_date = `${startDate.value.year}-${startDate.value.month}-${startDate.value.day}`
    const end_date = `${endDate.value.year}-${endDate.value.month}-${endDate.value.day}`
    console.log(start_date)
    loading.value = true
    sendApi(`/admin/states?start_date=${start_date}&end_date=${end_date}`,null,'GET').then(response=>{
        console.log(response)
        data.value = response.data
        response.data.forEach(response=>{
            total.value += response.commission
        })
        loading.value = false
    })
}


watch(startDate, (newVal)=>{
    getStates()
})

watch(endDate, (newVal)=>{
    getStates()
})

</script>

<style scoped>

</style>
