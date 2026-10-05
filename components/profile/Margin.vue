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
                            :trailing-icon="getType(service.key) === 'percentage' ? 'i-material-symbols-percent' : null"
                            :placeholder="getType(service.key) === 'percentage' ? 'Ex: 10' : 'Ex: 500'"
                            v-model="margins[service.key].value"
                            type="number"
                            min="0"
                            step="any"
                            class="w-full"
                            size="lg"
                        >
                            <template v-if="getType(service.key) === 'price'" #trailing>
                                <div class="text-xs text-muted tabular-nums font-semibold px-1">DZD</div>
                            </template>
                        </UInput>
                    </UFormField>
                    <UFormField label="Type" class="w-44">
                        <USelect 
                            v-model="margins[service.key].type" 
                            :items="types" 
                            value-key="value"
                            class="w-full"
                            size="lg"
                            @update:model-value="onTypeChange(service.key)"
                        />
                    </UFormField>

                    <!-- Live preview -->
                    <div v-if="margins[service.key].value !== null && margins[service.key].value !== ''" class="text-xs text-slate-500 dark:text-slate-400 self-end pb-2 font-medium">
                        <span v-if="getType(service.key) === 'percentage'">
                            → +{{ margins[service.key].value }}% sur le prix NET
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
                        Marges sauvegardées avec succès !
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
    { key: 'voyage', label: 'Voyages Organisés',  icon: 'i-heroicons-globe-americas' },
    { key: 'omra',   label: 'Omra',               icon: 'i-heroicons-moon' },
    { key: 'visa',   label: 'Visa',               icon: 'i-heroicons-identification' },
    { key: 'hotel',  label: 'Hôtels',             icon: 'i-heroicons-building-office-2' },
]

const types = [
    { label: "Pourcentage (%)", value: "percentage" },
    { label: "Prix fixe (DZD)", value: "price" },
]

const margins = ref({
    voyage: { value: null, type: 'percentage' },
    omra:   { value: null, type: 'percentage' },
    visa:   { value: null, type: 'percentage' },
    hotel:  { value: null, type: 'percentage' },
})

const getType = (key) => {
    const raw = margins.value[key]?.type
    if (typeof raw === 'object' && raw?.value) return raw.value
    return raw === 'price' ? 'price' : 'percentage'
}

const onTypeChange = (key) => {
    // Ensure string value
    const cur = getType(key)
    margins.value[key].type = cur
}

onMounted(() => {
    loadMargins()
})

const loadMargins = async () => {
    loadingMargins.value = true
    try {
        const response = await sendApi(profileGetUrl.value, null, 'GET')
        const data = response?.data || response
        const m = data?.margins || data

        for (const key of ['voyage', 'omra', 'visa', 'hotel']) {
            const item = m?.[key] || data?.margins?.[key]
            const rawType = item?.type || data?.[`markup_type_${key}`] || 'percentage'
            const cleanType = typeof rawType === 'object' && rawType?.value ? rawType.value : rawType
            margins.value[key].type = cleanType === 'price' ? 'price' : 'percentage'

            const rawVal = item?.margin ?? data?.[`markup_${key}`]
            if (rawVal !== null && rawVal !== undefined && rawVal !== '') {
                const num = parseFloat(rawVal)
                if (cleanType === 'percentage') {
                    // If stored as decimal (0.10 = 10%), display as 10. If already > 1 (e.g. 10), display as 10.
                    const displayPct = num <= 1.0 && num > 0 ? (num * 100) : num
                    margins.value[key].value = displayPct ? Number(displayPct.toFixed(2)).toString() : null
                } else {
                    margins.value[key].value = num ? Number(num.toFixed(2)).toString() : null
                }
            } else {
                margins.value[key].value = null
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
        for (const key of ['voyage', 'omra', 'visa', 'hotel']) {
            const m = margins.value[key]
            const typeVal = getType(key)
            payload[`markup_type_${key}`] = typeVal

            if (m.value !== null && m.value !== '' && !isNaN(m.value)) {
                const val = parseFloat(m.value)
                if (typeVal === 'percentage') {
                    // Convert display percentage (e.g. 10) to decimal (0.10) for database
                    payload[`markup_${key}`] = val / 100
                } else {
                    // Fixed DZD price
                    payload[`markup_${key}`] = val
                }
            } else {
                payload[`markup_${key}`] = null
            }
        }
        
        await sendApi(markupPutUrl.value, payload, 'PUT')
        saved.value = true

        await authStore.refreshUser()

        // Reload to ensure full two-way sync
        await loadMargins()

        setTimeout(() => { saved.value = false }, 4000)
    } catch (err) {
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