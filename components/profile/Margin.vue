<template>
    <div class="flex flex-col gap-8 w-full max-w-2xl">
        <!-- Loading State -->
        <div v-if="loadingMargins" class="flex items-center justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
        </div>

        <template v-else>
            <!-- Service Margin Cards -->
            <div 
                v-for="service in services" 
                :key="service.key"
                class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 transition-all hover:border-primary/30"
            >
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                        <UIcon :name="service.icon" class="w-5 h-5" />
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ service.label }}</h3>
                        <p class="text-[11px] text-slate-400">Marge appliquée sur les {{ service.label.toLowerCase() }}</p>
                    </div>
                </div>

                <div class="flex items-end gap-3 flex-wrap">
                    <UFormField label="Valeur de la marge" class="flex-1 min-w-[140px]">
                        <UInput
                            :trailing-icon="margins[service.key].type === 'percentage' ? 'i-material-symbols-percent' : null"
                            :placeholder="margins[service.key].type === 'percentage' ? 'Ex: 15' : 'Ex: 500.00'"
                            v-model="margins[service.key].value"
                            type="number"
                            min="0"
                            class="w-full"
                            size="lg"
                        >
                            <template v-if="margins[service.key].type === 'price'" #trailing>
                                <div class="text-xs text-muted tabular-nums font-semibold px-1">DZD</div>
                            </template>
                        </UInput>
                    </UFormField>
                    <UFormField label="Type" class="w-40">
                        <USelect 
                            v-model="margins[service.key].type" 
                            :items="types" 
                            class="w-full"
                            size="lg"
                            @change="margins[service.key].value = null"
                        />
                    </UFormField>

                    <!-- Live preview -->
                    <div v-if="margins[service.key].value" class="text-xs text-slate-500 dark:text-slate-400 self-end pb-2 font-medium">
                        <span v-if="margins[service.key].type === 'percentage'">
                            → +{{ margins[service.key].value }}% sur le prix
                        </span>
                        <span v-else>
                            → +{{ Number(margins[service.key].value).toLocaleString('fr-DZ') }} DZD fixe
                        </span>
                    </div>
                </div>
            </div>

            <!-- Save Button -->
            <div class="flex items-center gap-4 pt-2">
                <button 
                    @click="updateAllMargins"
                    :disabled="saving"
                    class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-secondary font-bold text-sm rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    <svg v-if="saving" class="animate-spin h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <UIcon v-else name="i-heroicons-check" class="w-4 h-4 text-secondary" />
                    <span>{{ saving ? 'Enregistrement...' : 'Enregistrer toutes les marges' }}</span>
                </button>
                <Transition name="fade">
                    <span v-if="saved" class="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4"/>
                        Marges sauvegardées !
                    </span>
                </Transition>
            </div>
        </template>
    </div>
</template>

<script setup>
const authStore = useAuthStore()
const toast = useToast()
const saving = ref(false)
const saved = ref(false)
const loadingMargins = ref(true)

// Detect role-based API prefix
const isAdmin = computed(() => authStore.User?.role === 'admin')
const profileGetUrl = computed(() => isAdmin.value ? '/admin/profile' : '/client/profile')
const markupPutUrl = computed(() => isAdmin.value ? '/admin/profile/set-markup' : '/client/profile/set-markup')

const services = [
    { key: 'hotel',  label: 'Hôtellerie',        icon: 'i-heroicons-building-office' },
    { key: 'voyage', label: 'Voyages Organisés',  icon: 'i-heroicons-globe-americas' },
    { key: 'omra',   label: 'Omra',               icon: 'i-heroicons-moon' },
    { key: 'visa',   label: 'Visa',               icon: 'i-heroicons-identification' },
]

const types = ref([
    { label: "Pourcentage (%)", value: "percentage" },
    { label: "Prix fixe (DZD)", value: "price" },
])

const margins = ref({
    hotel:  { value: null, type: 'percentage' },
    voyage: { value: null, type: 'percentage' },
    omra:   { value: null, type: 'percentage' },
    visa:   { value: null, type: 'percentage' },
})

onMounted(() => {
    loadMargins()
})

const loadMargins = async () => {
    loadingMargins.value = true
    try {
        const response = await sendApi(profileGetUrl.value, null, 'GET')
        // The profile response can have margins nested or at root
        const m = response?.data?.margins || response?.margins || response?.data || response

        for (const key of ['hotel', 'voyage', 'omra', 'visa']) {
            if (m?.[key]) {
                margins.value[key].type = m[key].type || 'percentage'
                // Server stores percentages as decimals (0.15 = 15%), display as whole number
                if (m[key].type === 'percentage' || !m[key].type) {
                    margins.value[key].value = m[key].margin ? (m[key].margin * 100).toFixed(2).replace(/\.00$/, '') : null
                } else {
                    margins.value[key].value = m[key].margin || null
                }
            }
            // Also try flat field names (markup_hotel, markup_type_hotel)
            const flatVal = m?.[`markup_${key}`]
            const flatType = m?.[`markup_type_${key}`]
            if (flatVal !== undefined || flatType !== undefined) {
                margins.value[key].type = flatType || 'percentage'
                if (margins.value[key].type === 'percentage') {
                    margins.value[key].value = flatVal ? (flatVal * 100).toFixed(2).replace(/\.00$/, '') : null
                } else {
                    margins.value[key].value = flatVal || null
                }
            }
        }
    } catch (err) {
        console.error('Failed to load margins:', err)
        toast.add({ title: 'Impossible de charger les marges', color: 'red', timeout: 4000 })
    } finally {
        loadingMargins.value = false
    }
}

const updateAllMargins = async () => {
    saving.value = true
    saved.value = false
    try {
        const payload = {}
        for (const key of ['hotel', 'voyage', 'omra', 'visa']) {
            const m = margins.value[key]
            payload[`markup_type_${key}`] = m.type
            if (m.type === 'percentage') {
                // Convert display value (15) back to decimal (0.15) for server
                payload[`markup_${key}`] = m.value ? parseFloat(m.value) / 100 : null
            } else {
                payload[`markup_${key}`] = m.value ? parseFloat(m.value) : null
            }
        }
        
        await sendApi(markupPutUrl.value, payload, 'PUT')
        saved.value = true

        // ✅ CRITICAL: Refresh authStore.User so businessMarkup computed updates immediately
        // Without this, hotel prices won't reflect the new margin until the user logs out/in
        await authStore.refreshUser()

        setTimeout(() => { saved.value = false }, 4000)
    } catch (err) {
        // api.js already shows error toast
        console.error('Margin update error:', err)
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>