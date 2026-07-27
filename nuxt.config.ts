// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head:{
      link:[
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  experimental: {
    appManifest: false,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'nuxt-time',
    'nuxt-swiper',
  ],
  css: ['~/assets/css/main.css'],
  pages:true,
  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: './assets/icons'
      },
    ],
  },
  ssr:true,
  ui: {
    // prefix: 'Nuxt',
    colorMode: true,
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  hooks: {
    'pages:extend'(pages) {
      const hashes: Record<string, string> = {
        '/admin/global_state': '/gfljgan5465ds',
        '/admin/users': '/x8dj29msk',
        '/admin/providers': '/p9q8w7e6r',
        '/admin/countries': '/c1m2n3b4v',
        '/admin/visa/offers': '/v0o9i8u7y',
        '/admin/visa/orders': '/v1p2l3m4k',
        '/admin/omra/offers': '/o0m9r8a7o',
        '/admin/omra/orders': '/o1m2r3a4o',
        '/admin/voyage_organise/offers': '/v0o9y8a7o',
        '/admin/voyage_organise/orders': '/v1o2y3a4o',
        '/admin/banner': '/b2n3m4k5l',
        '/admin/ccp': '/c2c3p4p5',
        '/admin/ccp/settings': '/s3t4t5i6n'
      };

      function updatePagePath(page: any) {
        if (page.path && hashes[page.path]) {
          page.path = hashes[page.path];
        }
        if (page.children) {
          page.children.forEach(updatePagePath);
        }
      }

      pages.forEach(updatePagePath);
    }
  }
});