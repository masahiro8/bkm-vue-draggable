<template>
  <div class="page">
    <div
      @dragend="dragend"
      class="droppable-element"
      draggable="true"
      unselectable="on"
    >
      Drag me!
    </div>
    <div ref="content" class="content" id="content">
      <grid-layout
        :layout.sync="layout"
        :col-num="grid_size.col"
        :row-height="content_grid.h"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="false"
        :prevent-collision="false"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          {{ item.i }}
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";

//グリッドの大きさ
const GRID = {
  col: 3,
  row: 12,
};

export default {
  components: {
    GridLayout,
    GridItem,
  },
  data: () => {
    return {
      mouse_pos: { x: null, y: null },
      grid_size: GRID,
      content_grid: { w: GRID.col, h: 0 },
      layout: [
        { x: 0, y: 0, w: 1, h: 10, i: "0" },
        { x: 1, y: 0, w: 1, h: 2, i: "1" },
        { x: 2, y: 0, w: 1, h: 5, i: "2" },
      ],
    };
  },
  mounted() {
    this.initEvent();
    this.$nextTick(() => {
      this.updateGridData();
    });
  },
  methods: {
    initEvent() {
      //ドラッグ検出
      document.addEventListener(
        "dragover",
        (e) => {
          this.mouse_pos = {
            x: e.clientX,
            y: e.clientY,
          };
        },
        false
      );

      //画面サイズ変更を検出
      window.addEventListener("resize", () => {
        this.updateGridData();
      });
    },
    updateGridData() {
      //なぜか$refsが取得できない
      // const contentRect = this.$refs["content"].getBoundingClientRect();
      const contentRect = document
        .getElementById("content")
        .getBoundingClientRect();
      this.content_grid.h = Math.floor(contentRect.height / GRID.row);
    },
    //エリアに入ったかの検知
    hitOnArea(parentRect) {
      if (
        this.mouse_pos.x > parentRect.left &&
        this.mouse_pos.x < parentRect.right &&
        this.mouse_pos.y > parentRect.top &&
        this.mouse_pos.y < parentRect.bottom
      ) {
        return true;
      } else {
        return false;
      }
    },
    dragend: function (e) {
      let parentRect = document
        .getElementById("content")
        .getBoundingClientRect();

      //pointerの位置からグリッド位置を取得
      const getGridPosition = (pointer, contentRect, grid) => {
        const w = Math.floor(contentRect.width / grid.col);
        const h = Math.floor(contentRect.height / grid.row);
        return {
          x: Math.floor(pointer.x / w),
          y: Math.floor((pointer.y - contentRect.y) / h),
        };
      };

      if (
        this.hitOnArea(parentRect) &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        const pointer_grid_position = getGridPosition(
          this.mouse_pos,
          parentRect,
          this.grid_size
        );
        this.layout.push({
          x: pointer_grid_position.x,
          y: pointer_grid_position.y,
          w: 1,
          h: 1,
          i: Math.floor(Math.random() * 9999),
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
}
.content {
  width: 320px;
  height: 100%;
  border: 1px solid red;
  padding: 0;
}
.vue-grid-item {
  border: 1px solid #ddd;
}
.droppable-element {
  width: 48px;
  text-align: center;
  background: #fdd;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
}
</style>