<template>
  <div class="calenderHeader">
    <div>
      <button @click="updateDate(-7)">prev</button>
    </div>
    <div class="title">{{ getTitle }}</div>
    <div>
      <button @click="updateDate(7)">next</button>
    </div>
  </div>
</template>
<script>
  import { getDateObjectFromDateFormat } from "./util/timeUtil";
  export default {
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
</style>
