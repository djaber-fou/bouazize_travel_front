<template>
  <div class="px-6 py-8 h-full bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/c2c3p4p5" />
        <div>
          <h1 class="text-2xl font-bold text-secondary dark:text-slate-100">Comptes CCP / BaridiMob</h1>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">Gérez vos comptes de paiement. Le système alternera automatiquement entre les comptes actifs (Round-Robin).</p>
        </div>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" @click="openModal(null)" class="font-semibold px-4 py-2">
        Ajouter un compte
      </UButton>
    </div>

    <!-- Accounts Table -->
    <div class="bg-white dark:bg-slate-900 rounded-none shadow-xs border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
      </div>

      <div v-else-if="accounts.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-banknotes" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-500 font-medium">Aucun compte CCP configuré.</p>
        <UButton color="primary" variant="soft" class="mt-4" @click="openModal(null)">Ajouter le premier compte</UButton>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-sm border-b border-gray-200 dark:border-slate-700">
              <th class="py-3 px-4 font-semibold">Titulaire</th>
              <th class="py-3 px-4 font-semibold">Numéro CCP</th>
              <th class="py-3 px-4 font-semibold">Clé</th>
              <th class="py-3 px-4 font-semibold">BaridiMob</th>
              <th class="py-3 px-4 font-semibold text-center">Utilisations</th>
              <th class="py-3 px-4 font-semibold text-center">Statut</th>
              <th class="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in accounts" :key="acc.id" class="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ acc.owner_name }}</td>
              <td class="py-3 px-4 font-mono">{{ acc.ccp_account_number }}</td>
              <td class="py-3 px-4 text-gray-500">{{ acc.ccp_key || '-' }}</td>
              <td class="py-3 px-4 font-mono text-sm">{{ acc.baridi_mob_number || '-' }}</td>
              <td class="py-3 px-4 text-center font-bold text-primary">{{ acc.usage_count }}</td>
              <td class="py-3 px-4 text-center">
                <USwitch :modelValue="acc.is_active" @update:modelValue="toggleStatus(acc, $event)" />
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <UButton size="sm" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openModal(acc)" />
                  <UButton size="sm" color="red" variant="ghost" icon="i-heroicons-trash" @click="deleteAccount(acc.id)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right-side Slideover (same as Banner page) -->
    <USlideover fullscreen v-model:open="isFormOpen"
      :title="editingAccount ? 'Modifier le compte CCP' : 'Ajouter un compte CCP'"
      close-icon="i-lucide-arrow-right"
      :close="{ color: 'secondary', class: 'cursor-pointer' }"
    >
      <template #body>
        <div class="flex flex-col gap-8">
          <UFormField :ui="{ label: 'text-secondary' }" label="Activer immédiatement" name="is_active">
            <div class="flex items-center gap-3">
              <USwitch v-model="form.is_active" />
              <span class="text-sm" :class="form.is_active ? 'text-green-600 font-semibold' : 'text-gray-500'">
                {{ form.is_active ? 'Compte actif' : 'Compte inactif' }}
              </span>
            </div>
          </UFormField>

          <UFormField :ui="{ label: 'text-secondary' }" label="Nom du titulaire du compte" name="owner_name" required>
            <UInput v-model="form.owner_name" placeholder="Ex: BOUAZIZE TRAVEL SARL" class="lg:w-100 md:w-80 w-60" />
          </UFormField>

          <UFormField :ui="{ label: 'text-secondary' }" label="Numéro de compte CCP" name="ccp_account_number" required>
            <UInput v-model="form.ccp_account_number" placeholder="Ex: 1234567890" font-mono class="lg:w-100 md:w-80 w-60" />
          </UFormField>

          <UFormField :ui="{ label: 'text-secondary' }" label="Clé CCP" name="ccp_key">
            <UInput v-model="form.ccp_key" placeholder="Ex: 42" font-mono class="lg:w-100 md:w-80 w-60" />
          </UFormField>

          <UFormField :ui="{ label: 'text-secondary' }" label="Numéro RIP BaridiMob (optionnel)" name="baridi_mob_number">
            <UInput v-model="form.baridi_mob_number" placeholder="Ex: 00799999123456789012" font-mono class="lg:w-100 md:w-80 w-60" />
            <p class="text-xs text-gray-400 mt-1">Le numéro RIP commence par 007...</p>
          </UFormField>

          <UButton @click="saveAccount" :loading="isSaving" loading-icon="i-lucide-loader-circle"
            :label="editingAccount ? 'Enregistrer les modifications' : 'Ajouter le compte'"
            icon="i-heroicons-check-circle"
            class="w-fit font-bold"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin'
})

const toast = useToast()

const loading = ref(true)
const isFormOpen = ref(false)
const isSaving = ref(false)
const accounts = ref([])
const editingAccount = ref(null)

const form = reactive({
  owner_name: '',
  ccp_account_number: '',
  ccp_key: '',
  baridi_mob_number: '',
  is_active: true
})

onMounted(() => {
  fetchAccounts()
})

const fetchAccounts = async () => {
  loading.value = true
  try {
    const res = await sendApi('/admin/ccp/settings', null, 'GET')
    if (res?.data) {
      accounts.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openModal = (acc = null) => {
  editingAccount.value = acc
  if (acc) {
    form.owner_name = acc.owner_name
    form.ccp_account_number = acc.ccp_account_number
    form.ccp_key = acc.ccp_key
    form.baridi_mob_number = acc.baridi_mob_number
    form.is_active = acc.is_active
  } else {
    form.owner_name = ''
    form.ccp_account_number = ''
    form.ccp_key = ''
    form.baridi_mob_number = ''
    form.is_active = true
  }
  isFormOpen.value = true
}

const closeForm = () => {
  isFormOpen.value = false
  editingAccount.value = null
}

const saveAccount = async () => {
  if (!form.owner_name || !form.ccp_account_number) {
    toast.add({ title: 'Titulaire et Numéro CCP sont requis', color: 'red' })
    return
  }
  isSaving.value = true
  try {
    if (editingAccount.value) {
      await sendApi(`/admin/ccp/settings/${editingAccount.value.id}`, { ...form }, 'PUT')
      toast.add({ title: 'Compte mis à jour avec succès', color: 'green' })
    } else {
      await sendApi('/admin/ccp/settings', { ...form }, 'POST')
      toast.add({ title: 'Compte ajouté avec succès', color: 'green' })
    }
    isFormOpen.value = false
    await fetchAccounts()
  } catch (err) {
    toast.add({ title: err?.message || 'Erreur', color: 'red' })
  } finally {
    isSaving.value = false
  }
}

const toggleStatus = async (acc, newValue) => {
  acc.is_active = newValue
  try {
    await sendApi(`/admin/ccp/settings/${acc.id}`, {
      ...acc,
      is_active: newValue
    }, 'PUT')
    toast.add({ title: `Compte ${newValue ? 'activé' : 'désactivé'}`, color: 'green' })
  } catch (err) {
    acc.is_active = !newValue // revert on error
    toast.add({ title: 'Erreur lors de la modification', color: 'red' })
  }
}

const deleteAccount = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte CCP ?')) return
  try {
    await sendApi(`/admin/ccp/settings/${id}`, null, 'DELETE')
    toast.add({ title: 'Compte supprimé', color: 'green' })
    await fetchAccounts()
  } catch (err) {
    toast.add({ title: 'Erreur lors de la suppression', color: 'red' })
  }
}
</script>
