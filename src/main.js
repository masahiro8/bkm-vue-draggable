import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { initFirebase } from "./api/Firebase/api";

initFirebase();
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
