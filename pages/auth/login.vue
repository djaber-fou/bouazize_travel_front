<template>
    <div class="min-h-[calc(100vh-80px)] flex flex-col gap-8 items-center justify-center py-12 px-4">
        <div class="">
            <img src="/images/logo/logo-new.png" width="150"/>
        </div>
        <div class="">
            <Transition name="login">
                <Login v-if="defaultComponent === 'login'" @getComponent="showComponent"/>
            </Transition>
            <Transition name="login">
                <Register v-if="defaultComponent === 'register'" @getComponent="showComponent"/>
            </Transition>
            <Transition name="login">
                <ForgotPassword v-if="defaultComponent === 'forgetPassword'" @getComponent="showComponent"/>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import ForgotPassword from '~/components/auth/ForgotPassword.vue';
import Login from '~/components/auth/Login.vue';
import Register from '~/components/auth/Register.vue';

definePageMeta({
  
})
const defaultComponent = ref('login')

const showComponent = (value)=>{
    defaultComponent.value = value
}
</script>

<style scoped>
.login-enter-active {
  transition: all 0.4s ease;
}

.login-enter-from,
.login-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

</style>
