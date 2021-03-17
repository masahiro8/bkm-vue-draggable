<template>
  <div class="calenderHeader">
    <div class="calenderHeader--today">
      <button @click="onClickToday()">今日</button>
    </div>
    <div class="calenderHeader--center">
      <div class="calenderHeader--back">
        <button @click="updateMonth(-1)">
          <img :src="arrow_back" alt="" />
        </button>
      </div>
      <div class="calenderHeader--title">{{ getTitle }}</div>
      <div class="calenderHeader--forward">
        <button @click="updateMonth(1)">
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
      updateMonth(n) {
        const ndate = new Date(
          this.today.year,
          this.today.month - 1,
          this.today.day
        );
        ndate.setMonth(ndate.getMonth() + n);
        const dateObject = getDateObjectFromDateFormat(ndate);
        this.$emit("updateMonth", dateObject);
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
  .calenderHeader {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
  }

  .calenderHeader--center {
    display: flex;
    justify-content: center;
  }

  .calenderHeader--today {
    button {
      background: none;
      border: none;
      outline: none;
      padding: 4px 8px;
      text-decoration: none;
      color: black;
      opacity: 0.5;
      font-size:18px;
      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }
  }

  .calenderHeader--title {
    font-weight: 600;
    font-size: 18px;
    height: 36px;
    line-height: 36px;
    margin: 0 16px;
  }

  .calenderHeader--back,
  .calenderHeader--forward {
    height: 36px;
    display: flex;
    align-items: center;
    button {
      background: none;
      border: none;
      opacity: 0.5;
      outline: none;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
</style>
