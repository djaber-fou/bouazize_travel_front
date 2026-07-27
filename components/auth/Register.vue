<template>        
    <div class="w-full flex flex-col items-center text-start">
        <UForm :schema="schema" :state="state" @submit="submitRegister" class="flex flex-col gap-4">
            <UFormField label="Nom complet" name="name">
                <UInput placeholder="Nom complet" v-model="state.name" class="lg:w-100 md:w-80 w-60"/>
            </UFormField>

            <UFormField label="Nom d'utilisateur" name="username">
                <UInput placeholder="Nom d'utilisateur" v-model="state.username" class="lg:w-100 md:w-80 w-60"/>
            </UFormField>

            <UFormField label="Numéro de téléphone" name="phone">
                <UInput placeholder="05XXXXXXXX" v-model="state.phone" class="lg:w-100 md:w-80 w-60"/>
            </UFormField>

            <UFormField label="Email" name="email">
                <UInput placeholder="exemple@gmail.com" v-model="state.email" class="lg:w-100 md:w-80 w-60"/>
            </UFormField>

            <UFormField label="Mot de passe" name="password">
                <UInput
                    v-model="state.password"
                    placeholder="••••••••••••"
                    :type="showPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    class="lg:w-100 md:w-80 w-60"
                >
                    <template #trailing>
                    <UButton
                        color="secondary"
                        variant="link"
                        size="sm"
                        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showPassword"
                        aria-controls="password"
                        @click="showPassword = !showPassword"
                    />
                    </template>
                </UInput>

            </UFormField>

            <UFormField label="Confirmé le mot de passe" name="password_confirmation">
                <UInput
                    v-model="state.password_confirmation"
                    placeholder="••••••••••••"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    class="lg:w-100 md:w-80 w-60"
                    name="password_confirmation"
                >
                    <template #trailing>
                    <UButton
                        color="secondary"
                        variant="link"
                        size="sm"
                        :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showConfirmPassword"
                        aria-controls="password"
                        @click="showConfirmPassword = !showConfirmPassword"
                    />
                    </template>
                </UInput>
            </UFormField>

            <UFormField label="Type" name="state">
                <USelect placeholder="Sélectionner un type" v-model="state.role" :items="types" class="lg:w-100 md:w-80 w-60" />
            </UFormField>

            <UFormField v-if="state.role === 'business'" label="Document" name="state">
                <div class="flex items-center justify-center lg:w-100 md:w-80 w-60">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-none cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-primary dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Télécharger votre fichier</span></p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">(NIF , NIS , Agrément , Registre de Commerce)</p>
                        </div>
                        <UInput id="dropzone-file" type="file" class="hidden" @change="handleFile"/>
                    </label>
                </div> 
            </UFormField>
            
            <div class="flex gap-3 items-center">
                <UButton 
                :loading="loading"
                label="Inscrivez vous" 
                type="submit"
                color="primary"
                class="font-bold cursor-pointer w-fit"
                />
                <p @click="showLogin" class="cursor-pointer text-sm font-thin text-primary">
                    Vous avez un compte ?
                </p>
            </div>
        </UForm>
    </div>
</template>

<script setup>
// import { FormError, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
// import { getProducts } from '~/services/products'
import { useAuthStore } from '#imports';

const authStore = useAuthStore()
const loading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleFile = (event)=>{
    state.file = event.target.files[0]
}

const types = ref([
    {label:"Individuel", value:"individual"},
    {label:"Entreprise", value:"business"}
])
const emit = defineEmits(['getComponent'])
const showLogin = ()=>{
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
}).refine((data)=>data.password === data.password_confirmation,{
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
    file:undefined,
})

const validate = ()=>{
    const errors = []
    if (!state.email) errors.push({ name: 'email', message: 'Le champ email est obligatoire' })
    if (!state.password) errors.push({ name: 'password', message: 'Le champ mot de passe est obligatoire' })
    return errors
}

const toast = useToast()
const submitRegister = async () => {
    loading.value = true
    const formdata = new FormData();
    formdata.append('name',state.name)
    formdata.append('username',state.username)
    formdata.append('phone',state.phone)
    formdata.append('email',state.email)
    formdata.append('password',state.password)
    formdata.append('password_confirmation',state.password_confirmation)
    formdata.append('role',state.role)
    if(state.role === "business"){
        formdata.append('file',state.file)
    }
    // console.log(formdata.get('file'))
    try{
        const response = await authStore.register(formdata)
        loading.value = false
    }catch(err){
        loading.value = false
    }
}

</script>

<style lang="scss" scoped>

</style>