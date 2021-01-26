<template>
  <div id="app">
    <!-- <Timeline /> -->
    <!-- <TimelineGrid /> -->
    <button @click="addNew">ADD</button>
    <!-- ターゲットにドラッグ&ドロップして位置を変更できる -->
    <div style="display: flex">
      <DragTarget :id="1" :style="getLabelStyle">
        <Guide
          v-for="item in gridLines"
          :key="item"
          :index="item"
          :min15px="config.grid15min"
        />
      </DragTarget>
      <DragTarget
        v-for="list in lists"
        :key="list.id"
        :id="list.id"
        :initItems="list.items"
        :grid="{ x: 1, y: config.grid15min }"
        :fit0="{ x: true, y: false }"
        :limit="{ vertical: true, horizontal: false }"
        :style="getStyle"
        v-slot="{ params }"
      >
        <div>
          <Grid
            v-for="item in gridLines"
            :key="item"
            :index="item"
            :min15px="config.grid15min"
          />
        </div>
        <DraggableItem
          v-for="itemId in params.lists"
          :key="itemId"
          :itemId="itemId"
          :listId="params.listId"
          :limit="params.limit"
          :isTargetDetect="true"
          :fixHorizontal="true"
          :fixVertical="false"
          :fitGridX="params.grid.x"
          :fitGridY="params.grid.y"
          :fit0="params.fit0"
          v-slot="{
            target,
            position,
            expand,
            expandCallback,
            fitGrid,
            isMoving,
            startTime,
          }"
          ><DraggableExpandBox
            :initialPosition="{
              position,
              expand,
            }"
            :target="target"
            :fitGrid="fitGrid"
            :isMoving="isMoving"
            @callback-expand="expandCallback"
            v-slot="{ expandTime }"
            ><ItemBox
              :id="itemId"
              :startTime="startTime"
              :expandTime="expandTime" /></DraggableExpandBox
        ></DraggableItem>
      </DragTarget>
    </div>
    <!-- <div style="height: 400px; width: 80px">
      <ExpandBox
        :initialPosition="{
          parent: { x: 0, y: 0 },
          child: { x: 0, y: 200 },
        }"
        >okokokokok</ExpandBox
      >
    </div> -->
    <!-- <div style="height: 400px; width: 80px">
      <DraggableExpandBox
        :initialPosition="{
          parent: { x: 0, y: 0 },
          child: { x: 0, y: 100 },
        }"
      />
    </div> -->
  </div>
</template>

<script>
import DraggableItem from "./components/custom-draggable/DraggableItem";
import DragTarget from "./components/custom-draggable/DragTarget";
import { dragStore } from "./components/custom-draggable/DragStore";
// import ExpandBox from "./components/expand-box/ExpandBox";
import DraggableExpandBox from "./components/expand-box/DraggableExpandBox";
import ItemBox from "./components/item-box/ItemBox";
import Grid from "./components/custom-draggable/Grid";
import Guide from "./components/custom-draggable/Guide";

const CONFIG = {
  hour: 24, //1日の時間数
  targetWidth: 128, //幅ピクセル
  gideWidth: 32, //時間ガイドの幅
  grid15min: 16, //15分ごとのグリッドのピクセル数
};
export default {
  name: "App",
  data: () => {
    return {
      config: CONFIG,
      gridLines: [],
      lists: [
        {
          id: 100,
          items: [
            {
              itemId: 10001,
              targetId: 100,
              localPosition: { x: 0, y: 20 },
              expand: { x: 0, y: 30 },
            },
            {
              itemId: 10002,
              targetId: 100,
              localPosition: { x: 0, y: 80 },
              expand: { x: 0, y: 30 },
            },
          ],
        },
        { id: 101 },
        { id: 102 },
        { id: 103 },
        { id: 104 },
      ],
    };
  },
  components: {
    DraggableItem,
    DragTarget,
    DraggableExpandBox,
    ItemBox,
    Grid,
    Guide,
  },
  mounted() {
    const gridlines = [...Array(this.config.hour * 4)].map((item, i) => i + 1);
    this.gridLines = gridlines;
    console.log("gridLines", gridlines);
  },
  computed: {
    getLabelStyle() {
      const height = this.config.hour * this.config.grid15min * 4;
      return `width:${this.config.gideWidth}px;height:${height}px;`;
    },
    getStyle() {
      const height = this.config.hour * this.config.grid15min * 4;
      return `width:${this.config.targetWidth}px;height:${height}px;`;
    },
  },
  methods: {
    addNew() {
      dragStore.putOnTarget({
        itemId: Math.floor(Math.random() * 999),
        targetId: 102, //対象のターゲット
        localPosition: { x: 0, y: 30 }, //ボックスの位置
        expand: { x: 0, y: 50 }, //ボックスの高さ
      });
    },
  },
};
</script>

<style>
.timeframe {
  height: 400px;
  width: 200px;
  margin: 16px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
