import Vue from "vue";
import Router from "vue-router";
import SchedulerWeek from "./pages/SchedulerWeek";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "SchedulerWeek",
      component: SchedulerWeek
    }
  ]
});
