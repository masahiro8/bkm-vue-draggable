<template>
  <div class="grid-line" :class="is60Min ? 'min60' : null" :style="getStyle()">
    {{ label }}
  </div>
</template>
<script>
const MIN_RATE = 60 / 100;
export default {
  data: () => {
    return {
      label: "",
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
      (newValue) => {
        const cal0 = (val) => {
          const r = val / 4;
          return 0 === r - Math.floor(r) ? true : false;
        };
        this.is60Min = cal0(newValue[0]);

        const getTime = (val) => {
          const r = val / 4;
          return {
            h: `${Math.floor(r)}`.padStart(2, "0"),
            m: `${Math.ceil((r - Math.floor(r)) * MIN_RATE * 100)}`.padStart(
              2,
              "0"
            ),
          };
        };
        const { h, m } = getTime(newValue[0]);
        this.label = `${h}:${m}`;
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
@import "./ui.scss";
.grid-line {
  position: absolute;
  height: 12px;
  width: 100%;
  right: 0;
  color: #979797;
  font-size: 8px;
  text-align: right;
  padding-right: 4px;
  opacity: 0;
  transform: translateY(-12px);

  &.min60 {
    opacity: 1;
  }
  &:before{
    content:'';
    position: absolute;
    top:-3px;
    right:0;
    width:90%;
    height:1px;
    background-color: #DADADA;
  }
}
</style>