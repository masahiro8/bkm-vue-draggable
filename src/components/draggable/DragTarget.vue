<template>
  <div ref="self" class="target">
    <slot :params="params" />
  </div>
</template>
<script>
import { dragStore } from "../DragStore";
export default {
  data: () => {
    return {
      flag: false,
      params: {
        lists: [],
        listId: null,
        lastItem: null,
      },
    };
  },
  props: {
    id: {
      type: Number,
    },
    grid: {
      type: Object,
      defaultValue: { x: 1, y: 1 },
    },
    initItems: {
      type: Array,
      defaultValue: [],
    },
    //x=0,y=0に固定するかフラグ
    fit0: {
      type: Object,
      defaultValue: { x: false, y: false },
    },
    //上下左右の枠外への移動の許容
    limit: {
      type: Object,
      defaultValue: { vertical: true, horizontal: false },
    },
  },
  mounted() {
    this.$watch(
      () => [this.id],
      (newValue, oldValue) => {
        if (newValue[0] && !this.flag) {
          this.flag = true;
          this.init();
        }
      },
      {
        immediate: true,
      }
    );
  },
  computed: {
    getStyle() {
      const height = this.config.hour * this.config.grid15min * 4;
      return `width:${this.config.targetWidth}px;height:${height}px;`;
    },
  },
  methods: {
    init() {
      dragStore.setCallback(({ targets, targetsItems }) => {
        this.params = {
          listId: this.id,
          lists: targetsItems[this.id],
          grid: this.grid,
          fit0: this.fit0,
          limit: this.limit,
        };
      });
      dragStore.setTarget({
        id: this.id,
        ref: this.$refs.self,
        items: this.initItems,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.target {
  user-select: none;
  position: relative;
}
</style>