<template>
  <div ref="self" class="box" :class="getClass()" :style="getStyle()">
    <div class="delete">
      <DeleteBtn @onDelete="deleteItem" />
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
/**
 * 
 * props.item.overDay が日跨ぎのフラグで翌日の場合にtrue
 * 自分が日跨ぎの翌日の場合は、便宜上”goast”としている
 */
  import { hitArea } from "../util/hitArea";
  import { dragStore } from "../DragStore";
  import {
    getTimeFromYpx,
    getEndTime,
    getYpxFromTime,
    getRangeFromStartEnd,
    getTimeObjectFromString
  } from "../util/timeUtil";
  import DeleteBtn from "../UI/DeleteBtn";

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
        tag_id:null,
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
        target: null,//自分がいるDragTarget
        target_margin: null,
        params: {
          expand: { x: 0, y: 20 },
          fitGrid: { x: 1, y: 1 },
        },
        timerExpandUpdate: null,
        updatedExpand: 20,
        expandTime: { h: null, m: null },
        tags:null,
      };
    },
    components: {
      DeleteBtn,
    },
    props: {
      itemId: {
        type: Number,
      },
      type_id:{
        type: Number,
      },
      item:{
        type:Object,
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

      //新規ドロップの検知
      if(!this.item.overDay) {
        this.initMainUnit();
      }else {
        this.initGoastUnit();
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

      //ゴーストを監視
      this.$watch(
        () => [this.item],
        (newValue, oldValue) => {
          const n = JSON.stringify(newValue);
          const o = JSON.stringify(oldValue);
          if("overDay" in this.item && n != o) {
            console.log("Updated Main Unit !!!!");
            this.initGoastUnit();
          }
        },
        {
          immediate: true,
          deep: true
        }
      )
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
      //本体初期化
      initMainUnit(){
        const target = dragStore.getSelfTarget({
          itemId: this.id,
          type_id:this.type_id
        });
        //配置位置を決定
        const targetRect = target ? target.ref.getBoundingClientRect() : null;
        if (targetRect) {
          this.setInitialPosition({target,targetRect,overDay:false});
        }
      },
      //ゴースト初期化
      initGoastUnit(){
        const target = dragStore.getGoastTarget({
          type_id:this.type_id,
          date:this.date
        });
        // console.log("--------OverDay",this.date,this.item.overDay,target);
        //配置位置を決定
        const targetRect = target ? target.ref.getBoundingClientRect() : null;
        if (targetRect) {
          this.setInitialPosition({target,targetRect,overDay:true});
        }

      },
      //初期化時の座標計算と設置
      setInitialPosition({target,targetRect,overDay}){
        //自分を取得
        const self = dragStore.getItemById(this.id);
        let rect = this.$refs.self.getBoundingClientRect();
        const target_margin = {
          x: rect.x - targetRect.x,
          y: rect.y - targetRect.y,
        };
        this.target = target.ref;
        this.target_margin = target_margin;
        this.mousepoint_margin = { x: 0, y: 0 };
        this.tag_id = self.tag_id;

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
        if(!overDay){
          this.movingpoint = {
            x: this.fixHorizontal ? 0 : movingpoint.x,
            y: this.fixVertical ? 0 : movingpoint.y,
          };
        }else {
          //ゴースト
          this.movingpoint = this.getGoastPosition();
        }

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

        this.tags = dragStore.getTags();
        console.log("Mounted", this.item.itemId);
      },
      getGoastPosition(){
        const self = dragStore.getItemById(this.id);
        //ゴーストの位置
        //開始時間から24時までの時間
        const range = getRangeFromStartEnd({
          startTime:self.startTime,
          endTime:"24:00"
        })
        //ピクセルに変換
        const top = getYpxFromTime({
          time: getTimeObjectFromString(range),
          grid15min: this.fitGridY
        });
        return {x:0,y:-top};
      },
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
        let c = '';
        if (this.isMove) c += " moving";
        if( this.item.overDay ) c += " goast";
        return c;
      },
      getStyle() {
        let style = "";
        if (!this.self) return "";

        //Tagの色を設定
        if(this.tag_id && this.tags) {
          const _tag = this.tags.find( tag => {
            return tag.ticketId === this.tag_id;
          })
          if(_tag){
            style += `background-color:${_tag.color};`;
          } else {
            style += `background-color:#888;`;
          }
        }else{
          style += `background-color:#888;`;
        }

        const { normalized } = this.getStartTime;
        style += `left:${normalized.x}%;top:${normalized.y}%;`;

        //幅を設定
        if("group_width" in this.item) {
          const w = this.item.group_width;
          const l = this.item.group_width * this.item.group_index;
          style += `width:${w}%;`;
          //動かしてる時は位置を変更しない
          if(!this.isMove){
            style += `left:${l}%`;
          }
        }

        //動いてる時
        if(this.isMove) {
          style += `z-index:999`;
        }
        
        return style;
      },
      initial() {},

      //DraggableExpandBoxから高さを受け取る
      expandCallback({ expand, expandTime }) {
        clearTimeout(this.timerExpandUpdate);
        this.timerExpandUpdate = setTimeout(() => {
          this.updatedExpand = expand;
          this.expandTime = expandTime;

          if(this.item.overDay) {
            this.thisUpdateGoastOnTarget(this.date,this.type_id);
          }else{
            //登録
            this.thisPutOnTarget(this.date,this.type_id);
          }
        }, 200);
      },

      //ストアに登録
      thisPutOnTarget(date, type_id) {
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
          type_id,
          tag_id:this.tag_id,
        });
      },

      //ゴーストは登録しない
      thisUpdateGoastOnTarget(){
        console.log("UpdateGoast!!!!!!!");
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

        if (hit.date && hit.type_id >= 0 ) {
          //所属先を変更
          this.thisPutOnTarget(hit.date,hit.type_id);
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
        e.stopPropagation();
        dragStore.deleteItem({ itemId: this.itemId });
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

        //予定枠内でクリックしているかのチェック
        const hitarea = hitArea(point, this.rect);
        if (hitarea && this.isEnter) {

          //自分のいるターゲットのRect
          const targetRect = this.target.getBoundingClientRect();

          //クリック位置と自身の左上原点との距離の差分？
          this.movingpoint = convertToLocalPoint(
            point,
            targetRect || { x: 0, y: 0, width: 0, height: 0 }
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
    // transform:scale(0.97);
    transition: all .1s ease-in;
    border-radius:4px;
    border:1px solid rgba(255,255,255,.3);
    
    &:hover {
      cursor: move;
      transition:none;
      // transform:scale(1.0);
      box-shadow: 0 0 6px rgba(0,0,0,.1);
      border:1px solid rgba(0,0,0,.2);
    }

    &.goast {
      pointer-events: none;
      z-index: 0;
      opacity: .8;
      &:hover {
        cursor: default;
        transition:none;
      }
    }

    &.moving{
      transition:none;
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
