<template>        
    <div class="w-full flex flex-col text-start">
        <!-- Header -->
        <div class="mb-6 text-center">
            <h2 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Connexion</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Accédez à votre espace Bouazize Travel</p>
        </div>

        <UForm :schema="schema" :state="state" class="flex flex-col gap-4 w-full" @submit="onSubmit">
            <UFormField label="Email" name="email" class="w-full">
                <UInput 
                    placeholder="exemple@gmail.com" 
                    v-model="state.email" 
                    class="w-full"
                    icon="i-heroicons-envelope"
                    size="lg"
                />
            </UFormField>

            <UFormField label="Mot de passe" name="password" class="w-full">
                <UInput 
                    v-model="state.password" 
                    placeholder="••••••••••••" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="w-full"
                    :ui="{ trailing: 'pe-1' }"
                    icon="i-heroicons-lock-closed"
                    size="lg"
                >
                    <template #trailing>
                        <UButton
                            color="secondary"
                            variant="link"
                            size="sm"
                            :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                            @click="showPassword = !showPassword"
                        />
                    </template>
                </UInput>
            </UFormField>
            
            <div class="flex flex-col gap-3 pt-2">
                <button
                    :disabled="loading"
                    type="submit"
                    class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <UIcon v-if="!loading" name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 text-secondary" />
                    <svg v-else class="animate-spin h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    <span>{{ loading ? 'Connexion en cours...' : 'Se connecter' }}</span>
                </button>

                <div class="flex items-center justify-between pt-1">
                    <button 
                        type="button"
                        @click="showComponent('register')" 
                        class="cursor-pointer text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
                    >
                        <UIcon name="i-heroicons-user-plus" class="w-3.5 h-3.5" />
                        <span>Créer un compte</span>
                    </button>
                    <button 
                        type="button"
                        @click="showComponent('forgetPassword')" 
                        class="cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        Mot de passe oublié ?
                    </button>
                </div>
            </div>
        </UForm>
    </div>
</template>

<script setup>
import * as z from 'zod'
import { useAuthStore } from '#imports';

const authStore = useAuthStore()
const emit = defineEmits(['getComponent', 'requireVerification'])
const toast = useToast()
const showPassword = ref(false)

const showComponent = (component) => {
    emit('getComponent', component);
}

const loading = ref(false);

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
const schema = z.object({
    email: z.string({
        required_error:"Email est obligatoire"
    }).email('Email non valide'),
    password: z.string({
        required_error: 'Mot de passe est obligatoire'
    })
    .min(8, 'Doit contenir au moins 8 caractères').regex(
      passwordRegex,
      'Le mot de passe doit contenir une majuscule et un caractère spécial'
    ),
})

const state = ref({
  email: undefined,
  password: undefined
})

const onSubmit = async () => {
    loading.value = true
    try {
        const result = await authStore.login(state.value)
        
        // Check if email verification is required
        if (result?.requiresVerification) {
            emit('requireVerification', result.email)
            toast.add({ 
                title: result.message || 'Veuillez confirmer votre e-mail', 
                color: 'orange', 
                timeout: 5000 
            })
            return
        }
    } catch(err) {
        const msg = err?.data?.message || err?.response?.data?.message || "Erreur de connexion"
        toast.add({ title: msg, color: 'red', timeout: 5000 })
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
</style>