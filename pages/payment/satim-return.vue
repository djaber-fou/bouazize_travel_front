<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
    <div class="max-w-3xl mx-auto">

      <!-- ============================================================== -->
      <!-- 1. LOADING STATE                                               -->
      <!-- ============================================================== -->
      <div v-if="state === 'loading'" class="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div class="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-primary animate-spin" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Vérification de la Transaction SATIM...
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Nous confirmons l'état de votre paiement auprès du serveur d'autorisation interbancaire SATIM. Veuillez patienter un instant.
          </p>
        </div>
        <div class="flex items-center justify-center gap-2">
          <div v-for="i in 3" :key="i" class="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" :style="`animation-delay: ${(i-1)*0.15}s`"></div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 2. PAYMENT ACCEPTED (CERTIFICATION IHM COMPLIANT)               -->
      <!-- Criteria: ("respCode": "00", "ErrorCode": "0", "OrderStatus": "2") -->
      <!-- ============================================================== -->
      <div v-else-if="state === 'success'" class="space-y-6">
        <!-- Main Printable Receipt Card -->
        <div id="satim-printable-receipt" class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden print:border-none print:shadow-none">
          
          <!-- Receipt Header -->
          <div class="bg-emerald-700 text-white p-6 sm:p-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/10 shrink-0">
                  <Icon name="heroicons:check-badge" class="w-9 h-9 text-white" />
                </div>
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-wider mb-1">
                    Transaction Approuvée
                  </span>
                  <h1 class="text-xl sm:text-2xl font-black tracking-tight">
                    Reçu de Paiement Électronique
                  </h1>
                  <p class="text-xs text-emerald-100">
                    Passerelle SATIM-EPG • GIE Monétique Algérie
                  </p>
                </div>
              </div>

              <!-- Agency Branding -->
              <div class="text-right">
                <span class="text-base font-black tracking-wider block">BOUAZIZE TRAVEL</span>
                <span class="text-[11px] text-emerald-100 block">Agence de Tourisme et de Voyages</span>
              </div>
            </div>
          </div>

          <!-- Receipt Details Table (All mandatory SATIM fields) -->
          <div class="p-6 sm:p-8 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <!-- Parameter: respCode_desc -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Résultat de la transaction (respCode_desc)</span>
                <span class="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {{ receipt.respCode_desc || 'Transaction approuvée' }}
                </span>
              </div>

              <!-- Parameter: approvalCode -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Numéro d'autorisation (approvalCode)</span>
                <span class="text-sm font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  {{ receipt.approvalCode || receipt.receipt_number || 'AUT-' + receipt.orderId }}
                </span>
              </div>

              <!-- Parameter: orderId -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Identifiant de transaction SATIM (orderId)</span>
                <span class="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 block break-all">
                  {{ receipt.orderId }}
                </span>
              </div>

              <!-- Parameter: orderNumber -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Numéro de commande marchand (orderNumber)</span>
                <span class="text-sm font-mono font-bold text-primary mt-1 block">
                  {{ receipt.orderNumber }}
                </span>
              </div>

              <!-- Parameter: transaction_date -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date et heure de la transaction</span>
                <span class="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 block">
                  {{ receipt.transaction_date || currentDateTime }}
                </span>
              </div>

              <!-- Parameter: Mode de paiement -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mode de paiement</span>
                <span class="text-sm font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Icon name="heroicons:credit-card" class="w-4 h-4 text-emerald-500" />
                  <span>carte CIB/EDAHABIA</span>
                </span>
              </div>
            </div>

            <!-- Amount Banner -->
            <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                  Montant total réglé
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  Débité immédiatement avec confirmation 3D-Secure
                </span>
              </div>
              <div class="text-right">
                <span class="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {{ formatAmount(receipt.amount) }}
                </span>
                <span class="ml-1 text-base font-black text-emerald-700 dark:text-emerald-300">DZD</span>
              </div>
            </div>

            <!-- MANDATORY GREEN NUMBER NOTICE (Exigence SATIM: 3020) -->
            <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Icon name="heroicons:phone" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p class="text-xs text-amber-900 dark:text-amber-200 font-bold leading-relaxed">
                En cas de problème de paiement, veuillez contacter le numéro vert de la SATIM <strong>3020</strong> (Appel gratuit).
              </p>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- MANDATORY 3 ACTIONS BAR (Exigences SATIM):                       -->
        <!-- 1. Impression                                                  -->
        <!-- 2. Téléchargement PDF                                          -->
        <!-- 3. Envoi par e-mail à une adresse tierce                       -->
        <!-- ============================================================== -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4 print:hidden">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions disponibles pour votre reçu :</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- 1. Print Receipt -->
            <button
              type="button"
              @click="printReceipt"
              class="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="heroicons:printer" class="w-4 h-4 text-primary" />
              <span>Imprimer le reçu</span>
            </button>

            <!-- 2. Download PDF -->
            <button
              type="button"
              :disabled="isGeneratingPdf"
              @click="downloadPdf"
              class="py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
            >
              <Icon v-if="!isGeneratingPdf" name="heroicons:arrow-down-tray" class="w-4 h-4" />
              <Icon v-else name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
              <span>{{ isGeneratingPdf ? 'Génération...' : 'Télécharger en PDF' }}</span>
            </button>

            <!-- 3. Send by Email (Toggle Box) -->
            <button
              type="button"
              @click="showEmailBox = !showEmailBox"
              class="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Icon name="heroicons:envelope" class="w-4 h-4" />
              <span>Envoyer par e-mail</span>
            </button>
          </div>

          <!-- Third-Party Email Dispatch Form (SATIM Requirement: envoi à une adresse tierce) -->
          <div v-if="showEmailBox" class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <p class="text-xs text-slate-600 dark:text-slate-400">
              Saisissez l'adresse e-mail (la vôtre ou celle d'un tiers) à laquelle expédier une copie officielle en format PDF :
            </p>
            <form @submit.prevent="sendEmailReceipt" class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="recipientEmail"
                type="email"
                required
                placeholder="Exemple: client@gmail.com"
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                :disabled="isSendingEmail || !recipientEmail"
                class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon v-if="!isSendingEmail" name="heroicons:paper-airplane" class="w-3.5 h-3.5" />
                <Icon v-else name="heroicons:arrow-path" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ isSendingEmail ? 'Envoi...' : 'Envoyer le reçu' }}</span>
              </button>
            </form>
            <p v-if="emailSuccessMessage" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <Icon name="heroicons:check-circle" class="w-4 h-4" />
              <span>{{ emailSuccessMessage }}</span>
            </p>
          </div>

          <!-- Bottom Navigation Links -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center text-xs">
            <nuxt-link to="/client/orders" class="font-bold text-primary hover:underline flex items-center gap-1">
              <Icon name="heroicons:calendar" class="w-4 h-4" />
              <span>Consulter mes réservations &amp; vouchers</span>
            </nuxt-link>
            <nuxt-link to="/" class="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
              Retour à l'accueil
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 3. PAYMENT REJECTED (CERTIFICATION IHM COMPLIANT)               -->
      <!-- Criteria:                                                      -->
      <!-- SI ("respCode": "00", "ErrorCode": "0", "OrderStatus": "3")    -->
      <!--   -> « Votre transaction a été rejetée / Your transaction was rejected / تم رفض معاملتك » -->
      <!-- SINON                                                          -->
      <!--   -> Afficher respCode_desc (sinon actionCodeDescription)      -->
      <!--   -> Numéro vert 3020                                          -->
      <!-- ============================================================== -->
      <div v-else-if="state === 'rejected'" class="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl p-8 sm:p-10 space-y-6 text-center">
        <div class="w-20 h-20 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center ring-8 ring-rose-50 dark:ring-rose-900/20">
          <Icon name="heroicons:x-circle" class="w-12 h-12 text-rose-500" />
        </div>

        <div class="space-y-3">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">
            Paiement Refusé
          </h2>

          <!-- Rejection Message per SATIM strict condition -->
          <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 max-w-lg mx-auto">
            <p class="text-sm font-black text-rose-700 dark:text-rose-300 leading-relaxed">
              {{ rejection.message }}
            </p>
          </div>
        </div>

        <!-- Optional Technical Details for Transparency -->
        <div v-if="rejection.orderNumber || rejection.orderId" class="inline-flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-xl">
          <span v-if="rejection.orderNumber">Réf: <strong>{{ rejection.orderNumber }}</strong></span>
          <span v-if="rejection.orderId">Transaction: <strong>{{ rejection.orderId }}</strong></span>
        </div>

        <!-- MANDATORY GREEN NUMBER NOTICE (Exigence SATIM: 3020) -->
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 max-w-lg mx-auto flex items-center gap-3 text-left">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Icon name="heroicons:phone" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p class="text-xs text-amber-900 dark:text-amber-200 font-bold leading-relaxed">
            En cas de problème de paiement, veuillez contacter le numéro vert de la SATIM <strong>3020</strong>.
          </p>
        </div>

        <!-- Retry Button -->
        <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <button
            type="button"
            @click="retryPayment"
            class="flex-1 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
          >
            Réessayer le paiement
          </button>
          <nuxt-link
            to="/"
            class="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors text-center"
          >
            Retour à l'accueil
          </nuxt-link>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 4. SYSTEM ERROR                                                -->
      <!-- ============================================================== -->
      <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center space-y-5">
        <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
          <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-amber-500" />
        </div>
        <h2 class="text-xl font-black text-slate-900 dark:text-white">
          Session de Paiement Introuvable
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Aucun identifiant de transaction n'a été transmis. Si vous avez été débité, veuillez contacter le support avec votre référence.
        </p>
        <nuxt-link
          to="/"
          class="inline-block py-3 px-6 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-md"
        >
          Retour à l'accueil
        </nuxt-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { sendApi } from '@/composables/api';

definePageMeta({ layout: 'default' });

useHead({
  title: 'Résultat de la transaction - SATIM - Bouazize Travel',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

const route = useRoute();
const router = useRouter();

const state = ref('loading'); // 'loading' | 'success' | 'rejected' | 'error'
const isGeneratingPdf = ref(false);
const showEmailBox = ref(false);
const recipientEmail = ref('');
const isSendingEmail = ref(false);
const emailSuccessMessage = ref('');

// Certified Receipt State
const receipt = ref({
  respCode_desc: '',
  orderId: '',
  orderNumber: '',
  approvalCode: '',
  transaction_date: '',
  amount: 0,
  currency: 'DZD',
  card_type: 'carte CIB/EDAHABIA',
  satim_green_number: '3020',
  receipt_number: '',
});

// Certified Rejection State
const rejection = ref({
  message: '',
  respCode_desc: '',
  actionCodeDescription: '',
  orderId: '',
  orderNumber: '',
  satim_green_number: '3020',
});

const cibId = route.query.cib_id;
const orderType = route.query.order_type;
const orderId = route.query.order_id;
const explicitStatus = route.query.status;

const currentDateTime = computed(() => {
  return new Date().toLocaleString('fr-DZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

const formatAmount = (val) => {
  return new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val) || 0);
};

const retryPayment = () => {
  if (orderId && orderType) {
    router.push(`/payment/confirm?order_id=${orderId}&type=${orderType}`);
  } else {
    router.push('/');
  }
};

const printReceipt = () => {
  window.print();
};

const downloadPdf = async () => {
  isGeneratingPdf.value = true;
  try {
    const element = document.getElementById('satim-printable-receipt');
    if (!element) return;

    // Dynamically import html2pdf
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Recu_Paiement_SATIM_${receipt.value.orderNumber || 'BOUAZIZE'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF generation error:', err);
    // Fallback to window print
    window.print();
  } finally {
    isGeneratingPdf.value = false;
  }
};

const sendEmailReceipt = async () => {
  if (!recipientEmail.value || isSendingEmail.value || !cibId) return;

  isSendingEmail.value = true;
  emailSuccessMessage.value = '';

  try {
    const payload = {
      payment_id: Number(cibId),
      email: recipientEmail.value,
    };

    const res = await sendApi('/payment/cib/send-receipt', payload, 'POST');
    emailSuccessMessage.value = res?.message || `Le reçu a été envoyé avec succès à ${recipientEmail.value}`;
    setTimeout(() => {
      showEmailBox.value = false;
    }, 4000);
  } catch (err) {
    console.error('Send email error:', err);
    alert(err?.message || "Impossible d'envoyer le reçu par e-mail. Veuillez réessayer.");
  } finally {
    isSendingEmail.value = false;
  }
};

onMounted(async () => {
  if (!cibId) {
    state.value = 'error';
    return;
  }

  // Handle immediate failure from failUrl redirect
  if (explicitStatus === 'failed') {
    state.value = 'rejected';
    const msg = route.query.msg ? decodeURIComponent(route.query.msg) : null;
    rejection.value = {
      message: msg || 'Votre transaction a été rejetée / تم رفض معاملتك',
      orderId: route.query.orderId || cibId,
      orderNumber: `ORD-${cibId}`,
      satim_green_number: '3020',
    };
    return;
  }

  // Simulator mode handler (local dev)
  if (route.query.mode === 'simulator') {
    try {
      const simRes = await sendApi('/payment/cib/simulate', {
        payment_id: Number(cibId),
        card_number: '6280581110007215',
        otp: '123456',
      }, 'POST');
      const simData = simRes?.data || simRes;

      state.value = 'success';
      receipt.value = {
        respCode_desc: 'Transaction approuvée (Mode Test)',
        orderId: `SIM-${cibId}`,
        orderNumber: `ORD-${cibId}`,
        approvalCode: simData?.receipt_number || 'SIM-AUT-123456',
        transaction_date: currentDateTime.value,
        amount: simData?.amount || route.query.amount || 5966.56,
        currency: 'DZD',
        card_type: 'carte CIB/EDAHABIA',
        satim_green_number: '3020',
        receipt_number: simData?.receipt_number || 'SIM-AUT-123456',
      };
      return;
    } catch (simErr) {
      console.warn('Simulator error:', simErr);
    }
  }

  // Call acknowledge API to verify transaction with SATIM
  try {
    const res = await sendApi('/payment/cib/acknowledge', {
      payment_id: Number(cibId),
    }, 'POST');

    const data = res?.data || res;

    // CASE 1: ACCEPTED
    if (data?.success) {
      state.value = 'success';
      receipt.value = {
        respCode_desc: data.respCode_desc || 'Transaction approuvée',
        orderId: data.orderId || cibId,
        orderNumber: data.orderNumber || `ORD-${cibId}`,
        approvalCode: data.approvalCode || data.receipt_number,
        transaction_date: data.transaction_date || currentDateTime.value,
        amount: data.amount || 0,
        currency: data.currency || 'DZD',
        card_type: data.card_type || 'carte CIB/EDAHABIA',
        satim_green_number: data.satim_green_number || '3020',
        receipt_number: data.receipt_number || data.approvalCode,
      };
    } else {
      // CASE 2: REJECTED
      state.value = 'rejected';
      rejection.value = {
        message: data?.message || 'Votre transaction a été rejetée / تم رفض معاملتك',
        respCode_desc: data?.respCode_desc || '',
        actionCodeDescription: data?.actionCodeDescription || '',
        orderId: data?.orderId || cibId,
        orderNumber: data?.orderNumber || `ORD-${cibId}`,
        satim_green_number: data?.satim_green_number || '3020',
      };
    }
  } catch (err) {
    console.error('SATIM acknowledge error:', err);
    state.value = 'rejected';
    rejection.value = {
      message: err?.message || 'Erreur lors de la vérification du paiement auprès de la SATIM.',
      satim_green_number: '3020',
      orderId: cibId,
      orderNumber: `ORD-${cibId}`,
    };
  }
});
</script>

<style scoped>
@media print {
  body {
    background: white !important;
  }
  #satim-printable-receipt {
    border: 1px solid #cbd5e1 !important;
    box-shadow: none !important;
  }
}
</style>
