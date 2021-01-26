<template>
  <div
    class="grid-line"
    :class="is60Min ? 'min60' : null"
    :style="getStyle()"
  ></div>
</template>
<script>
export default {
  data: () => {
    return {
      is60Min: false,
    };
  },
  props: {
    min15px: {
      type: Number,
    },
    index: {
      type: Number,
    },
  },
  mounted() {
    this.$watch(
      () => [this.index],
      (newValue, oldValue) => {
        const cal = (val) => {
          const r = val / 4;
          return 0 === r - Math.floor(r) ? true : false;
        };
        this.is60Min = cal(newValue[0]);
      },
      {
        immediate: true,
      }
    );
  },
  methods: {
    getStyle() {
      return `top:${this.min15px * this.index}px;`;
    },
  },
};
</script>
<style lang="scss" scoped>
.grid-line {
  position: absolute;
  height: 1px;
  width: 100%;
  left: 0;
  background-color: #e1e1e1;
  &.min60 {
    background-color: #aaa;
  }
}
</style>