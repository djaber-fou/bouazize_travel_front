<template>
    <div class="w-full flex flex-col text-start">
        <div class="flex flex-col gap-5 w-full">
            <!-- Header -->
            <div class="flex flex-col items-center gap-2 text-center mb-1">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-1 border border-primary/20 shadow-xs">
                    <UIcon name="i-heroicons-envelope-open" class="w-7 h-7 text-primary" />
                </div>
                <h3 class="text-2xl font-black text-secondary dark:text-white tracking-tight">Confirmez votre e-mail</h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                    Un code à 6 chiffres a été envoyé à <strong class="text-secondary dark:text-white font-bold">{{ email }}</strong>. 
                    Entrez-le ci-dessous pour activer votre compte.
                </p>
            </div>

            <!-- Code Input -->
            <div class="flex justify-center gap-2 sm:gap-2.5 my-2">
                <input
                    v-for="(digit, idx) in codeDigits"
                    :key="idx"
                    :ref="el => { if (el) inputRefs[idx] = el }"
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

            <!-- Error Message -->
            <p v-if="errorMsg" class="text-center text-xs font-semibold text-red-500">{{ errorMsg }}</p>

            <!-- Verify Button -->
            <button 
                type="button"
                @click="verifyCode"
                :disabled="fullCode.length !== 6 || verifying"
                class="w-full h-11 sm:h-12 bg-primary hover:bg-primary-hover text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <UIcon v-if="!verifying" name="i-heroicons-check-circle" class="w-5 h-5 text-secondary" />
                <svg v-else class="animate-spin h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                <span>{{ verifying ? 'Vérification...' : 'Confirmer le code' }}</span>
            </button>

            <!-- Resend & Back -->
            <div class="flex flex-col items-center gap-2 pt-1 text-center">
                <div>
                    <button 
                        v-if="cooldown <= 0"
                        @click="resend" 
                        :disabled="resending"
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
                    @click="$emit('getComponent', 'login')" 
                    class="cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary inline-flex items-center gap-1 transition-colors pt-1"
                >
                    <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
                    <span>Retour à la connexion</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['email'])
const emit = defineEmits(['getComponent'])
const authStore = useAuthStore()
const toast = useToast()

const codeDigits = ref(['', '', '', '', '', ''])
const inputRefs = ref([])
const verifying = ref(false)
const resending = ref(false)
const errorMsg = ref('')
const cooldown = ref(60)

const fullCode = computed(() => codeDigits.value.join(''))

// Start cooldown timer
let timer = null
const startCooldown = () => {
    cooldown.value = 60
    clearInterval(timer)
    timer = setInterval(() => {
        cooldown.value--
        if (cooldown.value <= 0) clearInterval(timer)
    }, 1000)
}
onMounted(() => {
    startCooldown()
    nextTick(() => {
        if (inputRefs.value[0]) inputRefs.value[0].focus()
    })
})
onUnmounted(() => clearInterval(timer))

const onDigitInput = (idx, event) => {
    const val = event.target.value.replace(/\D/g, '')
    codeDigits.value[idx] = val.charAt(0) || ''
    event.target.value = codeDigits.value[idx]
    if (val && idx < 5) {
        nextTick(() => inputRefs.value[idx + 1]?.focus())
    }
    // Auto-submit when all 6 digits filled
    if (fullCode.value.length === 6) {
        verifyCode()
    }
}

const onBackspace = (idx, event) => {
    if (!codeDigits.value[idx] && idx > 0) {
        codeDigits.value[idx - 1] = ''
        nextTick(() => inputRefs.value[idx - 1]?.focus())
    }
}

const onPaste = (event) => {
    event.preventDefault()
    const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    for (let i = 0; i < 6; i++) {
        codeDigits.value[i] = pasted.charAt(i) || ''
    }
    const focusIdx = Math.min(pasted.length, 5)
    nextTick(() => inputRefs.value[focusIdx]?.focus())
    if (pasted.length === 6) verifyCode()
}

const verifyCode = async () => {
    if (fullCode.value.length !== 6 || verifying.value) return
    verifying.value = true
    errorMsg.value = ''
    try {
        await authStore.verifyEmail(props.email, fullCode.value)
        toast.add({ title: 'E-mail confirmé avec succès !', color: 'green', timeout: 3000 })
    } catch (err) {
        const msg = err?.data?.message || err?.response?.data?.message || 'Code invalide ou expiré'
        errorMsg.value = msg
        codeDigits.value = ['', '', '', '', '', '']
        nextTick(() => inputRefs.value[0]?.focus())
    } finally {
        verifying.value = false
    }
}

const resend = async () => {
    resending.value = true
    try {
        await authStore.resendVerification(props.email)
        toast.add({ title: 'Nouveau code envoyé !', color: 'green', timeout: 3000 })
        startCooldown()
    } catch (err) {
        const msg = err?.data?.message || err?.response?.data?.message || 'Erreur lors du renvoi'
        toast.add({ title: msg, color: 'red', timeout: 5000 })
    } finally {
        resending.value = false
    }
}
</script>

<style scoped>
</style>
