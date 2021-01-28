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

      //1週間の日付データ
      const weekDate = getWeekFromDate(today);
      this.weekArray = weekDate;
      console.log(weekDate);

      //スケジュールをロード
      const res = await fetch("/json/schedule.json");
      if (res.ok) {
        const response = await res.json();
        this.lists = response.schedule;
      } else {
        throw new Error();
      }

      dragStore.setUpdateCallback(({ schedule }) => {
        console.log("Published ", schedule);
      });
      this.setBodyOverflowHidden(true);
    },
    destroyed() {
      this.setBodyOverflowHidden(true);
    },
    methods: {
      //選択日を更新
      updateDate(val) {
        const today = getDateStringFromObject(val);

        //1週間の日付データ
        const weekDate = getWeekFromDate(today);
        this.weekArray = weekDate;
        this.todayObject = val;

        console.log(today, val);
      },
      updateWeeks() {},
      setBodyOverflowHidden(b) {
        document.querySelector("body").style.overflow = b ? "hidden" : "auto";
      },
    },
  };
</script>
<style lang="scss"></style>
