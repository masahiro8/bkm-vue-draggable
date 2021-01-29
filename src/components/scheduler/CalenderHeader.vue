<template>
  <div class="calenderHeader">
    <div class="calenderHeader--back">
      <button @click="updateDate(-7)"><img :src="arrow_back" alt="" /></button>
    </div>
    <div class="calenderHeader--title">{{ getTitle }}</div>
    <div class="calenderHeader--forward">
      <button @click="updateDate(7)">
        <img :src="arrow_forward" alt="" />
      </button>
    </div>
  </div>
</template>
<script>
  import { getDateObjectFromDateFormat } from "./util/timeUtil";
  export default {
    data: () => {
      return {
        arrow_back: require("./assets/arrow_back.svg"),
        arrow_forward: require("./assets/arrow_forward.svg"),
      };
    },
    mounted() {},
    props: {
      today: {
        type: Object,
      },
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
    },
  };
</script>
<style lang="scss" scoped>
  .calenderHeader {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
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
