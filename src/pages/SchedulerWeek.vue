<template>
  <PageFrame>
    <template v-slot:pageBodySide>
      <ScheduleMenu :bodyScroll="bodyScroll" :headerRect="headerRect" :bodyMainRect="bodyMainRect" />
      <ScheduleMenu :bodyScroll="bodyScroll" :headerRect="headerRect" :bodyMainRect="bodyMainRect" />
      <ScheduleMenu :bodyScroll="bodyScroll" :headerRect="headerRect" :bodyMainRect="bodyMainRect" />
    </template>
    <template v-slot:pageBodyMain>
      <CalenderHeader
        @updateDate="updateDate"
        :today="todayObject"
        :numbersOfDays="7"
      />
      <div class="week__main">
        <SchedulerWeek
          :config="config"
          :config_reserve_type_ids="config_reserve_type_ids"
          :week="weekArray"
          :bodyScroll="bodyScroll"
          :isHeaderTableOpen="isHeaderTableOpen"
        />
      </div>
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
  import { CONFIG_SCHEDULER } from "../components/scheduler/config";
  import {ScheduleTypes} from "../components/scheduler/store/ScheduleStore";
  import CalenderHeader from "../components/scheduler/CalenderHeader";
  import { apiConnect } from "../components/scheduler/util/apiConnect";
  import ScheduleMenu from "../components/scheduler/menu/ScheduleMenu";
  import { UIObserver } from "../components/scheduler/store/ScheduleStore";

  export default {
    data: () => {
      return {
        config: CONFIG_SCHEDULER,
        config_reserve_type_ids:null,
        gridLines: [],
        lists: [],
        weekArray: [],
        todayObject: {},
        bodyScroll:0,
        bodyMainRect:{},
        isHeaderTableOpen: true,
        headerRect:{}
      };
    },
    components: {
      PageFrame,
      SchedulerWeek,
      CalenderHeader,
      ScheduleMenu,
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
      async loadData(today) {
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
<style lang="scss" scoped>
  .week__main{
    width:100%;
    overflow-x: auto;
  }
</style>
