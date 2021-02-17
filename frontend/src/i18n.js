import Vue from 'vue'
import VueI18n from 'vue-i18n'

const locales = [
  {
    code: 'ja',
    iso: 'ja-JP',
    displayName: '日本語',
    file: 'ja.json'
  }
]

let message = {}
const locale = locales.filter(v => v.iso === window.navigator.language)

message[locale[0].code] = require(`./assets/i18n/${locale[0].file}`)

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale,
  fallbackLocale: 'ja',
  messages: message
})
