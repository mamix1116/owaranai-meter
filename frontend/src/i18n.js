import Vue from 'vue'
import VueI18n from 'vue-i18n'

const locales = [
  { //default
    code: 'ja',
    iso: 'ja-JP',
    displayName: '日本語',
    file: 'ja.json'
  }
]

let message = {}
const locale = locales.filter(
  v => v.code === window.navigator.language.toLowerCase().split('-')[0]
)[0] || locales[0]

message[locale.code] = require(`./assets/i18n/${locale.file}`)

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: locale.code,
  fallbackLocale: 'ja',
  messages: message
})
