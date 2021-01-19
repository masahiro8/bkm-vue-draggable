<template>
  <div ref="self" class="box" :class="getClass()" :style="getStyle()">
    id:
    <slot :params="params" />
  </div>
</template>
<script>
// import { roundGrid } from "../../util/roundGrid";
import { hitArea } from "../../util/hitArea";

//ポインター位置を返すラッパー
const getPointer = (e) => {
  return { x: e.clientX, y: e.clientY };
};

//ターゲットのローカル座標に変換
const convertToLocalPoint = (selfPoint, parentRect) => {
  return {
    x: selfPoint.x - parentRect.x,
    y: selfPoint.y - parentRect.y,
  };
};

//値を標準化
// const getNormalizeValue = (self, targetRect) => {
//   const _rect = self.getBoundingClientRect();
//   return (_rect.y - targetRect.y) / (targetRect.height - _rect.height);
// };

// //標準化した値からピクセルを検出
// const getPixRectFromNormalRect = (self, targetRect, normalPos) => {
//   const _rect = self.getBoundingClientRect();
//   console.log("getPixRectFromNormalRect", _rect, targetRect, normalPos);
//   const x = 100 / targetRect.width - _rect.width * normalPos.y;
//   const y = 100 / targetRect.height - _rect.height * normalPos.y;
//   return { x, y };
// };

export default {
  data: () => {
    return {
      self: null,
      rect: null,
      isMove: false,
      isEnter: false,
      movingpoint: null,
      mousepoint_margin: { x: 0, y: 0 },
      mousepoint: null,
      params: {
        rect: { x: null, y: null, width: null, height: null },
      },
    };
  },
  props: {
    name: {
      type: String,
    },
    targetRect: {
      type: Object,
      defaultValue: { x: 0, y: 0, width: 0, height: 0 },
    },
    initialPosition: {
      type: Object,
      defaultValue: { x: 0, y: 0 },
    },
    //y方向のグリッド吸着
    fitGridY: {
      type: Number,
      defaultValue: 1,
    },
    fixY: {
      type: Boolean,
      defaultValue: false,
    },
    forceHeight: {
      type: Number,
    },
  },
  mounted() {
    //新しくリストに追加されたItemはmountedで作られるので、ここで検知する
    if (!this.fixY) {
      this.addDragEvent();
    } else {
      this.rect = this.$refs.self.getBoundingClientRect();
    }

    this.$watch(
      () => [this.initialPosition],
      (newValue, oldValue) => {
        const pos = newValue[0];
        this.movingpoint = pos;
        this.UpdateParam(pos);
      },
      {
        immediate: true,
        deep: true,
      }
    );

    this.$watch(
      () => [this.movingpoint],
      (newValue, oldValue) => {
        const pos = newValue[0];
        this.movingpoint = pos;
        this.UpdateParam(pos);
        this.callbackRect();
      },
      {
        immediate: true,
        deep: true,
      }
    );
  },
  beforeDestroy() {
    this.removeDragEvent();
  },
  methods: {
    UpdateParam(pos) {
      let params = { ...this.params };
      params.rect.x = this.rect.x;
      params.rect.y = this.rect.y;
      params.rect.width = this.rect.width;
      params.rect.height = this.rect.height;
      this.params = params;
    },
    callbackRect() {
      this.$emit("set-rect", {
        x: this.movingpoint.x,
        y: this.movingpoint.y,
        width: this.rect.width,
        height: this.rect.height,
      });
    },
    getClass() {
      if (this.fixY) return "disabled";
      if (this.isMove) return "moving";
      return "";
    },
    getStyle() {
      if (!this.self) return "";
      const margin = { ...this.mousepoint_margin };
      const point = { ...this.movingpoint };
      let style = `left:0;top:${point.y - margin.y}px;`;
      if (this.forceHeight) style = `height:${this.forceHeight}px;${style}`;
      if (this.forceYzero) {
        style = `height:0;left:0;top:0;`;
      }
      return style;
    },
    mouseMove(e) {
      e.stopPropagation();
      if (!this.self || !this.isMove) return;
      this.rect = this.$refs.self.getBoundingClientRect();
      const point = getPointer(e);
      const movingpoint = convertToLocalPoint(
        point,
        this.targetRect || { x: 0, y: 0, width: 0, height: 0 }
      );
      this.movingpoint = movingpoint;
    },
    mouseDown(e) {
      e.stopPropagation();
      if (!this.self || !this.isEnter) return;
      this.isMove = true;
      this.rect = this.$refs.self.getBoundingClientRect();
      const point = getPointer(e);
      const movingpoint = convertToLocalPoint(
        point,
        this.targetRect || { x: 0, y: 0, width: 0, height: 0 }
      );
      this.movingpoint = movingpoint;
      const hitarea = hitArea(point, this.rect);
      if (hitarea && this.isEnter) {
        //ドラッグ開始時にマージンを取得する
        this.mousepoint_margin = {
          x: point.x - this.rect.x,
          y: point.y - this.rect.y,
        };
      }
    },
    mouseUp(e) {
      e.stopPropagation();
      this.isMove = false;
    },
    mouseEnter(e) {
      e.stopPropagation();
      this.isEnter = true;
    },
    mouseOut(e) {
      this.isEnter = false;
    },
    mouseLeave(e) {
      this.isEnter = false;
    },

    addDragEvent() {
      this.self = this.$refs.self;
      this.rect = this.$refs.self.getBoundingClientRect();
      this.self.addEventListener("mouseenter", this.mouseEnter);
      this.self.addEventListener("mouseleave", this.mouseLeave);
      this.self.addEventListener("mouseout", this.mouseOut);
      window.addEventListener("mousemove", this.mouseMove);
      this.self.addEventListener("mousedown", this.mouseDown);
      window.addEventListener("mouseup", this.mouseUp);
    },
    removeDragEvent() {
      this.self = this.$refs.self;
      this.self.removeEventListener("mouseenter", this.mouseEnter);
      this.self.removeEventListener("mouseleave", this.mouseLeave);
      this.self.removeEventListener("mouseout", this.mouseOut);
      window.removeEventListener("mousemove", this.mouseMove);
      this.self.removeEventListener("mousedown", this.mouseDown);
      window.removeEventListener("mouseup", this.mouseUp);
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  user-select: none;
  position: relative;
  opacity: 0.5;
  background-color: #eee;
  width: 100%;
  font-size: 12px;
  z-index: 1;
  &:hover {
    cursor: move;
    opacity: 1;
  }
  &.moving {
    opacity: 1;
    background-color: #ff8888;
  }
  &.disabled {
    &:hover {
      cursor: default;
      opacity: 0.5;
    }
  }
}
</style>