<template>
    <UModal :close="{ onClick: () => emit('close', true) }" :title="title">
        <template #footer>
            <div class="w-full flex justify-end gap-2">
                <UButton class="font-bold" color="neutral" label="Annuler" @click="emit('close', true)" />
                <UButton class="font-bold" color="error" label="Continue" @click="emit('close', false)" />
            </div>
        </template>
  </UModal>
</template>

<script setup>
const {title} = defineProps(['title']);
const emit = defineEmits(['close'])
</script>

<style scoped>

</style>

