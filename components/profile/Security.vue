<template>
    <div class="flex flex-col min-[640px]:items-start items-center gap-10">
        <div>
            <UFormField label="Mot de passe récent">
                <UInput
                    v-model="data.current_password"
                    placeholder="••••••••••••"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    
                >
                    <template #trailing>
                    <UButton
                        color="secondary"
                        variant="link"
                        size="sm"
                        :icon="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showCurrentPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showCurrentPassword"
                        aria-controls="password"
                        @click="showCurrentPassword = !showCurrentPassword"
                    />
                    </template>
                </UInput>
            </UFormField>
        </div>
        <div class="flex min-[640px]:flex-row flex-col min-[640px]:justify-start justify-center gap-10">
            <UFormField label="Nouveau mot de passe">
                <UInput
                v-model="data.password"
                    placeholder="••••••••••••"
                    :type="showPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    
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
            <UFormField label="Confirmé le mot de passe">
                <UInput
                v-model="data.password_confirmation"
                    placeholder="••••••••••••"
                    :type="showConfirmationPassword ? 'text' : 'password'"
                    :ui="{ trailing: 'pe-1' }"
                    
                >
                    <template #trailing>
                    <UButton
                        color="secondary"
                        variant="link"
                        size="sm"
                        :icon="showConfirmationPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showConfirmationPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showConfirmationPassword"
                        aria-controls="password"
                        @click="showConfirmationPassword = !showConfirmationPassword"
                    />
                    </template>
                </UInput>
            </UFormField>
        </div>
        <div>
            <UButton class="font-bold" @click="save" label="Enregistrer"/>
        </div>
    </div>
</template>

<script setup>
import { changePassword } from '~/services/profile';
import * as z from 'zod'
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

const showCurrentPassword = ref(false)
const showPassword = ref(false)
const showConfirmationPassword = ref(false)

const data = ref({
    current_password:null,
    password:null,
    password_confirmation:null
})

const save = async()=>{
    console.log(data)
    const response = await changePassword(data.value)
    console.log(response)
}

</script>

<style scoped>

</style>