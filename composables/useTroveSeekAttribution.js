import { ref } from 'vue'

const STORAGE_KEY = 'bzz_ts_attribution'
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

const mediaCodeState = ref('')
const surveyAnswerState = ref('')
const hasLinkSignalState = ref(false)

function readStoredAttribution() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.expires_at && Date.now() > Number(parsed.expires_at)) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeStoredAttribution(data) {
  if (typeof window === 'undefined') return
  try {
    const payload = {
      ...data,
      updated_at: new Date().toISOString(),
      expires_at: data.expires_at || (Date.now() + NINETY_DAYS_MS),
    }
    const serialized = JSON.stringify(payload)
    window.localStorage.setItem(STORAGE_KEY, serialized)
    const maxAgeSec = 90 * 24 * 60 * 60
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(btoa(unescape(encodeURIComponent(serialized))))}; path=/; max-age=${maxAgeSec}; SameSite=Lax`
  } catch {
    // ignore storage errors
  }
}

export function captureTroveSeekAttributionFromLocation() {
  if (typeof window === 'undefined') return null

  const existing = readStoredAttribution() || {
    visitor_id: 'ts_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
    first_touch: null,
    last_touch: null,
    media_code: '',
    attribution_survey: '',
  }

  const params = new URLSearchParams(window.location.search || '')
  const ts = params.get('ts') || params.get('troveseek') || ''
  const refParam = params.get('ref') || params.get('partner') || params.get('media') || ''
  const utm_source = params.get('utm_source') || ''
  const utm_medium = params.get('utm_medium') || ''
  const utm_campaign = params.get('utm_campaign') || ''
  const fbclid = params.get('fbclid') || ''
  const ttclid = params.get('ttclid') || ''
  const gclid = params.get('gclid') || ''
  const code = params.get('code') || params.get('media_code') || params.get('promo') || ''
  const referrer = (typeof document !== 'undefined' && document.referrer && !document.referrer.includes(window.location.hostname))
    ? document.referrer
    : ''

  const hasNewTouch = Boolean(ts || refParam || utm_source || utm_campaign || fbclid || ttclid || gclid || code || referrer)

  if (hasNewTouch) {
    const touch = {
      ts: ts || undefined,
      ref: refParam || undefined,
      utm_source: utm_source || undefined,
      utm_medium: utm_medium || undefined,
      utm_campaign: utm_campaign || undefined,
      fbclid: fbclid || undefined,
      ttclid: ttclid || undefined,
      gclid: gclid || undefined,
      code: code ? code.toUpperCase() : undefined,
      referrer: referrer || undefined,
      landing_path: window.location.pathname + window.location.search,
      timestamp: new Date().toISOString(),
    }

    if (!existing.first_touch) {
      existing.first_touch = touch
    }
    existing.last_touch = touch
    if (code) {
      existing.media_code = code.toUpperCase()
    }
  }

  writeStoredAttribution(existing)

  mediaCodeState.value = existing.media_code || ''
  surveyAnswerState.value = existing.attribution_survey || ''
  hasLinkSignalState.value = Boolean(
    existing.first_touch?.ts ||
    existing.first_touch?.fbclid ||
    existing.first_touch?.ttclid ||
    existing.first_touch?.gclid ||
    existing.first_touch?.utm_source ||
    existing.first_touch?.ref
  )

  return existing
}

export function getAttributionHeaderValue() {
  if (typeof window === 'undefined') return ''
  try {
    const data = readStoredAttribution()
    if (!data) return ''
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  } catch {
    return ''
  }
}

export function useTroveSeekAttribution() {
  if (typeof window !== 'undefined' && !mediaCodeState.value && !surveyAnswerState.value) {
    const stored = readStoredAttribution()
    if (stored) {
      mediaCodeState.value = stored.media_code || ''
      surveyAnswerState.value = stored.attribution_survey || ''
      hasLinkSignalState.value = Boolean(
        stored.first_touch?.ts ||
        stored.first_touch?.fbclid ||
        stored.first_touch?.ttclid ||
        stored.first_touch?.gclid ||
        stored.first_touch?.utm_source ||
        stored.first_touch?.ref
      )
    }
  }

  function setMediaCode(code) {
    const cleaned = String(code || '').trim().toUpperCase()
    mediaCodeState.value = cleaned
    const stored = readStoredAttribution() || {
      visitor_id: 'ts_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
    }
    stored.media_code = cleaned
    writeStoredAttribution(stored)
  }

  function setSurveyAnswer(answer) {
    const cleaned = String(answer || '').trim()
    surveyAnswerState.value = cleaned
    const stored = readStoredAttribution() || {
      visitor_id: 'ts_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
    }
    stored.attribution_survey = cleaned
    writeStoredAttribution(stored)
  }

  return {
    mediaCode: mediaCodeState,
    surveyAnswer: surveyAnswerState,
    hasLinkSignal: hasLinkSignalState,
    setMediaCode,
    setSurveyAnswer,
    captureTroveSeekAttributionFromLocation,
    getAttributionHeaderValue,
  }
}
