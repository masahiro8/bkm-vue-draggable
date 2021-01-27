<template>
  <ScheduleLayout>
    <!-- スケジュールヘッダー -->
    <template v-slot:headerLabel>
      <ScheduleHeader :config="config" :lists="lists" />
    </template>
    <!-- スケジュールラベル -->
    <template v-slot:bodyLabel>
      <!-- 時間表示 -->
      <GuideFrame :config="config" />
    </template>
    <!-- スケジュール表 -->
    <template v-slot:bodyMain>
      <DragTarget
        v-for="(list, index) in lists"
        :key="list.id"
        :id="list.id"
        :listParams="list"
        :grid="{ x: 1, y: config.grid15min }"
        :fit0="{ x: true, y: false }"
        :limit="{ vertical: true, horizontal: false }"
        :style="getStyle"
        v-slot="{ params }"
      >
        <!-- フレーム内の後ろに表示 -->
        <ListBox :id="list.id" :last="index === lists.length - 1"></ListBox>
        <!-- 背景のグリッド線 -->
        <GridFrame :config="config" />
        <!-- スケジュール表示 -->
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
        >
          <!-- スケジュール内の予定 -->
          <DraggableExpandBox
            :initialPosition="{
              position,
              expand,
            }"
            :target="target"
            :fitGrid="fitGrid"
            :isMoving="isMoving"
            @callback-expand="expandCallback"
            v-slot="{ expandTime, isDragging }"
          >
            <!-- アイテム内の表示UI -->
            <ItemBox
              :id="itemId"
              :isMoving="isMoving"
              :isDragging="isDragging"
              :targetId="params.listId"
              :startTime="startTime"
              :expandTime="expandTime"
            /> </DraggableExpandBox
        ></DraggableItem>
      </DragTarget>
    </template>
  </ScheduleLayout>
</template>

<script>
import DraggableItem from "./draggable/DraggableItem";
import DragTarget from "./draggable/DragTarget";
import DraggableExpandBox from "./expand/DraggableExpandBox";
import ItemBox from "./UI/ItemBox";
import ListBox from "./UI/ListBox";
import GridFrame from "./UI/GridFrame";
import GuideFrame from "./UI/GuideFrame";
import ScheduleLayout from "./UI/ScheduleLayout";
import ScheduleHeader from "./ScheduleHeader";

export default {
  name: "Scheduler",
  data: () => {
    return {
      gridLines: [],
    };
  },
  props: {
    config: {
      type: Object,
    },
    lists: {
      type: Array,
    },
  },
  components: {
    DraggableItem,
    DragTarget,
    DraggableExpandBox,
    ScheduleLayout,
    ScheduleHeader,
    ItemBox,
    ListBox,
    GridFrame,
    GuideFrame,
  },
  computed: {
    getStyle() {
      const height = this.config.hour * this.config.grid15min * 4;
      return `min-width:${this.config.targetWidth}px;height:${height}px;`;
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
