<template>
  <div class="frame">
    <Grid
      v-for="item in gridLines"
      :key="item"
      :index="item"
      :min15px="config.grid15min"
    />
  </div>
</template>
<script>
import Grid from "./Grid";
export default {
  data: () => {
    return {
      gridLines: [],
    };
  },
  components: {
    Grid,
  },
  props: {
    config: {
      type: Object,
    },
  },
  mounted() {
    const gridlines = [...Array(this.config.hour * 4)].map((item, i) => i + 1);
    this.gridLines = gridlines;
  },
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.frame {
  user-select: none;
  position: relative;
  background-color: #efefef;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    box-sizing: border-box;
    background-color: $grid-color;
  }
}
</style>