<template>
  <PageFrame>
    <template v-slot:pageHeader> Global Header </template>
    <template v-slot:pageBodySide> Side Menu </template>
    <template v-slot:pageBodyMain
      ><SchedulerWeek :config="config" :week="week" :lists="lists"
    /></template>
  </PageFrame>
</template>
<script>
import { dragStore } from "../components/scheduler/DragStore";
import PageFrame from "./UI/PageFrame";
import SchedulerWeek from "../components/scheduler/SchedulerWeek";
import { getWeekFromDate } from "../components/scheduler/util/timeUtil";
import { CONFIG_SCHEDULER } from "../statics/config";

export default {
  data: () => {
    return {
      config: CONFIG_SCHEDULER,
      gridLines: [],
      lists: [],
      week: [],
    };
  },
  components: {
    PageFrame,
    SchedulerWeek,
  },
  async mounted() {
    //日付をロード
    const { year, month, day } = this.$route.query;
    const weekDate = getWeekFromDate(
      year && month && day ? `${year}-${month}-${day}` : null
    );
    this.week = weekDate;
    console.log(weekDate);

    //スケジュールをロード
    const res = await fetch("/json/schedule.json");
    if (res.ok) {
      const response = await res.json();
      this.lists = response.schedule;
    } else {
      throw new Error();
    }

    dragStore.setUpdateCallback(({ items }) => {
      console.log("Published ", items);
    });
    this.setBodyOverflowHidden(true);
  },
  destroyed() {
    this.setBodyOverflowHidden(true);
  },
  methods: {
    setBodyOverflowHidden(b) {
      document.querySelector("body").style.overflow = b ? "hidden" : "auto";
    },
  },
};
</script>
<style lang="scss">
</style>