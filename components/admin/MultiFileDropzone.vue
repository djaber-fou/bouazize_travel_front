<template>
  <div class="space-y-4 w-full">
    <!-- Drag-and-drop multi-file area -->
    <div
      class="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
      :class="isDragging
        ? 'border-primary bg-primary/10'
        : 'border-primary/40 bg-primary/5 hover:bg-primary/10 dark:bg-slate-800/50 dark:border-primary/50'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        :accept="acceptAttr"
        @change="onInputChange"
      />
      <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 text-primary mx-auto mb-2" />
      <p class="text-sm font-bold text-secondary dark:text-white">
        Glissez-déposez vos documents ici ou cliquez pour parcourir
      </p>
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        Sélection multiple autorisée (jusqu'à {{ maxFiles }} fichiers · {{ maxFileMb }} Mo max/fichier)
      </p>
      <p class="text-[11px] text-gray-400 mt-0.5">
        PDF, JPG, PNG, WEBP, Word, Excel, PowerPoint, TXT, ZIP
      </p>
    </div>

    <!-- Error banner -->
    <div
      v-if="errorMsg"
      class="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2"
    >
      <span>{{ errorMsg }}</span>
      <button type="button" class="cursor-pointer font-bold" @click="errorMsg = ''">Fermer</button>
    </div>

    <!-- Selected files list -->
    <div v-if="modelValue.length > 0" class="space-y-2">
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span class="font-semibold">
          {{ modelValue.length }} fichier{{ modelValue.length > 1 ? 's' : '' }} sélectionné{{ modelValue.length > 1 ? 's' : '' }}
          ({{ formatBytes(totalBytes) }})
        </span>
        <button
          type="button"
          class="text-rose-600 hover:underline font-semibold cursor-pointer"
          :disabled="disabled"
          @click="clearAll"
        >
          Tout retirer
        </button>
      </div>

      <ul class="max-h-52 overflow-y-auto space-y-2 pr-1">
        <li
          v-for="(file, idx) in modelValue"
          :key="`${file.name}-${file.size}-${idx}`"
          class="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <UIcon :name="iconFor(file.name)" class="w-5 h-5 text-primary shrink-0" />
            <div class="min-w-0">
              <p class="font-semibold text-slate-800 dark:text-slate-100 truncate" :title="file.name">
                {{ file.name }}
              </p>
              <p class="text-[11px] text-slate-400">{{ formatBytes(file.size) }}</p>
            </div>
          </div>
          <button
            type="button"
            class="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
            title="Retirer ce fichier"
            :disabled="disabled"
            @click="removeFile(idx)"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </li>
      </ul>
    </div>

    <!-- Upload progress bar -->
    <div v-if="progress > 0 && progress < 100" class="space-y-1">
      <div class="flex justify-between text-[11px] font-semibold text-primary">
        <span>Téléversement en cours...</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-150"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxFiles: {
    type: Number,
    default: 10,
  },
  maxFileMb: {
    type: Number,
    default: 15,
  },
  progress: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const ALLOWED_EXTS = new Set([
  'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp',
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'txt', 'rtf', 'zip',
])

const acceptAttr = '.pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.txt,.rtf,.zip'

const fileInput = ref(null)
const isDragging = ref(false)
const errorMsg = ref('')

const totalBytes = computed(() =>
  props.modelValue.reduce((sum, f) => sum + Number(f?.size || 0), 0)
)

function triggerFileInput() {
  if (props.disabled) return
  fileInput.value?.click()
}

function addFiles(fileList) {
  errorMsg.value = ''
  const incoming = Array.from(fileList || [])
  if (!incoming.length) return

  const next = [...props.modelValue]
  const errors = []
  const maxBytes = props.maxFileMb * 1024 * 1024

  for (const file of incoming) {
    if (next.length >= props.maxFiles) {
      errors.push(`Maximum ${props.maxFiles} fichiers autorisés par envoi.`)
      break
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXTS.has(ext)) {
      errors.push(`Format refusé : ${file.name}`)
      continue
    }
    if (file.size > maxBytes) {
      errors.push(`Trop volumineux (max ${props.maxFileMb} Mo) : ${file.name}`)
      continue
    }
    const dup = next.some((f) => f.name === file.name && f.size === file.size)
    if (!dup) {
      next.push(file)
    }
  }

  if (errors.length) {
    errorMsg.value = errors.join(' · ')
  }
  emit('update:modelValue', next)
}

function onInputChange(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  if (props.disabled) return
  addFiles(e.dataTransfer?.files)
}

function removeFile(idx) {
  const next = props.modelValue.filter((_, i) => i !== idx)
  emit('update:modelValue', next)
}

function clearAll() {
  errorMsg.value = ''
  emit('update:modelValue', [])
}

function formatBytes(bytes) {
  const n = Number(bytes || 0)
  if (n < 1024) return `${n} o`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`
  return `${(n / (1024 * 1024)).toFixed(2)} Mo`
}

function iconFor(name) {
  const n = String(name || '').toLowerCase()
  if (/\.pdf$/.test(n)) return 'i-heroicons-document-text'
  if (/\.(jpe?g|png|gif|webp|bmp)$/.test(n)) return 'i-heroicons-photo'
  if (/\.(xlsx?)$/.test(n)) return 'i-heroicons-table-cells'
  if (/\.(zip)$/.test(n)) return 'i-heroicons-archive-box'
  return 'i-heroicons-document'
}
</script>
