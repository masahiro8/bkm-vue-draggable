<template>
  <PageFrameSingle>
    <template v-slot:pageBodyMain>
      <CalenderHeaderMonth
        @updateDate="updateDate"
        @updateMonth="updateMonth"
        :today="todayObject"
        :scheduleTypeId="scheduleTypeId"
      />
      <div>
        <SchedulerMonth
          :todayObject="todayObject"
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
  } from "../components/scheduler/util/timeUtil";
  import { CONFIG_SCHEDULER,SCHEDULER_TYPE } from "../components/scheduler/config";
  import { ScheduleTypes } from "../components/scheduler/store/ScheduleStore";
  import { apiConnect } from "../components/scheduler/util/apiConnect";

  export default {
    data: () => {
      return {
        config: CONFIG_SCHEDULER,
        config_reserve_type_ids: null,
        gridLines: [],
        lists: [],
        todayObject: {},
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
