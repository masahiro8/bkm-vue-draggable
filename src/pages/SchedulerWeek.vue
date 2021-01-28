<template>
  <PageFrame>
    <template v-slot:pageHeader> Global Header </template>
    <template v-slot:pageBodySide> Side Menu </template>
    <template v-slot:pageBodyMain>
      <CalenderHeader
        @updateDate="updateDate"
        :today="todayObject"
        :week="weekArray"
      />
      <SchedulerWeek :config="config" :week="weekArray" :lists="lists" />
    </template>
  </PageFrame>
</template>
<script>
  import { dragStore } from "../components/scheduler/DragStore";
  import PageFrame from "./UI/PageFrame";
  import SchedulerWeek from "../components/scheduler/SchedulerWeek";
  import {
    getWeekFromDate,
    getDateStringFromObject,
    getDateObjectFromString,
  } from "../components/scheduler/util/timeUtil";
  import { CONFIG_SCHEDULER } from "../statics/config";
  import CalenderHeader from "../components/scheduler/CalenderHeader";

  export default {
    data: () => {
      return {
        config: CONFIG_SCHEDULER,
        gridLines: [],
        lists: [],
        weekArray: [],
        todayObject: {},
      };
    },
    components: {
      PageFrame,
      SchedulerWeek,
      CalenderHeader,
    },
    async mounted() {
      //日付をロード
      const { year, month, day } = this.$route.query;

      //今日の日付
      const today = getDateStringFromObject({ year, month, day });
      const todayObject = getDateObjectFromString(today);
      this.todayObject = todayObject;

      this.loadData(today);

      dragStore.setUpdateCallback(() => {});
      this.setBodyOverflowHidden(true);
    },
    destroyed() {
      this.setBodyOverflowHidden(true);
    },
    methods: {
      //選択日を更新
      async updateDate(val) {
        //選択日
        this.todayObject = val;
        const today = getDateStringFromObject(val);
        this.loadData(today);
      },
      async loadData(today) {
        //1週間の日付データ
        this.weekArray = getWeekFromDate(today);

        //スケジュールをロード
        const res = await fetch("/json/schedule.json");
        if (res.ok) {
          const response = await res.json();
          dragStore.setAllItems({ schedule: response.schedule });
        } else {
          throw new Error();
        }
      },
      setBodyOverflowHidden(b) {
        document.querySelector("body").style.overflow = b ? "hidden" : "auto";
      },
    },
  };
</script>
<style lang="scss"></style>
