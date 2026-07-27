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
                @update:model-value="getProviders"
                />
                <UButton @click="open = true" :ui="{leadingIcon:'text-neutral'}" class="font-bold" icon="i-material-symbols-add-2" label="Ajouter"/>
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
        <USlideover fullscreen v-model:open="open" title="Ajouter un fournisseur" close-icon="i-lucide-arrow-right" :close="{
        color: 'secondary',
        class:'cursor-pointer',
        }">
            <template #body>
                <div class="flex flex-col gap-10">
                    <UFormField :ui="{label:'text-secondary'}" label="Nom" name="name">
                        <UInput placeholder="Nom" v-model="form.name" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>

                    <UFormField :ui="{label:'text-secondary'}" label="E-mail" name="email">
                        <UInput placeholder="exemple@gmail.com" v-model="form.email" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>

                    <UFormField :ui="{label:'text-secondary'}" label="Numéro de Téléphone" name="phone">
                        <UInput placeholder="05XXXXXXXX" v-model="form.phone" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <UButton @click="addProvider" :loading="loading" loading-icon="i-lucide-loader-circle" label="Ajouter" class="w-fit font-bold"/>
                </div>
            </template>
        </USlideover>
        <UModal class="" v-model:open="openBalance" title="Gestion des dettes">
            <template #body>
                <div class="flex flex-col gap-5">
                    <div class="flex justify-center gap-3">
                        <div class="font-bold">Dettes:</div>
                        <div class="text-error font-bold">{{ provider?.debts }} DZD</div>
                    </div>
                    <div class="flex flex-col gap-5 items-center">
                        <UFormField :ui="{label:'text-secondary'}" label="Montant">
                            <UInput v-model="providerDebts.amount" placeholder="0.00">
                                <template #trailing>
                                    <div
                                        id="character-count"
                                        class="text-xs text-muted tabular-nums"
                                        aria-live="polite"
                                        role="status"
                                    >
                                        DZD
                                    </div>
                                </template>
                            </UInput>
                        </UFormField>
                        <div class="flex flex-col-reverse">
                            <UTextarea placeholder="Description..." class="w-100" v-model="providerDebts.description"/>
                        </div>
                        <div class="">
                            <UButton @click="manageDebts(provider.id)" label="Ajouter" class="font-bold w-fit"/>
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
        <UModal fullscreen v-model:open="openTransactions" title="Transactions">
            <template #body>
                <div class="flex flex-col gap-5">
                    <div class="flex flex-col md:flex-row gap-4 items-end bg-neutral-50 p-4 rounded-md border border-neutral-200">
                        <UFormField :ui="{label:'text-secondary'}" label="Date de début">
                            <UInput type="date" v-model="transactionFilters.from" class="w-full md:w-60" />
                        </UFormField>
                        <UFormField :ui="{label:'text-secondary'}" label="Date de fin">
                            <UInput type="date" v-model="transactionFilters.to" class="w-full md:w-60" />
                        </UFormField>
                        <UButton label="Filtrer" icon="i-lucide-filter" @click="getTransactions(currentProviderId)" class="font-bold h-[36px]" />
                        <UButton label="Réinitialiser" variant="soft" color="gray" @click="transactionFilters.from=null; transactionFilters.to=null; getTransactions(currentProviderId)" class="font-bold h-[36px]" />
                    </div>
                    <UTable :data="transactions" :columns="transactioCalumns" class="flex-1" />
                    <div v-if="totalTransactions" class="w-full flex justify-end">
                        <div class="w-fit flex items-center justify-start gap-5 w-sm h-10 border-1 font-bold border-neutral-300 ">
                            <div class="flex items-center justify-center h-full w-1/2 bg-neutral-200">Total</div>
                            <div class="flex justify-end w-full px-2">{{ totalTransactions }} DZD</div>
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import { refDebounced } from '#imports'
import { NuxtTime, UBadge, UIcon } from '#components'

const totalTransactions = ref(null)
const open = ref(false)
const openBalance = ref(false)
const openTransactions = ref(false)
const enableDebts = ref(false)
const manageBalance = ref({
    balance:true,
    debts: false
})
const toggleBalance = (value)=>{
    if(value === "balance"){
        manageBalance.value.balance = true
        manageBalance.value.debts = false
    }else{
        manageBalance.value.balance = false
        manageBalance.value.debts = true
    }
}

const form = reactive({
    name:null,
    email:null,
    phone:null
})

definePageMeta({
    layout:"admin",
    // 
})

const UButton = resolveComponent('UButton')


const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'name',
        header: 'Fournisseur',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Téléphone'
    },
    {
        accessorKey: 'debts',
        header: 'Dettes',
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
                    name:"i-streamline-money-cash-bill-2-currency-billing-payment-finance-cash-bill-money-accounting",
                    size:"17",
                    class:"cursor-pointer text-green-700",
                    onClick:()=>{getProvider(row.original.id)}
                },
            ),
            h(
                UIcon,
                {
                    name:"i-carbon-cics-transaction-server-zos",
                    size:"17",
                    class:"cursor-pointer text-secondary",
                    onClick:()=>{getTransactions(row.original.id)}
                },
            ),
        )}
    }, 
]
const transactioCalumns = [
    {
        accessorKey:"description",
        header:"Description"
    },
    {
        accessorKey:"type",
        header:"Type",
        cell: ({ row }) => {
            const type = {
                debts: 'Dettes',
                paid: 'Payé',
            }[row.getValue('type')]
            const color = {
                debts:'error',
                paid:'success',
            }[row.getValue('type')]

            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, () =>
                type
            )
        }
    },
    {
        accessorKey:"amount",
        header:"Montant"
    },
    {
        accessorKey:"created_at",
        header:"Date",
        cell:({row})=>{
            return h(
                'div',
                undefined,
                h(NuxtTime,{
                    datetime:row.original.created_at,
                    locale:"fr-FR",
                    year:"numeric",
                    month:"numeric",
                    day:"numeric"
                })
            )
        }
    },
]

const providerDebts = reactive({
    amount:null,
    description:null
})

const pagination = ref({
  pageIndex: undefined,
  pageSize: undefined,
  totalItems:undefined,
  totalPages:undefined
})
const data = ref([])
const transactions = ref([])
const provider = ref()

const transactionFilters = reactive({
    from: null,
    to: null
})
const currentProviderId = ref(null)

const loading = ref(false)
const emptyTable = ref('')

const search = ref('')
const searchDebounce = refDebounced(search,200)

onMounted(()=>{
    getProviders(1);
})

const getProviders = async (page=1)=>{
    loading.value = true
    sendApi(`/admin/providers?page=${page}&per_page=10&search=${search.value}`,null,'GET').then(response=>{
        data.value = response.data
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

const getProvider = async (id)=>{
    openBalance.value = true
    loading.value = true
    sendApi(`/admin/providers/${id}`,null,'GET').then(response=>{
        provider.value = response.data
        loading.value = false
    })
}

const addProvider = async ()=>{
    if(!form.email){
        delete form.email
    }
    if(!form.phone){
        delete form.phone
    }
    loading.value = true
    sendApi('/admin/providers/add',form,'POST').then(response=>{
        getProviders()
        open.value = false
        loading.value = false
        console.log(response)
        form.name = null
        form.email = null
        form.phone = null
    })
}


const manageDebts = async(id)=>{
    const data = ref({
        amount:providerDebts.amount ===  null ? Number.parseFloat(0).toFixed(2) : Number.parseFloat(providerDebts.amount).toFixed(2),
    })
    if(providerDebts.description){
        data.value.description = providerDebts.description
    }
    sendApi(`/admin/providers/${id}/add-amount`,data.value,'POST').then(response=>{
        getProviders()
        providerDebts.amount = null
        providerDebts.debts = null
        openBalance.value = false
    })
}

const getTransactions = async(id)=>{
    currentProviderId.value = id
    totalTransactions.value = 0
    let url = `/admin/providers/${id}/transactions?`
    if (transactionFilters.from) url += `from=${transactionFilters.from}&`
    if (transactionFilters.to) url += `to=${transactionFilters.to}`

    sendApi(url,null,'GET').then(response=>{
        console.log(response)
        transactions.value = response.data
        response.data.forEach(transaction=>{
            totalTransactions.value += transaction.amount
        })
        openTransactions.value = true
    })
}


const onPageChange = async (page)=>{
    await getProviders(page)
}
</script>

<style scoped>

</style>
