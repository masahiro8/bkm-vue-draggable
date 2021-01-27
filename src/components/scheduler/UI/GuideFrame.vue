<template>
  <div class="frame" :style="getLabelStyle">
    <Guide
      v-for="item in gridLines"
      :key="item"
      :index="item"
      :min15px="config.grid15min"
    />
  </div>
</template>
<script>
import Guide from "./Guide";
export default {
  data: () => {
    return {
      gridLines: [],
    };
  },
  components: {
    Guide,
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
  computed: {
    getLabelStyle() {
      const height = this.config.hour * this.config.grid15min * 4;
      return `width:${this.config.gideWidth}px;height:${height}px;`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.frame {
  user-select: none;
  position: relative;
}
</style>