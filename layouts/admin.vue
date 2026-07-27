<template>
    <div class="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors duration-300">
        <!-- Top Admin Header Bar -->
        <header class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs h-16 px-4 md:px-6 flex items-center justify-between transition-all duration-300">
            <!-- Left Header: Toggle Button & Breadcrumbs -->
            <div class="flex items-center gap-4">
                <button 
                    @click="isCollapsed = !isCollapsed" 
                    class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                    :title="isCollapsed ? 'Déplier le menu' : 'Réduire le menu'"
                >
                    <UIcon :name="isCollapsed ? 'i-heroicons-bars-3-bottom-left' : 'i-heroicons-bars-3'" class="w-6 h-6" />
                </button>

                <!-- Page Breadcrumb & Title -->
                <div class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span class="text-slate-400 dark:text-slate-500 font-medium">Administration</span>
                    <UIcon name="i-heroicons-chevron-right-20-solid" class="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    <span class="text-slate-900 dark:text-slate-100 font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                        {{ currentPageTitle }}
                    </span>
                </div>
            </div>

            <!-- Right Header Actions & Indicators -->
            <div class="flex items-center gap-3">
                <!-- Dark Mode Toggle Button -->
                <DarkModeToggle />

                <!-- Security Session Badge -->
                <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-semibold">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Session Sécurisée</span>
                </div>

                <!-- Public Site Link Button -->
                <nuxt-link 
                    to="/" 
                    target="_blank"
                    class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span class="hidden md:inline">Voir le site public</span>
                </nuxt-link>

                <!-- Admin Profile Menu -->
                <div class="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                    <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shadow-2xs">
                        {{ userInitial }}
                    </div>
                    <div class="hidden lg:flex flex-col text-left">
                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{{ authStore.User?.name || 'Admin' }}</span>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Administrateur</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Body Frame: Sidebar + Content -->
        <div class="flex flex-1 items-start min-h-[calc(100vh-64px)]">
            <!-- Sidebar Shell -->
            <div 
                class="sticky top-16 h-[calc(100vh-64px)] shrink-0 z-40 transition-all duration-300"
                :class="isCollapsed ? 'w-20' : 'w-64'"
            >
                <SideBar 
                    :is-collapsed="isCollapsed" 
                    @toggle="isCollapsed = !isCollapsed" 
                    class="w-full h-full"
                />
            </div>

            <!-- Page Workspace Container -->
            <main class="flex-1 p-6 md:p-8 min-w-0 transition-all duration-300">
                <div class="w-full max-w-7xl mx-auto">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore, useCookie } from '#imports';
import SideBar from '~/components/SideBar.vue';
import DarkModeToggle from '~/components/DarkModeToggle.vue';

const route = useRoute();
const authStore = useAuthStore();

// Sidebar Collapse State (persisted in cookies)
const isCollapsed = useCookie('admin_sidebar_collapsed', { default: () => false });

const userInitial = computed(() => {
    return authStore.User?.name ? authStore.User.name.charAt(0).toUpperCase() : 'A';
});

// Map routes to human readable titles for header breadcrumb
const currentPageTitle = computed(() => {
    const path = route.path;
    if (path.includes('/gfljgan5465ds')) return 'État Global';
    if (path.includes('/b2n3m4k5l')) return 'Bannière';
    if (path.includes('/x8dj29msk')) return 'Utilisateurs';
    if (path.includes('/p9q8w7e6r')) return 'Fournisseurs';
    if (path.includes('/c1m2n3b4v')) return 'Pays';
    if (path.includes('/v0o9i8u7y')) return 'Visa - Offres';
    if (path.includes('/v1p2l3m4k')) return 'Visa - Commandes';
    if (path.includes('/o0m9r8a7o')) return 'Omra - Offres';
    if (path.includes('/o1m2r3a4o')) return 'Omra - Commandes';
    if (path.includes('/v0o9y8a7o')) return 'Voyage Organisé - Offres';
    if (path.includes('/v1o2y3a4o')) return 'Voyage Organisé - Commandes';
    if (path.includes('/s3t4t5i6n')) return 'Paramètres CCP';
    if (path.includes('/c2c3p4p5')) return 'Paiements CCP';
    return 'Tableau de bord';
});

// Inactivity Auto-logout (5 minutes)
let timeoutId;
const INACTIVITY_LIMIT = 5 * 60 * 1000; 

const logoutAdmin = () => {
    authStore.logout();
};

const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(logoutAdmin, INACTIVITY_LIMIT);
};

onMounted(() => {
    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);
});

onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId);
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('mousedown', resetTimer);
    window.removeEventListener('keydown', resetTimer);
    window.removeEventListener('scroll', resetTimer);
    window.removeEventListener('touchstart', resetTimer);
});
</script>

<style scoped>
</style>