import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { SUPPORTED_LOCALES } from '@/locales'

let message = {}
SUPPORTED_LOCALES.forEach(item => {
  message[item.code] = require(`./assets/i18n/${item.file}`)
})

export const navigatorLanguage = window.navigator.language
  .toLowerCase()
  .split('-')[0]
const locale =
  SUPPORTED_LOCALES.filter(v => v.code === navigatorLanguage)[0] ||
  SUPPORTED_LOCALES[0]

Vue.use(VueI18n)

export const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: locale.code,
  fallbackLocale: 'ja',
  messages: message
})
