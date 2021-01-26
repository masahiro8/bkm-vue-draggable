<template>
  <div class="headerLabel">
    <div :style="'width:' + config.gideWidth + 'px;'"></div>
    <div class="headerLabel--labels">
      <div
        class="headerLabel--label"
        v-for="item in lists"
        :key="item.id"
        :style="'min-width:' + config.targetWidth + 'px;'"
      >
        <ScheduleLabel :item="item" />
      </div>
    </div>
  </div>
</template>
<script>
import ScheduleLabel from "../UI/ScheduleLabel";
export default {
  components: {
    ScheduleLabel,
  },
  props: {
    config: {
      type: Object,
    },
    lists: {
      type: Array,
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