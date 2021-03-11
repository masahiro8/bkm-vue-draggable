<template>
  <ScheduleHeaderTable :isTableOpen="isTableOpen">
    <template v-slot:cell1>
      <span class="headerTable--label">申請</span>
    </template>
    <template v-slot:cell2>
      <span class="headerTable--label">勤務</span>
    </template>
  </ScheduleHeaderTable>
</template>
<script>
import ScheduleHeaderTable from "./ScheduleHeaderTable";
export default {
  props: {
    isTableOpen:{
      type:Boolean
    }
  },
  components:{
    ScheduleHeaderTable
  }
}
</script>
<style lang="scss" scoped>
  @import "../ui.scss";
  .headerTable--label{
    color:#898A8D;
    font-size:8px;
  }
</style>