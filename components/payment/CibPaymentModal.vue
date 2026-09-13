<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-slate-950/80 transition-opacity" @click="handleClose"></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100 dark:border-slate-800"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-slate-900 p-5 sm:p-6 text-white relative">
          <button 
            type="button" 
            @click="handleClose"
            class="absolute top-5 right-5 text-slate-400 hover:text-white rounded-full p-1.5 transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Icon name="heroicons:credit-card" class="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black tracking-wide">Paiement Électronique Sécurisé</h3>
              <p class="text-xs text-slate-400">Passerelle Nationale SATIM • GIE Monétique</p>
            </div>
          </div>

          <!-- Order Summary Pill -->
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm">
            <div class="text-slate-400">
              Réf: <span class="font-mono font-bold text-white">{{ orderReference }}</span>
            </div>
            <div class="text-right">
              <span class="text-slate-400 text-xs">Montant total:</span>
              <span class="ml-1.5 font-black text-emerald-400 text-base sm:text-lg">{{ formattedAmount }} DZD</span>
            </div>
          </div>
        </div>

        <!-- Sandbox Test Notice Banner -->
        <div class="bg-amber-50 dark:bg-amber-950/30 border-y border-amber-200 dark:border-amber-800/60 px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-medium">
            <Icon name="heroicons:beaker" class="w-4 h-4 flex-shrink-0" />
            <span>Mode Sandbox (Test) — Bouazize Travel</span>
          </div>
          <button 
            type="button"
            @click="autofillTestCard"
            class="text-[11px] font-bold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <Icon name="heroicons:sparkles" class="w-3.5 h-3.5" />
            Remplir carte test
          </button>
        </div>

        <div class="p-5 sm:p-6 space-y-5">
          <!-- STEP 1: Card Details -->
          <div v-if="currentStep === 'card'">
            <!-- Simple Card Type Selector (flat) -->
            <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Type de carte</p>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="selectedCardType = 'cib'"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-black transition-all"
                  :class="selectedCardType === 'cib' ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'"
                >
                  <div class="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-black text-[9px]">CIB</div>
                  <span>Carte CIB</span>
                </button>
                <button
                  type="button"
                  @click="selectedCardType = 'edahabia'"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-black transition-all"
                  :class="selectedCardType === 'edahabia' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'"
                >
                  <div class="w-5 h-5 rounded bg-amber-500 text-slate-900 flex items-center justify-center font-black text-[9px]">EP</div>
                  <span>Edahabia</span>
                </button>
              </div>
            </div>

            <!-- Card Inputs Form -->
            <form @submit.prevent="proceedToOtp" class="space-y-4">
              <!-- Card Number -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro de Carte (16 chiffres)
                </label>
                <div class="relative">
                  <input
                    v-model="cardNumber"
                    type="text"
                    maxlength="19"
                    placeholder="5078 0300 0000 0000"
                    required
                    @input="formatCardInput"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  />
                  <div class="absolute right-3 top-3 text-slate-400">
                    <Icon name="heroicons:credit-card" class="w-6 h-6" />
                  </div>
                </div>
              </div>

              <!-- Cardholder Name -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du Porteur de la Carte
                </label>
                <input
                  v-model="cardHolder"
                  type="text"
                  placeholder="BOUAZIZE YOUCEF"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <!-- Expiry & CVV -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date d'Expiration (MM/AA)
                  </label>
                  <input
                    v-model="cardExpiry"
                    type="text"
                    maxlength="5"
                    placeholder="12/28"
                    required
                    @input="formatExpiryInput"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>CVV2 / CVC</span>
                    <span class="text-[10px] text-slate-400 font-normal">3 chiffres au dos</span>
                  </label>
                  <input
                    v-model="cardCvc"
                    type="password"
                    maxlength="3"
                    placeholder="•••"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center tracking-widest"
                  />
                </div>
              </div>

              <p v-if="errorMessage" class="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
                {{ errorMessage }}
              </p>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full mt-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm tracking-wide shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                <span>Continuer vers l'Authentification 3D-Secure</span>
                <Icon v-if="!isLoading" name="heroicons:arrow-right" class="w-4 h-4" />
              </button>
            </form>
          </div>

          <!-- STEP 2: 3D Secure / OTP SMS Challenge -->
          <div v-else-if="currentStep === 'otp'" class="space-y-4 text-center py-2">
            <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/20">
              <Icon name="heroicons:shield-check" class="w-8 h-8" />
            </div>

            <div>
              <h4 class="text-base font-black text-slate-900 dark:text-white">Authentification 3D-Secure SATIM</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Pour valider votre règlement de <span class="font-bold text-slate-900 dark:text-white">{{ formattedAmount }} DZD</span>, veuillez entrer le code de sécurité temporaire reçu par SMS.
              </p>
            </div>

            <!-- Simulated SMS Alert -->
            <div class="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 font-mono text-left border border-slate-200 dark:border-slate-700">
              <div class="flex items-center gap-1.5 text-primary font-bold text-[11px] mb-1">
                <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4" />
                <span>Message SMS Simulé (SATIM-OTP):</span>
              </div>
              <p>Votre code de confirmation pour Bouazize Travel est : <span class="font-bold text-emerald-600 dark:text-emerald-400">123456</span></p>
            </div>

            <form @submit.prevent="submitFinalPayment" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Code de confirmation (OTP)
                </label>
                <input
                  v-model="otpCode"
                  type="text"
                  maxlength="6"
                  placeholder="123456"
                  required
                  autofocus
                  class="w-48 mx-auto px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xl tracking-[0.3em] font-black text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <p v-if="errorMessage" class="text-xs text-rose-500 font-medium">
                {{ errorMessage }}
              </p>

              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="currentStep = 'card'"
                  class="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Modifier carte
                </button>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                  <span>Confirmer et Payer</span>
                </button>
              </div>
            </form>
          </div>

          <!-- STEP 3: Success Confirmation -->
          <div v-else-if="currentStep === 'success'" class="text-center py-4 space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/20">
              <Icon name="heroicons:check-badge" class="w-10 h-10" />
            </div>

            <div>
              <h4 class="text-lg font-black text-slate-900 dark:text-white">Paiement Réussi & Réservation Confirmée !</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Votre transaction a été validée avec succès par la passerelle SATIM. Votre voucher officiel et reçu de paiement ont été générés.
              </p>
            </div>

            <!-- Receipt Box -->
            <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">N° Reçu CIB:</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ receiptNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Référence dossier:</span>
                <span class="font-mono font-bold text-primary">{{ orderReference }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Montant débité:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formattedAmount }} DZD</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Statut:</span>
                <span class="font-black text-emerald-600">CONFIRMÉ (Payé)</span>
              </div>
            </div>

            <button
              type="button"
              @click="handleSuccessFinish"
              class="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm shadow-lg shadow-primary/25 transition-all"
            >
              Voir ma réservation et télécharger le voucher
            </button>
          </div>
        </div>

        <!-- Modal Footer Security Brandings -->
        <div class="bg-slate-50 dark:bg-slate-800/40 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div class="flex items-center gap-1.5">
            <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5 text-emerald-500" />
            <span>Cryptage SSL 256-bit certifié</span>
          </div>
          <div class="font-bold tracking-wider">
            SATIM • GIE MONÉTIQUE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { sendApi } from '@/composables/api';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: [Number, String],
    required: true
  },
  orderType: {
    type: String,
    required: true
  },
  orderReference: {
    type: String,
    default: 'BOUAZIZE-ORDER'
  },
  amount: {
    type: [Number, String],
    default: 0
  }
});

const emit = defineEmits(['close', 'success']);

const currentStep = ref('card'); // 'card' | 'otp' | 'success'
const selectedCardType = ref('cib');
const cardNumber = ref('');
const cardHolder = ref('BOUAZIZE YOUCEF');
const cardExpiry = ref('12/28');
const cardCvc = ref('123');
const otpCode = ref('123456');

const isLoading = ref(false);
const errorMessage = ref('');
const paymentSessionId = ref(null);
const receiptNumber = ref('');

const formattedAmount = computed(() => {
  const val = Number(props.amount) || 0;
  return new Intl.NumberFormat('fr-DZ', { minimumFractionDigits: 0 }).format(val);
});

const formattedCardNumber = computed(() => {
  return cardNumber.value;
});

// Format card number with spaces every 4 digits
const formatCardInput = (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 16) val = val.substring(0, 16);
  cardNumber.value = val.replace(/(.{4})/g, '$1 ').trim();
};

// Format expiry MM/YY
const formatExpiryInput = (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 4) val = val.substring(0, 4);
  if (val.length >= 2) {
    cardExpiry.value = val.substring(0, 2) + '/' + val.substring(2);
  } else {
    cardExpiry.value = val;
  }
};

// Autofill with official Algerian sandbox test cards
const autofillTestCard = () => {
  if (selectedCardType.value === 'edahabia') {
    cardNumber.value = '5078 0300 0000 0000';
  } else {
    cardNumber.value = '6280 5800 0000 0000';
  }
  cardHolder.value = 'BOUAZIZE YOUCEF';
  cardExpiry.value = '12/28';
  cardCvc.value = '123';
  otpCode.value = '123456';
  errorMessage.value = '';
};

// Initial state reset when opened
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentStep.value = 'card';
    errorMessage.value = '';
    autofillTestCard();
  }
});

// Step 1: Initialize payment session & proceed to OTP
const proceedToOtp = async () => {
  errorMessage.value = '';
  const cleanNumber = cardNumber.value.replace(/\s/g, '');
  if (cleanNumber.length < 16) {
    errorMessage.value = 'Veuillez saisir un numéro de carte valide (16 chiffres).';
    return;
  }
  if (!cardExpiry.value || cardExpiry.value.length < 5) {
    errorMessage.value = 'Veuillez renseigner la date d\'expiration (MM/AA).';
    return;
  }
  if (!cardCvc.value || cardCvc.value.length < 3) {
    errorMessage.value = 'Veuillez renseigner le code CVV2 (3 chiffres).';
    return;
  }

  isLoading.value = true;
  try {
    const res = await sendApi('/payment/cib/initialize', {
      order_type: props.orderType,
      order_id: Number(props.orderId),
      card_type: selectedCardType.value
    }, 'POST');

    if (!res) {
      errorMessage.value = 'Échec d\'initialisation du paiement CIB.';
      return;
    }

    const data = res.data || res;
    paymentSessionId.value = data?.payment_id;

    // If external redirect required (Chargily / SATIM live)
    if (data?.mode === 'chargily' && data?.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }
    if (data?.mode === 'satim' && data?.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }

    // Default: Simulator test mode -> Move to 3D Secure OTP step
    currentStep.value = 'otp';
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Échec d\'initialisation du paiement CIB.';
  } finally {
    isLoading.value = false;
  }
};

// Step 2: Submit final payment confirmation
const submitFinalPayment = async () => {
  if (!otpCode.value || otpCode.value.length < 4) {
    errorMessage.value = 'Veuillez saisir le code OTP reçu par SMS.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const res = await sendApi('/payment/cib/simulate', {
      payment_id: paymentSessionId.value,
      card_number: cardNumber.value.replace(/\s/g, ''),
      card_type: selectedCardType.value,
      holder_name: cardHolder.value,
      expiry: cardExpiry.value,
      otp: otpCode.value
    }, 'POST');

    if (!res) {
      errorMessage.value = 'Authentification échouée. Vérifiez votre code OTP.';
      return;
    }

    const data = res.data || res;
    receiptNumber.value = data?.receipt_number || 'CIB-' + Date.now();
    currentStep.value = 'success';
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Authentification échouée. Vérifiez votre code OTP.';
  } finally {
    isLoading.value = false;
  }
};

const handleSuccessFinish = () => {
  emit('success', {
    receiptNumber: receiptNumber.value,
    orderId: props.orderId,
    orderType: props.orderType
  });
  emit('close');
};

const handleClose = () => {
  if (currentStep.value === 'success') {
    handleSuccessFinish();
  } else {
    emit('close');
  }
};
</script>
