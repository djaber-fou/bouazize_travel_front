<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
        <Icon name="heroicons:credit-card" class="w-5 h-5 text-primary" />
        <span>Mode de Paiement Sécurisé</span>
      </h3>
      <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
        Validation Admin Requise
      </span>
    </div>
    
    <div class="grid gap-4" :class="gridColsClass">
      <!-- E-Payment Option (BaridiMob / CCP / CIB / Edahabia) -->
      <label 
        for="payment-method-ccp"
        class="relative flex cursor-pointer rounded-2xl border p-5 shadow-sm focus:outline-none transition-all"
        :class="modelValue === 'ccp' ? 'border-primary ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'"
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
              Paiement Électronique (BaridiMob / CCP)
            </span>
            <span class="mt-1.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Virement direct en ligne avec reçu de transaction. Confirmation officielle de la réservation et délivrance du voucher dès vérification par l'administration.
            </span>
            <span class="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <Icon name="heroicons:shield-check" class="w-4 h-4" />
              100% Sécurisé & Certifié
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
        :class="modelValue === 'cash' ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'"
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
              Paiement en espèces directement au bureau de l'agence Bouazize Travel. Présentez-vous avec votre numéro de réservation.
            </span>
            <span class="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
              <Icon name="heroicons:building-storefront" class="w-4 h-4" />
              Règlement sur place à l'agence
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
          !disableCredit && modelValue === 'credit' ? 'border-primary ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10' : '',
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
import { computed } from 'vue';

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
  }
});

const emit = defineEmits(['update:modelValue']);

const gridColsClass = computed(() => {
  const visibleCount = 1 + (props.showCash ? 1 : 0) + (props.showCredit ? 1 : 0);
  if (visibleCount >= 3) return 'sm:grid-cols-3';
  if (visibleCount === 2) return 'sm:grid-cols-2';
  return 'grid-cols-1';
});
</script>
