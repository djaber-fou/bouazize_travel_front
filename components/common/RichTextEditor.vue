<template>
  <div class="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-none overflow-hidden">
    <!-- Formatting Toolbar -->
    <div class="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
      <button type="button" title="Gras" class="rte-btn" @mousedown.prevent="exec('bold')">
        <span class="font-bold text-xs">B</span>
      </button>
      <button type="button" title="Italique" class="rte-btn" @mousedown.prevent="exec('italic')">
        <span class="italic text-xs font-serif">I</span>
      </button>
      <button type="button" title="Souligné" class="rte-btn" @mousedown.prevent="exec('underline')">
        <span class="underline text-xs">U</span>
      </button>
      <span class="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></span>
      <button type="button" title="Titre de section" class="rte-btn" @mousedown.prevent="exec('formatBlock', 'h3')">
        <span class="font-bold text-[11px]">H3</span>
      </button>
      <button type="button" title="Paragraphe" class="rte-btn" @mousedown.prevent="exec('formatBlock', 'p')">
        <span class="text-[11px]">P</span>
      </button>
      <button type="button" title="Liste à puces" class="rte-btn" @mousedown.prevent="exec('insertUnorderedList')">
        <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
      </button>
      <button type="button" title="Liste numérotée" class="rte-btn" @mousedown.prevent="exec('insertOrderedList')">
        <UIcon name="i-heroicons-numbered-list" class="w-4 h-4" />
      </button>
      <button type="button" title="Citation" class="rte-btn" @mousedown.prevent="exec('formatBlock', 'blockquote')">
        <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-4 h-4" />
      </button>
      <span class="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></span>
      <button type="button" title="Insérer un lien" class="rte-btn" @mousedown.prevent="insertLink">
        <UIcon name="i-heroicons-link" class="w-4 h-4" />
      </button>
      <button type="button" title="Effacer le formatage" class="rte-btn" @mousedown.prevent="exec('removeFormat')">
        <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
      </button>
      <span class="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></span>
      <button
        type="button"
        title="Direction du texte (FR / AR)"
        class="rte-btn px-2 text-[11px] font-bold"
        @mousedown.prevent="toggleDir"
      >
        {{ editorDir.toUpperCase() }}
      </button>
      <button
        type="button"
        class="ml-auto px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer"
        :class="previewMode
          ? 'bg-primary text-white border-primary'
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-primary/40'"
        @click="previewMode = !previewMode"
      >
        {{ previewMode ? 'Éditer' : 'Aperçu' }}
      </button>
    </div>

    <!-- Editable Area -->
    <div
      v-show="!previewMode"
      ref="editorRef"
      contenteditable="true"
      :dir="editorDir"
      class="rte-content min-h-[180px] max-h-[420px] overflow-y-auto p-4 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
      :data-placeholder="placeholder"
      @input="onInput"
      @blur="onInput"
    ></div>

    <!-- Safe Preview -->
    <div
      v-if="previewMode"
      :dir="editorDir"
      class="rte-content min-h-[180px] max-h-[420px] overflow-y-auto p-4 text-sm text-slate-800 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-950/40"
      v-html="sanitizedPreview"
    ></div>

    <div class="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
      <span>Texte enrichi sécurisé (HTML nettoyé côté serveur contre les injections XSS).</span>
      <span>{{ charCount }} caractères</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Décrivez le programme détaillé, les hôtels, les services inclus, les excursions...',
  },
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const editorDir = ref('auto')
const previewMode = ref(false)
let isInternalUpdate = false

const stripDangerousPreview = (html) => {
  if (!html) return '<p class="text-slate-400 italic">Aucun contenu à afficher.</p>'
  return String(html)
    .replace(/<(script|style|iframe|object|embed|svg)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

const sanitizedPreview = computed(() => stripDangerousPreview(props.modelValue))

const charCount = computed(() => {
  const txt = String(props.modelValue || '').replace(/<[^>]*>/g, '').trim()
  return txt.length
})

const syncFromModel = (val) => {
  if (!editorRef.value) return
  const next = val || ''
  if (editorRef.value.innerHTML !== next) {
    editorRef.value.innerHTML = next
  }
}

onMounted(() => {
  syncFromModel(props.modelValue)
})

watch(() => props.modelValue, (val) => {
  if (isInternalUpdate) return
  syncFromModel(val)
})

const onInput = () => {
  if (!editorRef.value) return
  isInternalUpdate = true
  const raw = editorRef.value.innerHTML
  const plain = (editorRef.value.textContent || '').trim()
  emit('update:modelValue', plain === '' ? '' : raw)
  queueMicrotask(() => {
    isInternalUpdate = false
  })
}

const exec = (cmd, value = null) => {
  if (!editorRef.value) return
  editorRef.value.focus()
  try {
    document.execCommand(cmd, false, value)
  } catch (e) {
    // ignore browser execCommand quirks
  }
  onInput()
}

const insertLink = () => {
  const url = window.prompt('URL du lien (https://...) :')
  if (!url) return
  const trimmed = url.trim()
  if (!/^https?:\/\//i.test(trimmed) && !/^mailto:/i.test(trimmed)) {
    window.alert('Veuillez saisir une URL valide commençant par https:// ou http://')
    return
  }
  exec('createLink', trimmed)
}

const toggleDir = () => {
  editorDir.value = editorDir.value === 'auto' ? 'rtl' : (editorDir.value === 'rtl' ? 'ltr' : 'auto')
}
</script>

<style scoped>
.rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 4px;
  border: 1px solid transparent;
  color: #334155;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.rte-btn:hover {
  background: rgba(15, 23, 42, 0.08);
  border-color: rgba(148, 163, 184, 0.4);
}
:global(.dark) .rte-btn {
  color: #e2e8f0;
}
:global(.dark) .rte-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.rte-content:empty::before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}
.rte-content :deep(h2),
.rte-content :deep(h3),
.rte-content :deep(h4) {
  font-weight: 700;
  margin-top: 0.75rem;
  margin-bottom: 0.35rem;
}
.rte-content :deep(h3) {
  font-size: 1.05rem;
}
.rte-content :deep(p) {
  margin-bottom: 0.5rem;
}
.rte-content :deep(ul) {
  list-style: disc;
  padding-inline-start: 1.25rem;
  margin-bottom: 0.5rem;
}
.rte-content :deep(ol) {
  list-style: decimal;
  padding-inline-start: 1.25rem;
  margin-bottom: 0.5rem;
}
.rte-content :deep(blockquote) {
  border-inline-start: 3px solid #d97706;
  padding-inline-start: 0.75rem;
  color: #64748b;
  margin: 0.5rem 0;
}
.rte-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
</style>
