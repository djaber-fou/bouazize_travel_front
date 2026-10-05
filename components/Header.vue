<template>
    <header id="site-global-header" class="z-[100] w-full sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 py-3.5 shadow-sm">
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
                                            to="/services/hotels" 
                                            class="dropdown-item"
                                            @click="showServices = false"
                                        >
                                            <Icon name="i-heroicons-building-office-2" class="w-4 h-4 text-primary" />
                                            Hôtels
                                        </nuxt-link>
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
                <div class="md:hidden flex items-center gap-2 z-[201]">
                    <DarkModeToggle />
                    <button
                        id="mobile-menu-toggle"
                        type="button"
                        class="mobile-hamburger"
                        :class="showMenu ? 'is-open' : ''"
                        @click.stop="showMenu = !showMenu"
                        :aria-expanded="showMenu"
                        aria-label="Menu"
                    >
                        <span class="hamburger-bar"></span>
                        <span class="hamburger-bar"></span>
                        <span class="hamburger-bar"></span>
                    </button>
                </div>
            </nav>
        </div>

        <!-- Mobile Menu Overlay -->
        <Teleport to="body">
            <Transition name="mobile-menu">
                <div
                    v-if="showMenu"
                    class="mobile-menu-overlay"
                    id="mobile-menu-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation mobile"
                >
                    <!-- Close backdrop -->
                    <div class="mobile-menu-backdrop" @click="showMenu = false"></div>

                    <!-- Panel -->
                    <div class="mobile-menu-panel">
                        <!-- Header inside panel -->
                        <div class="mobile-menu-header">
                            <nuxt-link to="/" class="flex items-center gap-2" @click="showMenu = false">
                                <img src="/images/logo/bouazize-logo.png" class="w-9 h-9 object-contain" alt="Logo"/>
                                <span class="font-bold text-lg text-slate-900 dark:text-white">Bouazize <span class="text-primary">Travel</span></span>
                            </nuxt-link>
                            <button
                                type="button"
                                class="mobile-close-btn"
                                @click="showMenu = false"
                                aria-label="Fermer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Nav Links -->
                        <nav class="mobile-nav-links">
                            <nuxt-link to="/" class="mobile-nav-item" @click="showMenu = false">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                                Accueil
                            </nuxt-link>

                            <!-- Services accordion -->
                            <div class="mobile-nav-accordion">
                                <button type="button" class="mobile-nav-item mobile-nav-accordion-trigger" @click="mobileServicesOpen = !mobileServicesOpen">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                                    Services
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-auto transition-transform duration-200" :class="mobileServicesOpen ? 'rotate-180' : ''"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                </button>
                                <Transition name="accordion">
                                    <div v-if="mobileServicesOpen" class="mobile-nav-sub">
                                        <nuxt-link to="/services/hotels" class="mobile-nav-sub-item" @click="showMenu = false">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
                                            Hôtels
                                        </nuxt-link>
                                        <nuxt-link to="/services/visa" class="mobile-nav-sub-item" @click="showMenu = false">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                                            Visa
                                        </nuxt-link>
                                        <nuxt-link to="/services/omra" class="mobile-nav-sub-item" @click="showMenu = false">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" /></svg>
                                            Omra
                                        </nuxt-link>
                                        <nuxt-link to="/services/voyage_organise" class="mobile-nav-sub-item" @click="showMenu = false">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                            Voyage Organisé
                                        </nuxt-link>
                                    </div>
                                </Transition>
                            </div>

                            <nuxt-link to="/about" class="mobile-nav-item" @click="showMenu = false">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                À Propos
                            </nuxt-link>
                        </nav>

                        <!-- Divider -->
                        <div class="mobile-menu-divider"></div>

                        <!-- Auth Section -->
                        <div class="mobile-menu-auth">
                            <template v-if="token">
                                <div class="mobile-user-badge">
                                    <div class="mobile-user-avatar">{{ userInitial }}</div>
                                    <div>
                                        <p class="mobile-user-name">{{ user?.name }}</p>
                                        <p class="mobile-user-role">{{ user?.role === 'admin' ? 'Administrateur' : (user?.role === 'business' ? 'Partenaire B2B' : 'Client') }}</p>
                                    </div>
                                </div>
                                <div class="mobile-user-actions">
                                    <template v-for="(item, index) in menuItems" :key="index">
                                        <NuxtLink v-if="item?.link" :to="item.link" @click="showMenu = false" class="mobile-action-item" :class="item?.class">
                                            <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                            <span>{{ item.text }}</span>
                                        </NuxtLink>
                                        <button v-else type="button" @click="() => { if(item?.action) item.action(); showMenu = false; }" class="mobile-action-item" :class="item?.class">
                                            <Icon v-if="item?.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                                            <span>{{ item.text }}</span>
                                        </button>
                                    </template>
                                </div>
                            </template>
                            <template v-else>
                                <nuxt-link to="/auth/login" @click="showMenu = false" class="mobile-login-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                    Se connecter
                                </nuxt-link>
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </header>
</template>


<script setup>
const authStore = useAuthStore()
const user = computed(() => authStore.User)
const token = computed(() => authStore.Authorization?.token)
const showMenu = ref(false)
const mobileServicesOpen = ref(false)

// Close services accordion when main menu closes
watch(showMenu, (val) => {
    if (!val) mobileServicesOpen.value = false
})

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

/* ── Hamburger Button ────────────────────────────────────────── */
.mobile-hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
    border-radius: 8px;
    transition: background 0.2s;
    -webkit-tap-highlight-color: transparent;
}
.mobile-hamburger:hover { background: rgba(0,0,0,0.06); }
.mobile-hamburger .hamburger-bar {
    display: block;
    width: 22px;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.68,-0.6,0.32,1.6), opacity 0.2s;
    transform-origin: center;
}
.mobile-hamburger.is-open .hamburger-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.mobile-hamburger.is-open .hamburger-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.mobile-hamburger.is-open .hamburger-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile Menu Overlay ─────────────────────────────────────── */
.mobile-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: flex;
}
.mobile-menu-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
}
.mobile-menu-panel {
    position: relative;
    z-index: 1;
    width: min(340px, 88vw);
    height: 100%;
    background: white;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 40px rgba(0,0,0,0.2);
}
:global(html.dark) .mobile-menu-panel {
    background: #0f172a;
}

/* ── Panel Header ────────────────────────────────────────────── */
.mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}
:global(html.dark) .mobile-menu-header {
    border-bottom-color: rgba(255,255,255,0.08);
}
.mobile-close-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(0,0,0,0.06);
    border-radius: 8px;
    cursor: pointer;
    color: #374151;
    transition: background 0.2s;
    -webkit-tap-highlight-color: transparent;
}
:global(html.dark) .mobile-close-btn { background: rgba(255,255,255,0.1); color: #e2e8f0; }
.mobile-close-btn:hover { background: rgba(0,0,0,0.12); }

/* ── Nav Links ───────────────────────────────────────────────── */
.mobile-nav-links {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
    flex-shrink: 0;
}
.mobile-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    -webkit-tap-highlight-color: transparent;
    min-height: 52px;
}
:global(html.dark) .mobile-nav-item { color: #e2e8f0; }
.mobile-nav-item:hover,
.mobile-nav-item:global(.router-link-active) {
    background: rgba(var(--color-primary-rgb, 220,164,70), 0.08);
    color: var(--color-primary, #DCA446);
}
.mobile-nav-accordion { width: 100%; }
.mobile-nav-accordion-trigger { justify-content: flex-start; }
.mobile-nav-sub {
    padding: 0 0 8px 20px;
    background: rgba(0,0,0,0.02);
}
:global(html.dark) .mobile-nav-sub { background: rgba(255,255,255,0.02); }
.mobile-nav-sub-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px;
}
:global(html.dark) .mobile-nav-sub-item { color: #94a3b8; }
.mobile-nav-sub-item:hover { color: var(--color-primary, #DCA446); background: rgba(var(--color-primary-rgb,220,164,70),0.08); }

/* ── Divider ─────────────────────────────────────────────────── */
.mobile-menu-divider {
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin: 4px 0;
    flex-shrink: 0;
}
:global(html.dark) .mobile-menu-divider { background: rgba(255,255,255,0.08); }

/* ── Auth Section ────────────────────────────────────────────── */
.mobile-menu-auth { padding: 16px 20px 24px; flex: 1; }
.mobile-user-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(0,0,0,0.04);
    border-radius: 12px;
    margin-bottom: 12px;
}
:global(html.dark) .mobile-user-badge { background: rgba(255,255,255,0.05); }
.mobile-user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-primary, #DCA446);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 16px;
    flex-shrink: 0;
}
.mobile-user-name { font-weight: 700; font-size: 14px; color: #1e293b; }
:global(html.dark) .mobile-user-name { color: #f1f5f9; }
.mobile-user-role { font-size: 12px; color: #64748b; margin-top: 2px; }
.mobile-user-actions { display: flex; flex-direction: column; gap: 2px; }
.mobile-action-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    text-decoration: none;
    border-radius: 10px;
    transition: background 0.15s;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    -webkit-tap-highlight-color: transparent;
    min-height: 48px;
}
:global(html.dark) .mobile-action-item { color: #cbd5e1; }
.mobile-action-item:hover { background: rgba(0,0,0,0.05); }
:global(html.dark) .mobile-action-item:hover { background: rgba(255,255,255,0.06); }
.mobile-login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 20px;
    background: var(--color-primary, #DCA446);
    color: #0A0B25;
    font-weight: 800;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 10px;
    text-decoration: none;
    transition: background 0.2s;
    min-height: 52px;
}
.mobile-login-btn:hover { background: var(--color-primary-hover, #c9933e); }

/* ── Mobile Menu Animation ───────────────────────────────────── */
.mobile-menu-enter-active { transition: opacity 0.25s ease; }
.mobile-menu-leave-active { transition: opacity 0.2s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; }
.mobile-menu-enter-active .mobile-menu-panel { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.mobile-menu-leave-active .mobile-menu-panel { transition: transform 0.2s ease; }
.mobile-menu-enter-from .mobile-menu-panel, .mobile-menu-leave-to .mobile-menu-panel { transform: translateX(-100%); }

/* ── Accordion Animation ─────────────────────────────────────── */
.accordion-enter-active, .accordion-leave-active { transition: all 0.25s ease; overflow: hidden; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
.accordion-enter-to, .accordion-leave-from { max-height: 300px; opacity: 1; }

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
