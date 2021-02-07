import Vue from "vue";
import VueRouter from "vue-router";
import Total from "@/pages/Total";
import TryMeter from "@/pages/TryMeter";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Total },
    { path: "/try_meter", component: TryMeter },
    { path: "*", redirect: "/" }
  ]
});

export default router;
