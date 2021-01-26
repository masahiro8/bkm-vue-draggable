<template>
  <div class="item">
    <div class="header">
      <div class="start">{{ getStartTime }} / {{ getEndTime }}</div>
    </div>
    <div class="body"><slot /></div>
  </div>
</template>
<script>
import { dragStore } from "../custom-draggable/DragStore";
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
    startTime: {
      type: Object,
      defaultValue: { h: "00", m: "00" },
    },
    expandTime: {
      type: Object,
      defaultValue: { h: "00", m: "00" },
    },
  },
  mounted() {
    this.$watch(
      () => [this.id],
      (newValue, oldValue) => {
        // console.log("item =", newValue[0]);
        this.params = dragStore.getItemById(newValue[0]);
      },
      { immediate: true }
    );
  },
  computed: {
    getStartTime() {
      if (!this.startTime) return "";
      return `${this.startTime.h}:${this.startTime.m}`;
    },
    getEndTime() {
      if (!this.startTime || !this.expandTime) return "";
      const startMin = +this.startTime.h * 60 + +this.startTime.m;
      const totalMin = +this.expandTime.h * 60 + +this.expandTime.m;
      const endMin = startMin + totalMin;
      const h = Math.floor(endMin / 60);
      const m = endMin / 60 - h;
      return `${`${h}`.padStart(2, "0")}:${`${m * 60}`.padStart(2, "0")}`;
    },
  },
};
</script>
<style lang="scss" scoped>
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