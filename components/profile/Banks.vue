<template>
    <div class="flex flex-col gap-5">
        <div class="flex flex-col min-[640px]:items-start items-center gap-5">
            <div class="grid min-[640px]:grid-cols-2 grid-cols-1 gap-5">
                <UFormField label="Nom">
                    <UInput
                        v-model="bank.name"
                        placeholder="Nom"
                        class="w-60"
                    />
                </UFormField>
        
                <UFormField label="Adresse">
                    <UInput
                        v-model="bank.address"
                        placeholder="Adresse"
                        class="w-60"
                    />
                </UFormField>
        
                <UFormField label="Type">
                    <UInput
                        v-model="bank.type"
                        placeholder="Type"
                        class="w-60"
                    />
                </UFormField>
        
                <UFormField label="Numéro du compte">
                    <UInput
                        v-model="bank.account_number"
                        placeholder="Numéro du compte"
                        class="w-60"
                    />
                </UFormField>
        
                <UFormField label="Clé">
                    <UInput
                        v-model="bank.key"
                        placeholder="Clé"
                        class="w-60"
                    />
                </UFormField>
        
                <UFormField label="RIB">
                    <UInput
                        v-model="bank.rib"
                        placeholder="RIB"
                        class="w-60"
                    />
                </UFormField>
            </div>
            <div class="flex gap-2">
                <UButton class="font-bold" @click="()=>{
                    if(action === 'Sauvegarder'){
                        save()
                    }else{
                        update(bank?.id)
                    }
                }" :label="action"/>
                <UButton class="font-bold" variant="outline" label="Réinitialiser" @click="resetBank"/>
            </div>
        </div>
        <div>
            <UTable :data="data" :columns="columns" class="flex-1" />
            <USlideover>
                <template #content>
                    <Placeholder class="h-full m-4" />
                </template>
            </USlideover>
        </div>
    </div>
</template>

<script setup>
import { UBadge, UIcon } from '#components'

const action = ref('Sauvegarder')
const bank = ref({
    id:null,
    name:null,
    address:null,
    type:null,
    account_number:null,
    key:null,
    rib:null
})
const data = ref([])

const columns = [
    {
        accessorKey:'name',
        header:'Nom'
    },
    {
        accessorKey:'type',
        header:'Type'
    },
    {
        accessorKey:'account_number',
        header:'Numéro du compte'
    },
    {
        accessorKey:'active',
        header:'Statut',
        cell:({row})=>{
            return h(
                'div',
                undefined,
                h(
                    UBadge,
                    {
                        label:row.original.active?'Activé':'Désactivé',
                        variant:'subtle',
                        color:row.original.active ?'success':'error',
                        class:'font-bold cursor-pointer',
                        onClick:()=>{
                            enableBank(row.original.id)
                        }
                    }
                )
            )
        }
    },
    {
    id: 'actions',
    cell: ({ row }) => {
        return h(
            'div',
            { class: 'flex gap-3 items-center' },
            h(
                UIcon,
                {
                    name:"i-lucide-eye",
                    size:"17",
                    class:"cursor-pointer",
                    onClick:()=>{getBank(row.original.id)}
                },
            ),
        )}
    }, 
]

onMounted(()=>{
    getBanks()
})

const resetBank = ()=>{
    action.value = 'Sauvegarder'
    bank.value.id = null
    bank.value.name = null,
    bank.value.address = null,
    bank.value.type = null,
    bank.value.account_number = null,
    bank.value.key = null,
    bank.value.rib = null

}

const getBanks = async()=>{
    sendApi('/banks',null,'GET').then(response=>{
        data.value = response.data
    })
}

const getBank = async (id)=>{
    action.value = 'Modifier'
    sendApi(`/banks/${id}`,null,'GET').then(response=>{
        bank.value = response.data
    })
}
const save = async()=>{
    sendApi('/banks/create',bank.value,'POST').then(()=>{
        getBanks()
        resetBank()
    })
}
const update = async(id)=>{
    sendApi(`/banks/${id}/update`,bank.value,'PUT').then(()=>{
        getBanks()
        resetBank()
    })
}

const enableBank = async (id)=>{
    sendApi(`/banks/${id}/activate`,null,'PUT').then(()=>{
        getBanks()
    })
}

</script>

<style scoped>

</style>