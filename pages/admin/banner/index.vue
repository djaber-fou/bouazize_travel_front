<template>
  <div class="px-6 py-8 h-full bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-secondary dark:text-slate-100">Gestion des Bannières</h1>
        <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">Gérez vos bannières d'annonces et définissez celle qui est active sur l'accueil.</p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" @click="openCreateModal" class="font-semibold px-4 py-2">
        Nouvelle Bannière
      </UButton>
    </div>

    <!-- Banners Table -->
    <div class="bg-white dark:bg-slate-900 rounded-none shadow-xs border border-gray-100 dark:border-slate-800 overflow-hidden">
      <UTable :data="banners" :columns="columns" :loading="loadingList" class="w-full">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-10">
            <p class="text-gray-500 text-sm">Données non trouvées</p>
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col items-center justify-center py-10">
            <p class="text-gray-500 text-sm">Données non trouvées</p>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Add/Edit Slideover -->
    <USlideover fullscreen v-model:open="isModalOpen" 
    :title="editingId ? 'Modifier la bannière' : 'Ajouter une bannière'" 
    close-icon="i-lucide-arrow-right" :close="{
    color: 'secondary',
    class:'cursor-pointer',
    }">
      <template #body>
        <div class="flex flex-col gap-10">
          <UFormField :ui="{label:'text-secondary'}" label="Disponibilité" name="is_active">
              <USwitch v-model="form.is_active" />
          </UFormField>
          <UFormField :ui="{label:'text-secondary'}" label="Titre de l'annonce" name="title">
              <UInput placeholder="Ex: Offre Spéciale Été" v-model="form.title" class="lg:w-100 md:w-80 w-60"/>
          </UFormField>
          <UFormField :ui="{label:'text-secondary'}" label="Description / Information" name="information">
              <UTextarea placeholder="Détails de l'annonce..." v-model="form.information" class="lg:w-100 md:w-80 w-60"/>
          </UFormField>
          <UFormField :ui="{label:'text-secondary'}" label="Texte du Bouton" name="button_text">
              <UInput placeholder="Ex: Voir plus" v-model="form.button_text" class="lg:w-100 md:w-80 w-60"/>
          </UFormField>
          <UFormField :ui="{label:'text-secondary'}" label="Lien du Bouton" name="button_link">
              <UInput placeholder="Ex: /services/visa" v-model="form.button_link" class="lg:w-100 md:w-80 w-60"/>
          </UFormField>
          <UFormField :ui="{label:'text-secondary'}" label="Alignement" name="alignment">
              <USelect :items="[{label:'Gauche', value:'left'}, {label:'Centre', value:'center'}, {label:'Droite', value:'right'}]" v-model="form.alignment" class="lg:w-100 md:w-80 w-60"/>
          </UFormField>
          <UFormField :ui="{label:'text-secondary'}" label="Image de fond" name="image">
              <div class="flex flex-col gap-3">
                  <input type="file" @change="onFileChange" accept="image/*" class="lg:w-100 md:w-80 w-60 text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"/>
                  <div v-if="previewImage || form.image_url" class="lg:w-100 md:w-80 w-60 mt-2">
                    <img :src="previewImage || getFullImageUrl(form.image_url)" class="w-full h-40 object-cover border border-gray-200" alt="Banner Preview" />
                  </div>
              </div>
          </UFormField>
          
          <UButton @click="saveBanner" :loading="loadingForm" loading-icon="i-lucide-loader-circle" :label="editingId ? 'Mettre à jour' : 'Ajouter'" class="w-fit font-bold"/>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'

definePageMeta({
  layout: 'admin'
})

const toast = useToast()
const config = useRuntimeConfig()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

// State
const banners = ref([])
const loadingList = ref(false)
const isModalOpen = ref(false)
const loadingForm = ref(false)
const editingId = ref(null)

const columns = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const url = getFullImageUrl(row.original.image_url)
      if (url) {
        return h('div', { class: 'w-24 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200' }, [
          h('img', { src: url, class: 'w-full h-full object-cover', alt: 'Banner' })
        ])
      }
      return h('div', { class: 'w-24 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400' }, 'Sans Image')
    }
  },
  {
    accessorKey: 'title',
    header: 'Titre & Info',
    cell: ({ row }) => {
      return h('div', undefined, [
        h('p', { class: 'font-semibold text-gray-900' }, row.original.title || 'Sans titre'),
        h('p', { class: 'text-xs text-gray-500 truncate max-w-[200px]' }, row.original.information || '')
      ])
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Statut',
    cell: ({ row }) => {
      return h(UBadge, {
        color: row.original.is_active ? 'green' : 'gray',
        variant: 'soft'
      }, () => (row.original.is_active ? 'Active' : 'Inactive'))
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const buttons = []
      
      if (!row.original.is_active) {
        buttons.push(h(UTooltip, { text: 'Définir comme active' }, () => h(UButton, {
          icon: 'i-heroicons-check-circle',
          size: 'sm',
          color: 'green',
          variant: 'ghost',
          onClick: () => setActive(row.original.id)
        })))
      } else {
        buttons.push(h(UTooltip, { text: 'Désactiver' }, () => h(UButton, {
          icon: 'i-heroicons-x-circle',
          size: 'sm',
          color: 'gray',
          variant: 'ghost',
          onClick: () => setDeactive(row.original.id)
        })))
      }
      
      buttons.push(h(UTooltip, { text: 'Modifier' }, () => h(UButton, {
        icon: 'i-heroicons-pencil-square',
        size: 'sm',
        color: 'primary',
        variant: 'ghost',
        onClick: () => openEditModal(row.original)
      })))
      
      buttons.push(h(UTooltip, { text: 'Supprimer' }, () => h(UButton, {
        icon: 'i-heroicons-trash',
        size: 'sm',
        color: 'red',
        variant: 'ghost',
        onClick: () => deleteBanner(row.original.id)
      })))
      
      return h('div', { class: 'flex items-center gap-2' }, buttons)
    }
  }
]

const form = reactive({
  title: '',
  information: '',
  button_text: '',
  button_link: '',
  is_active: false,
  image_url: null,
  alignment: 'center'
})

let imageFile = null
const previewImage = ref(null)

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  // Ensure the url points to the storage directory if it doesn't already
  const path = url.startsWith('/') ? url : '/' + url;
  const finalPath = path.startsWith('/storage') ? path : '/storage' + path;
  
  return rootUrl + finalPath;
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageFile = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const resetForm = () => {
  form.title = ''
  form.information = ''
  form.button_text = ''
  form.button_link = ''
  form.is_active = false
  form.image_url = null
  form.alignment = 'center'
  imageFile = null
  previewImage.value = null
  editingId.value = null
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = (banner) => {
  resetForm()
  editingId.value = banner.id
  form.title = banner.title || ''
  form.information = banner.information || ''
  form.button_text = banner.button_text || ''
  form.button_link = banner.button_link || ''
  form.is_active = banner.is_active || false
  form.image_url = banner.image_url || null
  form.alignment = banner.alignment || 'center'
  isModalOpen.value = true
}

const fetchBanners = async () => {
  loadingList.value = true
  try {
    const res = await sendApi('/admin/settings/banner', null, 'GET')
    if (res?.data) {
      banners.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch banners', error)
  } finally {
    loadingList.value = false
  }
}

const saveBanner = async () => {
  loadingForm.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('information', form.information)
    formData.append('button_text', form.button_text)
    formData.append('button_link', form.button_link)
    formData.append('is_active', form.is_active ? '1' : '0')
    formData.append('alignment', form.alignment)
    
    if (imageFile) {
      formData.append('image', imageFile)
    }

    const endpoint = editingId.value 
      ? `/admin/settings/banner/${editingId.value}`
      : '/admin/settings/banner'
      
    await sendApi(endpoint, formData, 'POST')
    
    isModalOpen.value = false
    await fetchBanners()
  } catch (error) {
    // API composable handles errors
  } finally {
    loadingForm.value = false
  }
}

const deleteBanner = async (id) => {
  try {
    await sendApi(`/admin/settings/banner/${id}`, null, 'DELETE')
    await fetchBanners()
  } catch (error) {
    // API composable handles errors
  }
}

const setActive = async (id) => {
  try {
    await sendApi(`/admin/settings/banner/${id}/active`, null, 'PUT')
    await fetchBanners()
  } catch (error) {
    // API composable handles errors
  }
}

const setDeactive = async (id) => {
  try {
    await sendApi(`/admin/settings/banner/${id}/deactivate`, null, 'PUT')
    await fetchBanners()
  } catch (error) {
    // API composable handles errors
  }
}

onMounted(() => {
  fetchBanners()
})
</script>
