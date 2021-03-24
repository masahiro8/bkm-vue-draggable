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

      this.setBodyOverflowHidden(true);

      //日付をロード
      this.$watch(
        ()=>[this.$route.params],
        ( newValue )=>{
          if( newValue[0] ){
            const { year, month } = newValue[0];
            this.init({ year, month } );
          }
        },
        {
          immediate: true,
          deep: true
        }
      )
    },
    destroyed() {
      this.setBodyOverflowHidden(true);
    },
    methods: {
      init({ year, month }){
        //今日の日付
        const today = getDateStringFromObject({ year, month, day:1 });
        const todayObject = getDateObjectFromString(today);
        this.todayObject = todayObject;
        this.loadData();
      },
      //選択日を更新
      async updateDate(val) {
        const {year,month,day} = val;
        this.$router.push({
          name: 'SchedulerDay-yyyymmdd',
          params: { year, month, day}
        });
      },
      async updateMonth(val){
        //選択日
        //TODO: history backで再描画されない
        const {year,month} = val;
        this.$router.push({
          name: 'SchedulerMonth-yyyymm',
          params: { year,month:`${month}`.padStart(2,"0")}
        });
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
