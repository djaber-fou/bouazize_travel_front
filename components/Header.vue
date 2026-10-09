<template>
    <header class="z-[100] w-full sticky top-0 bg-white dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all duration-300 shadow-sm" :class="{'py-3': y > 20, 'py-4': y <= 20}">
        <div class="w-full px-6 md:px-12">
            <nav class="flex justify-between items-center">
                <nuxt-link to="/" class="flex gap-3 items-center z-[101]">
                    <img src="/images/logo/bouazize-logo.png" class="w-12 h-12 object-contain" alt="Bouazize Logo"/>
                    <div class="max-[400px]:hidden">
                        <p class="font-bold text-2xl tracking-tight transition-colors duration-300 text-secondary dark:text-white">
                            Bouazize <span class="text-primary">Travel</span>
                        </p>
                    </div>
                </nuxt-link>

                <!-- Center Menu (Desktop) -->
                <div class="hidden md:flex flex-1 justify-center items-center space-x-10">
                    <nuxt-link to="/" exact class="nav-link whitespace-nowrap">Accueil</nuxt-link>
                    
                    <!-- Services Dropdown — hover controlled via JS for precision -->
                    <div class="relative">
                        <nuxt-link 
                            to="/services" 
                            class="nav-link flex items-center gap-1 whitespace-nowrap"
                            @mouseenter="showServices = true"
                            @mouseleave="startServicesHideTimer"
                        >
                            Services
                            <Icon 
                                name="i-heroicons-chevron-down-20-solid" 
                                class="w-4 h-4 transition-transform duration-300"
                                :class="showServices ? 'rotate-180 text-primary' : ''"
                            />
                        </nuxt-link>
                        <!-- Dropdown panel -->
                        <Transition name="dropdown">
                            <div 
                                v-if="showServices"
                                class="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-56 z-50"
                                @mouseenter="cancelServicesHideTimer"
                                @mouseleave="startServicesHideTimer"
                            >
                                <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 border-t-2 border-t-primary shadow-2xl rounded-none overflow-hidden">
                                    <div class="p-2 flex flex-col gap-0.5">
                                        <nuxt-link 
                                            to="/services/hotels" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-building-office-2" class="w-4 h-4 text-primary" />
                                            <span>Hôtels</span>
                                        </nuxt-link>
                                        <nuxt-link 
                                            to="/services/visa" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-ticket" class="w-4 h-4 text-primary" />
                                            <span>Visa</span>
                                        </nuxt-link>
                                        <nuxt-link 
                                            to="/services/omra" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-building-library" class="w-4 h-4 text-primary" />
                                            <span>Omra</span>
                                        </nuxt-link>
                                        <nuxt-link 
                                            to="/services/voyage_organise" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 text-primary" />
                                            <span>Voyage Organisé</span>
                                        </nuxt-link>
                                        <div class="pt-1 mt-1 border-t border-gray-100 dark:border-slate-800">
                                            <nuxt-link 
                                                to="/services" 
                                                class="dropdown-item text-primary font-semibold"
                                                @click="showServices = false"
                                            >
                                                <Icon name="i-heroicons-squares-2x2" class="w-4 h-4" />
                                                <span>Tous les services</span>
                                            </nuxt-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <nuxt-link to="/about" class="nav-link whitespace-nowrap">À Propos</nuxt-link>
                </div>

                <!-- Right Actions (Desktop) -->
                <div class="hidden md:flex items-center gap-3">
                    <DarkModeToggle />

                    <!-- User Menu Dropdown -->
                    <div v-if="token" class="relative">
                        <button 
                            type="button"
                            class="flex items-center gap-2 font-semibold text-secondary dark:text-white hover:text-primary transition-colors py-2 cursor-pointer"
                            @mouseenter="showUserMenu = true"
                            @mouseleave="startUserMenuHideTimer"
                        >
                            <span>{{ user?.name }}</span>
                            <Icon 
                                name="i-heroicons-chevron-down-20-solid" 
                                class="w-4 h-4 transition-transform duration-300"
                                :class="showUserMenu ? 'rotate-180 text-primary' : ''"
                            />
                        </button>
                        <Transition name="user-dropdown">
                            <div 
                                v-if="showUserMenu"
                                class="absolute right-0 top-full pt-3 w-56 z-50"
                                @mouseenter="cancelUserMenuHideTimer"
                                @mouseleave="startUserMenuHideTimer"
                            >
                                <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 border-t-2 border-t-primary shadow-2xl rounded-none overflow-hidden">
                                    <div class="p-2 flex flex-col gap-0.5">
                                        <template v-for="(item, index) in menuItems" :key="index">
                                            <NuxtLink 
                                                v-if="item?.link"
                                                :to="item.link" 
                                                @click="() => { if(item?.action) item.action(); showUserMenu = false; }" 
                                                class="dropdown-item text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-secondary dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-primary transition-colors cursor-pointer"
                                                :class="item?.class"
                                            >
                                                <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                                <span>{{ item.text }}</span>
                                            </NuxtLink>
                                            <button 
                                                v-else
                                                type="button"
                                                @click="() => { if(item?.action) item.action(); showUserMenu = false; }" 
                                                class="dropdown-item text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-secondary dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-primary transition-colors cursor-pointer w-full"
                                                :class="item?.class"
                                            >
                                                <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                                <span>{{ item.text }}</span>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                    
                    <nuxt-link v-else to="/auth/login">
                        <button class="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 font-bold uppercase tracking-wider text-sm transition-colors duration-300 rounded-none cursor-pointer">
                            Connexion
                        </button>
                    </nuxt-link>
                </div>

                <!-- Mobile Toggle Button (Square, crisp) -->
                <div class="md:hidden flex items-center gap-2 z-[101]">
                    <DarkModeToggle />
                    <button 
                        type="button"
                        class="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-secondary dark:text-white hover:text-primary hover:border-primary transition-colors cursor-pointer rounded-none"
                        @click="showMenu = !showMenu" 
                        :aria-expanded="showMenu"
                        aria-label="Ouvrir le menu"
                    >
                        <Icon :name="showMenu ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-6 h-6" />
                    </button>
                </div>
            </nav>
        </div>
    </header>

    <!-- Mobile Navigation Drawer (Teleported to body to avoid sticky/backdrop-blur stacking issues) -->
    <!-- Mobile Navigation Drawer (Teleported to body to avoid sticky/backdrop-blur stacking issues) -->
    <Teleport to="body" v-if="isMounted">
        <Transition name="drawer-fade">
            <div 
                v-if="showMenu" 
                class="fixed inset-0 z-[9999] flex justify-end" 
                role="dialog" 
                aria-modal="true"
                aria-label="Menu principal"
            >
                <!-- Backdrop Overlay -->
                <div 
                    class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer z-10"
                    @click="showMenu = false"
                ></div>

                <!-- Drawer Panel -->
                <div 
                    class="relative w-full sm:max-w-md h-full bg-white dark:bg-[#0A0B25] text-secondary dark:text-white shadow-2xl flex flex-col z-20 border-l border-gray-200 dark:border-slate-800 drawer-content"
                    @click.stop
                >
                    <!-- Drawer Top Bar -->
                    <div class="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0A0B25] shrink-0">
                        <nuxt-link to="/" class="flex items-center gap-2.5" @click="showMenu = false">
                            <img src="/images/logo/bouazize-logo.png" class="w-9 h-9 object-contain" alt="Bouazize Logo"/>
                            <span class="font-bold text-lg tracking-tight text-secondary dark:text-white">
                                Bouazize <span class="text-primary">Travel</span>
                            </span>
                        </nuxt-link>

                        <div class="flex items-center gap-2">
                            <DarkModeToggle />
                            <button 
                                type="button"
                                class="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-primary hover:text-white hover:border-primary text-gray-700 dark:text-gray-200 transition-colors cursor-pointer rounded-none"
                                @click="showMenu = false"
                                aria-label="Fermer le menu"
                            >
                                <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable Drawer Body -->
                    <div class="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                        <!-- Main Nav Links -->
                        <div class="space-y-1.5">
                            <!-- Accueil -->
                            <nuxt-link 
                                to="/" 
                                exact
                                class="mobile-drawer-link"
                                @click="showMenu = false"
                            >
                                <div class="flex items-center gap-3">
                                    <Icon name="i-heroicons-home" class="w-5 h-5 text-primary" />
                                    <span>Accueil</span>
                                </div>
                                <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            </nuxt-link>

                            <!-- Services Accordion (Open by default for instant access) -->
                            <div class="border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40">
                                <button
                                    type="button"
                                    class="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold text-secondary dark:text-white hover:text-primary transition-colors cursor-pointer select-none"
                                    @click.stop="toggleMobileServices"
                                >
                                    <div class="flex items-center gap-3">
                                        <Icon name="i-heroicons-squares-2x2" class="w-5 h-5 text-primary" />
                                        <span>Nos Services</span>
                                    </div>
                                    <Icon 
                                        name="i-heroicons-chevron-down" 
                                        class="w-4 h-4 text-gray-400 transition-transform duration-200"
                                        :class="mobileServicesOpen ? 'rotate-180 text-primary' : ''"
                                    />
                                </button>

                                <!-- Sub-items (expanded by default, smoothly collapsible) -->
                                <div v-if="mobileServicesOpen" class="px-2 pb-2 space-y-1 border-t border-gray-200 dark:border-slate-800 pt-1.5">
                                    <nuxt-link 
                                        to="/services/hotels" 
                                        class="mobile-drawer-sublink"
                                        @click="showMenu = false"
                                    >
                                        <div class="flex items-center gap-2.5">
                                            <Icon name="i-heroicons-building-office-2" class="w-4 h-4 text-primary" />
                                            <span>Hôtels</span>
                                        </div>
                                        <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">Populaire</span>
                                    </nuxt-link>

                                    <nuxt-link 
                                        to="/services/visa" 
                                        class="mobile-drawer-sublink"
                                        @click="showMenu = false"
                                    >
                                        <div class="flex items-center gap-2.5">
                                            <Icon name="i-heroicons-ticket" class="w-4 h-4 text-primary" />
                                            <span>Demande de Visa</span>
                                        </div>
                                    </nuxt-link>

                                    <nuxt-link 
                                        to="/services/omra" 
                                        class="mobile-drawer-sublink"
                                        @click="showMenu = false"
                                    >
                                        <div class="flex items-center gap-2.5">
                                            <Icon name="i-heroicons-building-library" class="w-4 h-4 text-primary" />
                                            <span>Programmes Omra</span>
                                        </div>
                                    </nuxt-link>

                                    <nuxt-link 
                                        to="/services/voyage_organise" 
                                        class="mobile-drawer-sublink"
                                        @click="showMenu = false"
                                    >
                                        <div class="flex items-center gap-2.5">
                                            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 text-primary" />
                                            <span>Voyage Organisé</span>
                                        </div>
                                    </nuxt-link>

                                    <nuxt-link 
                                        to="/services" 
                                        class="mobile-drawer-sublink text-primary font-semibold border-t border-gray-100 dark:border-slate-800/80 mt-1"
                                        @click="showMenu = false"
                                    >
                                        <div class="flex items-center gap-2.5">
                                            <Icon name="i-heroicons-arrow-right-circle" class="w-4 h-4" />
                                            <span>Tous les services</span>
                                        </div>
                                    </nuxt-link>
                                </div>
                            </div>

                            <!-- À Propos -->
                            <nuxt-link 
                                to="/about" 
                                class="mobile-drawer-link"
                                @click="showMenu = false"
                            >
                                <div class="flex items-center gap-3">
                                    <Icon name="i-heroicons-information-circle" class="w-5 h-5 text-primary" />
                                    <span>À Propos</span>
                                </div>
                                <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            </nuxt-link>
                        </div>

                        <!-- User Account / Auth Section -->
                        <div class="pt-4 border-t border-gray-200 dark:border-slate-800">
                            <div v-if="token" class="space-y-3">
                                <!-- User Badge Card -->
                                <div class="p-3.5 bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 flex items-center gap-3">
                                    <div class="w-10 h-10 bg-primary/15 border border-primary text-primary flex items-center justify-center font-bold text-base uppercase shrink-0">
                                        {{ user?.name?.charAt(0) || 'U' }}
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="text-sm font-bold text-secondary dark:text-white truncate">{{ user?.name }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user?.email || (user?.role === 'admin' ? 'Administrateur' : 'Client') }}</p>
                                    </div>
                                </div>

                                <!-- Account Links -->
                                <div class="space-y-1">
                                    <template v-for="(item, index) in menuItems" :key="index">
                                        <NuxtLink 
                                            v-if="item?.link"
                                            :to="item.link" 
                                            @click="() => { if(item?.action) item.action(); showMenu = false; }" 
                                            class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-secondary dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-primary transition-colors text-left border border-transparent hover:border-gray-200 dark:hover:border-slate-800 cursor-pointer"
                                            :class="item?.class"
                                        >
                                            <div class="flex items-center gap-3">
                                                <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                                <span>{{ item.text }}</span>
                                            </div>
                                            <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
                                        </NuxtLink>
                                        <button 
                                            v-else
                                            type="button"
                                            @click="() => { if(item?.action) item.action(); showMenu = false; }" 
                                            class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-secondary dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-primary transition-colors text-left border border-transparent hover:border-gray-200 dark:hover:border-slate-800 cursor-pointer"
                                            :class="item?.class"
                                        >
                                            <div class="flex items-center gap-3">
                                                <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                                <span>{{ item.text }}</span>
                                            </div>
                                            <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
                                        </button>
                                    </template>
                                </div>
                            </div>

                            <!-- Guest / Login CTA -->
                            <div v-else class="space-y-3">
                                <nuxt-link 
                                    to="/auth/login" 
                                    class="w-full block"
                                    @click="showMenu = false"
                                >
                                    <button class="w-full bg-primary hover:bg-primary-hover text-white py-3.5 px-4 font-bold uppercase tracking-wider text-sm transition-colors duration-200 flex items-center justify-center gap-2 rounded-none cursor-pointer shadow-md">
                                        <Icon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
                                        <span>Connexion / S'inscrire</span>
                                    </button>
                                </nuxt-link>
                            </div>
                        </div>

                        <!-- Agency Contact Footer inside Drawer -->
                        <div class="pt-5 border-t border-gray-100 dark:border-slate-800/80 text-xs text-gray-500 dark:text-gray-400 space-y-2.5">
                            <p class="font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider text-[11px]">
                                Assistance Bouazize Travel
                            </p>
                            <div class="flex items-center gap-2.5">
                                <Icon name="i-heroicons-phone" class="w-4 h-4 text-primary shrink-0" />
                                <span>+213 (0) 550 00 00 00</span>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <Icon name="i-heroicons-envelope" class="w-4 h-4 text-primary shrink-0" />
                                <span>contact@bouazizetravel.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.User)
const token = computed(() => authStore.Authorization?.token)

// Mobile menu and drawer states
const isMounted = ref(false)
const showMenu = ref(false)
// Open by default so mobile users see services immediately!
const mobileServicesOpen = ref(true)

const toggleMobileServices = (e) => {
    if (e) {
        e.preventDefault()
        e.stopPropagation()
    }
    mobileServicesOpen.value = !mobileServicesOpen.value
}

onMounted(() => {
    isMounted.value = true
})

// Automatically close mobile menu on any navigation
router.afterEach(() => {
    showMenu.value = false
})

// Always keep services open when navigating to /services
watch(() => route.path, (newPath) => {
    if (newPath && newPath.startsWith('/services')) {
        mobileServicesOpen.value = true
    }
}, { immediate: true })

// Desktop services dropdown timer
const showServices = ref(false)
let servicesHideTimer = null

const startServicesHideTimer = () => {
    servicesHideTimer = setTimeout(() => {
        showServices.value = false
    }, 200)
}
const cancelServicesHideTimer = () => {
    if (servicesHideTimer) {
        clearTimeout(servicesHideTimer)
        servicesHideTimer = null
    }
}

// Desktop user menu dropdown timer
const showUserMenu = ref(false)
let userMenuHideTimer = null

const startUserMenuHideTimer = () => {
    userMenuHideTimer = setTimeout(() => {
        showUserMenu.value = false
    }, 200)
}
const cancelUserMenuHideTimer = () => {
    if (userMenuHideTimer) {
        clearTimeout(userMenuHideTimer)
        userMenuHideTimer = null
    }
}

const logout = async() => {
    showUserMenu.value = false
    showMenu.value = false
    await authStore.logout()
}

const menuItems = computed(() => {
    const items = [
        { link: "/profile", text: "Mon profil", icon: 'i-heroicons-user' },
    ];

    if (user.value?.role === "admin") {
        items.push({ link: "/x8dj29msk", text: "Tableau de bord", icon: 'i-heroicons-squares-2x2' });
        items.push({ link: "/h0t1e2l3s", text: "Gestion Hôtels", icon: 'i-heroicons-building-office-2' });
    }

    // Always provide "Mes commandes" so all users (clients & admin) can access their orders
    items.push({ link: "/client/orders", text: "Mes commandes", icon: 'i-heroicons-shopping-bag' });

    items.push({
        action: logout,
        text: "Déconnexion",
        icon: 'i-heroicons-arrow-right-on-rectangle',
        class: '!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/50'
    });

    return items;
});

// Lock/unlock body scroll when mobile menu is open
watch(showMenu, (val) => {
    if (process.client) {
        document.body.style.overflow = val ? 'hidden' : ''
    }
})

onUnmounted(() => {
    if (process.client) {
        document.body.style.overflow = ''
    }
    if (servicesHideTimer) clearTimeout(servicesHideTimer)
    if (userMenuHideTimer) clearTimeout(userMenuHideTimer)
})
</script>

<style scoped>
@reference "../assets/css/main.css";

.nav-link {
    @apply text-gray-600 dark:text-slate-300 font-medium hover:text-primary dark:hover:text-primary transition-colors relative py-2 whitespace-nowrap;
}
.nav-link::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300;
}
.nav-link:hover::after, .router-link-active::after {
    @apply w-full;
}
.router-link-active {
    @apply text-primary;
}

.dropdown-item {
    @apply flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-secondary dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all duration-150 cursor-pointer w-full rounded-none;
}

/* Mobile drawer link styling */
.mobile-drawer-link {
    @apply flex items-center justify-between px-4 py-3.5 text-base font-semibold text-secondary dark:text-white hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-800 rounded-none cursor-pointer;
}

.mobile-drawer-sublink {
    @apply flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-white dark:hover:bg-slate-800 transition-colors rounded-none cursor-pointer;
}

/* Desktop dropdown transitions */
.dropdown-enter-active {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
    transition: all 0.15s ease-in;
}
.dropdown-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-8px) scale(0.95);
}
.dropdown-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px) scale(0.97);
}

.user-dropdown-enter-active {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.user-dropdown-leave-active {
    transition: all 0.15s ease-in;
}
.user-dropdown-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
}
.user-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
}

/* Mobile drawer slide transition */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
    transition: opacity 0.25s ease-out;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
    opacity: 0;
}
.drawer-fade-enter-active .drawer-content {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-fade-leave-active .drawer-content {
    transition: transform 0.2s ease-in;
}
.drawer-fade-enter-from .drawer-content {
    transform: translateX(100%);
}
.drawer-fade-leave-to .drawer-content {
    transform: translateX(100%);
}
</style>
