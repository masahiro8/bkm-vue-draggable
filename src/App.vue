<template>
  <div id="app">
    <!-- <Timeline /> -->
    <!-- <TimelineGrid /> -->
    <button @click="addNew">ADD</button>
    <div style="display: flex">
      <DragTarget
        :id="100"
        :grid="{ x: 1, y: 8 }"
        :fit0="{ x: true, y: false }"
        :limit="{ vertical: true, horizontal: false }"
        style="width: 64px; height: 200px"
        v-slot="{ params }"
      >
        <DraggableItem
          v-for="(item, index) in params.lists"
          :key="index"
          :itemId="item"
          :listId="params.listId"
          :lastItem="params.lastItem"
          :limit="params.limit"
          :isTargetDetect="true"
          :fixHorizontal="true"
          :fixVertical="false"
          :fitGridX="params.grid.x"
          :fitGridY="params.grid.y"
          :fit0="params.fit0"
          >list1</DraggableItem
        >
      </DragTarget>
      <DragTarget
        :id="101"
        :grid="{ x: 1, y: 1 }"
        :fit0="{ x: true, y: false }"
        :limit="{ vertical: true, horizontal: false }"
        style="width: 64px; height: 200px"
        v-slot="{ params }"
      >
        <DraggableItem
          v-for="(item, index) in params.lists"
          :key="index"
          :itemId="item"
          :listId="params.listId"
          :lastItem="params.lastItem"
          :limit="params.limit"
          :isTargetDetect="true"
          :fixHorizontal="true"
          :fixVertical="false"
          :fitGridX="params.grid.x"
          :fitGridY="params.grid.y"
          :fit0="params.fit0"
          >list2</DraggableItem
        >
      </DragTarget>
    </div>
    <div style="height: 400px; width: 80px">
      <ExpandBox
        :initialPosition="{
          parent: { x: 0, y: 0 },
          child: { x: 0, y: 200 },
        }"
      />
    </div>
  </div>
</template>

<script>
import DraggableItem from "./components/custom-draggable/DraggableItem";
import DragTarget from "./components/custom-draggable/DragTarget";
import { dragStore } from "./components/custom-draggable/DragStore";
import ExpandBox from "./components/expand-box/ExpandBox";
export default {
  name: "App",
  components: {
    DraggableItem,
    DragTarget,
    ExpandBox,
  },
  mounted() {},
  methods: {
    addNew() {
      dragStore.putOnTarget({
        itemId: Math.floor(Math.random() * 999),
        targetId: 100,
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
