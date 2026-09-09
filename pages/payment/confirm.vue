<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
    <div class="container mx-auto max-w-2xl">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center gap-2 sm:gap-4">
          <div class="flex items-center text-primary">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="ml-2 font-medium text-sm hidden sm:block">Réservation</span>
          </div>
          <div class="w-8 sm:w-12 h-1 bg-primary rounded"></div>
          <div class="flex items-center text-primary">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
            <span class="ml-2 font-medium text-sm hidden sm:block">Paiement</span>
          </div>
          <div class="w-8 sm:w-12 h-1 bg-gray-300 dark:bg-slate-700 rounded"></div>
          <div class="flex items-center text-gray-400 dark:text-slate-500">
            <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-sm">3</div>
            <span class="ml-2 font-medium text-sm hidden sm:block">Confirmation</span>
          </div>
        </div>
      </div>

      <!-- Pending Status Banner -->
      <div class="mb-5 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="font-bold text-amber-800 dark:text-amber-200 text-sm">Réservation en option — En attente de paiement</p>
          <p class="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
            Votre réservation est enregistrée mais <strong>non confirmée</strong> jusqu'au paiement.
            <template v-if="bookingRef"> Référence : <strong>{{ bookingRef }}</strong></template>
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#0A0B25] to-[#151740] p-5 sm:p-6 text-white text-center border-b-2 border-primary">
          <div class="flex items-center justify-center gap-2 mb-2">
            <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            <h1 class="text-xl sm:text-2xl font-bold">Paiement par BaridiMob / CCP</h1>
          </div>
          <p class="text-white/70 text-sm">Effectuez le paiement puis soumettez votre preuve ci-dessous</p>
          <div v-if="amount" class="mt-3 inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-2 rounded-xl">
            <span class="text-white/70 text-sm">Montant :</span>
            <span class="text-2xl font-black text-primary">{{ formatPrice(amount) }}</span>
            <span class="text-white/70 text-sm font-bold">DZD</span>
          </div>
        </div>

        <div class="p-5 sm:p-8 space-y-6">
          <!-- Loading State -->
          <div v-if="pending" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm">
            {{ error }}
          </div>
          
          <!-- Success State -->
          <div v-else-if="paymentSubmittedSuccess" class="py-8 text-center flex flex-col items-center gap-4">
            <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Paiement transmis avec succès !</h2>
            <p class="text-gray-600 dark:text-slate-300 max-w-md text-sm leading-relaxed">
              Votre preuve de paiement a été soumise. L'agence Bouazize Travel va traiter et confirmer votre réservation sous peu.
            </p>
            <div v-if="bookingRef" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-mono font-bold text-slate-700 dark:text-slate-200">
              Réf: {{ bookingRef }}
            </div>
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <nuxt-link to="/client/orders" class="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors text-center">
                Mes Commandes
              </nuxt-link>
              <nuxt-link to="/" class="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm uppercase tracking-wider rounded-xl transition-colors text-center">
                Accueil
              </nuxt-link>
            </div>
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
                        <input ref="fileInput" type="file" class="sr-only" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" @change="handleFileUpload">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '#imports'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const token = computed(() => authStore.Authorization?.token)

const orderId = route.query.order_id
const orderType = route.query.type
const amount = route.query.amount
const bookingRef = route.query.ref || null

const pending = ref(true)
const error = ref(null)
const ccpSettings = ref(null)
const paymentSubmittedSuccess = ref(false)

const isSubmitting = ref(false)
const fileSelected = ref(null)
const fileInput = ref(null)

const form = ref({
  transaction_number: ''
})

onMounted(async () => {
  if (!orderId || !orderType) {
    error.value = "Informations de commande manquantes. Veuillez vérifier le lien ou contacter l'agence."
    pending.value = false
    return
  }

  try {
    const endpoint = token.value ? '/client/ccp/settings' : '/ccp/settings'
    const res = await sendApi(endpoint, null, 'GET')
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
    const endpoint = token.value ? '/client/ccp/submit' : '/ccp/submit'
    await sendApi(endpoint, formData, 'POST')
    if (token.value) {
      // Redirect to client orders page for logged in users
      router.push('/client/orders?payment_submitted=true')
    } else {
      // For guests: stay on page and show success state
      paymentSubmittedSuccess.value = true
    }
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
