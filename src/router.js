import Vue from "vue";
import Router from "vue-router";
import SchedulerWeek from "./pages/SchedulerWeek";
import SchedulerDay from "./pages/SchedulerDay";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/week",
      name: "SchedulerWeek",
      component: SchedulerWeek,
    },
    {
      path: "/day",
      name: "SchedulerDay",
      component: SchedulerDay,
    },
  ],
});
