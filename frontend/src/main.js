import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import './custom.scss'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
