<template>
    <div class="w-full space-y-4 pb-4 px-6 py-6 bg-slate-50/70 dark:bg-slate-950 min-h-full transition-colors duration-300">
        <div class="flex flex-col gap-5">
            <div>
                <UInput 
                v-model="search"
                icon="i-lucide-search" 
                size="md" 
                variant="outline" 
                placeholder="Rechercher..."
                @update:model-value="getUsers"
                />
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
        <USlideover  fullscreen v-model:open="open" :title="user?.name" close-icon="i-lucide-arrow-right" :close="{
        color: 'secondary',
        class:'cursor-pointer',
        }">
            <template #body>
                <div class="flex flex-col gap-10">
                    <div class="flex flex-col items-center gap-3 justify-center">
                        <div>
                            <img v-if="user?.image" class="w-30 h-30 object-cover rounded-full" :src="user?.image"/>
                            <div v-else class="bg-gray-100 rounded-full flex justify-center items-center w-30 h-30">   
                                <UIcon name="i-lucide-user-round" size="80"/>
                            </div>
                        </div>
                        <p class="text-secondary">{{ user?.name }}</p>
                        <UBadge class="font-bold" variant="soft" :color="user?.status === 'Approuvé' ? 'success' :
                         user?.status === 'Rejeté'? 'error' : 'warning'">{{ user?.status }}</UBadge>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-col gap-1">
                            <p class="text-secondary">E-mail:</p>
                            <div>{{ user?.email }}</div>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="text-secondary">Numéro de téléphone:</p>
                            <div>{{ user?.phone }}</div>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="text-secondary">Role:</p>
                            <USelect v-model="userRole" :items="roles" class="w-48 font-bold" />
                        </div>
                    </div>
                    <div class="w-full">
                        <UButton :disabled="user?.role?.value === userRole" @click="updateRole(user.id, userRole)" class="w-fit font-bold cursor-pointer" label="Sauvegarder"/>
                    </div>
                </div>
            </template>
        </USlideover>
        <UModal class="" v-model:open="openBalance" title="Gestion du solde">
            <template #body>
                <div class="flex flex-col gap-5">
                    <div class="flex justify-between gap-2">
                        <div class="text-success w-full flex justify-center font-bold">{{ user?.balance?.account_balance }} DZD</div>
                        <div class="text-error w-full flex justify-center font-bold">{{ user?.balance?.debts }} DZD</div>
                    </div>
                    <div class="flex justify-between gap-1">
                        <div
                        @click="toggleBalance('balance')" 
                        :class="{'bg-primary rounded-none text-white':manageBalance.balance}" 
                        class="text-primary w-full flex justify-center font-bold cursor-pointer border rounded-none border-primary">Solde</div>
                        <div
                        @click="toggleBalance('debts')"
                        :class="{'bg-primary rounded-none text-white':manageBalance.debts}" 
                        class="text-primary w-full flex justify-center font-bold cursor-pointer border rounded-none border-primary">Versement</div>
                    </div>
                    <div v-show="manageBalance.balance" class="flex flex-col gap-5 items-center">
                        <UFormField :ui="{label:'text-secondary'}" label="Montant">
                            <UInput v-model="userBalance.amount" placeholder="0.00">
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
                            <UFormField :class="{'opacity-50':!enableDebts}" :ui="{label:'text-secondary'}" label="Dettes">
                                <UInput v-model="userBalance.debts" :disabled="!enableDebts" placeholder="0.00">
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
                            <USwitch v-model="enableDebts" class="flex justify-end"/>
                        </div>
                        <div class="flex gap-2">
                            <UButton @click="setUserBalance(user.id)" label="Ajouter" class="font-bold w-fit"/>
                            <UButton @click="openReset = true" label="Réinitialiser" class="font-bold w-fit"/>
                        </div>
                    </div>

                    <div v-show="manageBalance.debts" class="flex flex-col gap-5 items-center justify-center">
                        <UFormField :ui="{label:'text-secondary'}" label="Montant">
                            <UInput v-model="userBalance.payment" placeholder="0.00">
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
                        <div class="">
                            <UButton @click="manageUserDebts(user.id)" label="Ajouter" class="font-bold w-fit"/>
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
        <UModal fullscreen v-model:open="openTransactions" title="Transactions">
            <template #body>
                <div class="w-full flex lg:flex-row md:flex-row flex-col justify-between items-center pb-4">
                    <div class="flex gap-2">
                        <UFormField :ui="{label:'text-secondary'}" name="from">
                            <UInput type="date" v-model="transactionFilters.from"/>
                        </UFormField>
                        <UFormField :ui="{label:'text-secondary'}" name="to">
                            <UInput type="date" v-model="transactionFilters.to"/>
                        </UFormField>
                    </div>
                    <div class="flex gap-2 items-center">
                        <UButton label="Filtrer" icon="i-lucide-filter" @click="getTransactions(user?.id)" class="font-bold h-[36px]" />
                        <UButton label="Réinitialiser" variant="soft" color="gray" @click="transactionFilters.from=null; transactionFilters.to=null; getTransactions(user?.id)" class="font-bold h-[36px]" />
                        <UIcon @click="openInvoiceModal(user?.id)" name="i-basil-invoice-solid" size="30" class="text-primary cursor-pointer ml-2"/>
                    </div>
                </div>
                <UTable v-model:row-selection="selectedTransactions" :empty="loadingTransactions?'chargement en cours...':'Données non trouvées'" :data="transactions" :columns="transactioCalumns" class="flex-1" />
            </template>
        </UModal>
        <UModal v-model:open="openReset" title="Êtes-vous sûr de vouloir réinitialiser le solde ?">
            <template #body>
                <div class="w-full flex gap-2 justify-end">
                    <UButton @click="openReset = false" label="Annuler" class="font-bold bg-error w-fit"/>
                    <UButton @click="resetSold(user.id)" label="Réinitialiser" class="font-bold w-fit"/>

                </div>
            </template>
        </UModal>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import { refDebounced } from '#imports'
import { NuxtTime, UIcon, ULink } from '#components'
import Confirmation from '~/components/modals/Confirmation.vue'
import Invoice from '~/components/invoices/Invoice.vue'
import html2canvas from 'html2canvas'
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const openReset = ref(false)

const overlay = useOverlay()
const modal = overlay.create(Confirmation, {
    props:{
        title:"Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
    },
    defineEmits:['delete']
})

const downloadFile = (url, filename)=> {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename; 
  document.body.appendChild(link); 
  link.click(); 
  document.body.removeChild(link); 
}

const openConfirmation = async(id)=> {
    const instance = modal.open()
    const close = await instance.result
    if(!close){
        deleteUser(id)
    }

}

const openInvoiceModal = async(id)=> {
    const selectedItems = Object.keys(selectedTransactions.value)
        .filter(key => selectedTransactions.value[key])
        .map(key => transactions.value[key]);

    const invoiceModal = overlay.create(Invoice,{
        props:{
            id:id,
            transactions: selectedItems.length > 0 ? selectedItems : transactions.value
        }
    })
    const instance = invoiceModal.open()
    const close = await instance.result
    console.log(close)
    if(close){
        // The modal handled download and closed successfully
    }
}

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

definePageMeta({
    layout:"admin",
    // 
})

const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'name',
        header: 'Utilisateur',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, {
                src:row.original?.image,
                size: 'xl',
                icon:row.original?.image ? null : "i-lucide-user-round"
                }),
                h('div', undefined, [
                    h('div', { class: '' }, row.original.name),
                    // h('p', { class: '' }, `@${row.original.username}`)
                ])
            ])
        }
    },
    {
        accessorKey: 'role',
        header: 'Role'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'phone',
        header: 'Téléphone'
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            
            const color = {
                Approuvé: 'success',
                Rejeté: 'error',
                'En attente':'warning'
            }[row.getValue('status')]

            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, () =>
                row.getValue('status')
            )
        }
    },
    {
    id: 'actions',
    cell: ({ row }) => {
        if(row.original.status === "En attente"){
            return h(
              'div',
              { class: 'flex gap-3 items-center' },
              h(
                UIcon,
                {
                  name:"i-lucide-eye",
                  size:"17",
                  class:"cursor-pointer",
                  onClick:()=>{viewUser(row.original.id)}
                },
              ),
              h(
                UIcon,
                {
                  name:"i-pajamas-approval",
                  size:"17",
                  class:"cursor-pointer text-success",
                  onClick:()=>{acceptUser(row.original.id)}
                },
              ),
              h(
                UIcon,
                {
                  name:"i-material-symbols-delete-outline",
                  size:"17",
                  class:"cursor-pointer text-error",
                  onClick:()=>{openConfirmation(row.original.id)}
                },
              ),
              row.original.role === "Entreprise" ?
              h(
                UIcon,
                {
                    name:"i-material-symbols-download",
                    size:"17",
                    class:"cursor-pointer text-secondary",
                    onClick:()=>{downloadFile(row.original.file,row.original.name)}
                },
                ):null,
                
            )
        }else{
            return h(
              'div',
              { class: 'flex gap-3 items-center' },
              h(
                UIcon,
                {
                  name:"i-lucide-eye",
                  size:"17",
                  class:"cursor-pointer",
                  onClick:()=>{viewUser(row.original.id)}
                },
              ),
              row.original.role === "Entreprise"?
              h(
                UIcon,
                {
                  name:"i-streamline-money-cash-bill-2-currency-billing-payment-finance-cash-bill-money-accounting",
                  size:"17",
                  class:"cursor-pointer text-green-700",
                  onClick:()=>{showBalance(row.original.id)}
                },
              ):null,
              row.original.role === "Entreprise"?
              h(
                UIcon,
                {
                    name:"i-carbon-cics-transaction-server-zos",
                    size:"17",
                    class:"cursor-pointer text-secondary",
                    onClick:()=>{getTransactions(row.original.id)}
                },
            ):null,
            h(
                UIcon,
                {
                  name:"i-material-symbols-delete-outline",
                  size:"17",
                  class:"cursor-pointer text-error",
                  onClick:()=>{openConfirmation(row.original.id)}
                },
              ),
              row.original.role === "Entreprise" ?
              h(
                UIcon,
                {
                    name:"i-material-symbols-download",
                    size:"17",
                    class:"cursor-pointer text-secondary",
                    onClick:()=>{downloadFile(row.original.file,row.original.name)}
                },
                ):null,
            )
        }
    }
    }, 
]

const transactioCalumns = [
    {
        id: 'select',
        header: ({ table }) => h(resolveComponent('UCheckbox'), {
            'modelValue': table.getIsAllPageRowsSelected(),
            'indeterminate': table.getIsSomePageRowsSelected(),
            'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all'
        }),
        cell: ({ row }) => h(resolveComponent('UCheckbox'), {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
            'ariaLabel': 'Select row'
        })
    },
    {
        accessorKey:"description",
        header:"Description"
    },
    {
        accessorKey:"unit_price",
        header:"Prix Unitaire"
    },
    {
        accessorKey:"total_price",
        header:"Prix Total"
    },
    {
        accessorKey:"amount_paid",
        header:"Montant Payé"
    },
    {
        accessorKey:"debts",
        header:"Dettes"
    },
    {
        accessorKey:"status",
        header:"Statut",
        cell: ({ row }) => {
            const status = {
                paid: 'Payé',
                unpaid: 'Non Payé',
                half_paid:'À moitié payé',
                payment:'Versement'
            }[row.getValue('status')]
            const color = {
                paid:'success',
                unpaid:'error',
                half_paid:'warning',
                payment:'info'
            }[row.getValue('status')]

            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, () =>
                status
            )
        }
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
                    month:"short",
                    day:"numeric",
                    hour:"numeric",
                    minute:"numeric"
                })
            )
        }
    },
]

function getActions (row){
    return [
        row.original.status === "En attente"?{
            label:"Approuvé",
            onSelect(){
                console.log('approved')
            }
        }:null,
        row.original.status === "En attente"?{
            label:"Rejeté",
            onSelect(){
                console.log('approved')
            }
        }:null,
        {
            label:"Détails",
            onSelect(){
                getUser(row.original.id)
            }
        }
    ].filter(Boolean)
}

const roles = ref([
    {label:"Individuel",value:"individual"},
    {label:"Entreprise",value:"business"}
])

const userRole = ref('individual')
const userBalance = ref({
    amount:null,
    debts:null,
    payment:null
})

const pagination = ref({
  pageIndex: undefined,
  pageSize: undefined,
  totalItems:undefined,
  totalPages:undefined
})
const data = ref([])
const transactions = ref([])
const selectedTransactions = ref({})
const user = ref()

const loading = ref(false)
const loadingTransactions = ref(false)
const emptyTable = ref('')
const transactionFilters = ref({from:null, to:null})

const search = ref('')
const searchDebounce = refDebounced(search,200)

onMounted(()=>{
    getUsers(1);
})

const getUsers = async (page=1)=>{
    loading.value = true
    sendApi(`/admin/users?page=${page}&per_page=10&search=${search.value}`,null,'GET').then(response=>{
        data.value = response.data.data
        pagination.value = {
            pageIndex:response.pagination.current_page - 1,
            pageSize:response.pagination.per_page,
            totalItems:response.pagination.total_items,
            totalPages:response.pagination.total_pages
        }
        loading.value = false
    })
}

const getUser = async (id)=>{
    loading.value = true
    sendApi(`/admin/users/${id}`,null,'GET').then(response=>{
        console.log(response)
        user.value = response.data
        userRole.value = response.data.role.value
    })
}

const viewUser = (id)=>{
    open.value = true
    getUser(id)
}
const showBalance = (id)=>{
    openBalance.value = true
    getUser(id)
}

const acceptUser = async(id)=>{
    sendApi(`/admin/users/${id}/accept`,null,'PUT').then(response=>{
        getUsers(pagination.value.pageIndex + 1)
    })
}

const updateRole = async(id,role)=>{
    sendApi(`/admin/users/${id}/set-role`,{role:role},'PUT').then(response=>{
        open.value = false,
        getUsers(pagination.value.pageIndex + 1)
    })
}

const setUserBalance = async(id)=>{
    const data = ref({
        amount:userBalance.value.amount ===  null ? Number.parseFloat(0).toFixed(2) : Number.parseFloat(userBalance.value.amount).toFixed(2),
        unpaid_amount: userBalance.value.debts ===  null ? Number.parseFloat(0).toFixed(2) : Number.parseFloat(userBalance.value.debts).toFixed(2)
    })
    sendApi(`/admin/users/${id}/set-balance`,data.value,'PUT').then(response=>{
        getUser(id)
        userBalance.value.amount = null
        userBalance.value.debts = null
    })
}

const manageUserDebts = async (id)=>{
    const payment = userBalance.value.payment ===  null ? Number.parseFloat(0).toFixed(2) : Number.parseFloat(userBalance.value.payment).toFixed(2)
    sendApi(`/admin/users/${id}/manage-debts`,{amount:payment},'PATCH').then(response=>{
        getUser(id)
        userBalance.value.payment = null
    })
}

const resetSold = async(id)=>{
    sendApi(`/admin/users/${id}/reset-balance`,null,'POST').then(response=>{
        getUser(id)
        openReset.value = false
    })
}

const getTransactions = async(id)=>{
    loadingTransactions.value = true
    let url = `/admin/users/${id}/transactions?`
    if(transactionFilters.value.from){
        url += `from=${transactionFilters.value.from}&`
    }
    if(transactionFilters.value.to){
        url += `to=${transactionFilters.value.to}`
    }
    sendApi(url,null,'GET').then(response=>{
        console.log(response)
        transactions.value = response.data
        selectedTransactions.value = {}
        getUser(id)
        openTransactions.value = true
        loadingTransactions.value = false
    })
}

const deleteUser = async (id)=>{
    sendApi(`/admin/users/${id}/delete`,null,'DELETE').then(response=>{
        getUsers(pagination.value.pageIndex + 1)
    })
}

const onPageChange = async (page)=>{
    await getUsers(page)
}
</script>

<style scoped>

</style>
