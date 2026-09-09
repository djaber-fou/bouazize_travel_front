<template>        
    <div class="w-full flex flex-col text-start">
        <!-- Header -->
        <div class="mb-6 text-center">
            <h2 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Créer un compte</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Rejoignez Bouazize Travel dès aujourd'hui</p>
        </div>

        <UForm :schema="schema" :state="state" @submit="submitRegister" class="flex flex-col gap-3.5 w-full">
            <UFormField label="Nom complet" name="name" class="w-full">
                <UInput placeholder="Nom complet" v-model="state.name" class="w-full" icon="i-heroicons-user" size="lg"/>
            </UFormField>

            <UFormField label="Nom d'utilisateur" name="username" class="w-full">
                <UInput placeholder="Nom d'utilisateur" v-model="state.username" class="w-full" icon="i-heroicons-at-symbol" size="lg"/>
            </UFormField>

            <UFormField label="Numéro de téléphone" name="phone" class="w-full">
                <UInput placeholder="05XXXXXXXX" v-model="state.phone" class="w-full" icon="i-heroicons-phone" size="lg"/>
            </UFormField>

            <UFormField label="Email" name="email" class="w-full">
                <UInput placeholder="exemple@gmail.com" v-model="state.email" class="w-full" icon="i-heroicons-envelope" size="lg"/>
            </UFormField>

            <UFormField label="Mot de passe" name="password" class="w-full">
                <UInput
                    v-model="state.password"
                    placeholder="••••••••••••"
                    :type="showPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    class="w-full"
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

            <UFormField label="Confirmer le mot de passe" name="password_confirmation" class="w-full">
                <UInput
                    v-model="state.password_confirmation"
                    placeholder="••••••••••••"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    class="w-full"
                    icon="i-heroicons-lock-closed"
                    size="lg"
                >
                    <template #trailing>
                    <UButton
                        color="secondary"
                        variant="link"
                        size="sm"
                        :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        @click="showConfirmPassword = !showConfirmPassword"
                    />
                    </template>
                </UInput>
            </UFormField>

            <UFormField label="Type de compte" name="state" class="w-full">
                <USelect placeholder="Sélectionner un type" v-model="state.role" :items="types" class="w-full" size="lg" />
            </UFormField>

            <UFormField v-if="state.role === 'business'" label="Document" name="state" class="w-full">
                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div class="flex flex-col items-center justify-center py-4 px-2 text-center">
                            <UIcon name="i-heroicons-cloud-arrow-up" class="w-7 h-7 mb-2 text-primary" />
                            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Télécharger votre document</p>
                            <p class="text-[10px] text-slate-400 mt-0.5">(NIF, NIS, Agrément, Registre de Commerce)</p>
                        </div>
                        <UInput id="dropzone-file" type="file" class="hidden" @change="handleFile"/>
                    </label>
                </div> 
            </UFormField>
            
            <div class="flex flex-col gap-3 pt-2">
                <button 
                    :disabled="loading"
                    type="submit"
                    class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <UIcon v-if="!loading" name="i-heroicons-user-plus" class="w-5 h-5 text-secondary" />
                    <svg v-else class="animate-spin h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    <span>{{ loading ? 'Création en cours...' : 'Créer mon compte' }}</span>
                </button>

                <div class="text-center pt-1">
                    <button 
                        type="button"
                        @click="showLogin" 
                        class="cursor-pointer text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                        <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
                        <span>Vous avez déjà un compte ? Se connecter</span>
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
const loading = ref(false)
const toast = useToast()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleFile = (event) => {
    state.file = event.target.files[0]
}

const types = ref([
    {label:"Individuel", value:"individual"},
    {label:"Entreprise", value:"business"}
])
const emit = defineEmits(['getComponent', 'requireVerification'])
const showLogin = () => {
    emit('getComponent','login');
}
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
const schema = z.object({
    name: z.string({
        required_error:"Nom est obligatoire"
    }),
    username: z.string({
        required_error:"Nom d'utilisateur est obligatoire"
    }),
    phone: z.string({
        required_error:"Numéro de téléphone est obligatoire"
    }),
    email: z.string({
        required_error:"Email est obligatoire"
    }).email('Email non valide'),
    password: z.string({
        required_error: 'Mot de passe est obligatoire'
    }).min(8, 'Doit contenir au moins 8 caractères').regex(
      passwordRegex,
      'Le mot de passe doit contenir une majuscule et un caractère spécial'
    ),
    password_confirmation: z.string({
        required_error: 'La confirmation est obligatoire',
    }),
}).refine((data) => data.password === data.password_confirmation,{
    message: "Les mots de passe ne correspondent pas",
    path: ['password_confirmation'],
})

const state = reactive({
    name: undefined,
    username: undefined,
    phone: undefined,
    email: undefined,
    password: undefined,
    password_confirmation: undefined,
    role: undefined,
    file: undefined,
})

const submitRegister = async () => {
    loading.value = true
    const formdata = new FormData();
    formdata.append('name', state.name)
    formdata.append('username', state.username)
    formdata.append('phone', state.phone)
    formdata.append('email', state.email)
    formdata.append('password', state.password)
    formdata.append('password_confirmation', state.password_confirmation)
    formdata.append('role', state.role)
    if(state.role === "business" && state.file){
        formdata.append('file', state.file)
    }
    try {
        const result = await authStore.register(formdata)
        
        // Check if email verification is required
        if (result?.requiresVerification) {
            emit('requireVerification', result.email)
            toast.add({ 
                title: result.message || 'Veuillez confirmer votre e-mail', 
                color: 'green', 
                timeout: 5000 
            })
            return
        }
    } catch(err) {
        const msg = err?.data?.message || err?.response?.data?.message || "Erreur lors de l'inscription"
        toast.add({ title: msg, color: 'red', timeout: 5000 })
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
</style>