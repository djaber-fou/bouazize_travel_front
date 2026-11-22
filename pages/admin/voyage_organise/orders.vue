<template>
    <div class="w-full space-y-4 pb-4">
        <div class="flex flex-col gap-5">
            <div class="flex flex-col sm:flex-row gap-3">
                <UInput 
                v-model="search"
                icon="i-lucide-search" 
                size="md" 
                variant="outline" 
                placeholder="Rechercher..."
                class="w-full sm:w-72"
                />
                <USelect v-model="orderStatusValue" value-key="id" :items="orderStatusItems" class="w-full sm:w-48" placeholder="Sélectionner" />
            </div>
            <div class="overflow-x-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
                <UTable
                :sticky="true"
                ref="table"
                v-model:pagination="pagination"
                :data="data"
                :columns="columns"
                :loading="loading && !data.length"
                :empty="loading?'chargement en cours...':'Données non trouvées'"
                class="w-full"
                />
            </div>
        
                <div class="flex justify-center border-t border-default pt-4">
                    <UPagination
                    :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getState().pagination.totalItems"
                    @update:page="onPageChange"
                        
                    />
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
                        <div class="text-base">
                            {{ order?.user?.name || order?.guest_name || 'Client' }}
                        </div>
                        <div v-if="order?.user?.email || order?.user?.phone" class="text-xs font-normal text-gray-500">
                            {{ [order?.user?.email, order?.user?.phone].filter(Boolean).join(' • ') }}
                        </div>
                    </div>
                    <UBadge class="w-fit font-bold" variant="subtle" :color="offerStatus?.color || 'primary'" :label="offerStatus?.label || 'En attente'"/>
                </div>
            </template>
            <template #body>
                <div class="flex flex-col gap-5">
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">VoyageOrganise:</p>
                        <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center">
                                <img v-if="order?.VoyageOrganise?.country?.flag" :src="order?.VoyageOrganise?.country?.flag" class="w-full h-full object-cover" />
                                <UIcon v-else name="i-heroicons-globe-alt" class="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                                {{ order?.VoyageOrganise?.country?.name }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Offre:</p>
                        <div>{{ order?.VoyageOrganise?.name }}</div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Garantie:</p>
                        <div>{{ offerGuarantee }}</div>
                    </div>
                    <div class="flex flex-col  gap-2">
                        <p class="text-secondary">Date:</p>
                        <NuxtTime :datetime="order?.created_at" locale="fr-FR" year="numeric" month="long" day="numeric"/>
                    </div>
                    <div v-if="order?.room_type" class="flex flex-col gap-2">
                        <p class="text-secondary font-bold">Type de Chambre:</p>
                        <div>
                            <UBadge color="primary" variant="soft" class="font-bold text-sm">
                                {{ order?.room_type }}
                            </UBadge>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <p class="text-secondary font-bold">Composition des Voyageurs:</p>
                        <div class="flex flex-wrap gap-2 text-sm">
                            <span class="bg-gray-100 dark:bg-slate-800 px-3 py-1 font-semibold text-secondary rounded-none">{{ order?.members }} Adulte(s)</span>
                            <span v-if="order?.children_count" class="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 px-3 py-1 font-semibold rounded-none">{{ order?.children_count }} Enfant(s)</span>
                            <span v-if="order?.babies_count" class="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 px-3 py-1 font-semibold rounded-none">{{ order?.babies_count }} Bébé(s)</span>
                        </div>
                    </div>
                                        <UBadge size="xl" color="success" variant="subtle" class="w-fit flex items-center gap-2">
                        <p class="text-secondary">Prix total:</p>
                        <div class="font-bold">{{ order?.price }} DZD</div>
                    </UBadge>
                    <div class="flex flex-col gap-2">
                        <p class="text-secondary font-bold">Mode de paiement:</p>
                        <div>
                            <UBadge v-if="order?.is_credit || order?.payment_method === 'credit'" color="primary" variant="subtle" class="font-bold text-sm">
                                Crédit B2B (Dette autorisée)
                            </UBadge>
                            <UBadge v-else color="neutral" variant="soft" class="font-bold text-sm uppercase">
                                {{ order?.payment_method || 'CCP / Virement' }}
                            </UBadge>
                        </div>
                    </div>

                    <!-- TroveSeek Production Attribution & Commission Summary -->
                    <div class="p-4 bg-primary/5 dark:bg-[#071124] border border-primary/30 space-y-2">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <span class="text-xs font-extrabold uppercase tracking-wider text-secondary dark:text-white">
                                Partenaire Média : TroveSeek Production
                            </span>
                            <UBadge :color="order?.attributed_to === 'troveseek' ? 'success' : 'neutral'" variant="subtle" size="xs" class="font-bold">
                                {{ order?.attributed_to === 'troveseek' ? 'Client TroveSeek Confirmé' : (order?.attribution_source || 'Direct / Agence') }}
                            </UBadge>
                        </div>
                        <div class="text-xs space-y-1 text-gray-600 dark:text-slate-300">
                            <div v-if="order?.attribution_source"><strong>Source :</strong> {{ order.attribution_source }}</div>
                            <div v-if="order?.attribution_code"><strong>Code Média :</strong> <span class="font-mono text-primary font-bold">{{ order.attribution_code }}</span></div>
                            <div v-if="order?.attribution_survey"><strong>Réponse Client :</strong> {{ order?.attribution_proof?.survey_label || order.attribution_survey }}</div>
                            <div class="pt-1 font-bold text-primary text-sm">
                                Part TroveSeek Production sur cette offre : {{ Number(order?.troveseek_commission_dzd || order?.VoyageOrganise?.troveseek_commission || 0).toLocaleString('fr-FR') }} DZD
                            </div>
                        </div>
                    </div>

                    <!-- Acceptance / Response Documents Sent -->
                    <div v-if="order?.acceptance_documents && order.acceptance_documents.length > 0" class="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
                        <div class="flex items-center justify-between">
                            <p class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                                <UIcon name="i-heroicons-paper-clip" class="w-4 h-4" />
                                Documents envoyés ({{ order.acceptance_documents.length }})
                            </p>
                            <span v-if="order.sent_at" class="text-[11px] text-emerald-700 dark:text-emerald-400">
                                Envoyé le <NuxtTime :datetime="order.sent_at" locale="fr-FR" year="numeric" month="short" day="numeric" hour="2-digit" minute="2-digit" />
                            </span>
                        </div>
                        <div class="space-y-1.5">
                            <div
                                v-for="doc in order.acceptance_documents"
                                :key="doc.id"
                                class="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 text-xs"
                            >
                                <span class="font-semibold text-slate-700 dark:text-slate-200 truncate" :title="doc.original_name">{{ doc.original_name }}</span>
                                <UButton
                                    size="xs"
                                    color="primary"
                                    variant="soft"
                                    icon="i-heroicons-arrow-down-tray"
                                    label="Télécharger"
                                    @click="downloadAcceptanceDoc(doc)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
                                    <template #footer>
                <div class="w-full flex flex-col gap-2">
                    <!-- B2B Order Banner -->
                    <div v-if="isB2BOrder" class="text-xs p-2.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
                        <UIcon name="i-lucide-info" class="w-4 h-4 shrink-0" />
                        <span>Client B2B (Dette autorisée) : Vous pouvez accepter ou rejeter directement la commande. La dette reste inscrite sur le compte de l'agence.</span>
                    </div>

                    <!-- B2B Actions: NO 'Payé' button, directly Accepter, Rejeter, Supprimer -->
                    <template v-if="isB2BOrder">
                        <div v-if="order?.status === 'pending'" class="w-full flex flex-col gap-2">
                            <div class="w-full flex gap-2 justify-between">
                                <UButton @click="()=>{
                                    openAccept = true
                                    orderAction = 'accept'
                                }" class="w-full align-middle font-bold" color="success">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Accepter</div>
                                        <UIcon name="i-icon-park-solid-correct"/>
                                    </div>
                                </UButton>
                                <UButton :loading="loadingAction === 'reject'" loading-icon="i-lucide-loader-circle" @click="()=>{
                                    openAccept = true
                                    orderAction = 'reject'
                                }" class="w-full align-middle font-bold" color="error">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Rejeter</div>
                                        <UIcon name="i-emojione-monotone-heavy-multiplication-x"/>
                                    </div>
                                </UButton>
                            </div>
                            <div class="w-1/2">
                                <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'supprimer')" class="w-full align-middle font-bold" color="error" variant="soft">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Supprimer</div>
                                        <UIcon name="i-material-symbols-delete-outline"/>
                                    </div>
                                </UButton>
                            </div>
                        </div>
                        <div v-else class="w-1/2">
                            <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'supprimer')" class="w-full align-middle font-bold" color="error" variant="soft">
                                <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>Supprimer</div>
                                    <UIcon name="i-material-symbols-delete-outline"/>
                                </div>
                            </UButton>
                        </div>
                    </template>

                    <!-- Individual Actions -->
                    <template v-else>
                        <div v-if="order?.status === 'pending'" class="w-full flex flex-col gap-2">
                            <div v-if="order?.paiment_status === 'paid'" class="w-full flex gap-2 justify-between">
                                <UButton @click="()=>{
                                    openAccept = true
                                    orderAction = 'accept'
                                }" class="w-full align-middle font-bold" color="success">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Accepter</div>
                                        <UIcon name="i-icon-park-solid-correct"/>
                                    </div>
                                </UButton>
                                <UButton :loading="loadingAction === 'reject'" loading-icon="i-lucide-loader-circle" @click="()=>{
                                    openAccept = true
                                    orderAction = 'reject'
                                }" class="w-full align-middle font-bold" color="error">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Rejeter</div>
                                        <UIcon name="i-emojione-monotone-heavy-multiplication-x"/>
                                    </div>
                                </UButton>
                            </div>
                            <div v-else class="w-full flex gap-2 justify-between">
                                <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'payer')" class="w-full align-middle font-bold" color="success">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Marquer Payé</div>
                                        <UIcon name="i-fluent-payment-24-filled"/>
                                    </div>
                                </UButton>
                                <UButton :loading="loadingAction === 'reject'" loading-icon="i-lucide-loader-circle" @click="()=>{
                                    openAccept = true
                                    orderAction = 'reject'
                                }" class="w-full align-middle font-bold" color="error">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Rejeter</div>
                                        <UIcon name="i-emojione-monotone-heavy-multiplication-x"/>
                                    </div>
                                </UButton>
                            </div>
                            <div class="w-1/2">
                                <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'supprimer')" class="w-full align-middle font-bold" color="error" variant="soft">
                                    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>Supprimer</div>
                                        <UIcon name="i-material-symbols-delete-outline"/>
                                    </div>
                                </UButton>
                            </div>
                        </div>
                        <div v-else class="w-1/2">
                            <UButton loading-icon="i-lucide-loader-circle" @click="openConfirmation(order.id, 'supprimer')" class="w-full align-middle font-bold" color="error" variant="soft">
                                <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>Supprimer</div>
                                    <UIcon name="i-material-symbols-delete-outline"/>
                                </div>
                            </UButton>
                        </div>
                    </template>
                </div>
            </template>
        </USlideover>
        <UModal v-model:open="openAccept" :title="orderAction === 'reject' ? 'Rejet de commande — Documents justificatifs (optionnels)' : 'Acceptation — Joindre un ou plusieurs documents'">
            <template #body>
                <div class="flex flex-col gap-5">
                    <MultiFileDropzone
                        v-model="selectedFiles"
                        :progress="uploadProgress"
                        :disabled="loadingAction === 'accept' || loadingAction === 'reject'"
                    />
                    <div class="flex justify-end gap-2">
                        <UButton variant="ghost" color="gray" label="Annuler" :disabled="loadingAction === 'accept' || loadingAction === 'reject'" @click="openAccept = false" />
                        <UButton
                            loading-icon="i-lucide-loader-circle"
                            :loading="loadingAction === 'accept' || loadingAction === 'reject'"
                            :color="orderAction === 'reject' ? 'error' : 'primary'"
                            :label="orderAction === 'reject' ? 'Confirmer le rejet' : `Accepter et envoyer (${selectedFiles.length})`"
                            class="font-bold w-fit"
                            @click="() => {
                                if (orderAction === 'accept') {
                                    acceptOrder()
                                } else {
                                    rejectOrder()
                                }
                            }"
                        />
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
        <UModal v-model:open="openDocsModal" fullscreen>
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <div class="flex items-center gap-4">
                        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="openDocsModal = false" />
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Documents de la commande #{{ selectedDocsOrderId }}</h2>
                    </div>
                    <UButton :loading="loadingDocsZip" loading-icon="i-lucide-loader-circle" icon="i-heroicons-arrow-down-tray" @click="downloadAllDocs" color="primary" variant="solid" label="Télécharger Tout" />
                </div>
            </template>
            <template #body>
                <div class="p-6 bg-gray-50 dark:bg-slate-950 min-h-full">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(doc, index) in selectedOrderDocs" :key="index" class="flex flex-col gap-2 bg-white dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-bold text-secondary truncate" :title="getDocName(doc)">{{ getDocName(doc) }}</span>
                                <UButton icon="i-heroicons-arrow-down-tray" @click="downloadSingleFile(doc)" size="sm" color="primary" variant="soft" label="Télécharger" />
                            </div>
                            <div class="bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center h-64">
                                <iframe v-if="getDocExt(doc) === 'pdf'" :src="doc" class="w-full h-full border-0"></iframe>
                                <img v-else-if="['jpg','jpeg','png','webp','gif'].includes(getDocExt(doc))" :src="doc" class="w-full h-full object-contain" />
                                <div v-else class="flex flex-col items-center gap-2 text-gray-500">
                                    <UIcon name="i-heroicons-document" class="w-16 h-16" />
                                    <span class="text-sm">{{ getDocName(doc) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!selectedOrderDocs?.length" class="text-center text-gray-500 py-10">
                        Aucun document trouvé pour cette commande.
                    </div>
                </div>
            </template>
        </UModal>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import { refDebounced } from '#imports'
import { UIcon } from '#components'
import Confirmation from '~/components/modals/Confirmation.vue'
import Invoice from '~/components/invoices/Invoice.vue'
import html2canvas from 'html2canvas'
import axios from 'axios'
import { useAuthStore } from '#imports'
import JSZip from 'jszip'
import pkg from 'file-saver'
import ExpandableTitle from '~/components/common/ExpandableTitle.vue'
import MultiFileDropzone from '~/components/admin/MultiFileDropzone.vue'
const { saveAs } = pkg
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const overlay = useOverlay()
const order = ref({})
const action = ref(null)
const orderAction = ref(null)

const isB2BOrder = computed(() => {
    const ord = order.value
    if (!ord) return false
    const u = ord.user
    const role = typeof u?.role === 'object' ? u?.role?.value : u?.role
    return Boolean(
        ord.is_b2b ||
        ord.is_credit ||
        ord.payment_method === 'credit' ||
        role === 'business'
    )
})

const openDocsModal = ref(false)
const selectedOrderDocs = ref([])
const selectedDocsOrderId = ref(null)

const openDocsViewer = (orderId, docs) => {
    selectedDocsOrderId.value = orderId
    selectedOrderDocs.value = docs
    openDocsModal.value = true
}

const getDocName = (url) => {
    if (!url) return 'Document'
    try {
        const parts = url.split('/')
        let filename = parts[parts.length - 1].split('?')[0]
        filename = decodeURIComponent(filename)
        return filename
    } catch { return 'Document' }
}

const getDocExt = (url) => {
    if (!url) return ''
    return url.split('.').pop().split('?')[0].toLowerCase()
}

const downloadSingleFile = async (url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        const blob = await response.blob()
        const filename = getDocName(url)
        saveAs(blob, filename)
    } catch (e) {
        console.error(e)
        window.open(url, '_blank')
    }
}

const loadingDocsZip = ref(false)

const downloadAllDocs = async () => {
    if (!selectedOrderDocs.value?.length) return
    loadingDocsZip.value = true
    
    try {
        const zip = new JSZip()
        const folderName = `commande_${selectedDocsOrderId.value}_documents`
        const folder = zip.folder(folderName)
        
        const promises = selectedOrderDocs.value.map(async (docUrl, index) => {
            const response = await fetch(docUrl)
            const blob = await response.blob()
            const filename = getDocName(docUrl)
            folder.file(filename, blob)
        })
        
        await Promise.all(promises)
        
        const content = await zip.generateAsync({ type: 'blob' })
        saveAs(content, `${folderName}.zip`)
    } catch (e) {
        console.error(e)
        useToast().add({title:"Erreur", description:"Erreur lors de la préparation du fichier zip", color:"red"})
    } finally {
        loadingDocsZip.value = false
    }
}

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
const offerStatus = ref({ color: 'primary', label: 'En attente' })
const uploadedFile = ref({
    url:null,
    file:null
})
const bank_info = ref({
    address:null,
    key:null,
    rib:null
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
        header: 'Utilisateur',
        cell: ({ row }) => {
            const userName = row.original?.user?.name || row.original?.guest_name || 'Invité'
            const userSub = row.original?.user?.email || row.original?.user?.phone || ''
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, {
                    src: row.original?.user?.image,
                    size: 'md',
                    icon: row.original?.user?.image ? null : "i-lucide-user-round"
                }),
                h('div', { class: 'flex flex-col' }, [
                    h('div', { class: 'font-medium text-gray-900 dark:text-white' }, userName),
                    userSub ? h('div', { class: 'text-xs text-gray-500' }, userSub) : null
                ])
            ])
        }
    },
    {
        accessorKey: 'country',
        header: 'Pays',
        cell:({row})=>{
            return h('div', { class: 'font-medium' }, row.original?.VoyageOrganise?.country?.name || '-')
        }
    },
    {
        accessorKey: 'VoyageOrganise',
        header: 'Offre',
        cell:({row})=>{
            return h(ExpandableTitle, {
                title: row.original?.VoyageOrganise?.name || '-',
                avatar: row.original?.VoyageOrganise?.image,
                avatarSize: 'md',
                maxChars: 35
            })
        }
    },
    {
        accessorKey: 'price',
        header: 'Prix',
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const val = row.getValue('status')
            const statusMap = {
                accepted: { color: 'success', label: 'Accepté' },
                confirmed: { color: 'success', label: 'Confirmé' },
                paid: { color: 'success', label: 'Payé' },
                completed: { color: 'success', label: 'Terminé' },
                rejected: { color: 'error', label: 'Rejeté' },
                cancelled: { color: 'error', label: 'Annulé' },
                pending: { color: 'warning', label: 'En attente' },
                option: { color: 'info', label: 'En Option' },
            }
            const meta = statusMap[val] || { color: 'neutral', label: val || 'En attente' }
            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color: meta.color }, () => meta.label)
        }
    },
                {
        accessorKey: 'paiment_status',
        header: 'Paiement',
        cell: ({ row }) => {
            const val = row.getValue('paiment_status')
            const paymentMap = {
                paid: { color: 'success', label: 'Payé' },
                half_paid: { color: 'warning', label: 'Partiel' },
                pending_payment: { color: 'warning', label: 'Attente' },
                unpaid: { color: 'error', label: 'Non payé' },
                rejected: { color: 'error', label: 'Refusé' },
            }
            const meta = paymentMap[val] || { color: 'neutral', label: val || 'Non payé' }
            return h(UBadge, { class: 'capitalize font-bold', variant: 'soft', color: meta.color }, () => meta.label)
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
                    name:"i-lucide-eye",
                    size:"17",
                    class:"cursor-pointer text-secondary",
                    onClick: () => {
                        order.value = row.original
                        getOrder(row.original.id)
                        open.value = true
                    }
                },
            ),
            h(
                UIcon,
                {
                    name:"i-lucide-folder-open",
                    size:"17",
                    class:"cursor-pointer text-secondary",
                    title:"Voir les documents",
                    onClick:()=>{openDocsViewer(row.original.id, row.original.documents)}
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
const orderStatusItems = ref([
        {
            label:"Tous",
            id:'all'
        },
        {
            label:"En attente",
            id:"pending"
        },
        {
            label:"Accepté",
            id:"accepted"
        },
        {
            label:"Rejeté",
            id:"rejected"
        }
    ])
const orderStatusValue = ref('all')
const data = ref([])

const loading = ref(false)
const loadingAction = ref(null)
const emptyTable = ref('')


const search = ref('')
const searchDebounce = refDebounced(search,200)

onMounted(()=>{
    getOrders(1);
})

const uploadedFileName = computed(() => uploadedFile.value?.file?.name || 'Document')
const uploadedFileIcon = computed(() => {
    const n = uploadedFileName.value.toLowerCase()
    if (/\.(jpe?g|png|gif|webp|heic|bmp)$/.test(n)) return 'i-lucide-image'
    if (/\.pdf$/.test(n)) return 'i-teenyicons-pdf-solid'
    if (/\.(docx?|odt|rtf|txt)$/.test(n)) return 'i-lucide-file-text'
    if (/\.(xlsx?)$/.test(n)) return 'i-lucide-file-spreadsheet'
    if (/\.(pptx?)$/.test(n)) return 'i-lucide-presentation'
    if (/\.(zip|rar|7z)$/.test(n)) return 'i-lucide-file-archive'
    return 'i-lucide-file'
})

const selectedFiles = ref([])
const uploadProgress = ref(0)

const resetUploadedFile = () => {
    if (uploadedFile.value?.url) {
        URL.revokeObjectURL(uploadedFile.value.url)
    }
    uploadedFile.value = { url: null, file: null }
    selectedFiles.value = []
    uploadProgress.value = 0
}

const downloadAcceptanceDoc = (doc) => {
    const targetUrl = doc?.signed_url || doc?.download_url
    if (targetUrl) window.open(targetUrl, '_blank')
}

const onFileChange = (event)=> {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
        useToast().add({ title: "Le fichier dépasse la taille maximale autorisée (20 Mo)", color: 'red' });
        return;
    }
    if (uploadedFile.value?.url) {
        URL.revokeObjectURL(uploadedFile.value.url);
    }
    uploadedFile.value = {
        url: URL.createObjectURL(file),
        file: file
    };
}

const getOrders = async (page = 1) => {
    const pageNum = typeof page === 'number' ? page : 1
    loading.value = true
    try {
        const response = await sendApi(`/admin/voyage_organise/orders?page=${pageNum}&per_page=10&search=${encodeURIComponent(search.value || '')}&status=${orderStatusValue.value}`, null, 'GET')
        data.value = response?.data?.data || response?.data || []
        if (response?.pagination) {
            pagination.value = {
                pageIndex: (response.pagination.current_page || 1) - 1,
                pageSize: response.pagination.per_page || 10,
                totalItems: response.pagination.total_items ?? data.value.length,
                totalPages: response.pagination.total_pages || 1
            }
        }
    } catch (err) {
        console.error('Error fetching voyage organise orders:', err)
        data.value = []
    } finally {
        loading.value = false
    }
}

const getOrder = async (id)=>{
    loading.value = true
    sendApi(`/admin/voyage_organise/orders/${id}`,null,'GET').then(response=>{
        console.log(response)
        order.value = response.data
        offerGuarantee.value = {
            with: 'Totale',
            without: 'Sans',
            half: 'Demi'
        }[response.data.VoyageOrganise?.guarantee] || 'Sans'
        const statusMap = {
            accepted: { color: 'success', label: 'Accepté' },
            confirmed: { color: 'success', label: 'Confirmé' },
            paid: { color: 'success', label: 'Payé' },
            completed: { color: 'success', label: 'Terminé' },
            rejected: { color: 'error', label: 'Rejeté' },
            cancelled: { color: 'error', label: 'Annulé' },
            pending: { color: 'primary', label: 'En attente' },
            pending_payment: { color: 'warning', label: 'Attente Paiement' },
            unpaid: { color: 'warning', label: 'Non Payé' },
            option: { color: 'info', label: 'En Option' },
        }
        offerStatus.value = statusMap[response.data.status] || { color: 'primary', label: response.data.status || 'En attente' }
        loading.value = false
    })
}

const uploadOrderActionWithProgress = async (endpoint, filesList) => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const token = authStore.Authorization?.token
    const formData = new FormData()
    filesList.forEach((f) => formData.append('files[]', f))
    formData.append('_method', 'PUT')
    uploadProgress.value = 1

    const res = await axios.post(`${config.public.apiBaseUrl}${endpoint}`, formData, {
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        onUploadProgress: (evt) => {
            if (evt.total) {
                uploadProgress.value = Math.min(99, Math.round((evt.loaded * 100) / evt.total))
            }
        },
    })
    uploadProgress.value = 100
    return res.data
}

const acceptOrder = async ()=>{
    if (!selectedFiles.value.length) {
        useToast().add({ title: "Veuillez joindre au moins un document avant d'accepter", color: 'red' })
        return
    }
    loadingAction.value = "accept"
    try {
        const response = await uploadOrderActionWithProgress(`/admin/voyage_organise/orders/${order.value.id}/accept`, selectedFiles.value)
        if (response) {
            useToast().add({ title: response.message || 'Commande acceptée et documents envoyés', color: 'success' })
            openAccept.value = false
            orderAction.value = null
            resetUploadedFile()
            await Promise.all([
                getOrder(order.value.id),
                getOrders((pagination.value.pageIndex ?? 0) + 1)
            ])
        }
    } catch (err) {
        useToast().add({ title: err?.response?.data?.message || "Échec lors de l'envoi des documents", color: 'red' })
    } finally {
        loadingAction.value = null
        uploadProgress.value = 0
    }
}

const markAsPaid = async ()=>{
    loadingAction.value = "paid"
    try {
        const response = await sendApi(`/admin/voyage_organise/orders/${order.value.id}/paid`, null, 'PUT')
        if (response) {
            await Promise.all([
                getOrder(order.value.id),
                getOrders((pagination.value.pageIndex ?? 0) + 1)
            ])
        }
    } finally {
        loadingAction.value = null
    }
}

const rejectOrder = async ()=>{
    loadingAction.value = "reject"
    try {
        const response = await uploadOrderActionWithProgress(`/admin/voyage_organise/orders/${order.value.id}/reject`, selectedFiles.value)
        if (response) {
            useToast().add({ title: response.message || 'Commande refusée avec succès', color: 'success' })
            openAccept.value = false
            orderAction.value = null
            resetUploadedFile()
            await Promise.all([
                getOrder(order.value.id),
                getOrders((pagination.value.pageIndex ?? 0) + 1)
            ])
        }
    } catch (err) {
        useToast().add({ title: err?.response?.data?.message || 'Échec lors du rejet de la commande', color: 'red' })
    } finally {
        loadingAction.value = null
        uploadProgress.value = 0
    }
}

const deleteOrder = async (id)=>{
    sendApi(`/admin/voyage_organise/orders/${id}/delete`,null,'DELETE').then(()=>{
        open.value = false
        getOrders(pagination.value.pageIndex + 1)
    })
}

const getInvoice = async(id)=>{
    const response = sendApi(`/admin/voyage_organise/orders/${id}/invoice`,null,'GET').then((response)=>{
        return response.data
    })
    return response
}

const createInvoice = async()=>{
    console.log(bank_info.value)
    sendApi(`/admin/voyage_organise/orders/${order.value.id}/create-invoice`,{bank_info:bank_info.value},'POST').then(()=>{
        order.value.id = null
        bank_info.value.address = null
        bank_info.value.key = null
        bank_info.value.rib = null
        openInvoice.value = false
        getOrders(pagination.value.pageIndex + 1)
    })
}



const onPageChange = async (page)=>{
    await getOrders(page)
}

watch(orderStatusValue, async ()=>{
    await getOrders(1)
})
watch(searchDebounce, async ()=>{
    await getOrders(1)
})
</script>

<style scoped>
.pdf-content {
  color: #333;
}
</style>
