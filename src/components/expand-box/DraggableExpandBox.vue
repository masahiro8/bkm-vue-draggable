<template>
  <div
    class="draggable_expandbox"
    refType="expandbox"
    ref="root"
    :style="frameStyle"
  >
    <div class="content" :style="frameStyle">
      <slot />
    </div>
    <DraggableVertical
      ref="child"
      refType="child"
      :initialPosition="initialPosition.expand"
      :fitGridY="8"
      :forceHeight="16"
      @set-rect="setHandleRectBottom"
    />
    <div class="expandbox--frame" :style="frameStyle"></div>
  </div>
</template>
<script>
/*
移動と縦方向に伸縮するコンポーネント
座標の管理だけをする
*/
import DraggableVertical from "./DraggableVertical";
export default {
  data: () => {
    return {
      handleRects: {
        top: { x: null, y: null, width: null, height: null },
        bottom: { x: null, y: null, width: null, height: null },
      },
    };
  },
  props: {
    fixY: {
      type: Boolean,
    },
    fitGrid: {
      type: Object,
    },
    initialPosition: {
      type: Object,
      defaultValue: {
        expand: { x: 0, y: 50 },
      },
    },
  },
  components: {
    DraggableVertical,
  },
  computed: {
    frameStyle() {
      //グリッドのサイズにまるめる
      const fitGrid = (gridSize, value) => {
        return Math.floor(value / gridSize) * gridSize;
      };
      const height =
        this.handleRects.bottom.y - this.handleRects.bottom.margin_y;
      const _height = fitGrid(this.fitGrid.y, height);
      return `top:${this.handleRects.top.y}px;height:${_height}px;`;
    },
  },
  mounted() {},
  methods: {
    setHandleRectBottom(rect) {
      let handleRects = { ...this.handleRects };
      handleRects.bottom = rect;
      this.handleRects = handleRects;
      const expand =
        this.handleRects.bottom.y - this.handleRects.bottom.margin_y;
      this.$emit("callback-expand", expand);
    },
  },
};
</script>
<style lang="scss" scoped>
.draggable_expandbox {
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #eee;
  pointer-events: none;
}
.expandbox--frame {
  background-color: red;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
  pointer-events: none;
}
.content {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  box-sizing: border-box;
  word-break: break-all;
  text-align: left;
  overflow: hidden;
}
</style>