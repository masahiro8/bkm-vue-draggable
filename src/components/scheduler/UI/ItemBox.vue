<template>
  <div class="item" :class="getClass">
    <div class="header">
      <div class="start">{{ getStartTime }} 〜 {{ getEndTime }}</div>
    </div>
    <div class="body"><slot /></div>
  </div>
</template>
<script>
import { dragStore } from "../DragStore";
import { getEndTime } from "../util/timeUtil";

export default {
  data: () => {
    return {
      params: { id: "" },
    };
  },
  props: {
    id: {
      type: Number,
    },
    targetId: {
      type: Number,
    },
    startTime: {
      type: Object,
      defaultValue: { h: "00", m: "00" },
    },
    expandTime: {
      type: Object,
      defaultValue: { h: "00", m: "00" },
    },
    isMoving: {
      type: Boolean,
    },
    isDragging: {
      type: Boolean,
    },
  },
  mounted() {
    this.$watch(
      () => [this.id, this.targetId],
      (newValue) => {
        // console.log("item =", newValue[0]);
        this.params = dragStore.getItemById(newValue[0]);
      },
      { immediate: true }
    );
  },
  computed: {
    getClass() {
      let style = "";
      style += this.isMoving ? "isMoving " : "";
      style += this.isDragging ? "isDragging " : "";
      return style;
    },
    getStartTime() {
      if (!this.startTime) return "";
      return `${this.startTime.h}:${this.startTime.m}`;
    },
    getEndTime() {
      const time = getEndTime({
        startTime: this.startTime,
        expandTime: this.expandTime,
      });
      return `${time.h}:${time.m}`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.item {
  background-color: $item-background-color;
  height: 100%;
  border-radius: 4px;
  &.isMoving {
    opacity: 0.5;
  }
  &.isDragging {
    opacity: 0.5;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 2px 4px;
}

.body {
  padding: 2px 4px;
}

.start {
  font-size: 10px;
  height: 12px;
  line-height: 12px;
  padding: 2px;
  box-sizing: border-box;
  color: white;
}
</style>