import { captureTroveSeekAttributionFromLocation } from '~/composables/useTroveSeekAttribution'

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    captureTroveSeekAttributionFromLocation()
    nuxtApp.hook('page:finish', () => {
      captureTroveSeekAttributionFromLocation()
    })
  }
})
