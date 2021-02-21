import Vue from 'vue'
import VueRouter from 'vue-router'
import Total from '@/pages/Total'
import TryMeter from '@/pages/TryMeter'
import { i18n, navigatorLanguage } from '@/i18n'
import { SUPPORTED_LOCALES } from '@/locales'
import store from '@/store'

Vue.use(VueRouter)

function getLocaleRegex() {
  let reg = ''
  SUPPORTED_LOCALES.forEach((locale, index) => {
    reg = `${reg}${locale.code}${
      index !== SUPPORTED_LOCALES.length - 1 ? '|' : ''
    }`
  })
  return `(${reg})`
}

function getLocale(locale='ja') {
  return SUPPORTED_LOCALES.find(loc => loc.code === locale)
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: `/:lang${getLocaleRegex()}?`,
      component: {
        render(c) {
          return c('router-view')
        }
      },
      children: [
        { path: '', component: Total, name: 'site_top' },
        { path: 'try_meter', component: TryMeter, name: 'try_meter' }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let language = getLocale(to.params.lang)
  if (!to.params.lang) {
    language = getLocale(navigatorLanguage)
  }
  store.dispatch('setLocale', language).then(() => {
    if (i18n.locale !== language.code) {
      i18n.locale = language.code
    }
    next()
  })
})

export default router
