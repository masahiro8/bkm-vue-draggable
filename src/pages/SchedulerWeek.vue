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
        :scheduleTypeId="scheduleTypeId"
        :holiday="holiday"
      />
      <div class="week__main">
        <SchedulerWeek
          :config="config"
          :config_reserve_type_ids="config_reserve_type_ids"
          :week="weekArray"
          :bodyScroll="bodyScroll"
          :isHeaderTableOpen="isHeaderTableOpen"
          :holiday="holiday"
        />
      </div>
    </template>
  </PageFrame>
</template>
<script>
  import { dragStore } from "../components/scheduler/DragStore";
  import PageFrame from "../components/scheduler/UI/PageFrame";
  import SchedulerWeek from "../components/scheduler/SchedulerWeek";
  import {
    getWeekFromDate,
    getDateStringFromObject,
    getDateObjectFromString,
    getDayFromDate
  } from "../components/scheduler/util/timeUtil";
  import { CONFIG_SCHEDULER,SCHEDULER_TYPE,HOLIDAY_TYPE } from "../components/scheduler/config";
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
        holiday:{},//休日
        //ここからUIObserver
        bodyScroll:0,
        bodyMainRect:{},
        headerRect:{},
        isHeaderTableOpen: true,
        scheduleTypeId:SCHEDULER_TYPE.WEEK.id
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
      const { year, month, day } = this.$route.params;

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
        // console.log("UIObserver",{...this.headerRect});
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

        //土日を指定
        let holiday = {};
        this.weekArray.forEach(item => {
          let h = HOLIDAY_TYPE.WEE;
          const w = getDayFromDate(item);
          if( w === 0 ) h = HOLIDAY_TYPE.SUN;
          if( w === 6 ) h = HOLIDAY_TYPE.SAT;
          holiday[item] = h;
        });
        console.log("holi",holiday);
        this.holiday = holiday;

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
