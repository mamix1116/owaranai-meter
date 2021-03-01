import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

const plugin: Plugin = function ({ $axios }, inject) {
  const api = $axios.create({
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFTOKEN',
  })

  inject('api', api)
}
export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $api: NuxtAxiosInstance
  }
}
