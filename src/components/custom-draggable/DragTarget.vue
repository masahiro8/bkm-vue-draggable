<template>
  <div ref="self" class="target">
    id:{{ id }}
    <slot :params="params" />
  </div>
</template>
<script>
import { dragStore } from "./DragStore";
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
  methods: {
    init() {
      dragStore.setTarget({
        id: this.id,
        ref: this.$refs.self,
      });
      dragStore.setCallback(({ targets, targetsItems, lastPutItem }) => {
        const lastItem = targetsItems[this.id].find((item) => {
          return item === lastPutItem.id;
        });
        this.params = {
          listId: this.id,
          lists: targetsItems[this.id],
          lastItem: lastItem ? lastPutItem : null,
          grid: this.grid,
          fit0: this.fit0,
          limit: this.limit,
        };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.target {
  user-select: none;
  position: relative;
  background-color: #efefef;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }
}
</style>