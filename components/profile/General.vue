<template>
    <div>
        <div class="grid min-[640px]:grid-cols-2 grid-cols-1 gap-x-5 gap-y-10">
            <UFormField label="Nom">
                <UInput disabled class="w-60" :model-value="user.name"/>
            </UFormField>
            <UFormField label="Nom d'utilisateur">
                <UInput disabled class="w-60" :model-value="user.username"/>
            </UFormField>
            <UFormField label="Email">
                <UInput disabled class="w-60" :model-value="user.email"/>
            </UFormField>
            <UFormField label="Numéro de téléphone">
                <UInput disabled class="w-60" :model-value="user.phone"/>
            </UFormField>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['user','token']);
const user = props.user;
const token = props.token;
</script>

<style lang="scss" scoped>

</style>