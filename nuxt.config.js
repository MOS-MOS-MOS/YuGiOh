export default {
  target: 'static',
  
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MDルムマ画像くん',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'MDルムマ画像くん' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://yugioh-md.netlify.app/' },
      { hid: 'og:title', property: 'og:title', content: 'MDルムマ画像くん' },
      { hid: 'og:description', property: 'og:description', content: '共通ディスクリプション' },
      { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/MOS-MOS-MOS/YuGioh/master/static/background.png' },
      { name: 'twitter:card', content: 'summary' }//twitterの画像サイズ
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/vue-konva',
      mode: 'client'
    },
    // syntax.vue
    {
      src: '~/plugins/vue2editor',
      mode: 'client'
    },
    {
      src: '~/plugins/highlight',
      mode: 'client'
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    '@nuxtjs/dotenv',
    [
      '@nuxtjs/google-gtag',
      {
        id: process.env.GAID,
        debug: false
      }
    ],
    'nuxt-svg-loader'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // transpile: ['vue-konva']
  }
}
