<template>
    <div class="w-full">
        <div class="grid min-[640px]:grid-cols-2 grid-cols-1 gap-x-5 gap-y-6">
            <UFormField label="Nom complet">
                <UInput class="w-60" v-model="form.name" placeholder="Votre nom complet" icon="i-heroicons-user"/>
            </UFormField>
            <UFormField label="Nom d'utilisateur">
                <UInput class="w-60" v-model="form.username" placeholder="Votre nom d'utilisateur" icon="i-heroicons-at-symbol"/>
            </UFormField>
            <UFormField label="Email">
                <UInput disabled class="w-60" :model-value="user.email" icon="i-heroicons-envelope" />
                <p class="text-[11px] text-slate-400 mt-1">L'email ne peut pas être modifié</p>
            </UFormField>
            <UFormField label="Numéro de téléphone">
                <UInput class="w-60" v-model="form.phone" placeholder="05XXXXXXXX" icon="i-heroicons-phone"/>
            </UFormField>
        </div>
        <div class="mt-6 flex items-center gap-3">
            <UButton 
                class="font-bold" 
                @click="save" 
                label="Enregistrer les modifications"
                :loading="saving"
                :disabled="!hasChanges"
                icon="i-heroicons-check"
            />
            <span v-if="saved" class="text-sm text-green-600 font-medium flex items-center gap-1">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4"/>
                Enregistré !
            </span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['user','token']);
const user = props.user;
const toast = useToast()

const saving = ref(false)
const saved = ref(false)

const form = ref({
    name: user.name || '',
    username: user.username || '',
    phone: user.phone || '',
})

const hasChanges = computed(() => {
    return form.value.name !== (user.name || '') ||
           form.value.username !== (user.username || '') ||
           form.value.phone !== (user.phone || '')
})

const save = async () => {
    saving.value = true
    saved.value = false
    try {
        const payload = {}
        if (form.value.name !== user.name) payload.name = form.value.name
        if (form.value.username !== user.username) payload.username = form.value.username
        if (form.value.phone !== user.phone) payload.phone = form.value.phone
        
        const response = await sendApi('/profile/update', payload, 'PUT')
        
        // Update the parent user object
        if (payload.name) user.name = form.value.name
        if (payload.username) user.username = form.value.username
        if (payload.phone) user.phone = form.value.phone
        
        saved.value = true
        toast.add({ title: 'Profil mis à jour avec succès', color: 'green', timeout: 3000 })
        setTimeout(() => { saved.value = false }, 3000)
    } catch (err) {
        const msg = err?.data?.message || err?.response?.data?.message || "Erreur lors de la mise à jour"
        toast.add({ title: msg, color: 'red', timeout: 5000 })
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
</style>