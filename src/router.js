import Vue from "vue";
import Router from "vue-router";
import SchedulerWeek from "./pages/SchedulerWeek";
import SchedulerDay from "./pages/SchedulerDay";
import SchedulerMonth from "./pages/SchedulerMonth";
import SchedulerList from "./pages/SchedulerList";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "SchedulerWeek",
      component: SchedulerWeek,
    },
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
    {
      path: "/month",
      name: "SchedulerMonth",
      component: SchedulerMonth,
    },
    {
      path: "/list",
      name: "SchedulerList",
      component: SchedulerList,
    },
  ],
});
