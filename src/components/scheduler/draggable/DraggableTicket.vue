<template>
  <div ref="self" class="ticket" :class="getClass()" :style="getStyle()">
    <div class="ticket__bar" :style="getBarColor(ticket.color)"></div>
    <div class="ticket__title">{{ticket.title}}</div>
  </div>
</template>
<script>
  import { hitArea,hitAreaInner } from "../util/hitArea";
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
        isHover: false,
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
      ticket: {
        type: Object,
      },
      index:{
        type: Number,
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
      target:{
        type: HTMLDivElement
      },
      //スケジューラーのスクロール量
      bodyScroll:{
        type: Number,
        defaultValue: 0
      },
      //ヘッダーのRect
      headerRect:{
        type:Object
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
        let _class = '';
        if (this.isMove) _class+="moving ";
        if (this.isHover) _class+="hover ";
        return _class;
      },
      getStyle() {
        const { pixel } = this.getStartTime;
        return this.isMove?`left:${pixel.x}px;top:${pixel.y}px;`: `left:${pixel.x}px;`;
      },
      getBarColor(color){
        return `background-color:${color}`;
      },

      //ストアに登録
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
        dragStore.addNew({
          date,
          startTime:__startTime.hm,
          endTime:__endTime.hm,
          type_id,
          tag_id: this.ticket.ticketId || 0
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
        //ドロップ先のタイプ
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

      //nピクセル内側で判定する
      hitInnerArea(e){
        const inner_pixel = 6;
        const point = getPointer(e);
        this.rect = this.$refs.self.getBoundingClientRect();
        this.isHover = hitAreaInner(point,this.rect,inner_pixel);
      },

      mouseMove(e) {
        e.stopPropagation();
        this.hitInnerArea(e);
        
        if (!this.self || !this.isMove ) return;
         const point = getPointer(e);
        this.mousepoint = point;
        this.movingpoint = convertToLocalPoint(
          point,
          this.targetRect || { x: 0, y: 0, width: 0, height: 0 }
        );
      },

      mouseDown(e) {
        e.stopPropagation();

        if (!this.self || !this.isEnter || !this.isHover) return;
        this.isMove = true;
        this.targetRect = this.target.getBoundingClientRect();
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

          console.log("headerrect", this.headerRect.top ,this.headerRect.height );

          //位置を補正
          // const targetRect = {...this.targetRect};
          // targetRect.y = targetRect.y - this.headerRect.height;

          const localPoint = convertToLocalPoint(
            point,
            this.targetRect || { x: 0, y: 0, width: 0, height: 0 }
          );

          this.movingpoint = {
            x: this.fixHorizontal ? 0 : localPoint.x,
            y: this.fixVertical ? 0 : localPoint.y - this.bodyScroll - this.headerRect.height,
          };

          this.mousepoint_margin = {
            x: this.fixHorizontal ? 0 : this.mousepoint_margin.x,
            y: this.fixVertical ? 0 : this.mousepoint_margin.y,
          };
          this.detectTarget(point);
        }
        this.mousedown = false;
        this.isMove = false;
        this.isEnter = false;
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
        // mouseLeaveを検知してisEnter = falseにすると、
        // グリッド固定してチケットを動かしている時、mouseUpのタイミングで
        // チケット外になっている可能性があるため、falseにはしないで、
        // mouseUp内で確実にチケットを設置してからfalseにする
        //this.isEnter = false;
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

  $height:26px;

  .ticket {
    user-select: none;
    position: absolute;
    width: 128px;
    height:$height - 1;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F8F8F8;
    border-bottom:2px solid white;
    z-index: 1;

    &.hover{ 
      cursor: move;
      box-shadow:0 1px 3px rgba(0,0,0,.3);
      border-bottom: none;
      z-index: 2;
    }
    &.moving{
      box-shadow:0 1px 3px rgba(0,0,0,.3);
      border-bottom: none;
      z-index: 3;
    }
    @for $index from 10 through 0 {
      &:nth-child(#{$index}) {
        top: $height * $index;
      }
    }
  }
  .ticket__bar{
    width: 4px;
    height:100%;
  }
  .ticket__title {
    flex: 1;
    font-size: 10px;
    text-align: left;
    text-indent: 1em;
  }
</style>
