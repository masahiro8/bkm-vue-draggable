<template>
  <PageFrameSingle>
    <template v-slot:pageBodyMain>
      <CalenderHeaderMonth
        @updateDate="updateDate"
        @updateMonth="updateMonth"
        :today="todayObject"
        :scheduleTypeId="scheduleTypeId"
        :holiday="holiday"
      />
      <div>
        <SchedulerMonth
          :todayObject="todayObject"
          :holiday="holiday"
          @updateDate="updateDate"
        />
      </div>
    </template>
  </PageFrameSingle>
</template>
<script>
  import { dragStore } from "../components/scheduler/DragStore";
  import PageFrameSingle from "../components/scheduler/UI/PageFrameSingle";
  import CalenderHeaderMonth from "../components/scheduler/CalenderHeaderMonth";
  import SchedulerMonth from "../components/scheduler/SchedulerMonth";
  import {
    getDateStringFromObject,
    getDateObjectFromString,
    getDayFromDate
  } from "../components/scheduler/util/timeUtil";
  import { CONFIG_SCHEDULER,SCHEDULER_TYPE,HOLIDAY_TYPE } from "../components/scheduler/config";
  import { ScheduleTypes } from "../components/scheduler/store/ScheduleStore";
  import { apiConnect } from "../components/scheduler/util/apiConnect";
  import { Calender } from "../components/scheduler/util/calender";

  export default {
    data: () => {
      return {
        config: CONFIG_SCHEDULER,
        config_reserve_type_ids: null,
        gridLines: [],
        lists: [],
        todayObject: {},
        holiday:{},//休日
        scheduleTypeId:SCHEDULER_TYPE.MONTH.id
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

      this.loadData();
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
        this.loadData();
      },
      async updateMonth(val){
        //選択日
        this.todayObject = val;
        this.loadData();
      },
      async loadData() {
        dragStore.resetTargets();

        //土日を指定
        const {year,month,day} = this.todayObject;
        const cal = Calender({year,month,day});
        let calenderList = cal.getDaysOfList();

        let holiday = {};
        const _month = `${month}`.padStart(2,"0");
        calenderList = calenderList.map(item=>{
          const day = `${item.day}`.padStart(2,"0");
          return `${year}-${_month}-${day}`;
        })
        calenderList.forEach(item => {
          let h = HOLIDAY_TYPE.WEE;
          const w = getDayFromDate(item);
          if( w === 0 ) h = HOLIDAY_TYPE.SUN;
          if( w === 6 ) h = HOLIDAY_TYPE.SAT;
          holiday[item] = h;
        });
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
<style lang="scss"></style>
