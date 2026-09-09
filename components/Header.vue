<template>
    <header class="z-[100] w-full sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 py-3.5 shadow-sm">
        <div class="w-full px-6 md:px-12">
            <nav class="flex justify-between items-center">
                <nuxt-link to="/" class="flex gap-3 items-center z-[101]">
                    <img src="/images/logo/bouazize-logo.png" class="w-12 h-12 object-contain" alt="Bouazize Logo"/>
                    <div class="max-[400px]:hidden">
                        <p class="font-bold text-2xl tracking-tight transition-colors duration-300" :class="showMenu ? 'text-white' : 'text-secondary dark:text-white'">
                            Bouazize <span class="text-primary">Travel</span>
                        </p>
                    </div>
                </nuxt-link>

                <!-- Center Menu -->
                <div class="hidden md:flex flex-1 justify-center items-center space-x-10">
                    <nuxt-link to="/" class="nav-link">Accueil</nuxt-link>
                    
                    <!-- Services Dropdown — hover controlled via JS for precision -->
                    <div class="relative">
                        <nuxt-link 
                            to="/services" 
                            class="nav-link flex items-center gap-1"
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
                                class="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-52 z-50"
                                @mouseenter="cancelServicesHideTimer"
                                @mouseleave="startServicesHideTimer"
                            >
                                <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                                    <div class="p-2 flex flex-col gap-0.5">
                                        <nuxt-link 
                                            to="/services/visa" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-ticket" class="w-4 h-4 text-primary" />
                                            Visa
                                        </nuxt-link>
                                        <nuxt-link 
                                            to="/services/omra" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-building-library" class="w-4 h-4 text-primary" />
                                            Omra
                                        </nuxt-link>
                                        <nuxt-link 
                                            to="/services/voyage_organise" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 text-primary" />
                                            Voyage Organisé
                                        </nuxt-link>
                                        <nuxt-link 
                                            to="/hotels" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-building-office-2" class="w-4 h-4 text-primary" />
                                            Hôtellerie
                                        </nuxt-link>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <nuxt-link to="/about" class="nav-link">À Propos</nuxt-link>
                </div>

                <!-- Right Actions -->
                <div class="hidden md:flex items-center gap-3">
                    <DarkModeToggle />

                    <!-- User Menu Dropdown -->
                    <div v-if="token" ref="userMenuRef" class="relative">
                        <button 
                            @click="toggleUserMenu"
                            type="button"
                            class="flex items-center gap-2.5 font-semibold text-secondary dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-all py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            :class="showUserMenu ? 'bg-slate-100 dark:bg-slate-800 text-primary' : ''"
                        >
                            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                                {{ userInitial }}
                            </div>
                            <span class="text-sm truncate max-w-[120px]">{{ user?.name || 'Mon Compte' }}</span>
                            <Icon 
                                name="i-heroicons-chevron-down-20-solid" 
                                class="w-4 h-4 transition-transform duration-300 shrink-0"
                                :class="showUserMenu ? 'rotate-180 text-primary' : 'text-slate-400'"
                            />
                        </button>
                        <Transition name="user-dropdown">
                            <div 
                                v-if="showUserMenu"
                                class="absolute right-0 top-full pt-2 w-60 z-50"
                            >
                                <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                                    <!-- User Header Summary -->
                                    <div class="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                                        <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ user?.name }}</p>
                                        <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ user?.email }}</p>
                                        <div class="mt-1.5">
                                            <span 
                                                class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider"
                                                :class="user?.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/30' : (user?.role === 'business' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700')"
                                            >
                                                {{ user?.role === 'admin' ? 'Administrateur' : (user?.role === 'business' ? 'Partenaire B2B' : 'Client') }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Links -->
                                    <div class="p-2 flex flex-col gap-0.5">
                                        <template v-for="(item, index) in menuItems" :key="index">
                                            <NuxtLink
                                                v-if="item?.link"
                                                :to="item.link"
                                                @click="showUserMenu = false"
                                                class="dropdown-item text-left"
                                                :class="item?.class"
                                            >
                                                <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                                <span class="truncate">{{ item.text }}</span>
                                            </NuxtLink>
                                            <button
                                                v-else
                                                type="button"
                                                @click="() => { if(item?.action) item.action(); showUserMenu = false; }"
                                                class="dropdown-item text-left"
                                                :class="item?.class"
                                            >
                                                <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                                <span class="truncate">{{ item.text }}</span>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                    
                    <nuxt-link v-else to="/auth/login">
                        <button class="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 font-bold uppercase tracking-wider text-sm transition-colors duration-300 rounded-xl shadow-sm">
                            Connexion
                        </button>
                    </nuxt-link>
                </div>

                <!-- Mobile Toggle -->
                <div class="md:hidden flex items-center gap-3 z-[101]">
                    <DarkModeToggle />
                    <button class="p-1 hover:text-primary transition-colors" :class="showMenu ? 'text-white' : 'text-secondary dark:text-white'" @click="showMenu = !showMenu">
                        <Icon :name="showMenu ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-8 h-8" />
                    </button>
                </div>
            </nav>
        </div>

        <!-- Mobile Menu -->
        <div class="fixed inset-0 bg-secondary/95 backdrop-blur-lg z-[100] transition-all duration-300 md:hidden flex flex-col items-center justify-center" :class="showMenu ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'">
            <div class="flex flex-col items-center space-y-8 text-2xl font-medium text-white w-full px-6">
                <nuxt-link to="/" class="mobile-nav-link" @click="showMenu=false">Accueil</nuxt-link>
                <nuxt-link to="/services" class="mobile-nav-link" @click="showMenu=false">Services</nuxt-link>
                <nuxt-link to="/about" class="mobile-nav-link" @click="showMenu=false">À Propos</nuxt-link>
                
                <div v-if="token" class="w-full flex flex-col items-center space-y-4 pt-8 border-t border-white/20">
                    <p class="text-primary text-lg mb-2">Bonjour, {{ user?.name }}</p>
                    <template v-for="(item, index) in menuItems" :key="index">
                        <NuxtLink
                            v-if="item?.link"
                            :to="item.link"
                            @click="showMenu = false"
                            class="text-xl text-gray-300 hover:text-white transition-colors"
                            :class="item?.class"
                        >
                            {{ item.text }}
                        </NuxtLink>
                        <button
                            v-else
                            type="button"
                            @click="() => { if(item?.action) item.action(); showMenu = false; }"
                            class="text-xl text-gray-300 hover:text-white transition-colors"
                            :class="item?.class"
                        >
                            {{ item.text }}
                        </button>
                    </template>
                </div>
                
                <div v-else class="pt-8 w-full border-t border-white/20 flex justify-center">
                    <nuxt-link to="/auth/login" @click="showMenu=false">
                        <UButton color="primary" size="xl" class="rounded-none px-10 font-bold">
                            Connexion
                        </UButton>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
const authStore = useAuthStore()
const user = computed(() => authStore.User)
const token = computed(() => authStore.Authorization?.token)
const showMenu = ref(false)

const userInitial = computed(() => {
    return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U'
})

// Services dropdown — controlled with timer to give user time to move mouse to submenu
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

// User menu dropdown (Click + Click-Outside toggle)
const showUserMenu = ref(false)
const userMenuRef = ref(null)

const toggleUserMenu = (event) => {
    if (event) event.stopPropagation()
    showUserMenu.value = !showUserMenu.value
}

const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        showUserMenu.value = false
    }
}

const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
        showUserMenu.value = false
        showServices.value = false
    }
}

onMounted(() => {
    if (process.client) {
        window.addEventListener('click', handleClickOutside)
        window.addEventListener('keydown', handleKeyDown)
    }
})

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('click', handleClickOutside)
        window.removeEventListener('keydown', handleKeyDown)
    }
})

const logout = async() => {
    showUserMenu.value = false
    await authStore.logout()
}

const menuItems = computed(() => [
    {link:"/profile", text:"Mon profil", icon: 'i-heroicons-user'},
    user.value?.role === "admin" ? {link:"/x8dj29msk", text:"Tableau de bord", icon: 'i-heroicons-squares-2x2'} : null,
    user.value?.role !== "admin" ? {link:"/client/orders", text:"Mes commandes", icon: 'i-heroicons-shopping-bag'} : null,
    {action:logout, text:"Déconnexion", icon: 'i-heroicons-arrow-right-on-rectangle', class: '!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/50'}
].filter(Boolean))

// Prevent body scroll when mobile menu is open
watch(showMenu, (val) => {
    if (process.client) {
        if (val) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
    }
})
</script>

<style scoped>
@reference "../assets/css/main.css";

.nav-link {
    @apply text-gray-600 dark:text-slate-300 font-medium hover:text-primary dark:hover:text-primary transition-colors relative py-2;
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
    @apply flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-secondary dark:text-slate-200 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-150 cursor-pointer w-full;
}

.mobile-nav-link {
    @apply hover:text-primary hover:scale-110 transition-all duration-300;
}

/* Dropdown animation */
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
</style>
