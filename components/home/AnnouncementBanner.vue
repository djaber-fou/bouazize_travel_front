<template>
  <div v-if="banner?.is_active" class="relative overflow-hidden bg-secondary text-white shadow-md border-b-4 border-primary">
    <!-- Background Image -->
    <div v-if="banner.image_url" class="absolute inset-0 z-0">
      <img :src="banner.image_url" class="w-full h-full object-cover opacity-30" alt="Announcement Background" />
      <div class="absolute inset-0 bg-secondary/80"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-6 py-8 md:py-10 text-center flex flex-col items-center justify-center gap-6">
      <div class="max-w-3xl">
        <h2 v-if="banner.title" class="text-2xl md:text-3xl font-extrabold mb-3 tracking-wide text-white uppercase">
          {{ banner.title }}
        </h2>
        <p v-if="banner.information" class="text-md md:text-lg text-gray-300 font-light">
          {{ banner.information }}
        </p>
      </div>

      <div v-if="banner.button_text && banner.button_link">
        <UButton
          :to="banner.button_link"
          size="lg"
          class="bg-primary hover:bg-primary-hover text-secondary font-bold uppercase tracking-wider px-8 py-3 rounded-none transition-colors duration-300"
        >
          {{ banner.button_text }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const banner = ref(null)

const fetchBanner = async () => {
  try {
    const res = await sendApi('/banner/active', null, 'GET')
    if (res?.data && res.data.is_active) {
      if (res.data.image_url) {
        const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api'
        const rootUrl = baseUrl.replace('/api', '')
        const path = res.data.image_url.startsWith('/') ? res.data.image_url : '/' + res.data.image_url
        const finalPath = path.startsWith('/storage') ? path : '/storage' + path
        res.data.image_url = rootUrl + finalPath
      }
      banner.value = res.data
    }
  } catch (error) {
    console.error('Failed to load banner', error)
  }
}

onMounted(() => {
  fetchBanner()
})
</script>
