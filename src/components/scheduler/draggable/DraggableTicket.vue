<template>
  <div ref="self" class="box" :class="getClass()" :style="getStyle()">
    <slot />
  </div>
</template>
<script>
  import { hitArea } from "../util/hitArea";
  import { dragStore } from "../DragStore";
  import { getTimeFromYpx,getEndTime,roundTo15min } from "../util/timeUtil";

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
        mousepoint_margin: { x: 0, y: 0 },
        mousepoint: null,
        mousedown: false,
        hitarea: false,
        params: {
          expand: { x: 0, y: 20 },
          fitGrid: { x: 1, y: 1 },
        },
        targetRect: { x: 0, y: 0 },
      };
    },
    props: {
      itemId: {
        type: Number,
      },
      type_id:{
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
      target:{
        type: HTMLDivElement
      }
    },
    mounted() {
      // 新しくリストに追加されたItemはmountedで作られるので、ここで検知する
      this.addDragEvent();

      // idが無い場合はdragStoreに登録
      this.id = this.itemId;

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

        // console.log("starttime",top,left);

        //時間変換は、親座標を考慮して取得
        const time = getTimeFromYpx({
          pixel: top - this.targetRect.y,
          grid15min: this.fitGridY,
        });

        return {
          //ピクセル
          pixel: {
            x: left,
            y: top,
          },
          //時間
          time,
        };
      },
    },
    methods: {
      getClass() {
        if (this.isMove) return "moving";
        return "";
      },
      getStyle() {
        const { pixel } = this.getStartTime;
        return `left:${pixel.x}px;top:${pixel.y}px;`;
      },

      //ストアに登録
      //TODO 挙動があやしい
      thisPutOnTarget(date, type_id) {
        const _startTime = this.getStartTime.time;
        const _endtime = getEndTime({
          startTime: this.getStartTime.time,
          expandTime: {h:"0",m:"30"},
        });

        const startTime = `${`${_startTime.h}`.padStart(
          2,
          "0"
        )}:${`${_startTime.m}`.padStart(2, "0")}`;
        const endTime = `${`${_endtime.h.padStart(
          2,
          "0"
        )}`}:${`${_endtime.m.padStart(2, "0")}`}`;

        const __startTime = roundTo15min(startTime);
        const __endTime = roundTo15min(endTime);

        console.log("put",date, type_id,__startTime,_startTime,startTime,endTime)

        dragStore.addNew({
          date,
          startTime:__startTime.hm,
          endTime:__endTime.hm,
          type_id
        });
      },

      reset(){
        //元に戻す
        const movingpoint = convertToLocalPoint(
          this.movepoint_start,
          this.targetRect
        );
        this.movingpoint = movingpoint;
        this.movepoint_start = null;
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

        if (hit && "date" in hit && hit.type_id >= 0 ) {
          //新規追加
          this.thisPutOnTarget(hit.date,hit.type_id);
        }
        this.reset();
      },

      mouseMove(e) {
        e.stopPropagation();
        if (!this.self || !this.isMove) return;
        const point = getPointer(e);
        this.mousepoint = point;
        this.movingpoint = convertToLocalPoint(
          point,
          this.targetRect || { x: 0, y: 0, width: 0, height: 0 }
        );
      },

      mouseDown(e) {
        e.stopPropagation();
        if (!this.self || !this.isEnter) return;
        this.isMove = true;

        this.targetRect = this.target.getBoundingClientRect();
        this.rect = this.$refs.self.getBoundingClientRect();
        const point = getPointer(e);

        //予定枠内でクリックしているかのチェック
        const hitarea = hitArea(point, this.rect);
        if (hitarea && this.isEnter) {

          //クリック位置と自身の左上原点との距離の差分？
          this.movingpoint = convertToLocalPoint(
            point,
            this.targetRect
          );
          this.movepoint_start = point;

          //ドラッグ開始時に原点とのマージンを取得する
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
          const localPoint = convertToLocalPoint(
            point,
            this.targetRect || { x: 0, y: 0, width: 0, height: 0 }
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
    width: 128px;
    border:1px solid black;
    z-index: 1;
    &:hover {
      cursor: move;
    }
    &.moving{
      color:red;
      border:1px solid red;
      // position: fixed;
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
