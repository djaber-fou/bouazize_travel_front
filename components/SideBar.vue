<template>
    <aside 
        class="h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 select-none shadow-xs"
        :class="isCollapsed ? 'w-20' : 'w-64'"
    >
        <!-- Sidebar Top Header / Brand Banner (Clean single container, no internal squeezed button) -->
        <div class="h-16 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center shrink-0" :class="isCollapsed ? 'justify-center' : 'justify-start'">
            <nuxt-link to="/x8dj29msk" class="flex items-center gap-3 overflow-hidden">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
                    <img src="/images/logo/bouazize-logo.png" class="w-7 h-7 object-contain" alt="Bouazize Logo"/>
                </div>
                <div v-if="!isCollapsed" class="flex flex-col min-w-0 transition-opacity duration-200">
                    <span class="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug truncate">
                        Bouazize <span class="text-primary">Travel</span>
                    </span>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Espace Admin
                    </span>
                </div>
            </nuxt-link>
        </div>

        <!-- Navigation Scroll Area -->
        <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6 sidebar-scroll">
            <div v-for="(group, gIdx) in navigationGroups" :key="gIdx" class="space-y-1">
                <!-- Group Label -->
                <div v-if="!isCollapsed && group.title" class="px-3 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {{ group.title }}
                </div>
                <div v-else-if="isCollapsed && group.title" class="my-2 border-t border-slate-100 dark:border-slate-800"></div>

                <!-- Group Items -->
                <div class="space-y-1">
                    <div v-for="item in group.items" :key="item.label">
                        <!-- Single Route Item -->
                        <template v-if="!item.children">
                            <nuxt-link 
                                :to="item.to" 
                                class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
                                :class="[
                                    isRouteActive(item.to) 
                                        ? 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold shadow-xs' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
                                    isCollapsed ? 'justify-center px-0' : ''
                                ]"
                                :title="isCollapsed ? item.label : undefined"
                            >
                                <!-- Active Bar Highlight -->
                                <div 
                                    v-if="isRouteActive(item.to)" 
                                    class="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full shadow-xs"
                                ></div>

                                <UIcon 
                                    :name="item.icon" 
                                    class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" 
                                    :class="isRouteActive(item.to) ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'"
                                />
                                
                                <span v-if="!isCollapsed" class="truncate">
                                    {{ item.label }}
                                </span>
                            </nuxt-link>
                        </template>

                        <!-- Accordion Submenu Item (Visa, Omra, Voyage Organisé) -->
                        <template v-else>
                            <div>
                                <button 
                                    @click="toggleSubmenu(item.label)" 
                                    class="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                                    :class="[
                                        isChildActive(item.children) ? 'text-primary font-semibold bg-slate-50 dark:bg-slate-800/40' : '',
                                        isCollapsed ? 'justify-center px-0' : 'justify-between'
                                    ]"
                                    :title="isCollapsed ? item.label : undefined"
                                >
                                    <div class="flex items-center gap-3 min-w-0">
                                        <UIcon 
                                            :name="item.icon" 
                                            class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" 
                                            :class="isChildActive(item.children) ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'"
                                        />
                                        <span v-if="!isCollapsed" class="truncate">
                                            {{ item.label }}
                                        </span>
                                    </div>

                                    <UIcon 
                                        v-if="!isCollapsed"
                                        name="i-heroicons-chevron-down-20-solid" 
                                        class="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0"
                                        :class="expandedMenus[item.label] ? 'rotate-180 text-primary' : ''"
                                    />
                                </button>

                                <!-- Nested Links -->
                                <div 
                                    v-show="!isCollapsed && (expandedMenus[item.label] || isChildActive(item.children))" 
                                    class="mt-1 ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 transition-all duration-200"
                                >
                                    <nuxt-link 
                                        v-for="subItem in item.children" 
                                        :key="subItem.to" 
                                        :to="subItem.to" 
                                        class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                                        :class="[
                                            isRouteActive(subItem.to)
                                                ? 'bg-primary text-white font-bold shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                                        ]"
                                    >
                                        <UIcon :name="subItem.icon" class="w-4 h-4 shrink-0" />
                                        <span class="truncate">{{ subItem.label }}</span>
                                    </nuxt-link>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Bottom Footer: Admin Profile Summary -->
        <div class="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
            <div class="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xs" :class="isCollapsed ? 'justify-center p-1.5' : ''">
                <div class="relative shrink-0">
                    <img 
                        v-if="user?.image" 
                        :src="user.image" 
                        class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        alt="Admin Avatar"
                    />
                    <div v-else class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {{ userInitial }}
                    </div>
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                </div>

                <div v-if="!isCollapsed" class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{{ user?.name || 'Administrateur' }}</p>
                    <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate">{{ user?.email || 'admin@bouazize.com' }}</p>
                </div>

                <button 
                    v-if="!isCollapsed"
                    @click="logout" 
                    class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Déconnexion"
                >
                    <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '#imports'

const props = defineProps({
    isCollapsed: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:isCollapsed', 'toggle'])

const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.User)
const userInitial = computed(() => user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A')

const expandedMenus = ref({
    'Visa': false,
    'Omra': false,
    'Voyage Organisé': false
})

const navigationGroups = [
    {
        title: 'Vue d\'ensemble',
        items: [
            {
                label: 'État Global',
                icon: 'i-heroicons-chart-bar-square',
                to: '/gfljgan5465ds'
            }
        ]
    },
    {
        title: 'Gestion & Données',
        items: [
            {
                label: 'Bannière',
                icon: 'i-heroicons-megaphone',
                to: '/b2n3m4k5l'
            },
            {
                label: 'Utilisateurs',
                icon: 'i-heroicons-users',
                to: '/x8dj29msk'
            },
            {
                label: 'Fournisseurs',
                icon: 'i-heroicons-briefcase',
                to: '/p9q8w7e6r'
            },
            {
                label: 'Pays',
                icon: 'i-heroicons-globe-europe-africa',
                to: '/c1m2n3b4v'
            },
            {
                label: 'Paiements CCP',
                icon: 'i-heroicons-banknotes',
                to: '/c2c3p4p5'
            }
        ]
    },
    {
        title: 'Prestations & Commandes',
        items: [
            {
                label: 'Visa',
                icon: 'i-heroicons-ticket',
                children: [
                    { label: 'Offres', icon: 'i-heroicons-tag', to: '/v0o9i8u7y' },
                    { label: 'Commandes', icon: 'i-heroicons-shopping-bag', to: '/v1p2l3m4k' }
                ]
            },
            {
                label: 'Omra',
                icon: 'i-heroicons-building-library',
                children: [
                    { label: 'Offres', icon: 'i-heroicons-tag', to: '/o0m9r8a7o' },
                    { label: 'Commandes', icon: 'i-heroicons-shopping-bag', to: '/o1m2r3a4o' }
                ]
            },
            {
                label: 'Voyage Organisé',
                icon: 'i-heroicons-paper-airplane',
                children: [
                    { label: 'Offres', icon: 'i-heroicons-tag', to: '/v0o9y8a7o' },
                    { label: 'Commandes', icon: 'i-heroicons-shopping-bag', to: '/v1o2y3a4o' }
                ]
            }
        ]
    }
]

const isRouteActive = (toPath) => {
    return route.path === toPath
}

const isChildActive = (children) => {
    if (!children) return false
    return children.some(child => route.path === child.to)
}

const toggleSubmenu = (label) => {
    expandedMenus.value[label] = !expandedMenus.value[label]
}

const logout = async () => {
    await authStore.logout()
}

// Auto open accordion for currently active section on mount
onMounted(() => {
    navigationGroups.forEach(group => {
        group.items.forEach(item => {
            if (item.children && isChildActive(item.children)) {
                expandedMenus.value[item.label] = true
            }
        })
    })
})
</script>

<style scoped>
/* Custom Scrollbar for Sidebar */
.sidebar-scroll::-webkit-scrollbar {
    width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(203, 213, 225, 0.6);
    border-radius: 4px;
}
.sidebar-scroll:hover::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.8);
}
</style>