<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <!-- Header: Clean Navy Secondary matching Bouazize Travel design system -->
    <div class="bg-[#0A0B25] text-white p-5 sm:p-6 border-b border-slate-800">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Icon name="heroicons:shield-check" class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black tracking-tight text-white">Paiement Électronique Sécurisé SATIM</h3>
            <p class="text-xs text-slate-400">GIE Monétique Algérie • Protocole 3D-Secure (OTP SMS)</p>
          </div>
        </div>

        <!-- Security Badge -->
        <div class="flex items-center gap-2">
          <div v-if="isSandbox" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-[11px] font-black text-amber-300 uppercase">
            <Icon name="heroicons:beaker" class="w-3.5 h-3.5" />
            <span>Mode Test Sandbox</span>
          </div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
            <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5 text-emerald-400" />
            <span>Connexion Sécurisée SSL</span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5 sm:p-6 space-y-6">
      <!-- 1. FINAL AMOUNT (Mis en évidence, caractère gras, grande taille selon exigence SATIM) -->
      <div class="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Montant final à payer
        </p>
        <div class="flex items-baseline justify-center gap-2">
          <span class="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {{ formattedAmount }}
          </span>
          <span class="text-base sm:text-lg font-black text-primary">DZD</span>
        </div>
        <p class="text-[11px] text-slate-400">
          Toutes taxes comprises (TTC) • Aucun frais supplémentaire
        </p>
      </div>

      <!-- Supported Cards Notice with Official CIB & EDAHABIA SVG Logos -->
      <div class="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
        <span class="font-bold text-slate-600 dark:text-slate-400">Cartes bancaires acceptées :</span>
        <div class="flex items-center gap-2.5">
          <img src="/images/payment/cib-logo.svg" alt="Carte CIB" class="h-7 w-auto rounded shadow-xs" />
          <img src="/images/payment/edahabia-logo.svg" alt="Carte EDAHABIA" class="h-7 w-auto rounded shadow-xs" />
        </div>
      </div>

      <!-- 2. CAPTCHA ANTI-ROBOT (Exigence SATIM: Éviter les robots) -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Icon name="heroicons:check-badge" class="w-4 h-4 text-primary" />
            <span>Contrôle de sécurité anti-robot (Captcha)</span>
          </label>
          <span v-if="isCaptchaValid" class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Icon name="heroicons:check-circle" class="w-3.5 h-3.5" />
            Code correct
          </span>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3">
          <!-- Captcha Visual Box -->
          <div class="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 select-none">
            <span class="text-base font-mono font-black tracking-wider text-slate-900 dark:text-white">
              {{ captchaChallenge.num1 }} + {{ captchaChallenge.num2 }} = ?
            </span>
            <button
              type="button"
              @click="refreshCaptcha"
              title="Changer le calcul"
              class="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              <Icon name="heroicons:arrow-path" class="w-4 h-4" />
            </button>
          </div>

          <!-- Captcha Input Field -->
          <div class="flex-1 w-full">
            <input
              v-model="captchaInput"
              type="number"
              placeholder="Entrez le résultat"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              :class="{ 'border-emerald-500': isCaptchaValid }"
            />
          </div>
        </div>
      </div>

      <!-- 3. CONDITIONS GÉNÉRALES DE PAIEMENT EN LIGNE ET DE VENTE (Exigence SATIM: affichées directement sur la page avant paiement) -->
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Icon name="heroicons:document-text" class="w-4 h-4 text-primary" />
            <span>Conditions Générales de Paiement en Ligne &amp; de Vente</span>
          </span>
          <button
            type="button"
            @click="showTermsModal = true"
            class="text-[11px] font-bold text-primary hover:underline cursor-pointer"
          >
            Agrandir
          </button>
        </div>

        <!-- Inline Scrollable Conditions Summary Directly on Checkout Page (SATIM IHM Compliance) -->
        <div class="max-h-36 overflow-y-auto p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>1. Cadre légal :</strong> Le règlement électronique sur la plateforme <strong>SARL Bouazize Travel</strong> (Agrément N° 4484 · RC 19/00-5345775 A 23) s'effectue via la passerelle nationale <strong>SATIM-EPG / GIE Monétique</strong>, conformément à la Loi n° 18-05 relative au commerce électronique.
          </p>
          <p>
            <strong>2. Sécurité 3D-Secure &amp; Confidentialité :</strong> Cartes acceptées : <strong>CIB</strong> et <strong>EDAHABIA</strong> (montant minimum 50,00 DZD). La saisie des coordonnées bancaires et du code OTP SMS s'effectue exclusivement sur le serveur sécurisé SSL de la SATIM ; Bouazize Travel ne conserve aucune donnée de carte.
          </p>
          <p>
            <strong>3. Tarifs, Confirmation &amp; Remboursement :</strong> Tous les prix sont affichés TTC en Dinar Algérien (DZD) sans frais cachés. Dès validation bancaire, un reçu officiel imprimable et téléchargeable en PDF est émis. En cas d'annulation éligible, le remboursement s'effectue par crédit sur la carte utilisée.
          </p>
          <p>
            <strong>4. Assistance SATIM :</strong> Pour toute réclamation liée à votre carte ou transaction, contactez gratuitement le numéro vert de la SATIM : <strong>3020</strong>.
          </p>
        </div>

        <label class="flex items-start gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            v-model="acceptedTerms"
            class="mt-0.5 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <span class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            J'ai lu, pris connaissance et j'accepte sans réserve les
            <button
              type="button"
              @click.stop="showTermsModal = true"
              class="font-bold text-primary hover:underline cursor-pointer"
            >
              Conditions Générales de Paiement en Ligne et de Vente
            </button>
            de l'agence <strong>Bouazize Travel</strong>.
          </span>
        </label>

        <div class="pl-7 flex items-center gap-2">
          <NuxtLink
            to="/conditions-generales-de-vente"
            target="_blank"
            class="text-[11px] text-slate-400 hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            <Icon name="heroicons:document-text" class="w-3.5 h-3.5" />
            <span>Consulter le document complet (nouvel onglet)</span>
            <Icon name="heroicons:arrow-top-right-on-square" class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>

      <!-- Error Notice if any -->
      <div v-if="errorMessage" class="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
        <Icon name="heroicons:exclamation-circle" class="w-4 h-4 shrink-0 mt-0.5" />
        <span class="leading-relaxed">{{ errorMessage }}</span>
      </div>

      <!-- 4. OFFICIAL PAYMENT BUTTON (Clean solid primary styling, NO gradients) -->
      <button
        type="button"
        :disabled="!canProceed || isLoading"
        @click="initiateSatimPayment"
        class="w-full py-4 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        :class="canProceed && !isLoading ? 'bg-primary hover:bg-primary-hover shadow-primary/20' : 'bg-slate-400 dark:bg-slate-700'"
      >
        <template v-if="isLoading">
          <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          <span>Connexion à la passerelle SATIM...</span>
        </template>
        <template v-else>
          <!-- Official CIB & EDAHABIA Logos Directly on Payment Button (SATIM IHM Requirement) -->
          <img src="/images/payment/cib-logo.svg" alt="CIB" class="h-6 w-auto rounded-xs bg-white/10" />
          <img src="/images/payment/edahabia-logo.svg" alt="EDAHABIA" class="h-6 w-auto rounded-xs bg-white/10" />
          <span>Payer par Carte CIB / EDAHABIA</span>
          <Icon name="heroicons:arrow-right" class="w-4 h-4" />
        </template>
      </button>

      <!-- Security Assistance Subtext -->
      <div class="pt-1 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
        <span class="flex items-center gap-1">
          <Icon name="heroicons:shield-check" class="w-3.5 h-3.5 text-emerald-500" />
          Protocole 3D-Secure 2.0 (OTP SMS)
        </span>
        <span class="flex items-center gap-1">
          <Icon name="heroicons:server" class="w-3.5 h-3.5 text-blue-500" />
          Serveur Monétique Certifié SATIM
        </span>
        <span class="flex items-center gap-1">
          <Icon name="heroicons:phone" class="w-3.5 h-3.5 text-amber-500" />
          Numéro vert d'assistance : <strong>3020</strong>
        </span>
      </div>
    </div>

    <!-- Official Document Modal (Conditions Générales de Vente) -->
    <div
      v-if="showTermsModal"
      class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showTermsModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2 text-primary font-black text-base">
            <Icon name="heroicons:document-text" class="w-5 h-5" />
            <span>Conditions Générales de Vente &amp; de Paiement</span>
          </div>
          <button
            type="button"
            @click="showTermsModal = false"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Real Legal Identity Header -->
        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 dark:text-white uppercase">SARL BOUAZIZE TRAVEL</span>
            <span class="font-bold text-primary">Agrément N° : 4484</span>
          </div>
          <p class="text-slate-500 dark:text-slate-300">
            RC N° : 19/00-5345775 A 23 • Gérant : M. Bouazize Youcef
          </p>
          <p class="text-slate-400 text-[11px]">
            Cité Elhidhab 35 Logts Draâ Bt 1 Loc 9, Sétif, Algérie
          </p>
        </div>

        <div class="max-h-[50vh] overflow-y-auto text-xs text-slate-600 dark:text-slate-300 space-y-3.5 pr-2 leading-relaxed">
          <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            1. Objet et Cadre Légal
          </h4>
          <p>
            Les présentes conditions générales régissent l'utilisation du service de paiement électronique fourni par l'agence Bouazize Travel en partenariat avec la SATIM et le GIE Monétique, conformément à la Loi n° 18-05 relative au commerce électronique en Algérie.
          </p>

          <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            2. Cartes Acceptées et Sécurité 3D-Secure
          </h4>
          <p>
            Sont acceptées toutes les cartes CIB interbancaires et la carte EDAHABIA d'Algérie Poste. La transaction est sécurisée par le protocole 3D-Secure 2.0 requérant un mot de passe à usage unique (OTP) envoyé par SMS.
          </p>

          <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            3. Confidentialité Absolue des Données Bancaires
          </h4>
          <p>
            Bouazize Travel ne collecte, ne traite et ne stocke <strong>aucune coordonnée bancaire</strong> (numéro de carte, date d'expiration, CVV2, OTP). La saisie s'effectue exclusivement sur le serveur bancaire crypté et sécurisé de la SATIM.
          </p>

          <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            4. Confirmation et Reçu Officiel
          </h4>
          <p>
            Dès validation par la SATIM, un reçu officiel comportant le numéro d'autorisation (approvalCode), l'identifiant de commande (orderId), la date et l'heure est immédiatement affiché. Le client peut l'imprimer, le télécharger en PDF ou le recevoir par e-mail.
          </p>

          <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            5. Annulation et Remboursement
          </h4>
          <p>
            En cas d'annulation conforme aux conditions de la prestation réservée, le remboursement est effectué par crédit direct sur le compte de la carte bancaire ayant servi au paiement initial.
          </p>

          <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            6. Assistance et Réclamation
          </h4>
          <p>
            Pour toute réclamation liée au fonctionnement de votre carte bancaire ou à une transaction rejetée, le centre d'assistance de la SATIM est joignable gratuitement au numéro vert : <strong>3020</strong>.
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <NuxtLink
            to="/conditions-generales-de-vente"
            target="_blank"
            class="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Voir la page complète</span>
            <Icon name="heroicons:arrow-top-right-on-square" class="w-3.5 h-3.5" />
          </NuxtLink>

          <button
            type="button"
            @click="acceptedTerms = true; showTermsModal = false"
            class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            J'accepte les conditions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { sendApi } from '@/composables/api';

const props = defineProps({
  amount: {
    type: [Number, String],
    required: true,
  },
  orderId: {
    type: [Number, String],
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
  orderReference: {
    type: String,
    default: '',
  },
  paymentToken: {
    type: String,
    default: '',
  },
  isSandbox: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['paymentSuccess', 'paymentFailed', 'priceUpdated']);

// Captcha State
const captchaChallenge = ref({ num1: 0, num2: 0 });
const captchaInput = ref('');
const acceptedTerms = ref(false);
const showTermsModal = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const generateCaptcha = () => {
  captchaChallenge.value = {
    num1: Math.floor(Math.random() * 8) + 2,
    num2: Math.floor(Math.random() * 8) + 1,
  };
  captchaInput.value = '';
};

const refreshCaptcha = () => {
  generateCaptcha();
};

const isCaptchaValid = computed(() => {
  const sum = captchaChallenge.value.num1 + captchaChallenge.value.num2;
  return Number(captchaInput.value) === sum;
});

const canProceed = computed(() => {
  return isCaptchaValid.value && acceptedTerms.value;
});

const formattedAmount = computed(() => {
  const val = Number(props.amount) || 0;
  return new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
});

onMounted(() => {
  generateCaptcha();
});

const idempotencyKey = ref('');

const initiateSatimPayment = async () => {
  if (!canProceed.value || isLoading.value) return;

  errorMessage.value = '';
  isLoading.value = true;

  if (!idempotencyKey.value) {
    idempotencyKey.value = `bzz-${props.orderType}-${props.orderId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  try {
    const payload = {
      order_type: props.orderType,
      order_id: Number(props.orderId),
      card_type: 'cib',
      payment_token: props.paymentToken || undefined,
      idempotency_key: idempotencyKey.value,
    };

    const res = await sendApi('/payment/cib/initialize', payload, 'POST', {
      silent: true,
      headers: {
        'Idempotency-Key': idempotencyKey.value,
        ...(props.paymentToken ? { 'X-Payment-Token': props.paymentToken } : {}),
      },
    });
    const data = res?.data || res;

    // Handle pre-payment hotel price update (HTTP 409 PRICE_CHANGED)
    if (data?.code === 'PRICE_CHANGED' && typeof data?.new_amount === 'number') {
      emit('priceUpdated', data.new_amount);
      idempotencyKey.value = '';
      errorMessage.value = res?.message || `Le tarif a été mis à jour (${data.new_amount} DZD). Veuillez vérifier le nouveau montant puis relancer le paiement.`;
      isLoading.value = false;
      return;
    }

    // SATIM Mode: Redirect client's browser directly to the official SATIM 3D-Secure payment URL
    if (data?.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }

    const errorText = res?.message || data?.message || 'Impossible de générer le lien officiel de paiement SATIM.';
    throw new Error(errorText);
  } catch (err) {
    console.error('SATIM initialization error:', err);
    errorMessage.value = err?.message || 'Erreur lors de la connexion à la passerelle SATIM. Veuillez réessayer.';
    isLoading.value = false;
  }
};
</script>
