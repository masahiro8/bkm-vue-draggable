<template>
  <div class="calenderHeader">
    <div class="calenderHeader--today">
      <button @click="onClickToday()">今日</button>
    </div>
    <div class="calenderHeader--center">
      <div class="calenderHeader--back">
        <button @click="updateDate(-numbersOfDays)">
          <img :src="arrow_back" alt="" />
        </button>
      </div>
      <div class="calenderHeader--title">{{ getTitle }}</div>
      <div class="calenderHeader--forward">
        <button @click="updateDate(numbersOfDays)">
          <img :src="arrow_forward" alt="" />
        </button>
      </div>
    </div>
    <CalenderHeaderTab :scheduleTypeId="scheduleTypeId" />
  </div>
</template>
<script>
  import { getDateObjectFromDateFormat } from "./util/timeUtil";
  import CalenderHeaderTab from "./UI/CalenderHeaderTab";
  export default {
    data: () => {
      return {
        arrow_back: require("./assets/arrow_back.svg"),
        arrow_forward: require("./assets/arrow_forward.svg"),
      };
    },
    components:{
      CalenderHeaderTab
    },
    mounted() {},
    props: {
      today: {
        type: Object,
      },
      numbersOfDays: {
        type: Number,
        default: 1,
      },
      scheduleTypeId:{
        type: Number
      }
    },
    computed: {
      getTitle() {
        return `${this.today.year}年${this.today.month}月`;
      },
    },
    methods: {
      updateDate(n) {
        const ndate = new Date(
          this.today.year,
          this.today.month - 1,
          this.today.day
        );
        ndate.setDate(ndate.getDate() + n);
        const dateObject = getDateObjectFromDateFormat(ndate);
        this.$emit("updateDate", dateObject);
      },
      onClickToday() {
        const ndate = new Date();
        const dateObject = getDateObjectFromDateFormat(ndate);
        this.$emit("updateDate", dateObject);
      },
    },
  };
</script>
<style lang="scss" scoped>
@import "./UI/uiCalenderHeader.scss";
</style>
