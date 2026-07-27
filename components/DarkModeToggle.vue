<template>
    <button 
        @click="toggleDark()" 
        class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
        :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
        aria-label="Changer de thème"
    >
        <UIcon 
            :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" 
            class="w-5 h-5 transition-transform duration-300 hover:rotate-12" 
            :class="isDark ? 'text-amber-400' : 'text-slate-600'"
        />
    </button>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
</style>
