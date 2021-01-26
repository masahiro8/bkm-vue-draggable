<template>
  <div
    class="draggable_expandbox"
    refType="expandbox"
    ref="root"
    :style="frameStyle"
  >
    <div class="content" :style="frameStyle">
      <slot :expandTime="expandTime" />
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
import { getTimeFromYpx } from "../../util/timeUtil";
export default {
  data: () => {
    return {
      isDragging: false,
      handleRects: {
        top: { x: null, y: null, width: null, height: null },
        bottom: { x: null, y: null, width: null, height: null },
      },
      params: {
        endTime: { h: "00", m: "00" },
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
    target: {
      type: Element,
    },
  },
  components: {
    DraggableVertical,
  },
  computed: {
    frameStyle() {
      const height =
        this.handleRects.bottom.y - this.handleRects.bottom.margin_y;
      const _height = this.getFitGrid(this.fitGrid.y, height); //グリッドのサイズにまるめる

      //ボックスの中はローカル領域なのでピクセルで指定しないといけない
      let style = `top:${this.handleRects.top.y}px;height:${_height}px;`;
      return style;
    },
    getClass() {
      return this.isDragging || this.isMoving ? "dragging" : null;
    },
    expandTime() {
      const height =
        this.handleRects.bottom.y - this.handleRects.bottom.margin_y;
      const _height = this.getFitGrid(this.fitGrid.y, height); //グリッドのサイズにまるめる
      const time = getTimeFromYpx({
        pixel: _height,
        grid15min: this.fitGrid.y,
      });
      return time;
    },
  },
  mounted() {},
  methods: {
    getFitGrid(gridSize, value) {
      return Math.floor(value / gridSize) * gridSize;
    },
    //座標を正規化
    getNormalizedPosition({ y, height }) {
      const targetRect = this.target
        ? this.target.getBoundingClientRect()
        : null;
      return targetRect
        ? {
            height: height / targetRect.height,
            y: y / targetRect.height,
          }
        : { x: 0, y: 0 };
    },
    setEnter(val) {
      this.isDragging = val;
    },
    setHandleRectBottom(rect) {
      let handleRects = { ...this.handleRects };
      handleRects.bottom = rect;
      this.handleRects = handleRects;
      const expand =
        this.handleRects.bottom.y - this.handleRects.bottom.margin_y;
      const expandTime = this.expandTime;
      this.$emit("callback-expand", { expand, expandTime });
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