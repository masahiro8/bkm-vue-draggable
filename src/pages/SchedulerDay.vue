<template>
  <PageFrame>
    <template v-slot:pageHeader> Global Header </template>
    <template v-slot:pageBodySide> Side Menu </template>
    <template v-slot:pageBodyMain>
      <CalenderHeader
        @updateDate="updateDate"
        :today="todayObject"
        :numbersOfDays="1"
      />
      <SchedulerWeek :config="config" :config_reserve_type_ids="config_reserve_type_ids" :week="weekArray" />
    </template>
  </PageFrame>
</template>
<script>
  import { dragStore } from "../components/scheduler/DragStore";
  import PageFrame from "./UI/PageFrame";
  import SchedulerWeek from "../components/scheduler/SchedulerWeek";
  import {
    getDateStringFromObject,
    getDateObjectFromString,
  } from "../components/scheduler/util/timeUtil";
  import { CONFIG_SCHEDULER,CONFIG_TYPE_IDS } from "../statics/config";
  import CalenderHeader from "../components/scheduler/CalenderHeader";
  import { apiConnect } from "../components/scheduler/util/apiConnect";

  export default {
    data: () => {
      return {
        config: CONFIG_SCHEDULER,
        config_reserve_type_ids: CONFIG_TYPE_IDS,
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
        dragStore.resetTargets();

        //1週間の日付データ
        this.weekArray = [today];

        //Firebaseから取得
        const schedule = await apiConnect.getItems({
          year: this.todayObject.year,
          month: this.todayObject.month,
          day: null,
        });
        dragStore.setAllItems({ schedule });
      },
      setBodyOverflowHidden(b) {
        document.querySelector("body").style.overflow = b ? "hidden" : "auto";
      },
    },
  };
</script>
<style lang="scss"></style>
