<template>
  <div
    ref="self"
    class="draggable_vertical"
    :class="getClass()"
    :style="getStyle()"
  >
    <slot />
  </div>
</template>
<script>
import { hitArea } from "../../util/hitArea";

//ポインター位置を返すラッパー
const getPointer = (e, type) => {
  // const scrollTop = type === "child" ? e.clientY : e.clientY + window.scrollY;
  return { x: e.clientX, y: e.clientY };
};

//ターゲットのローカル座標に変換
const convertToLocalPoint = (selfPoint, parentRect) => {
  return {
    x: selfPoint.x - parentRect.x,
    y: selfPoint.y - parentRect.y,
  };
};

//親要素を取得
const getParentElement = (target) => {
  return target.parentNode;
};

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
      parent: {
        refType: null,
        element: null,
      },
    };
  },
  props: {
    type: {
      type: String,
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

    //親コンポーネントを登録
    const element = getParentElement(this.$refs.self);
    const refType = element.getAttribute("refType");
    this.parent = {
      element,
      refType,
    };

    //初期値をセット
    this.$watch(
      () => [this.initialPosition],
      (newValue, oldValue) => {
        if (
          JSON.stringify(newValue) !== JSON.stringify(oldValue) &&
          newValue[0]
        ) {
          const pos = newValue[0];
          this.movingpoint = pos;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    //座標を更新
    this.$watch(
      () => [this.movingpoint],
      (newValue, oldValue) => {
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
    //frameのサイズを更新
    callbackRect() {
      this.$emit("set-rect", {
        x: this.movingpoint.x,
        y: this.movingpoint.y,
        width: this.rect.width,
        height: this.rect.height,
        margin_x: this.mousepoint_margin.x,
        margin_y: this.mousepoint_margin.y,
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
    updatePosition(e) {
      //自分の座標を取得
      this.rect = this.$refs.self.getBoundingClientRect();

      //親の座標を取得
      const parentRect = this.parent.element.getBoundingClientRect();
      const targetRect = {
        x: parentRect.x,
        y: parentRect.y,
        width: parentRect.width,
        height: parentRect.height,
      };

      //クリック座標を取得
      const point = getPointer(e, this.type);
      this.movingpoint = convertToLocalPoint(
        point,
        targetRect || { x: 0, y: 0, width: 0, height: 0 }
      );
    },
    mouseMove(e) {
      e.stopPropagation();
      if (!this.self || !this.isMove) return;
      this.updatePosition(e);
    },
    mouseDown(e) {
      e.stopPropagation();
      if (!this.self || !this.isEnter) return;
      this.isMove = true;
      this.updatePosition(e);

      const point = getPointer(e, this.type);
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
.draggable_vertical {
  user-select: none;
  position: absolute;
  opacity: 0.5;
  background-color: #eee;
  width: 100%;
  font-size: 12px;
  z-index: 1;
  pointer-events: auto;
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