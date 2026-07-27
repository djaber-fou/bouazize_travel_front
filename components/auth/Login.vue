<template>        
        <div class="w-full flex flex-col items-center text-start">
            <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
                <UFormField label="Email" name="email">
                    <UInput placeholder="exemple@gmail.com" v-model="state.email" class="lg:w-100 md:w-80 w-60"/>
                </UFormField>

                <UFormField label="Mot de passe" name="password">
                    <UInput placeholder="••••••••••••" v-model="state.password" type="password" class="lg:w-100 md:w-80 w-60"/>
                </UFormField>
                
                <div class="flex gap-3 items-center">
                    <UButton
                    :loading="loading" 
                    label="Connexion" 
                    type="submit"
                    color="primary"
                    class="font-bold cursor-pointer w-fit"
                    />
                    <div @click="showComponent('register')" class="cursor-pointer text-sm font-thin text-primary">
                        <p>
                            Créer un compte
                        </p>
                    </div>
                   
                </div>
                <div @click="showComponent('forgetPassword')" class="text-sm cursor-pointer font-thin text-primary">
                    <p>
                        Vous avez oublié votre mot de passe ?
                    </p>
                </div>
            </UForm>
        </div>
</template>

<script setup>
// import { FormError, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { useAuthStore } from '#imports';

const authStore = useAuthStore()
const emit = defineEmits(['getComponent'])
const showComponent = (component)=>{
    emit('getComponent',component);
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
    try{
        const response = await authStore.login(state.value)
        loading.value = false
    }catch(err){
        loading.value = false
    }
    state.value = {
        email: undefined,
        password: undefined
    }
    console.log(loading.value)

    
    
}

</script>

<style lang="scss" scoped>

</style>