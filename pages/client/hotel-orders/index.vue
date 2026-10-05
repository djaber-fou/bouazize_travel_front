<template>
  <div class="min-h-screen flex items-center justify-center p-6 text-center">
    <div class="flex flex-col items-center gap-3">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 text-primary animate-spin" />
      <p class="text-sm font-medium text-slate-500">Redirection vers vos réservations d'hôtels...</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/client/orders?tab=hotels')
    }
  ]
})
</script>
