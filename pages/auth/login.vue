<template>
    <div class="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-10 px-4 bg-slate-50/60 dark:bg-slate-950/60 transition-colors">
        <!-- Brand Logo Header -->
        <nuxt-link to="/" class="mb-6 flex flex-col items-center group transition-transform hover:scale-105">
            <img src="/images/logo/bouazize-logo.png" class="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md" alt="Bouazize Travel"/>
            <span class="mt-2 text-xl font-bold text-secondary dark:text-white tracking-tight">
                Bouazize <span class="text-primary">Travel</span>
            </span>
        </nuxt-link>

        <!-- Auth Card Shell -->
        <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl p-6 sm:p-8 transition-all duration-300">
            <Transition name="login" mode="out-in">
                <Login 
                    v-if="defaultComponent === 'login'" 
                    @getComponent="showComponent"
                    @requireVerification="handleVerification"
                />
            </Transition>
            <Transition name="login" mode="out-in">
                <Register 
                    v-if="defaultComponent === 'register'" 
                    @getComponent="showComponent"
                    @requireVerification="handleVerification"
                />
            </Transition>
            <Transition name="login" mode="out-in">
                <ForgotPassword 
                    v-if="defaultComponent === 'forgetPassword'" 
                    @getComponent="showComponent"
                />
            </Transition>
            <Transition name="login" mode="out-in">
                <EmailVerification 
                    v-if="defaultComponent === 'verification'" 
                    :email="verificationEmail"
                    @getComponent="showComponent"
                />
            </Transition>
        </div>
    </div>
</template>

<script setup>
import ForgotPassword from '~/components/auth/ForgotPassword.vue';
import Login from '~/components/auth/Login.vue';
import Register from '~/components/auth/Register.vue';
import EmailVerification from '~/components/auth/EmailVerification.vue';

definePageMeta({
  
})
const defaultComponent = ref('login')
const verificationEmail = ref('')

const showComponent = (value) => {
    defaultComponent.value = value
}

const handleVerification = (email) => {
    verificationEmail.value = email
    defaultComponent.value = 'verification'
}
</script>

<style scoped>
.login-enter-active,
.login-leave-active {
  transition: all 0.3s ease;
}

.login-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.login-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
