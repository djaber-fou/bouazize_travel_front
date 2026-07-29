<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-none shadow-sm border border-gray-100 dark:border-slate-800">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Paiements CCP</h1>
        <p class="text-gray-500 dark:text-slate-400 text-sm mt-1">Gérez et vérifiez les paiements par BaridiMob / CCP.</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton color="gray" variant="outline" icon="i-heroicons-cog" to="/s3t4t5i6n">
          Paramètres CCP
        </UButton>
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="fetchPayments" :loading="pending">
          Actualiser
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-900 rounded-none shadow-sm border border-gray-100 dark:border-slate-800 p-4 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
      <UInput v-model="filters.search" icon="i-heroicons-magnifying-glass" placeholder="Rechercher par client ou N° transaction..." class="w-full sm:w-72" @keyup.enter="fetchPayments" />
      <USelect v-model="filters.status" :items="statusOptions" @update:model-value="fetchPayments" class="w-44" />
      <USelect v-model="filters.order_type" :items="typeOptions" @update:model-value="fetchPayments" class="w-52" />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-900 rounded-none shadow-sm border border-gray-100 dark:border-slate-800">
      <UTable :data="payments" :columns="columns" :loading="pending">
        <template #empty>
          <div class="flex flex-col items-center py-16 text-gray-400">
            <UIcon name="i-heroicons-banknotes" class="w-12 h-12 mb-3 opacity-40" />
            <p>Aucun paiement CCP trouvé</p>
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-center" v-if="pagination.totalItems > 0">
        <UPagination
          v-model="pagination.pageIndex"
          :total="pagination.totalItems"
          :items-per-page="pagination.pageSize"
          @update:model-value="fetchPayments"
        />
      </div>
    </div>

    <!-- Reject Modal -->
    <UModal v-model:open="isRejectModalOpen" title="Rejeter le paiement">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormGroup label="Motif du rejet (facultatif)">
            <UTextarea v-model="rejectionReason" placeholder="Veuillez expliquer pourquoi le paiement est rejeté..." rows="3" />
          </UFormGroup>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="isRejectModalOpen = false">Annuler</UButton>
            <UButton color="red" @click="submitReject" :loading="isRejecting">Confirmer le rejet</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- View Modal -->
    <UModal v-model:open="isViewModalOpen" fullscreen>
      <template #header>
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="isViewModalOpen = false" />
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Détails du paiement CCP #{{ selectedPayment?.id }}</h2>
        </div>
      </template>
      <template #body>
        <div v-if="selectedPayment" class="grid md:grid-cols-2 gap-8 p-6 bg-gray-50 dark:bg-slate-950 min-h-full">
          <!-- Left: Details -->
          <div class="space-y-6">
            <UCard>
              <template #header>
                <h3 class="font-bold text-lg text-secondary dark:text-white">Informations du Client</h3>
              </template>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Nom:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedPayment.user?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Email:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedPayment.user?.email }}</span>
                </div>
                <div class="flex justify-between" v-if="selectedPayment.user?.phone">
                  <span class="text-gray-500">Téléphone:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedPayment.user?.phone }}</span>
                </div>
              </div>
            </UCard>
            
            <UCard>
              <template #header>
                <h3 class="font-bold text-lg text-secondary dark:text-white">Détails de la Transaction</h3>
              </template>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Montant:</span>
                  <span class="font-bold text-xl text-primary">{{ formatPrice(selectedPayment.amount) }} DZD</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">N° Transaction:</span>
                  <span class="font-mono font-bold text-gray-900 dark:text-white">{{ selectedPayment.transaction_number }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Compte CCP cible:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedPayment.ccp_account_number }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Service:</span>
                  <span class="font-medium capitalize text-gray-900 dark:text-white">{{ selectedPayment.order_type?.replace('_', ' ') }} (ID: {{ selectedPayment.order_id }})</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Soumis le:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ new Date(selectedPayment.created_at).toLocaleString('fr-FR') }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
                  <span class="text-gray-500">Statut:</span>
                  <UBadge :color="getStatusColor(selectedPayment.status)" variant="subtle" size="lg">{{ getStatusLabel(selectedPayment.status) }}</UBadge>
                </div>
                <div v-if="selectedPayment.status === 'rejected'" class="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800">
                  <span class="font-bold block mb-1">Motif du rejet:</span>
                  {{ selectedPayment.rejection_reason || 'Aucun motif fourni' }}
                </div>
              </div>
            </UCard>
            
            <!-- Actions in modal -->
            <div v-if="selectedPayment.status === 'pending'" class="flex gap-4">
              <UButton color="red" variant="soft" size="lg" icon="i-heroicons-x-mark" class="flex-1" @click="openRejectModal(selectedPayment)">Rejeter</UButton>
              <UButton color="green" size="lg" icon="i-heroicons-check" class="flex-1" @click="confirmPayment(selectedPayment.id)" :loading="isConfirming">Confirmer le paiement</UButton>
            </div>
          </div>
          
          <!-- Right: Proof File -->
          <div class="flex flex-col">
            <h3 class="font-bold text-lg text-secondary dark:text-white mb-4">Reçu de paiement</h3>
            <div class="flex-1 bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] relative group">
              <template v-if="selectedPayment.proof_file">
                <iframe 
                  v-if="getDocExt(selectedPayment.proof_file) === 'pdf'" 
                  :src="selectedPayment.proof_file" 
                  class="w-full h-[600px] rounded-lg border-0 bg-white"
                ></iframe>
                <img 
                  v-else-if="['jpg','jpeg','png','webp','gif'].includes(getDocExt(selectedPayment.proof_file))" 
                  :src="selectedPayment.proof_file" 
                  class="w-full h-full object-contain p-4 max-h-[600px]" 
                  alt="Reçu de paiement"
                />
                <div v-else class="flex flex-col items-center justify-center p-12 text-gray-500 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <UIcon name="i-heroicons-document" class="w-24 h-24 mb-4 text-gray-400" />
                  <p class="font-medium">Document attaché ({{ getDocExt(selectedPayment.proof_file).toUpperCase() }})</p>
                </div>
                <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UButton color="white" icon="i-heroicons-arrow-down-tray" @click="downloadProofFile" size="sm">
                    Télécharger
                  </UButton>
                </div>
              </template>
              <div v-else class="text-gray-400 flex flex-col items-center gap-3">
                <UIcon name="i-heroicons-document-minus" class="w-12 h-12" />
                <p>Aucun reçu attaché</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'
import pkg from 'file-saver'
const { saveAs } = pkg

definePageMeta({
    layout: 'admin'
})

const toast = useToast()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const payments = ref([])
const pending = ref(true)
const isConfirming = ref(false)

const filters = ref({
  search: '',
  status: 'all',
  order_type: 'all'
})

const pagination = ref({
  pageIndex: 1,
  pageSize: 15,
  totalItems: 0
})

const statusOptions = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'En attente', value: 'pending' },
  { label: 'Confirmé', value: 'confirmed' },
  { label: 'Rejeté', value: 'rejected' }
]

const typeOptions = [
  { label: 'Tous les services', value: 'all' },
  { label: 'Visa', value: 'visa' },
  { label: 'Omra', value: 'omra' },
  { label: 'Voyage Organisé', value: 'voyage_organise' }
]

const columns = [
  {
    accessorKey: 'user.name',
    header: 'Client',
    cell: ({ row }) => h('div', undefined, [
      h('p', { class: 'font-semibold text-gray-900 dark:text-white' }, row.original.user?.name || '-'),
      h('p', { class: 'text-xs text-gray-500' }, row.original.user?.email || '')
    ])
  },
  {
    accessorKey: 'order_type',
    header: 'Service',
    cell: ({ row }) => h('span', { class: 'capitalize font-medium text-gray-700 dark:text-slate-300' }, row.original.order_type?.replace('_', ' ') || '-')
  },
  {
    accessorKey: 'amount',
    header: 'Montant',
    cell: ({ row }) => h('span', { class: 'font-bold text-gray-900 dark:text-white' }, formatPrice(row.original.amount) + ' DZD')
  },
  {
    accessorKey: 'transaction_number',
    header: 'N° Transaction',
    cell: ({ row }) => h('span', { class: 'font-mono text-sm' }, row.original.transaction_number || '-')
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => h(UBadge, { color: getStatusColor(row.original.status), variant: 'subtle' }, () => getStatusLabel(row.original.status))
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const buttons = [
        h(UButton, { size: 'sm', color: 'gray', variant: 'ghost', icon: 'i-heroicons-eye', onClick: () => viewPayment(row.original) })
      ]
      if (row.original.status === 'pending') {
        buttons.push(h(UButton, { size: 'sm', color: 'green', variant: 'soft', icon: 'i-heroicons-check', onClick: () => confirmPayment(row.original.id), loading: isConfirming.value }))
        buttons.push(h(UButton, { size: 'sm', color: 'red', variant: 'soft', icon: 'i-heroicons-x-mark', onClick: () => openRejectModal(row.original) }))
      }
      return h('div', { class: 'flex items-center gap-2' }, buttons)
    }
  }
]

// Modal states
const isViewModalOpen = ref(false)
const selectedPayment = ref(null)
const isRejectModalOpen = ref(false)
const rejectionReason = ref('')
const isRejecting = ref(false)
const paymentToReject = ref(null)

const downloadProofFile = async () => {
  if (!selectedPayment.value?.proof_file) return
  
  const url = selectedPayment.value.proof_file
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
    const blob = await response.blob()
    
    let filename = getDocName(url)
    if (filename === 'Document') filename = `recu_paiement_${selectedPayment.value.id}.${getDocExt(url) || 'jpg'}`
    
    saveAs(blob, filename)
  } catch (e) {
    console.error(e)
    window.open(url, '_blank')
  }
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

onMounted(() => {
  fetchPayments()
})

const fetchPayments = async () => {
  pending.value = true
  try {
    const query = `page=${pagination.value.pageIndex}&per_page=${pagination.value.pageSize}&status=${filters.value.status}&order_type=${filters.value.order_type}&search=${filters.value.search}`
    const res = await sendApi(`/admin/ccp/payments?${query}`, null, 'GET')
    if (res?.data) {
      payments.value = res.data.data || res.data
      pagination.value.totalItems = res.data.total || 0
    }
  } catch (err) {
    toast.add({ title: 'Erreur lors du chargement des paiements', color: 'red' })
  } finally {
    pending.value = false
  }
}

const viewPayment = async (payment) => {
  try {
    const res = await sendApi(`/admin/ccp/payments/${payment.id}`, null, 'GET')
    if (res?.data) {
      selectedPayment.value = res.data
      isViewModalOpen.value = true
    }
  } catch (err) {
    toast.add({ title: 'Erreur de chargement', color: 'red' })
  }
}

const confirmPayment = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir confirmer ce paiement ? La commande associée sera marquée comme payée.')) return
  isConfirming.value = true
  try {
    await sendApi(`/admin/ccp/payments/${id}/confirm`, {}, 'POST')
    isViewModalOpen.value = false
    fetchPayments()
  } catch (err) {
    if (!err.response?.data?.message) {
      toast.add({ title: err?.message || 'Erreur de confirmation', color: 'red' })
    }
  } finally {
    isConfirming.value = false
  }
}

const openRejectModal = (payment) => {
  paymentToReject.value = payment
  rejectionReason.value = ''
  isRejectModalOpen.value = true
}

const submitReject = async () => {
  isRejecting.value = true
  try {
    await sendApi(`/admin/ccp/payments/${paymentToReject.value.id}/reject`, { rejection_reason: rejectionReason.value }, 'POST')
    isRejectModalOpen.value = false
    isViewModalOpen.value = false
    fetchPayments()
  } catch (err) {
    if (!err.response?.data?.message) {
      toast.add({ title: err?.message || 'Erreur de rejet', color: 'red' })
    }
  } finally {
    isRejecting.value = false
  }
}

// Helpers
const getStatusLabel = (status) => ({ pending: 'En attente', confirmed: 'Confirmé', rejected: 'Rejeté' }[status] || status)
const getStatusColor = (status) => ({ pending: 'yellow', confirmed: 'green', rejected: 'red' }[status] || 'gray')
const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price || 0)
</script>
