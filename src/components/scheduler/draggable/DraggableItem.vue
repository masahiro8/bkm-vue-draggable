<template>
  <div ref="self" class="box" :class="getClass()" :style="getStyle()">
    <div class="delete">
      <button @click="deleteItem">delete</button>
    </div>
    <slot
      :target="params.target"
      :position="params.position"
      :expand="params.expand"
      :fitGrid="params.fitGrid"
      :isMoving="params.isMoving"
      :startTime="params.startTime"
      :expandCallback="expandCallback"
    />
  </div>
</template>
<script>
  import { hitArea } from "../util/hitArea";
  import { dragStore } from "../DragStore";
  import { getTimeFromYpx, getEndTime, getYpxFromTime } from "../util/timeUtil";

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

  export default {
    data: () => {
      return {
        id: null,
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
        params: {
          expand: { x: 0, y: 20 },
          fitGrid: { x: 1, y: 1 },
        },
        timerExpandUpdate: null,
        updatedExpand: 20,
        expandTime: { h: null, m: null },
      };
    },
    props: {
      itemId: {
        type: Number,
      },
      date: {
        type: String,
        defaultValue: null,
      },
      //ターゲット追加をするか
      isTargetDetect: {
        type: Boolean,
        defaultValue: false,
      },
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

      //自分を取得
      const self = dragStore.getItemById(this.id);

      //新規ドロップの検知
      const target = dragStore.getSelfTarget({ itemId: this.id });

      const targetRect = target ? target.ref.getBoundingClientRect() : null;
      if (targetRect) {
        let rect = this.$refs.self.getBoundingClientRect();
        const target_margin = {
          x: rect.x - targetRect.x,
          y: rect.y - targetRect.y,
        };
        this.target = target.ref;
        this.target_margin = target_margin;
        this.mousepoint_margin = { x: 0, y: 0 };

        //時間から座標に変換
        const time = {
          h: self.startTime.split(":")[0],
          m: self.startTime.split(":")[1],
        };

        //時間から座標に変換
        const localPosition = {
          x: 0,
          y: getYpxFromTime({ time: time, grid15min: this.fitGridY }),
        };
        // let movingpoint = { ...self.localPosition };//座標をそのまま取得
        let movingpoint = { ...localPosition };

        //時間から座標に変換
        const endtime = {
          h: self.endTime.split(":")[0],
          m: self.endTime.split(":")[1],
        };

        const expandPosition = {
          x: 0,
          y:
            getYpxFromTime({
              time: endtime,
              grid15min: this.fitGridY,
            }) - localPosition.y,
        };

        //固定補正
        this.movingpoint = {
          x: this.fixHorizontal ? 0 : movingpoint.x,
          y: this.fixVertical ? 0 : movingpoint.y,
        };
        //expandから経過時間を設定
        this.params = {
          target: target.ref,
          position: this.movingpoint,
          expand: expandPosition,
          startTime: this.getStartTime.time,
          fitGrid: {
            x: this.fitGridX,
            y: this.fitGridY,
          },
        };
      }

      this.$watch(
        () => [this.isMove],
        (newValue) => {
          const params = { ...this.params };
          params.isMoving = newValue[0];
          params.startTime = this.getStartTime.time;
          this.params = params;
        }
      );
    },
    beforeDestroy() {
      this.removeDragEvent();
    },
    computed: {
      //現在の時間を取得
      getStartTime() {
        const margin = { ...this.mousepoint_margin };
        const point = { ...this.movingpoint };

        let top = !this.fitGridY
          ? point.y - margin.y
          : fitGrid(this.fitGridY, point.y - margin.y);

        let left = !this.fitGridX
          ? point.x - margin.x
          : fitGrid(this.fitGridX, point.x - margin.x);

        const normalized = this.getNormalizedPosition({
          x: left * 100,
          y: top * 100,
        });

        const time = getTimeFromYpx({
          pixel: top,
          grid15min: this.fitGridY,
        });

        return {
          //ピクセル
          pixel: {
            x: left,
            y: top,
          },
          //正規化
          normalized,
          //時間
          time,
        };
      },
    },
    methods: {
      //座標を正規化
      getNormalizedPosition({ x, y }) {
        const targetRect = this.target
          ? this.target.getBoundingClientRect()
          : null;
        return targetRect
          ? {
              x: x / targetRect.width,
              y: y / targetRect.height,
            }
          : { x: 0, y: 0 };
      },
      getClass() {
        if (this.isMove) return "moving";
        return "";
      },
      getStyle() {
        if (!this.self) return "";
        const { normalized } = this.getStartTime;
        return `left:${normalized.x}%;top:${normalized.y}%;`;
      },
      initial() {},

      //DraggableExpandBoxから高さを受け取る
      expandCallback({ expand, expandTime }) {
        clearTimeout(this.timerExpandUpdate);
        this.timerExpandUpdate = setTimeout(() => {
          this.updatedExpand = expand;
          this.expandTime = expandTime;
          //登録
          this.putOnTarget(this.date);
        }, 200);
      },

      //ストアに登録
      putOnTarget(date) {
        const _startTime = this.getStartTime.time;
        const _endtime = getEndTime({
          startTime: this.getStartTime.time,
          expandTime: this.expandTime,
        });

        const startTime = `${`${_startTime.h}`.padStart(
          2,
          "0"
        )}:${`${_startTime.m}`.padStart(2, "0")}`;

        const endTime = `${`${_endtime.h.padStart(
          2,
          "0"
        )}`}:${`${_endtime.m.padStart(2, "0")}`}`;

        //所属先を変更
        dragStore.putOnTarget({
          itemId: this.id,
          date,
          startTime,
          endTime,
        });
      },

      //エリアヒット検出 >> ドロップ先を検出して登録
      detectTarget() {
        const selfRect = this.$refs.self.getBoundingClientRect();
        const hit = dragStore.hitTarget({
          x: selfRect.x,
          y: selfRect.y,
          width: selfRect.width,
          height: selfRect.height,
        });

        if (hit) {
          //所属先を変更
          this.putOnTarget(hit.date);
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
        }
      },

      deleteItem(e) {
        console.log("delete");
        dragStore.deleteItem({ itemId: this.itemId });
        e.stopPropagation();
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
          this.detectTarget(point);
        }
        this.mousedown = false;
        this.isMove = false;
      },
      mouseEnter(e) {
        e.stopPropagation();
        this.isEnter = true;
      },
      mouseOut() {
        //mouseOutはこの要素の上に乗ってる要素にポインターが乗った時にも呼ばれるので、
        //座標だけではなく、深度も含めて挙動を監視している
        // this.isEnter = false;
      },
      mouseLeave() {
        this.isEnter = false;
      },
      mouseClick(e) {
        e.stopPropagation();
        e.preventDefault();
      },

      addDragEvent() {
        this.self = this.$refs.self;
        this.self.addEventListener("click", this.mouseClick);
        this.self.addEventListener("mouseenter", this.mouseEnter);
        this.self.addEventListener("mouseleave", this.mouseLeave);
        this.self.addEventListener("mouseout", this.mouseOut);
        window.addEventListener("mousemove", this.mouseMove);
        this.self.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
      },
      removeDragEvent() {
        this.self.removeEventListener("click", this.mouseClick);
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
    width: 100%;
    z-index: 1;
    &:hover {
      cursor: move;
    }
  }

  .delete {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    button: {
      pointer-events: all;
    }
  }
</style>
