<template>
  <PageFrameSingle>
    <template v-slot:pageBodyMain>
      <CalenderHeaderMonth
        @updateDate="updateDate"
        @updateMonth="updateMonth"
        :today="todayObject"
      />
      <div>
        <SchedulerMonth :todayObject="todayObject" @updateDate="updateDate" />
      </div>
    </template>
  </PageFrameSingle>
</template>
<script>
  import { dragStore } from "../components/scheduler/DragStore";
  import PageFrameSingle from "./UI/PageFrameSingle";
  import CalenderHeaderMonth from "../components/scheduler/CalenderHeaderMonth";
  import SchedulerMonth from "../components/scheduler/SchedulerMonth";
  import {
    getDateStringFromObject,
    getDateObjectFromString,
    getWeekFromDate
  } from "../components/scheduler/util/timeUtil";
  import { CONFIG_SCHEDULER } from "../components/scheduler/config";
  import { ScheduleTypes } from "../components/scheduler/store/ScheduleStore";
  import { apiConnect } from "../components/scheduler/util/apiConnect";
  import { UIObserver } from "../components/scheduler/store/ScheduleStore";

  export default {
    data: () => {
      return {
        config: CONFIG_SCHEDULER,
        config_reserve_type_ids: null,
        gridLines: [],
        lists: [],
        weekArray: [],
        todayObject: {},
        //ここからUIObserver
        bodyScroll:0,
        bodyMainRect:{},
        headerRect:{},
        isHeaderTableOpen: true,
      };
    },
    components: {
      PageFrameSingle,
      CalenderHeaderMonth,
      SchedulerMonth
    },
    async mounted() {
      
      //タイプを取得
      ScheduleTypes.getCallback(values=>{
        this.config_reserve_type_ids = values;
      });

      //日付をロード
      const { year, month, day } = this.$route.query;

      //今日の日付
      const today = getDateStringFromObject({ year, month, day });
      const todayObject = getDateObjectFromString(today);
      this.todayObject = todayObject;

      this.loadData(today);
      this.setBodyOverflowHidden(true);
      
      //スクロール取得
      UIObserver.getCallback((value)=>{
        this.bodyScroll = value["bodyScroll"];
        this.isHeaderTableOpen = value["isHeaderTableOpen"];
        this.headerRect = value["headerRect"];
        this.bodyMainRect = value["bodyMainRect"];
        // console.log("UIObserver",value);
      })
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
      async updateMonth(val){
        //選択日
        this.todayObject = val;
        const today = getDateStringFromObject(val);
        console.log(today);
        this.loadData(today);
      },
      async loadData(today) {
        dragStore.resetTargets();

        //1週間の日付データ
        this.weekArray = getWeekFromDate(today);
        dragStore.resetTargets();

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
