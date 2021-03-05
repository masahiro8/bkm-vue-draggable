<template>
  <div ref="self" class="target" :id="randomId">
    <slot :params="params" />
  </div>
</template>
<script>
  import { dragStore } from "../DragStore";
  import { getTimeFromYpx, roundTo15min } from "../util/timeUtil";

  export default {
    data: () => {
      return {
        flag: false,
        params: {
          lists: [],
          listId: null,
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
        const height = this.config.hour * this.config.grid15min * 4;
        return `min-width:${this.config.targetWidth}px;height:${height}px;`;
        // return `height:${height}px;`;
      },
    },
    methods: {
      init() {
        this.params.targetRef = this.$refs.self;
        dragStore.setCallback(({ allItems }) => {
          const items = allItems.filter((item) => {
            // console.log("init",item);
            return item.date === this.date && item.type_id === this.type_id
          });

          this.params = {
            lists: items.map((item) => item.itemId),
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
  }
</style>
