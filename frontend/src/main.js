import Vue from "vue";
import VueGtag from "vue-gtag";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "@/assets/global.scss";
import "@/assets/custom.scss";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = process.env.NODE_ENV === "production";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.use(
  VueGtag,
  {
    config: { id: process.env.VUE_APP_GOOGLE_ANALYTICS },
    pageTrackerTemplate(to) {
      return {
        page_title: "try meter",
        page_path: to.path
      };
    }
  },
  router
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
