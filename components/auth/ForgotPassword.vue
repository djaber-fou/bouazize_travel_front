<template>        
    <div class="w-full flex flex-col items-center text-start">
        
        <!-- Success State -->
        <div v-if="success" class="flex flex-col items-center gap-6 text-center max-w-sm">
            <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <UIcon name="i-heroicons-envelope-open" class="w-10 h-10 text-green-600" />
            </div>
            <div class="flex flex-col gap-2">
                <h3 class="text-xl font-bold text-secondary">E-mail envoyé !</h3>
                <p class="text-gray-500 text-sm leading-relaxed">
                    Un nouveau mot de passe a été envoyé à <strong>{{ submittedEmail }}</strong>. 
                    Veuillez consulter votre boîte de réception et vous connecter avec votre nouveau mot de passe.
                </p>
                <p class="text-xs text-gray-400 mt-1">Pensez à vérifier vos spams si vous ne trouvez pas l'e-mail.</p>
            </div>
            <UButton 
                label="Retour à la connexion" 
                color="primary"
                class="font-bold w-full"
                @click="showLogin"
            />
        </div>

        <!-- Form State -->
        <UForm v-else :schema="schema" :state="state" class="flex flex-col gap-5 w-full" @submit="onSubmit">
            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold text-secondary">Mot de passe oublié ?</h3>
                <p class="text-gray-500 text-sm">Entrez votre adresse e-mail. Nous vous enverrons un nouveau mot de passe.</p>
            </div>

            <UFormField label="Adresse e-mail" name="email">
                <UInput 
                    placeholder="exemple@gmail.com" 
                    v-model="state.email" 
                    class="lg:w-100 md:w-80 w-60"
                    icon="i-heroicons-envelope"
                    size="lg"
                    :disabled="loading"
                />
            </UFormField>
            
            <div class="flex flex-col gap-3">
                <UButton 
                    label="Envoyer le nouveau mot de passe" 
                    type="submit"
                    color="primary"
                    class="font-bold cursor-pointer w-full"
                    :loading="loading"
                    loading-icon="i-lucide-loader-circle"
                    size="lg"
                />
                <div @click="showLogin" class="text-center cursor-pointer text-sm font-medium text-primary hover:underline">
                    ← Retour à la connexion
                </div>
            </div>
        </UForm>

    </div>
</template>

<script setup>
import * as z from 'zod'
import { useAuthStore } from '#imports'

const authStore = useAuthStore()
const emit = defineEmits(['getComponent'])
const toast = useToast()

const success = ref(false)
const loading = ref(false)
const submittedEmail = ref('')

const showLogin = () => {
    emit('getComponent','login')
}

const schema = z.object({
    email: z.string({
        required_error: "Email est obligatoire"
    }).email('Email non valide'),
})

const state = ref({
    email: undefined,
})

const onSubmit = async () => {
    if (!state.value.email) return
    
    loading.value = true
    try {
        await authStore.forgotPassword(state.value)
        submittedEmail.value = state.value.email
        success.value = true
    } catch(err) {
        const message = err?.data?.message || err?.response?.data?.message || "Une erreur s'est produite. Veuillez vérifier votre e-mail."
        toast.add({ 
            title: message, 
            color: 'red',
            timeout: 5000
        })
        state.value = { email: undefined }
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
</style>