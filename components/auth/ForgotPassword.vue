<template>        
    <div class="w-full flex flex-col text-start">
        
        <!-- STEP 4: Success State -->
        <div v-if="step === 'success'" class="flex flex-col items-center gap-5 text-center">
            <div class="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="flex flex-col gap-1.5">
                <h3 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Mot de passe réinitialisé !</h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                    Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
                </p>
            </div>
            <button 
                type="button"
                @click="showLogin"
                class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 text-secondary" />
                <span>Se connecter</span>
            </button>
        </div>

        <!-- STEP 1: Email Input -->
        <UForm v-else-if="step === 'email'" :schema="emailSchema" :state="emailState" class="flex flex-col gap-4 w-full" @submit="submitEmail">
            <div class="mb-2 text-center">
                <h3 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Mot de passe oublié ?</h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Entrez votre e-mail pour recevoir un code de confirmation</p>
            </div>

            <UFormField label="Adresse e-mail" name="email" class="w-full">
                <UInput 
                    placeholder="exemple@gmail.com" 
                    v-model="emailState.email" 
                    class="w-full"
                    icon="i-heroicons-envelope"
                    size="lg"
                    :disabled="loading"
                />
            </UFormField>
            
            <div class="flex flex-col gap-3 pt-2">
                <button 
                    :disabled="loading"
                    type="submit"
                    class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <UIcon v-if="!loading" name="i-heroicons-paper-airplane" class="w-5 h-5 text-secondary" />
                    <svg v-else class="animate-spin h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    <span>{{ loading ? 'Envoi en cours...' : 'Envoyer le code' }}</span>
                </button>

                <div class="text-center pt-1">
                    <button 
                        type="button"
                        @click="showLogin" 
                        class="cursor-pointer text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                        <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
                        <span>Retour à la connexion</span>
                    </button>
                </div>
            </div>
        </UForm>

        <!-- STEP 2: Code Verification -->
        <div v-else-if="step === 'code'" class="flex flex-col gap-5 w-full">
            <div class="flex flex-col items-center gap-2 text-center mb-1">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xs">
                    <UIcon name="i-heroicons-shield-check" class="w-7 h-7 text-primary" />
                </div>
                <h3 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Entrez le code</h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                    Un code à 6 chiffres a été envoyé à <strong class="text-secondary dark:text-white font-bold">{{ submittedEmail }}</strong>
                </p>
            </div>

            <!-- 6-digit code input -->
            <div class="flex justify-center gap-2 sm:gap-2.5 my-1">
                <input
                    v-for="(digit, idx) in codeDigits"
                    :key="idx"
                    :ref="el => { if (el) codeInputRefs[idx] = el }"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    :value="codeDigits[idx]"
                    @input="onDigitInput(idx, $event)"
                    @keydown.backspace="onBackspace(idx, $event)"
                    @paste="onPaste($event)"
                    class="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black border-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                    :class="codeDigits[idx] ? 'border-primary ring-2 ring-primary/20 bg-white dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'"
                />
            </div>

            <p v-if="codeError" class="text-center text-xs font-semibold text-red-500">{{ codeError }}</p>

            <button 
                type="button"
                @click="submitCode"
                :disabled="fullCode.length !== 6 || loading"
                class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <UIcon v-if="!loading" name="i-heroicons-check-circle" class="w-5 h-5 text-secondary" />
                <svg v-else class="animate-spin h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                <span>{{ loading ? 'Vérification...' : 'Vérifier le code' }}</span>
            </button>

            <div class="flex flex-col items-center gap-2 pt-1 text-center">
                <div>
                    <button 
                        v-if="cooldown <= 0"
                        @click="resendCode" 
                        :disabled="loading"
                        type="button"
                        class="text-xs font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50 inline-flex items-center gap-1 transition-colors"
                    >
                        <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" />
                        <span>Renvoyer le code</span>
                    </button>
                    <span v-else class="text-xs text-slate-400">
                        Renvoyer dans <strong class="text-primary font-bold">{{ cooldown }}s</strong>
                    </span>
                </div>

                <button 
                    type="button"
                    @click="step = 'email'" 
                    class="cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary inline-flex items-center gap-1 transition-colors pt-1"
                >
                    <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
                    <span>Changer l'adresse e-mail</span>
                </button>
            </div>
        </div>

        <!-- STEP 3: New Password -->
        <UForm v-else-if="step === 'password'" :schema="passwordSchema" :state="passwordState" class="flex flex-col gap-4 w-full" @submit="submitPassword">
            <div class="flex flex-col items-center gap-2 text-center mb-1">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xs">
                    <UIcon name="i-heroicons-lock-closed" class="w-7 h-7 text-primary" />
                </div>
                <h3 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Nouveau mot de passe</h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Créez un nouveau mot de passe sécurisé pour votre compte</p>
            </div>

            <UFormField label="Nouveau mot de passe" name="password" class="w-full">
                <UInput
                    v-model="passwordState.password"
                    placeholder="••••••••••••"
                    :type="showPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    class="w-full"
                    size="lg"
                    icon="i-heroicons-lock-closed"
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
                    v-model="passwordState.password_confirmation"
                    placeholder="••••••••••••"
                    :type="showConfirm ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    class="w-full"
                    size="lg"
                    icon="i-heroicons-lock-closed"
                >
                    <template #trailing>
                        <UButton
                            color="secondary"
                            variant="link"
                            size="sm"
                            :icon="showConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                            @click="showConfirm = !showConfirm"
                        />
                    </template>
                </UInput>
            </UFormField>

            <div class="pt-2">
                <button 
                    :disabled="loading"
                    type="submit"
                    class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <UIcon v-if="!loading" name="i-heroicons-key" class="w-5 h-5 text-secondary" />
                    <svg v-else class="animate-spin h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    <span>{{ loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe' }}</span>
                </button>
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

const step = ref('email') // 'email' | 'code' | 'password' | 'success'
const loading = ref(false)
const submittedEmail = ref('')
const verifiedCode = ref('')
const codeError = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

// Cooldown timer
const cooldown = ref(0)
let timer = null
const startCooldown = () => {
    cooldown.value = 60
    clearInterval(timer)
    timer = setInterval(() => {
        cooldown.value--
        if (cooldown.value <= 0) clearInterval(timer)
    }, 1000)
}
onUnmounted(() => clearInterval(timer))

const showLogin = () => {
    emit('getComponent','login')
}

// === STEP 1: Email ===
const emailSchema = z.object({
    email: z.string({ required_error: "Email est obligatoire" }).email('Email non valide'),
})
const emailState = ref({ email: undefined })

const submitEmail = async () => {
    if (!emailState.value.email) return
    loading.value = true
    try {
        await authStore.forgotPassword(emailState.value)
        submittedEmail.value = emailState.value.email
        step.value = 'code'
        startCooldown()
        nextTick(() => {
            if (codeInputRefs.value[0]) codeInputRefs.value[0].focus()
        })
    } catch(err) {
        const message = err?.data?.message || err?.response?.data?.message || "Une erreur s'est produite."
        toast.add({ title: message, color: 'red', timeout: 5000 })
    } finally {
        loading.value = false
    }
}

// === STEP 2: Code ===
const codeDigits = ref(['', '', '', '', '', ''])
const codeInputRefs = ref([])
const fullCode = computed(() => codeDigits.value.join(''))

const onDigitInput = (idx, event) => {
    const val = event.target.value.replace(/\D/g, '')
    codeDigits.value[idx] = val.charAt(0) || ''
    event.target.value = codeDigits.value[idx]
    if (val && idx < 5) {
        nextTick(() => codeInputRefs.value[idx + 1]?.focus())
    }
    if (fullCode.value.length === 6) submitCode()
}
const onBackspace = (idx, event) => {
    if (!codeDigits.value[idx] && idx > 0) {
        codeDigits.value[idx - 1] = ''
        nextTick(() => codeInputRefs.value[idx - 1]?.focus())
    }
}
const onPaste = (event) => {
    event.preventDefault()
    const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    for (let i = 0; i < 6; i++) codeDigits.value[i] = pasted.charAt(i) || ''
    if (pasted.length === 6) submitCode()
}

const submitCode = async () => {
    if (fullCode.value.length !== 6 || loading.value) return
    loading.value = true
    codeError.value = ''
    try {
        await authStore.verifyResetCode(submittedEmail.value, fullCode.value)
        verifiedCode.value = fullCode.value
        step.value = 'password'
    } catch (err) {
        codeError.value = err?.data?.message || err?.response?.data?.message || 'Code invalide ou expiré'
        codeDigits.value = ['', '', '', '', '', '']
        nextTick(() => codeInputRefs.value[0]?.focus())
    } finally {
        loading.value = false
    }
}

const resendCode = async () => {
    loading.value = true
    try {
        await authStore.forgotPassword({ email: submittedEmail.value })
        toast.add({ title: 'Nouveau code envoyé !', color: 'green', timeout: 3000 })
        startCooldown()
        codeDigits.value = ['', '', '', '', '', '']
    } catch (err) {
        toast.add({ title: "Erreur lors de l'envoi", color: 'red', timeout: 5000 })
    } finally {
        loading.value = false
    }
}

// === STEP 3: New Password ===
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9]).{8,}$/
const passwordSchema = z.object({
    password: z.string({ required_error: 'Mot de passe est obligatoire' })
        .min(8, 'Doit contenir au moins 8 caractères')
        .regex(passwordRegex, 'Doit contenir une majuscule, un chiffre et un caractère spécial'),
    password_confirmation: z.string({ required_error: 'La confirmation est obligatoire' }),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ['password_confirmation'],
})

const passwordState = ref({
    password: undefined,
    password_confirmation: undefined,
})

const submitPassword = async () => {
    loading.value = true
    try {
        await authStore.resetPassword(
            submittedEmail.value, 
            verifiedCode.value, 
            passwordState.value.password, 
            passwordState.value.password_confirmation
        )
        step.value = 'success'
    } catch (err) {
        const message = err?.data?.message || err?.response?.data?.message || "Erreur lors de la réinitialisation"
        toast.add({ title: message, color: 'red', timeout: 5000 })
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
</style>