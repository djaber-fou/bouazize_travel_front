<template>
  <div class="flex items-start gap-3 min-w-0 max-w-[280px] sm:max-w-[340px] md:max-w-[400px]">
    <!-- Avatar / Flag Thumbnail -->
    <div v-if="avatar || avatarIcon" class="shrink-0 pt-0.5">
      <UAvatar
        v-if="avatar"
        :src="avatar"
        :size="avatarSize"
        class="border border-gray-100 dark:border-slate-800 shadow-2xs rounded-md object-cover"
      />
      <div
        v-else-if="avatarIcon"
        class="w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shrink-0"
      >
        <UIcon :name="avatarIcon" class="w-5 h-5" />
      </div>
    </div>

    <!-- Text content container -->
    <div class="flex flex-col min-w-0 flex-1">
      <!-- Title handling -->
      <div class="relative">
        <!-- Short title: fits in normal line without truncating -->
        <div
          v-if="!isLong"
          class="font-bold text-sm sm:text-base text-gray-900 dark:text-white break-words leading-snug"
          :title="title"
        >
          {{ title || '-' }}
        </div>

        <!-- Long title - Collapsed state: truncated with interactive three dots (...) feedback -->
        <div
          v-else-if="!isExpanded"
          class="flex items-center gap-1.5 flex-wrap"
        >
          <span
            class="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-[250px] md:max-w-[290px] cursor-pointer hover:text-primary transition-colors"
            :title="title"
            @click.stop="toggleExpand"
          >
            {{ title }}
          </span>

          <!-- Three points feedback button (...) -->
          <button
            type="button"
            @click.stop="toggleExpand"
            :title="`Cliquer pour afficher tout le titre : \n${title}`"
            class="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold font-mono tracking-wider text-primary bg-primary/10 hover:bg-primary/20 dark:bg-primary/25 dark:hover:bg-primary/35 rounded border border-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs select-none"
            aria-label="Afficher le titre complet"
          >
            ...
          </button>
        </div>

        <!-- Long title - Expanded state: displayed across multiple lines, never stretching the table width -->
        <div
          v-else
          class="space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          <div
            class="font-bold text-sm sm:text-base text-gray-900 dark:text-white whitespace-normal break-words leading-snug cursor-pointer hover:opacity-90 transition-opacity"
            :title="title"
            @click.stop="toggleExpand"
          >
            {{ title }}
          </div>

          <button
            type="button"
            @click.stop="toggleExpand"
            class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer select-none transition-colors"
          >
            <UIcon name="i-heroicons-chevron-up" class="w-3.5 h-3.5" />
            <span>Réduire</span>
          </button>
        </div>
      </div>

      <!-- Subtitle (e.g. Country name / category) -->
      <div
        v-if="subtitle"
        class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate flex items-center gap-1 font-medium"
        :title="subtitle"
      >
        <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <span class="truncate uppercase tracking-wide">{{ subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  avatarIcon: {
    type: String,
    default: null
  },
  avatarSize: {
    type: String,
    default: 'xl'
  },
  maxChars: {
    type: Number,
    default: 45
  }
})

const isExpanded = ref(false)

const isLong = computed(() => {
  return (props.title || '').length > props.maxChars
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>
