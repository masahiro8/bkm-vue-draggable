<template>
  <div ref="self" class="box" :class="getClass()" :style="getStyle()">
    <slot />
  </div>
</template>
<script>
// import { roundGrid } from "../../util/roundGrid";
import { hitArea } from "../../util/hitArea";
import { dragStore } from "./DragStore";

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

//グリッドのサイズにまるめる
const fitGrid = (gridSize, value) => {
  return Math.floor(value / gridSize) * gridSize;
};

//ターゲットの中におさっているか
const detectInTargetRect = (selfRect, targetRect, limit) => {
  if (!selfRect || !targetRect) return null;
  let result = { vertical: null, horizontal: null };
  if (limit.vertical) {
    result.vertical = targetRect.y > selfRect.y ? 0 : null;
    result.vertical =
      targetRect.y + targetRect.height < selfRect.y + selfRect.height
        ? targetRect.y + targetRect.height - selfRect.height
        : null;
  }
  if (limit.horizontal) {
    result.horizontal = targetRect.x > selfRect.x ? 0 : null;
    result.horizontal =
      targetRect.x + targetRect.width < selfRect.x + selfRect.width
        ? targetRect.x + targetRect.width - selfRect.width
        : null;
  }
  return result;
};

export default {
  data: () => {
    return {
      self: null,
      rect: null,
      isMove: false,
      isEnter: false,
      movingpoint: null,
      movepoint_start: null,
      mousepoint_margin: null,
      mousepoint: null,
      mousedown: false,
      hitarea: false,
      target: null,
      target_margin: null,
    };
  },
  props: {
    itemId: {
      type: Number,
    },
    listId: {
      type: Number,
    },
    //最後に追加されたアイテム
    lastItem: {
      type: Object,
    },
    //ターゲット追加をするか
    isTargetDetect: {
      type: Boolean,
      defaultValue: false,
    },
    // canDropTargets: {
    //   type: Array,
    // },
    //x方向の移動を固定
    fixHorizontal: {
      type: Boolean,
      defaultValue: false,
    },
    //y方向の移動を固定
    fixVertical: {
      type: Boolean,
      defaultValue: false,
    },
    //x方向のグリッド吸着
    fitGridX: {
      type: Number,
      defaultValue: 1,
    },
    //y方向のグリッド吸着
    fitGridY: {
      type: Number,
      defaultValue: 1,
    },
    //{x,y}の座標を0に補正するか
    fit0: {
      type: Object,
      defaultValue: { x: false, y: false },
    },
    limit: {
      type: Object,
      defaultValue: { vertical: false, horizontal: false },
    },
  },
  mounted() {
    //新しくリストに追加されたItemはmountedで作られるので、ここで検知する
    this.addDragEvent();

    //idが無い場合はdragStoreに登録
    this.id = this.itemId;

    //新規ドロップの検知
    if (this.id === this.lastItem.id) {
      const target = dragStore.getSelfTarget({ itemId: this.id });
      const targetRect = target ? target.ref.getBoundingClientRect() : null;
      if (targetRect) {
        let rect = this.$refs.self.getBoundingClientRect();
        const target_margin = {
          x: rect.x - targetRect.x,
          y: rect.y - targetRect.y,
        };
        this.mousepoint = this.lastItem.position
          ? {
              x: this.lastItem.position.x - this.lastItem.margin.x,
              y: this.lastItem.position.y - this.lastItem.margin.y,
            }
          : { x: targetRect.x, y: targetRect.y };
        this.target = target.ref;
        this.target_margin = target_margin;
        this.mousepoint_margin = { x: 0, y: 0 };
        const movingpoint = convertToLocalPoint(
          this.mousepoint,
          targetRect || { x: 0, y: 0, width: 0, height: 0 }
        );
        //固定補正
        this.movingpoint = {
          x: this.fixHorizontal ? 0 : movingpoint.x,
          y: this.fixVertical ? 0 : movingpoint.y,
        };
      }
    }
  },
  beforeDestroy() {
    this.removeDragEvent();
  },
  methods: {
    getClass() {
      if (this.isMove) return "moving";
      return "";
    },
    getStyle() {
      if (!this.self) return "";
      const margin = { ...this.mousepoint_margin };
      const point = { ...this.movingpoint };

      let top = !this.fitGridY
        ? point.y - margin.y
        : fitGrid(this.fitGridY, point.y - margin.y);

      let left = !this.fitGridX
        ? point.x - margin.x
        : fitGrid(this.fitGridX, point.x - margin.x);

      return `left:${left}px;top:${top}px;`;
    },
    initial() {},

    //エリアヒット検出 >> ドロップ先を検出して登録
    detectTarget({ x, y }) {
      const selfRect = this.$refs.self.getBoundingClientRect();
      const hit = dragStore.hitTarget({
        x: selfRect.x,
        y: selfRect.y,
        width: selfRect.width,
        height: selfRect.height,
      });
      if (hit) {
        //所属先を変更
        dragStore.putOnTarget({
          itemId: this.id,
          targetId: hit.id,
          position: { x, y },
          margin: {
            x: x - selfRect.x,
            y: y - selfRect.y,
          },
        });
        this.movepoint_start = null;
      } else {
        //元に戻す
        const target = dragStore.getSelfTarget({ itemId: this.id });
        const targetRect = target ? target.ref.getBoundingClientRect() : null;
        const movingpoint = convertToLocalPoint(
          this.movepoint_start,
          targetRect
        );
        this.movingpoint = movingpoint;
        this.movepoint_start = null;
        //最後追加を削除
        dragStore.clearLastItem();
      }
    },
    mouseMove(e) {
      e.stopPropagation();
      if (!this.self || !this.isMove) return;
      const point = getPointer(e);
      this.mousepoint = point;
      const targetRect = this.target.getBoundingClientRect();
      this.movingpoint = convertToLocalPoint(
        point,
        targetRect || { x: 0, y: 0, width: 0, height: 0 }
      );
    },
    mouseDown(e) {
      e.stopPropagation();
      if (!this.self || !this.isEnter) return;
      this.isMove = true;

      this.rect = this.$refs.self.getBoundingClientRect();
      const point = getPointer(e);
      const hitarea = hitArea(point, this.rect);
      if (hitarea && this.isEnter) {
        const targetRect = this.target.getBoundingClientRect();
        this.movingpoint = convertToLocalPoint(
          point,
          targetRect || { x: 0, y: 0, width: 0, height: 0 }
        );
        this.movepoint_start = point;
        //ドラッグ開始時にマージンを取得する
        this.mousepoint_margin = {
          x: point.x - this.rect.x,
          y: point.y - this.rect.y,
        };
      }
    },
    mouseUp(e) {
      e.stopPropagation();
      //エリアヒット検出
      const point = getPointer(e);

      if (this.isMove && this.isEnter) {
        //位置を補正
        const targetRect = this.target.getBoundingClientRect();
        const localPoint = convertToLocalPoint(
          point,
          targetRect || { x: 0, y: 0, width: 0, height: 0 }
        );
        this.movingpoint = {
          x: this.fixHorizontal ? 0 : localPoint.x,
          y: this.fixVertical ? 0 : localPoint.y,
        };
        this.mousepoint_margin = {
          x: this.fixHorizontal ? 0 : this.mousepoint_margin.x,
          y: this.fixVertical ? 0 : this.mousepoint_margin.y,
        };
      }
      this.mousedown = false;
      this.isMove = false;

      this.detectTarget(point);
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
      this.self.addEventListener("mouseenter", this.mouseEnter);
      this.self.addEventListener("mouseleave", this.mouseLeave);
      this.self.addEventListener("mouseout", this.mouseOut);
      window.addEventListener("mousemove", this.mouseMove);
      this.self.addEventListener("mousedown", this.mouseDown);
      window.addEventListener("mouseup", this.mouseUp);
    },
    removeDragEvent() {
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
  position: absolute;
  background-color: red;
  width: 64px;
  font-size: 12px;
  z-index: 1;
  &:hover {
    cursor: move;
  }
  &.canmove {
    background-color: #880000;
  }
  &.moving {
    background-color: #ff8888;
  }
}
</style>