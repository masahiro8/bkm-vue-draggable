<template>
  <div ref="self" class="target" :id="randomId">
    <slot :params="params" />
  </div>
</template>
<script>
  import { dragStore } from "../DragStore";
  import { getTimeFromYpx, roundTo15min, getYpxFromTime,getYesturday,getMinFromTimeStr } from "../util/timeUtil";
  import { scheduleTile } from "../util/scheduleTIle";

  const deepCopyObject = (obj) =>{
    const _copy = JSON.stringify(obj);
    return JSON.parse(_copy);
  }

  export default {
    data: () => {
      return {
        flag: false,
        params: {
          lists: null,
          lastItem: null,
          targetRef: null
        },
        randomId:Math.floor(Math.random()*99999)
      };
    },
    props: {
      date: {
        type: String,
      },
      //アイテムの属性
      type_id:{
        type: Number,
      },
      //フレーム番号
      frame_index:{
        type: Number
      },
      grid: {
        type: Object,
        defaultValue: { x: 1, y: 1 },
      },
      //x=0,y=0に固定するかフラグ
      fit0: {
        type: Object,
        defaultValue: { x: false, y: false },
      },
      //上下左右の枠外への移動の許容
      limit: {
        type: Object,
        defaultValue: { vertical: true, horizontal: false },
      },
      //クリックして新規作成
      isClickToAdd: {
        type: Boolean,
        default: true,
      },
      //ドロップできるか
      isDropTarget:{
        type: Boolean,
        default: true,
      }
    },
    mounted() {
      this.init();
      this.addEvent();
      this.$watch(
        () => [this.date],
        (newValue, oldValue) => {
          if (newValue !== oldValue) {
            this.$nextTick(() => {
              this.update();
            });
          }
        },
        {
          immediate: true,
        }
      );
    },
    destroyed() {
      this.removeEvent();
    },
    computed: {
      getStyle() {
        const height = this.config.innerHeight;
        return `min-width:${this.config.targetWidth}px;height:${height}px;`;
      },
    },
    methods: {
      init() {
        this.params.targetRef = this.$refs.self;
        dragStore.setCallback(({ allItems }) => {
          
          //日付とタイプで絞り込み
          let refined = allItems.filter((item) => {
            return item.date === this.date && item.type_id === this.type_id
          });

          // console.log(" 今日 all ",this.date, [...refined]);

          //前日の日跨ぎをチェック
          const yesturday = getYesturday(this.date);

          //日跨ぎしている予約を取得
          const overItems = allItems.filter( item => {
            const endMin = getMinFromTimeStr(item.endTime);
            const h24Min = getMinFromTimeStr("24:00");
            return item.date === yesturday && item.type_id === this.type_id && endMin > h24Min
          });
          
          //日跨ぎの予約をゴーストとして追加
          refined = [...refined, ...overItems.map(item => {
            const _item = deepCopyObject(item);
            _item.overDay = true;//日跨ぎフラグ
            _item.date = this.date;
            return _item;
          })];

          // if(overItems.length){
          //   console.log("ゴースト追加済み ",this.date, overItems, [...refined]);
          // }

          //時間をピクセルに変換
          const _items = refined.map(item=>{
            let _item = deepCopyObject(item);
            //時間から座標に変換
            const start_time = {
              h: _item.startTime.split(":")[0],
              m: _item.startTime.split(":")[1],
            };
            const end_time = {
              h: _item.endTime.split(":")[0],
              m: _item.endTime.split(":")[1],
            };
            //タイルを作成するために時間からピクセルに変換して保持
            const _start_time = getYpxFromTime({time:start_time,grid15min: this.grid.y });
            const _end_time = getYpxFromTime({time:end_time,grid15min: this.grid.y });
            _item.start = _start_time;
            _item.end = _end_time;
            _item.id = item.itemId;

            //日跨ぎは時間ピクセルを再計算
            if("overDay" in item) {
              const _24 = getYpxFromTime({time:{h:"24",m:"0"},grid15min: this.grid.y });
              _item.start = getYpxFromTime({time:{h:"0",m:"0"},grid15min: this.grid.y });
              _item.end = _end_time - _24;
            }
            return _item;
          })

          //時間レイアウトを設定
          const items_tiled = scheduleTile().sortAll([..._items],this.grid?this.grid.y:0);

          this.params = {
            lists: items_tiled,
            grid: this.grid,
            fit0: this.fit0,
            limit: this.limit,
            targetRef: this.$refs.self
          };
        });
      },
      update() {
        //ストアに自身を登録
        dragStore.setTarget({
          date: this.date,
          type_id: this.type_id,
          ref: this.$refs.self,
          isDropTarget:this.isDropTarget
        });
      },

      //マウスクリックで新規予定の作成
      async mouseClick(e) {
        const rect = this.self.getBoundingClientRect();
        const point = { x: e.clientX, y: e.clientY };
        const localPoint = {
          x: point.x - rect.x,
          y: point.y - rect.y,
        };
        const _startTime = getTimeFromYpx({
          pixel: localPoint.y,
          grid15min: this.grid.y,
        });
        const _endTime = getTimeFromYpx({
          pixel: localPoint.y + this.grid.y * 2,
          grid15min: this.grid.y,
        });
        const startTime = roundTo15min(`${_startTime.h}:${_startTime.m}`);
        const endTime = roundTo15min(`${_endTime.h}:${_endTime.m}`);

        //Firebaseに新規追加
        dragStore.addNew({
          date: this.date,
          startTime: startTime.hm,
          endTime: endTime.hm,
          type_id: this.type_id
        });
      },
      addEvent() {
        if (!this.isClickToAdd) return;
        this.self = this.$refs.self;
        this.self.addEventListener("click", this.mouseClick);
      },
      removeEvent() {
        this.self.removeEventListener("click", this.mouseClick);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .target {
    user-select: none;
    position: relative;
    flex: 1;
    pointer-events: all;
    &.isDrop{
      &:hover{
        background-color: red;
      }
    }
  }
</style>
