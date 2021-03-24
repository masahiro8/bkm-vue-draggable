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
      path: "/week/:year/:month/:day",
      name: "SchedulerWeek-yyyymmdd",
      component: SchedulerWeek,
    },
    {
      path: "/day",
      name: "SchedulerDay",
      component: SchedulerDay,
    },
    {
      path: "/day/:year/:month/:day",
      name: "SchedulerDay-yyyymmdd",
      component: SchedulerDay,
    },
    {
      path: "/month",
      name: "SchedulerMonth",
      component: SchedulerMonth,
    },
    {
      path: "/month/:year/:month",
      name: "SchedulerMonth-yyyymm",
      component: SchedulerMonth,
    },
    {
      path: "/list",
      name: "SchedulerList",
      component: SchedulerList,
    },
  ],
});
