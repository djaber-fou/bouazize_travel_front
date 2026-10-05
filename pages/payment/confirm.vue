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
          <div class="w-8 sm:w-12 h-1 rounded" :class="isOrderPaid ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-700'"></div>
          <div class="flex items-center" :class="isOrderPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500'">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" :class="isOrderPaid ? 'bg-emerald-600 text-white' : 'bg-gray-300 dark:bg-slate-700 text-white'">
              {{ isOrderPaid ? '✓' : '3' }}
            </div>
            <span class="ml-2 font-medium text-sm hidden sm:block">Confirmation</span>
          </div>
        </div>
      </div>

      <!-- Paid Status Banner -->
      <div v-if="isOrderPaid" class="mb-5 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-sm">
        <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
          <Icon name="heroicons:check-circle" class="w-6 h-6" />
        </div>
        <div>
          <p class="font-black text-emerald-900 dark:text-emerald-200 text-sm">Paiement Validé — Réservation Confirmée !</p>
          <p class="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">
            Votre règlement a été reçu et validé. Votre voucher officiel est prêt.
            <template v-if="bookingRef"> Référence : <strong>{{ bookingRef }}</strong></template>
          </p>
        </div>
      </div>

      <!-- Pending Status Banner -->
      <div v-else class="mb-5 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl">
        <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="font-bold text-amber-800 dark:text-amber-200 text-sm">Réservation en option — En attente de règlement</p>
          <p class="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
            Choisissez votre mode de paiement ci-dessous pour confirmer définitivement votre séjour.
            <template v-if="bookingRef"> Référence : <strong>{{ bookingRef }}</strong></template>
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
        <!-- Header -->
        <div class="bg-slate-900 dark:bg-slate-950 p-6 text-white text-center border-b border-slate-700">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Icon name="heroicons:shield-check" class="w-7 h-7 text-emerald-400" />
            <h1 class="text-xl sm:text-2xl font-black">Règlement Sécurisé de votre Réservation</h1>
          </div>
          <p class="text-slate-400 text-xs sm:text-sm">Agence Bouazize Travel • Transactions certifiées SATIM & CCP</p>
          
          <div v-if="amount" class="mt-4 inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-xl">
            <span class="text-slate-400 text-xs uppercase tracking-wider font-semibold">Montant à régler :</span>
            <span class="text-2xl sm:text-3xl font-black text-emerald-400">{{ formatPrice(amount) }}</span>
            <span class="text-slate-400 text-xs font-bold">DZD</span>
          </div>
        </div>

        <div class="p-5 sm:p-8 space-y-6">
          <!-- Loading State -->
          <div v-if="pending" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center text-sm">
            {{ error }}
          </div>
          
          <!-- Success State (CIB or CCP Submitted) -->
          <div v-else-if="isOrderPaid || paymentSubmittedSuccess" class="py-6 text-center flex flex-col items-center gap-4">
            <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/20">
              <Icon name="heroicons:check-badge" class="w-12 h-12" />
            </div>
            
            <div class="space-y-1">
              <h2 class="text-2xl font-black text-gray-900 dark:text-white">
                {{ isOrderPaid ? 'Paiement CIB Confirmé !' : 'Paiement CCP Transmis !' }}
              </h2>
              <p class="text-gray-600 dark:text-slate-300 max-w-md text-xs sm:text-sm leading-relaxed mx-auto">
                <template v-if="isOrderPaid">
                  Votre transaction a été validée avec succès. Votre réservation est officiellement <strong>confirmée</strong>.
                </template>
                <template v-else>
                  Votre reçu CCP a été envoyé à l'administration. Dès validation, votre réservation sera confirmée.
                </template>
              </p>
            </div>

            <!-- Receipt & Reference Info Box -->
            <div class="w-full max-w-md bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div v-if="cibReceiptNumber" class="flex justify-between">
                <span class="text-slate-500">N° Reçu CIB:</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ cibReceiptNumber }}</span>
              </div>
              <div v-if="bookingRef" class="flex justify-between">
                <span class="text-slate-500">Référence dossier:</span>
                <span class="font-mono font-bold text-primary">{{ bookingRef }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Montant :</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatPrice(amount) }} DZD</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Statut de la réservation :</span>
                <span class="font-black" :class="isOrderPaid ? 'text-emerald-600' : 'text-amber-600'">
                  {{ isOrderPaid ? 'CONFIRMÉ (Payé)' : 'EN COURS DE VÉRIFICATION' }}
                </span>
              </div>
            </div>

            <div class="pt-3 flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <nuxt-link to="/client/orders" class="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center">
                Mes Commandes & Vouchers
              </nuxt-link>
              <nuxt-link to="/" class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors text-center">
                Retour à l'Accueil
              </nuxt-link>
            </div>
          </div>

          <!-- Main Payment Selection Tabs & Forms -->
          <template v-else>
            <!-- Payment Mode Tabs -->
            <div class="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                @click="activeMethod = 'cib'"
                class="py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                :class="activeMethod === 'cib' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
              >
                <Icon name="heroicons:credit-card" class="w-5 h-5 text-emerald-500" />
                <span>Carte CIB / Edahabia</span>
                <span class="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-[10px] font-black">
                  Direct
                </span>
              </button>

              <button
                type="button"
                @click="activeMethod = 'ccp'"
                class="py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                :class="activeMethod === 'ccp' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
              >
                <Icon name="heroicons:device-phone-mobile" class="w-5 h-5 text-primary" />
                <span>Virement CCP / BaridiMob</span>
              </button>
            </div>

            <!-- OPTION 1: CIB & Edahabia Payment View -->
            <div v-if="activeMethod === 'cib'" class="space-y-6 pt-2">
              <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black tracking-wider uppercase border border-emerald-200 dark:border-emerald-800">
                      Confirmation Immédiate
                    </span>
                    <span class="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                      Mode Test
                    </span>
                  </div>
                  <span class="text-xs text-slate-400 font-bold">SATIM • GIE</span>
                </div>

                <h3 class="text-base font-black text-slate-900 dark:text-white mb-1">Paiement Immédiat par Carte Bancaire</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Réglez instantanément avec votre carte <strong class="text-slate-700 dark:text-slate-300">CIB</strong> (toutes banques algériennes) ou votre carte <strong class="text-slate-700 dark:text-slate-300">Edahabia</strong> (Algérie Poste).
                </p>

                <!-- Cards Accepted -->
                <div class="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div class="flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 dark:text-slate-200">
                    <div class="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[8px]">CIB</div>
                    <span>Carte CIB</span>
                  </div>
                  <div class="flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 dark:text-slate-200">
                    <div class="w-4 h-4 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-[8px]">EP</div>
                    <span>Edahabia</span>
                  </div>
                  <div class="ml-auto text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Icon name="heroicons:bolt" class="w-4 h-4" />
                    <span>Sans attente</span>
                  </div>
                </div>
              </div>

              <!-- CTA to Open CIB Modal -->
              <button
                type="button"
                @click="isCibModalOpen = true"
                class="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-3"
              >
                <Icon name="heroicons:credit-card" class="w-5 h-5" />
                <span>Payer {{ formatPrice(amount) }} DZD par Carte CIB / Edahabia</span>
                <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              </button>

              <div class="text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
                <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5 text-emerald-500" />
                <span>Paiement sécurisé 3D-Secure certifié SATIM • Algérie Poste</span>
              </div>
            </div>

            <!-- OPTION 2: CCP / BaridiMob Payment View -->
            <div v-else-if="activeMethod === 'ccp' && ccpSettings" class="space-y-6 pt-2">
              <!-- Agency CCP Info -->
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 sm:p-6 border border-blue-100 dark:border-blue-800">
                <h2 class="text-base font-black text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 text-primary" />
                  <span>Coordonnées CCP de l'Agence Bouazize Travel</span>
                </h2>
                <div class="space-y-3 text-xs sm:text-sm">
                  <div class="flex justify-between items-center border-b border-blue-200/60 dark:border-blue-800 pb-2">
                    <span class="text-blue-700 dark:text-blue-400">Numéro de Compte CCP :</span>
                    <div class="flex items-center gap-2">
                      <span class="font-black text-gray-900 dark:text-white text-base sm:text-lg">{{ ccpSettings.ccp_account_number }}</span>
                      <span v-if="ccpSettings.ccp_key" class="text-gray-500 font-mono font-bold">Clé: {{ ccpSettings.ccp_key }}</span>
                    </div>
                  </div>
                  <div v-if="ccpSettings.baridi_mob_number" class="flex justify-between items-center border-b border-blue-200/60 dark:border-blue-800 pb-2">
                    <span class="text-blue-700 dark:text-blue-400">Numéro BaridiMob (RIP) :</span>
                    <span class="font-black text-gray-900 dark:text-white text-base font-mono">{{ ccpSettings.baridi_mob_number }}</span>
                  </div>
                  <div class="flex justify-between items-center pb-1">
                    <span class="text-blue-700 dark:text-blue-400">Titulaire du compte :</span>
                    <span class="font-black text-gray-900 dark:text-white">{{ ccpSettings.owner_name }}</span>
                  </div>
                </div>
              </div>

              <!-- Upload Form -->
              <form @submit.prevent="submitPayment" class="space-y-5 pt-2">
                <h3 class="text-base font-black text-gray-900 dark:text-white">Confirmez votre virement CCP</h3>
                <p class="text-gray-600 dark:text-slate-400 text-xs">
                  Après avoir effectué le virement, veuillez renseigner le numéro de transaction et télécharger le reçu.
                </p>
                
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Numéro de transaction (BaridiMob / Reçu CCP)
                  </label>
                  <input 
                    v-model="form.transaction_number" 
                    type="text" 
                    required
                    placeholder="Ex: 0023456789"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Reçu de paiement (PDF, JPG, PNG)
                  </label>
                  <div 
                    class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-2xl hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                    :class="{'border-primary bg-primary/5': fileSelected}"
                    @click="$refs.fileInput.click()"
                  >
                    <div class="space-y-1 text-center">
                      <Icon v-if="!fileSelected" name="heroicons:document-arrow-up" class="mx-auto h-10 w-10 text-gray-400" />
                      <Icon v-else name="heroicons:check-circle" class="mx-auto h-10 w-10 text-green-500" />
                      <div class="flex text-xs text-gray-600 dark:text-slate-400 justify-center">
                        <label class="relative cursor-pointer rounded-md font-bold text-primary hover:text-primary-600 focus-within:outline-none">
                          <span>{{ fileSelected ? fileSelected.name : 'Télécharger un justificatif' }}</span>
                          <input ref="fileInput" type="file" class="sr-only" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" @change="handleFileUpload">
                        </label>
                      </div>
                      <p v-if="!fileSelected" class="text-[11px] text-gray-500 dark:text-slate-500">PNG, JPG, PDF jusqu'à 5MB</p>
                    </div>
                  </div>
                </div>

                <div class="pt-2">
                  <button 
                    type="submit" 
                    :disabled="isSubmitting || !fileSelected || !form.transaction_number"
                    class="w-full bg-primary hover:bg-primary-hover text-white font-black py-3.5 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
                  >
                    <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                    <Icon v-else name="heroicons:paper-airplane" class="w-4 h-4" />
                    <span>{{ isSubmitting ? 'Envoi du justificatif...' : 'Soumettre le reçu CCP' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- CIB Payment Interactive Modal -->
    <CibPaymentModal
      :is-open="isCibModalOpen"
      :order-id="orderId"
      :order-type="orderType"
      :order-reference="bookingRef || ('BOUAZIZE-' + orderId)"
      :amount="amount"
      @close="isCibModalOpen = false"
      @success="handleCibSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '#imports'
import CibPaymentModal from '~/components/payment/CibPaymentModal.vue'

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
const isOrderPaid = ref(route.query.status === 'paid')
const cibReceiptNumber = ref(route.query.receipt || null)

const activeMethod = ref(route.query.method === 'baridimob' || route.query.method === 'ccp' ? 'ccp' : 'cib')
const isCibModalOpen = ref(route.query.auto_open === '1' || (route.query.method === 'cib' && !isOrderPaid.value))

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
    }
  } catch (err) {
    // Non blocking if CIB is primary
    console.warn("Notice: ccp settings fetch:", err?.message)
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
      router.push('/client/orders?payment_submitted=true')
    } else {
      paymentSubmittedSuccess.value = true
    }
  } catch (err) {
    // sendApi already shows toast
  } finally {
    isSubmitting.value = false
  }
}

const handleCibSuccess = (data) => {
  isOrderPaid.value = true
  cibReceiptNumber.value = data?.receiptNumber || 'CIB-' + Date.now()
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-DZ').format(price || 0)
}
</script>
