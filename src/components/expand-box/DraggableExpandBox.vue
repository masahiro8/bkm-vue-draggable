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
      @set-enter="setEnter"
    />
    <div class="expandbox--frame" :class="getClass" :style="frameStyle"></div>
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
      isDragging: false,
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
    isMoving: {
      type: Boolean,
      defaultValue: false,
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
      let style = `top:${this.handleRects.top.y}px;height:${_height}px;`;
      return style;
    },
    getClass() {
      console.log("isMoving || isDragging", this.isMoving);
      return this.isDragging || this.isMoving ? "dragging" : null;
    },
  },
  mounted() {},
  methods: {
    setEnter(val) {
      this.isDragging = val;
    },
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
  &.dragging {
    background-color: #ff8888;
  }
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