<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
        <Icon name="heroicons:credit-card" class="w-5 h-5 text-primary" />
        <span>Mode de Paiement Sécurisé</span>
      </h3>
      <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
        Paiement Certifié
      </span>
    </div>
    
    <div class="grid gap-4" :class="gridColsClass">
      <!-- 1. E-Payment Option (Carte CIB / EDAHABIA - SATIM) -->
      <label 
        for="payment-method-cib"
        class="relative flex cursor-pointer rounded-2xl border p-5 shadow-sm focus:outline-none transition-all sm:col-span-2"
        :class="modelValue === 'cib' ? 'border-primary ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'"
      >
        <input 
          id="payment-method-cib"
          type="radio" 
          name="payment_method" 
          value="cib" 
          class="sr-only"
          :checked="modelValue === 'cib'"
          @change="$emit('update:modelValue', 'cib')"
        >
        <span class="flex flex-1 pr-8">
          <span class="flex flex-col">
            <span class="text-sm font-black text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded bg-[#004b93] text-white text-[10px] font-black">CIB</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded bg-[#008250] text-white text-[10px] font-black">الذهبية</span>
              <span>Carte CIB / EDAHABIA (Passerelle SATIM)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary">Confirmation Immédiate</span>
            </span>
            <span class="mt-1.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Paiement électronique direct et 100% sécurisé via la plateforme officielle SATIM (protocole 3D-Secure avec SMS OTP). Reçu officiel et voucher immédiats.
            </span>
            <span class="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <Icon name="heroicons:shield-check" class="w-4 h-4 text-primary" />
              <span>GIE Monétique • Zéro frais de dossier</span>
            </span>
          </span>
        </span>
        <Icon 
          v-if="modelValue === 'cib'" 
          name="heroicons:check-circle-solid" 
          class="h-6 w-6 text-primary absolute top-5 right-5" 
        />
      </label>

      <!-- 2. E-Payment Option (BaridiMob / CCP) -->
      <label 
        for="payment-method-ccp"
        class="relative flex cursor-pointer rounded-2xl border p-5 shadow-sm focus:outline-none transition-all"
        :class="modelValue === 'ccp' ? 'border-primary ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10 shadow-md' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'"
      >
        <input 
          id="payment-method-ccp"
          type="radio" 
          name="payment_method" 
          value="ccp" 
          class="sr-only"
          :checked="modelValue === 'ccp'"
          @change="$emit('update:modelValue', 'ccp')"
        >
        <span class="flex flex-1 pr-8">
          <span class="flex flex-col">
            <span class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="heroicons:device-phone-mobile" class="w-5 h-5 text-primary" />
              Virement CCP / BaridiMob
            </span>
            <span class="mt-1.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Virement direct vers le compte CCP de l'agence avec justificatif. Confirmation officielle dès vérification par l'équipe administrative.
            </span>
            <span class="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <Icon name="heroicons:document-arrow-up" class="w-4 h-4 text-slate-400" />
              Reçu de transaction requis
            </span>
          </span>
        </span>
        <Icon 
          v-if="modelValue === 'ccp'" 
          name="heroicons:check-circle-solid" 
          class="h-6 w-6 text-primary absolute top-5 right-5" 
        />
      </label>

      <!-- Espèces / En Agence (Cash) Option — visible when showCash is true -->
      <label 
        v-if="showCash"
        for="payment-method-cash"
        class="relative flex cursor-pointer rounded-2xl border p-5 shadow-sm focus:outline-none transition-all"
        :class="modelValue === 'cash' ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 shadow-md' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'"
      >
        <input 
          id="payment-method-cash"
          type="radio" 
          name="payment_method" 
          value="cash" 
          class="sr-only"
          :checked="modelValue === 'cash'"
          @change="$emit('update:modelValue', 'cash')"
        >
        <span class="flex flex-1 pr-8">
          <span class="flex flex-col">
            <span class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="heroicons:banknotes" class="w-5 h-5 text-amber-500" />
              Espèces / En Agence
            </span>
            <span class="mt-1.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Règlement au comptoir de l'agence Bouazize Travel. Présentez-vous avec votre référence de réservation.
            </span>
            <span class="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
              <Icon name="heroicons:building-storefront" class="w-4 h-4" />
              Règlement sur place
            </span>
          </span>
        </span>
        <Icon 
          v-if="modelValue === 'cash'" 
          name="heroicons:check-circle-solid" 
          class="h-6 w-6 text-amber-500 absolute top-5 right-5" 
        />
      </label>

      <!-- Credit Option (B2B only) -->
      <label 
        v-if="showCredit"
        for="payment-method-credit"
        class="relative flex rounded-2xl border p-5 shadow-sm focus:outline-none transition-all"
        :class="[
          disableCredit ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800' : 'cursor-pointer',
          !disableCredit && modelValue === 'credit' ? 'border-primary ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10 shadow-md' : '',
          !disableCredit && modelValue !== 'credit' ? 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600' : ''
        ]"
      >
        <input 
          id="payment-method-credit"
          type="radio" 
          name="payment_method" 
          value="credit" 
          class="sr-only"
          :disabled="disableCredit"
          :checked="modelValue === 'credit'"
          @change="!disableCredit && $emit('update:modelValue', 'credit')"
        >
        <span class="flex flex-1 pr-8">
          <span class="flex flex-col">
            <span class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="heroicons:document-text" class="w-5 h-5 text-amber-500" />
              Crédit Agence B2B / Facture
            </span>
            <span class="mt-1.5 flex flex-col text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              <span>Paiement différé prélevé sur votre solde entreprise pré-autorisé.</span>
              <span v-if="disableCredit" class="text-rose-500 font-bold mt-1">Solde insuffisant pour ce montant</span>
            </span>
          </span>
        </span>
        <Icon 
          v-if="modelValue === 'credit'" 
          name="heroicons:check-circle-solid" 
          class="h-6 w-6 text-primary absolute top-5 right-5" 
        />
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  disableCredit: {
    type: Boolean,
    default: false
  },
  showCredit: {
    type: Boolean,
    default: false
  },
  showCash: {
    type: Boolean,
    default: true
  },
  showCib: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

onMounted(() => {
  if (props.modelValue === 'cib') {
    emit('update:modelValue', 'ccp');
  }
});

const gridColsClass = computed(() => {
  const visibleCount = (props.showCib ? 1 : 0) + 1 + (props.showCash ? 1 : 0) + (props.showCredit ? 1 : 0);
  if (visibleCount >= 2) return 'sm:grid-cols-2';
  return 'grid-cols-1';
});
</script>
