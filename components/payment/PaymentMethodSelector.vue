<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Méthode de paiement</h3>
    
    <div class="grid sm:grid-cols-2 gap-4">
      <!-- CCP Option -->
      <label 
        class="relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all"
        :class="modelValue === 'ccp' ? 'border-primary ring-1 ring-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'"
      >
        <input 
          type="radio" 
          name="payment_method" 
          value="ccp" 
          class="sr-only"
          :checked="modelValue === 'ccp'"
          @change="$emit('update:modelValue', 'ccp')"
        >
        <span class="flex flex-1">
          <span class="flex flex-col">
            <span class="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="heroicons:credit-card" class="w-5 h-5 text-primary" />
              BaridiMob / CCP
            </span>
            <span class="mt-1 flex items-center text-xs text-gray-500 dark:text-slate-400">
              Paiement direct en ligne avec reçu.
            </span>
          </span>
        </span>
        <Icon 
          v-if="modelValue === 'ccp'" 
          name="heroicons:check-circle-solid" 
          class="h-6 w-6 text-primary absolute top-4 right-4" 
        />
      </label>

      <!-- Credit Option -->
      <label 
        class="relative flex rounded-xl border p-4 shadow-sm focus:outline-none transition-all"
        :class="[
          disableCredit ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800' : 'cursor-pointer',
          !disableCredit && modelValue === 'credit' ? 'border-primary ring-1 ring-primary bg-primary/5 dark:bg-primary/10' : '',
          !disableCredit && modelValue !== 'credit' ? 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600' : ''
        ]"
      >
        <input 
          type="radio" 
          name="payment_method" 
          value="credit" 
          class="sr-only"
          :disabled="disableCredit"
          :checked="modelValue === 'credit'"
          @change="!disableCredit && $emit('update:modelValue', 'credit')"
        >
        <span class="flex flex-1">
          <span class="flex flex-col">
            <span class="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="heroicons:document-text" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Crédit Agence / Facture
            </span>
            <span class="mt-1 flex flex-col text-xs text-gray-500 dark:text-slate-400">
              <span>Paiement différé via votre solde.</span>
              <span v-if="disableCredit" class="text-red-500 font-bold mt-1">Solde insuffisant</span>
            </span>
          </span>
        </span>
        <Icon 
          v-if="modelValue === 'credit'" 
          name="heroicons:check-circle-solid" 
          class="h-6 w-6 text-primary absolute top-4 right-4" 
        />
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  disableCredit: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>
