<template>
    <div class="min-h-[calc(100vh-80px)] w-full space-y-4 py-8 pb-16 px-4 md:px-8">
        <div class="flex flex-col gap-5">
            <div class="">
                <UInput 
                v-model="search"
                icon="i-lucide-search" 
                size="md" 
                variant="outline"
                placeholder="Rechercher..."
                @update:model-value="getOrders"
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
        <USlideover fullscreen v-model:open="open"  
        close-icon="i-lucide-arrow-right" :close="{
        color: 'secondary',
        class:'cursor-pointer',
        }">
            <template #header>
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-secondary">
                        <div>
                            {{ order?.user?.name }}
                        </div>
                    </div>
                    <UBadge class="w-fit font-bold" variant="subtle" :color="offerStatus.color" :label="offerStatus.label"/>
                </div>
            </template>
            <template #body>
                <div class="flex flex-col gap-5">
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Visa:</p>
                        <div class="flex items-center gap-3">
                            <UAvatar :src="order?.visa?.country?.flag" size="sm"/>
                            <div>
                                {{ order?.visa?.country?.name }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Offre:</p>
                        <div>{{ order?.visa?.name }}</div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Garantie:</p>
                        <div>{{ offerGuarantee }}</div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Date:</p>
                        <NuxtTime :datetime="order?.created_at" locale="fr-FR" year="numeric" month="long" day="numeric"/>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Prix unitaire:</p>
                        <div>{{ order?.price / order?.members }} DZD</div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Membres:</p>
                        <div>{{ order?.members }}</div>
                    </div>
                    <UBadge size="xl" color="success" variant="subtle" class="w-fit flex items-center gap-2">
                        <p class="text-secondary">Prix total:</p>
                        <div class="font-bold">{{ order?.price }} DZD</div>
                    </UBadge>
                    
                </div>
            </template>
            <template #footer>
                <div v-if="order?.paiment_status === 'unpaid'" class="w-1/2">
                    <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'payer')" class="w-full align-middle font-bold" color="success">
                        <div class="w-full flex justify-between items-center">
                            <div>Payé</div>
                            <UIcon name="i-fluent-payment-24-filled"/>
                        </div>
                    </UButton>
                </div>
                <div v-else-if="order?.status === 'pending' && order?.paiment_status === 'paid'" class="w-full flex gap-2 justify-between">
                    <UButton @click="openAccept = true" class="w-full align-middle font-bold" color="success">
                        <div class="w-full flex justify-between items-center">
                            <div>Accepter</div>
                            <UIcon name="i-icon-park-solid-correct"/>
                        </div>
                    </UButton>
                    <UButton :loading="loadingAction === 'reject'" loading-icon="i-lucide-loader-circle" @click="()=>{
                        openConfirmation(order.id,'rejeter')
                        }" class="w-full align-middle font-bold" color="error">
                        <div class="w-full flex justify-between items-center">
                            <div>Rejeter</div>
                            <UIcon name="i-emojione-monotone-heavy-multiplication-x"/>
                        </div>
                    </UButton>
                </div>
                <div v-else class="w-1/2">
                    <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'supprimer')" class="w-full align-middle font-bold" color="error">
                        <div class="w-full flex justify-between items-center">
                            <div>Supprimer</div>
                            <UIcon name="i-material-symbols-delete-outline"/>
                        </div>
                    </UButton>
                </div>
            </template>
        </USlideover>
        <UModal v-model:open="openAccept" title="Confirmation de commande">
            <template #body>
                <div class="flex flex-col gap-5">
                    <div class="flex justify-center">
                        <label v-if="!uploadedFile.url" for="file">
                            <div 
                            class="cursor-pointer flex flex-col gap-2 justify-center items-center w-[200px] h-[100px] border-solid border-1 border-primary bg-primary/5 rounded-none">
                                <UIcon name="i-lineicons-upload" class="text-primary" size="30"/>
                                <div class="text-primary text-sm font-bold">Télécharger un document</div>
                            </div>
                            <UInput type="file" class="hidden" id="file" @change="onFileChange"/>
                        </label>
                        <div v-else class="flex items-start" style="margin-top: 20px;">
                            <ULink :to="uploadedFile.url">
                                <UIcon name="i-teenyicons-pdf-solid" class="text-secondary" size="100"/>
                            </ULink>
                            <UIcon 
                            name="i-material-symbols-cancel" 
                            class="cursor-pointer text-error"
                            @click="()=>{
                                uploadedFile.url = null
                                uploadedFile.file = null 
                            }"
                            />
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <UButton loading-icon="i-lucide-loader-circle" :loading="loadingAction ==='accept'" @click="acceptOrder" label="Envoyer" color="primary" class="font-bold w-fit"/>
                    </div>
                </div>
            </template>
        </UModal>
        <UModal v-model:open="openInvoice" title="Ajouter une facture">
            <template #body>
                <div class="flex flex-col gap-5">
                    <UFormField :ui="{label:'text-secondary'}" label="Adresse" name="address">
                        <UInput placeholder="Adresse" v-model="bank_info.address" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>

                    <UFormField :ui="{label:'text-secondary'}" label="Clé" name="key">
                        <UInput placeholder="Clé" v-model="bank_info.key" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>

                    <UFormField :ui="{label:'text-secondary'}" label="RIB" name="rib">
                        <UInput placeholder="RIB" v-model="bank_info.rib" class="lg:w-100 md:w-80 w-60"/>
                    </UFormField>
                    <div class="flex justify-center">
                        <UButton loading-icon="i-lucide-loader-circle" :loading="loadingAction ==='invoice'" @click="createInvoice()" label="Ajouter" color="primary" class="font-bold w-fit"/>
                    </div>
                </div>
            </template>
        </UModal>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import { refDebounced } from '#imports'
import { NuxtTime, UIcon } from '#components'
import Confirmation from '~/components/modals/Confirmation.vue'
import Invoice from '~/components/invoices/Invoice.vue'
import html2canvas from 'html2canvas'
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const overlay = useOverlay()
const order = ref({})
const action = ref(null)


const openConfirmation = async(id, action)=> {
    const modal = overlay.create(Confirmation, {
        props:{
            title:`Êtes-vous sûr de vouloir ${action} cette commande ?`,
        },
        defineEmits:['delete']
    })
    const instance = modal.open()
    const close = await instance.result
    if(!close){
        if(action === "rejeter"){
            rejectOrder(id)
        }
        else if(action === "payer"){
            markAsPaid(id)
        }
        else{
            deleteOrder(id)
        }
    }
}

const openInvoiceModal = async(id)=> {
    const invoices = await getInvoice(id)
    // console.log(h)
    const invoiceModal = overlay.create(Invoice,{
        props:{
            id:id,
            invoices:invoices
        }
    })
    console.log(id)
    const instance = invoiceModal.open()
    const close = await instance.result
    console.log(close)
    if(close){
        const {jsPDF} = await import('jspdf')
        html2canvas(close).then(function(canvas) {
            const imgData = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF({
                        orientation: 'p',
                        unit: 'px',
                        format: 'a4',
                    });
            pdf.addImage(imgData, 'JPEG', 5,5);
            pdf.save("document.pdf");
        });
    }
    order.value.id = null

}


const open = ref(false)
const openAccept = ref(false)
const openInvoice = ref(false)
const orderInvoice = ref({})
const offerGuarantee = ref({})
const offerStatus = ref({})
const uploadedFile = ref({
    url:null,
    file:null
})
const bank_info = ref({
    address:null,
    key:null,
    rib:null
})


const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')

const columns = [
    {
        accessorKey: 'offer',
        header: 'Visa',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, {
                src:row.original?.offer?.flag,
                size: 'xl',
                }),
                h('div', undefined, [
                    h('div', { class: '' }, row.original.offer.name),
                ])
            ])
        }
    },
    {
        accessorKey: 'created_at',
        header: 'Date de soumission',
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
    {
        accessorKey: 'unit_price',
        header: 'Prix unitaire',
    },
    {
        accessorKey: 'members',
        header: 'Membres',
    },
    {
        accessorKey: 'total_price',
        header: 'Prix total',
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const color = {
                accepted: 'success',
                rejected: 'error',
                pending:'warning'
            }[row.getValue('status')]

            const status = {
                accepted: 'Accepté',
                rejected: 'Rejeté',
                pending:'En attente'
            }[row.getValue('status')]

            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, status)
        }
    },
    {
        accessorKey: 'payment_status',
        header: 'Paiement',
        cell: ({ row }) => {
            const color = {
                paid: 'success',
                unpaid: 'error',
            }[row.getValue('payment_status')]

            const status = {
                paid: 'Payé',
                unpaid: 'Non payé',
            }[row.getValue('payment_status')]

            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color }, status)
        }
    },
    {
        accessorKey: 'response_by_date',
        header: 'Date de réponse',
        cell:({row})=>{
            return h(
                'div',
                undefined,
                row.original.response_by_date ?
                h(NuxtTime,{
                    datetime:row.original.response_by_date,
                    locale:"fr-FR",
                    year:"numeric",
                    month:"numeric",
                    day:"numeric"
                }): "Aucun"
            )
        }
    },
    {
        accessorKey:"attachment",
        header:"Attachement",
        cell:({row})=>{
            return h(
                'div',
                {class:"text-center"},
                row.original.attachment ?
                h(UIcon,
                {
                    name:"i-teenyicons-attachment-solid",
                    size:"17",
                    class:"cursor-pointer text-primary",
                    onClick:()=>{
                        const url = row.original.attachment;
                        window.open(url, "_blank");
                    }
                }) : "Aucun"
            )
        }
    }
]

const pagination = ref({
  pageIndex: undefined,
  pageSize: undefined,
  totalItems:undefined,
  totalPages:undefined
})
const data = ref([])

const loading = ref(false)
const loadingAction = ref(null)
const emptyTable = ref('')


const search = ref('')
const searchDebounce = refDebounced(search,200)

onMounted(()=>{
    getOrders(1);
})

const onFileChange = (event)=> {
      const file = event.target.files[0];
      if (file && file.type.startsWith('application/pdf')) {
        uploadedFile.value.url = URL.createObjectURL(file);
        uploadedFile.value.file = file
        console.log(uploadedFile.value.url)
      } else {
        uploadedFile.value = null;
      }
}

const getOrders = async (page=1)=>{
    loading.value = true
    sendApi(`/client/visa/orders?page=${page}&per_page=10&search=${searchDebounce.value}`,null,'GET').then(response=>{
        data.value = response.data
        pagination.value = {
            pageIndex:response.pagination.current_page - 1,
            pageSize:response.pagination.per_page,
            totalItems:response.pagination.total_items,
            totalPages:response.pagination.total_pages
        }
        console.log(data.value)
        loading.value = false
    })
}

const getOrder = async (id)=>{
    loading.value = true
    sendApi(`/admin/visa/orders/${id}`,null,'GET').then(response=>{
        console.log(response)
        order.value = response.data
        offerGuarantee.value = {
            with: 'Totale',
            without: 'Sans',
            half:'Demi'
        }[response.data.visa.guarantee]
        offerStatus.value = {
            accepted: {color:'success',label:'Accepté'},
            rejected: {color:'error',label:'Rejeté'},
            pending: {color:'primary',label:'En attente'},
        }[response.data.status]
        console.log(response.data.status)
        loading.value = false
    })
}

const acceptOrder = async ()=>{
    loadingAction.value = "accept" 
    const formData = new FormData()
    formData.append('file', uploadedFile.value.file)
    formData.append('_method','PUT')
    sendApi(`/admin/visa/orders/${order.value.id}/accept`,formData,'POST').then(()=>{
        getOrder(order.value.id)
        getOrders(pagination.value.pageIndex + 1)
        openAccept.value = false
        uploadedFile.value.url = null
        uploadedFile.value.file = null
        loadingAction.value = null
    })
}

const markAsPaid = async ()=>{
    loadingAction.value = "paid"
    sendApi(`/admin/visa/orders/${order.value.id}/paid`,null,'PUT').then(()=>{
        getOrder(order.value.id)
        getOrders(pagination.value.pageIndex + 1)
        loadingAction.value = null
    })
}

const rejectOrder = async ()=>{
    loadingAction.value = "reject" 
    sendApi(`/admin/visa/orders/${order.value.id}/reject`,null,'PUT').then(()=>{
        getOrder(order.value.id)
        getOrders(pagination.value.pageIndex + 1)
        loadingAction.value = null
    })
}

const deleteOrder = async (id)=>{
    sendApi(`/admin/visa/orders/${id}/delete`,null,'DELETE').then(()=>{
        open.value = false
        getOrders(pagination.value.pageIndex + 1)
    })
}

const getInvoice = async(id)=>{
    const response = sendApi(`/admin/visa/orders/${id}/invoice`,null,'GET').then((response)=>{
        return response.data
    })
    return response
}

const createInvoice = async()=>{
    console.log(bank_info.value)
    sendApi(`/admin/visa/orders/${order.value.id}/create-invoice`,{bank_info:bank_info.value},'POST').then(()=>{
        order.value.id = null
        bank_info.value.address = null
        bank_info.value.key = null
        bank_info.value.rib = null
        openInvoice.value = false
        getOrders(pagination.value.pageIndex + 1)
    })
}

const downloadZip = async (user,id)=> {
    const blob = await sendApi(`/admin/visa/orders/${id}/download`,null,'GET')
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', user+'.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


const onPageChange = async (page)=>{
    await getOrders(page)
}
</script>

<style scoped>
.pdf-content {
  color: #333;
}
</style>
