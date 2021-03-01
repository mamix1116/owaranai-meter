export default {
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'ja',
      prefix: 'og: http://ogp.me/ns#',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:type', content: 'website' },
      { property: 'fb:app_id', content: '812810555941690' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@mamix1116' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon-192x192.png' },
      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: '/apple-touch-icon-180x180.png',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/global.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/api.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/google-analytics',
    '@nuxtjs/style-resources',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-i18n',
  ],

  bootstrapVue: {
    icons: true,
  },

  i18n: {
    locales: [
      { code: 'ja', iso: 'ja-JP', file: 'ja.json' },
      { code: 'ko', iso: 'ko-KR', file: 'ko.json' },
      { code: 'zh-tw', iso: 'zh-TW', file: 'zh-tw.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'ja',
    lazy: true,
    langDir: 'assets/i18n/',
    vueI18n: {
      fallbackLocale: 'ja',
    },
    seo: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },

  proxy: {
    '^/api/': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/': '/api/' },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  styleResources: {
    scss: '@/assets/scss/variables.scss',
  },

  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID, // Use as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID,
    },
    axios: {
      baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000/api/v1',
    },
  },
}
