<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-end gap-2">
            <UFormField label="Marges">
                <UInput
                    :trailing-icon="type.value === 'percentage'?'i-material-symbols-percent':null"
                    :placeholder="type.value === 'percentage'?'0':'0.00'"
                    v-model="margin.value"
                    :ui="{ trailing: 'pe-1' }"
                    
                >
                <template v-if="type.value === 'price'" #trailing>
                    <div
                        id="character-count"
                        class="text-xs text-muted tabular-nums"
                        aria-live="polite"
                        role="status"
                    >
                        DZD
                    </div>
                </template>
                </UInput>
            </UFormField>
            <USelect @change="()=>{
                margin.type = type.value
                margin.value = null
                }" v-model="type.value" :items="types" class="w-35 h-fit " />
        </div>
        <div class="w-fit flex items-end">
            <UButton class="w-fit h-fit font-bold" @click="updateMargin" label="Enrgistrer"/>
        </div>
    </div>
</template>

<script setup>

const types = ref([
    {
        label:"Pourcentage",
        value:"percentage"
    },
    {
        label:"Prix",
        value:"price"
    },
])

const type = ref({
    label:null,
    value:null
})

const margin = ref({
    value:null,
    type:null
})

onMounted(()=>{
    getMargin()
})
const getMargin = async()=>{
    sendApi('/profile',null,'GET').then(response=>{
        console.log(response)
        margin.value.type = response.data.margin.type
        margin.value.value =response.data.margin.type === 'percentage'? response.data.margin.margin*100 :response.data.margin.margin
        type.value.value = response.data.margin.type
        type.value.label = response.data.margin.type === 'percentage' ? 'Pourcentage':'Prix'
    })
}
const updateMargin = async()=>{
    const data = ref({markup:null, markup_type:null})
    data.value.markup = margin.value.type === 'percentage'? margin.value.value / 100 : margin.value.value ===  null ? Number.parseFloat(0).toFixed(2) : Number.parseFloat(margin.value.value).toFixed(2)
    data.value.markup_type = margin.value.type 
    console.log(data.value)
    sendApi('/client/profile/set-markup',data.value,'PUT').then(()=>{
        getMargin()
    })
}

</script>

<style scoped>

</style>