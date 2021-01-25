<template>
  <div id="app">
    <!-- <Timeline /> -->
    <!-- <TimelineGrid /> -->
    <button @click="addNew">ADD</button>
    <!-- ターゲットにドラッグ&ドロップして位置を変更できる -->
    <div style="display: flex">
      <DragTarget
        v-for="list in lists"
        :key="list.id"
        :id="list.id"
        :initItems="list.items"
        :grid="{ x: 1, y: 1 }"
        :fit0="{ x: true, y: false }"
        :limit="{ vertical: true, horizontal: false }"
        style="width: 64px; height: 200px"
        v-slot="{ params }"
      >
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
          v-slot="{ position, expand, expandCallback }"
          ><DraggableExpandBox
            :initialPosition="{
              position,
              expand,
            }"
            @callback-expand="expandCallback"
            ><ItemBox :id="itemId" /></DraggableExpandBox
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
export default {
  name: "App",
  data: () => {
    return {
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
  },
  mounted() {},
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
