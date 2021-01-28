<template>
  <div class="headerLabel">
    <div :style="'width:' + config.gideWidth + 'px;'"></div>
    <div class="headerLabel--labels">
      <div
        class="headerLabel--label"
        v-for="(date, index) in week"
        :key="index"
        :style="'min-width:' + config.targetWidth + 'px;'"
      >
        <ScheduleLabel :label="getLabel(date)" />
      </div>
    </div>
  </div>
</template>
<script>
  import ScheduleLabel from "./UI/ScheduleLabel";
  import { getLangDateFromDateFormat } from "./util/timeUtil";
  export default {
    components: {
      ScheduleLabel,
    },
    props: {
      config: {
        type: Object,
      },
      week: {
        type: Array,
      },
    },
    methods: {
      getLabel(date) {
        const label = getLangDateFromDateFormat({
          lang: "ja",
          date: date,
        });
        return `${label.dd}(${label.dayofweek})`;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .headerLabel {
    display: flex;
  }
  .headerLabel--labels {
    display: flex;
    width: 100%;
  }
  .headerLabel--label {
    flex: 1;
  }
</style>
