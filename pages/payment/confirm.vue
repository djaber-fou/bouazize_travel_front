<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center text-primary">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <span class="ml-2 font-medium hidden sm:block">Réservation</span>
          </div>
          <div class="w-12 h-1 bg-primary"></div>
          <div class="flex items-center text-primary">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <span class="ml-2 font-medium hidden sm:block">Paiement</span>
          </div>
          <div class="w-12 h-1 bg-gray-300 dark:bg-slate-700"></div>
          <div class="flex items-center text-gray-400 dark:text-slate-500">
            <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-700 text-white flex items-center justify-center font-bold">3</div>
            <span class="ml-2 font-medium hidden sm:block">Confirmation</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
        <!-- Header -->
        <div class="bg-primary p-6 text-white text-center">
          <h1 class="text-2xl font-bold mb-2">Paiement par BaridiMob / CCP</h1>
          <p class="text-primary-100">Veuillez effectuer le paiement pour confirmer votre commande.</p>
        </div>

        <div class="p-6 md:p-8 space-y-8">
          <!-- Order Summary (Optional info based on query params) -->
          <div v-if="amount" class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <span class="text-gray-600 dark:text-slate-400 font-medium">Montant à payer :</span>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatPrice(amount) }} DZD</span>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-center">
            {{ error }}
          </div>
          
          <!-- Payment Info & Form -->
          <template v-else-if="ccpSettings">
            
            <!-- Agency CCP Info -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <h2 class="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                <Icon name="heroicons:information-circle" class="w-5 h-5" />
                Informations de paiement
              </h2>
              <div class="space-y-4">
                <div class="flex justify-between items-center border-b border-blue-200 dark:border-blue-800 pb-2">
                  <span class="text-blue-700 dark:text-blue-400">Compte CCP :</span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-900 dark:text-white text-lg">{{ ccpSettings.ccp_account_number }}</span>
                    <span v-if="ccpSettings.ccp_key" class="text-gray-500 font-mono">Clé: {{ ccpSettings.ccp_key }}</span>
                  </div>
                </div>
                <div v-if="ccpSettings.baridi_mob_number" class="flex justify-between items-center border-b border-blue-200 dark:border-blue-800 pb-2">
                  <span class="text-blue-700 dark:text-blue-400">Numéro BaridiMob (RIP) :</span>
                  <span class="font-bold text-gray-900 dark:text-white text-lg">{{ ccpSettings.baridi_mob_number }}</span>
                </div>
                <div class="flex justify-between items-center pb-2">
                  <span class="text-blue-700 dark:text-blue-400">Titulaire du compte :</span>
                  <span class="font-bold text-gray-900 dark:text-white">{{ ccpSettings.owner_name }}</span>
                </div>
              </div>
            </div>

            <!-- Upload Form -->
            <form @submit.prevent="submitPayment" class="space-y-6 pt-4 border-t border-gray-100 dark:border-slate-800">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Confirmez votre transfert</h3>
              <p class="text-gray-600 dark:text-slate-400 text-sm">Après avoir effectué le transfert, veuillez entrer le numéro de transaction et télécharger le reçu.</p>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Numéro de transaction</label>
                <input 
                  v-model="form.transaction_number" 
                  type="text" 
                  required
                  placeholder="Ex: 0023456789"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reçu de paiement (PDF, JPG, PNG)</label>
                <div 
                  class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-lg hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                  :class="{'border-primary bg-primary/5': fileSelected}"
                  @click="$refs.fileInput.click()"
                >
                  <div class="space-y-1 text-center">
                    <Icon v-if="!fileSelected" name="heroicons:document-arrow-up" class="mx-auto h-12 w-12 text-gray-400" />
                    <Icon v-else name="heroicons:check-circle" class="mx-auto h-12 w-12 text-green-500" />
                    <div class="flex text-sm text-gray-600 dark:text-slate-400 justify-center">
                      <label class="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-600 focus-within:outline-none">
                        <span>{{ fileSelected ? fileSelected.name : 'Télécharger un fichier' }}</span>
                        <input ref="fileInput" type="file" class="sr-only" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileUpload">
                      </label>
                    </div>
                    <p v-if="!fileSelected" class="text-xs text-gray-500 dark:text-slate-500">PNG, JPG, PDF jusqu'à 5MB</p>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <button 
                  type="submit" 
                  :disabled="isSubmitting || !fileSelected || !form.transaction_number"
                  class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                  <Icon v-else name="heroicons:paper-airplane" class="w-5 h-5" />
                  {{ isSubmitting ? 'Envoi en cours...' : 'Soumettre le paiement' }}
                </button>
              </div>
            </form>

          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = route.query.order_id
const orderType = route.query.type
const amount = route.query.amount

const pending = ref(true)
const error = ref(null)
const ccpSettings = ref(null)

const isSubmitting = ref(false)
const fileSelected = ref(null)
const fileInput = ref(null)

const form = ref({
  transaction_number: ''
})

onMounted(async () => {
  if (!orderId || !orderType) {
    error.value = "Informations de commande manquantes. Veuillez retourner à vos commandes."
    pending.value = false
    return
  }

  try {
    const res = await sendApi('/client/ccp/settings', null, 'GET')
    if (res?.data) {
      ccpSettings.value = res.data
    } else {
      error.value = "Aucun compte CCP configuré par l'agence pour le moment. Veuillez contacter le support."
    }
  } catch (err) {
    error.value = err?.response?.data?.message || "Erreur lors du chargement des informations CCP."
  } finally {
    pending.value = false
  }
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 5MB)")
      return
    }
    fileSelected.value = file
  }
}

const submitPayment = async () => {
  if (!fileSelected.value || !form.value.transaction_number) return

  isSubmitting.value = true
  const formData = new FormData()
  formData.append('order_type', orderType)
  formData.append('order_id', orderId)
  formData.append('transaction_number', form.value.transaction_number)
  formData.append('proof_file', fileSelected.value)

  try {
    await sendApi('/client/ccp/submit', formData, 'POST')
    // Redirect to orders page with success message
    router.push('/client/orders?payment_submitted=true')
  } catch (err) {
    // sendApi already shows a toast for errors
  } finally {
    isSubmitting.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-DZ').format(price)
}
</script>
