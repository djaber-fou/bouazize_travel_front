<template>
  <div class="p-4 sm:p-5 bg-white dark:bg-[#0C1C39] border border-gray-200 dark:border-[#1e3a6d] space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-white/10 pb-2.5">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-megaphone" class="w-4 h-4 text-primary" />
        <span class="text-xs sm:text-sm font-bold text-secondary dark:text-white">
          Comment avez-vous connu cette offre ?
        </span>
      </div>
      <span
        v-if="hasLinkSignal || mediaCode"
        class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
      >
        <UIcon name="i-heroicons-check-badge" class="w-3.5 h-3.5" />
        <span>Offre Média TroveSeek détectée</span>
      </span>
    </div>

    <!-- 1-Click Source Survey Chips (Layer 3) -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="opt in surveyOptions"
        :key="opt.value"
        type="button"
        @click="selectSurvey(opt.value)"
        class="px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5"
        :class="surveyAnswer === opt.value
          ? 'bg-primary text-[#0C1C39] border-primary font-bold shadow-xs'
          : 'bg-gray-50 dark:bg-[#071124] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-[#1e3a6d] hover:border-primary'"
      >
        <UIcon :name="opt.icon" class="w-3.5 h-3.5" />
        <span>{{ opt.label }}</span>
      </button>
    </div>

    <!-- Media / Promo Code Input (Layer 2) -->
    <div class="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
      <label class="text-xs font-semibold text-gray-600 dark:text-slate-300 shrink-0">
        Code Média / Partenaire (Optionnel) :
      </label>
      <div class="relative flex-1 max-w-xs">
        <input
          :value="mediaCode"
          @input="onCodeInput($event.target.value)"
          type="text"
          placeholder="Ex: TROVESEEK, TS2026..."
          class="w-full px-3 py-1.5 text-xs font-mono uppercase bg-gray-50 dark:bg-[#071124] border border-gray-300 dark:border-[#1e3a6d] text-secondary dark:text-white focus:border-primary outline-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTroveSeekAttribution } from '~/composables/useTroveSeekAttribution'

const { mediaCode, surveyAnswer, hasLinkSignal, setMediaCode, setSurveyAnswer } = useTroveSeekAttribution()

const surveyOptions = [
  { label: 'Facebook / Instagram', value: 'facebook_instagram', icon: 'i-heroicons-sparkles' },
  { label: 'TikTok / Reels', value: 'tiktok_reels', icon: 'i-heroicons-video-camera' },
  { label: 'Google / Site Web', value: 'google_web', icon: 'i-heroicons-globe-alt' },
  { label: 'Code Média / Sponsor', value: 'code_media', icon: 'i-heroicons-tag' },
  { label: 'Agence physique / Ami', value: 'agence_physique', icon: 'i-heroicons-building-storefront' },
]

function selectSurvey(val) {
  setSurveyAnswer(surveyAnswer.value === val ? '' : val)
}

function onCodeInput(val) {
  setMediaCode(val)
}
</script>
