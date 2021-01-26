<template>
  <div id="app">
    <button @click="addNew">ADD</button>
    <Scheduler :config="config" :lists="lists" />
    <!-- ターゲットにドラッグ&ドロップして位置を変更できる -->
    <div style="display: flex"></div>
  </div>
</template>

<script>
import { dragStore } from "./components/DragStore";
import Scheduler from "./components/scheduler/Scheduler";

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
              startTime: "12:00",
              endTime: "15:00",
            },
          ],
        },
        {
          id: 101,
          items: [
            {
              itemId: 10002,
              targetId: 101,
              startTime: "10:00",
              endTime: "11:00",
            },
          ],
        },
        { id: 102 },
        { id: 103 },
        { id: 104 },
      ],
    };
  },
  components: {
    Scheduler,
  },
  mounted() {
    dragStore.setUpdateCallback(({ items }) => {
      console.log("Published ", items);
    });
  },
  methods: {
    addNew() {
      dragStore.putOnTarget({
        itemId: Math.floor(Math.random() * 999),
        targetId: 102, //対象のターゲット
        startTime: "12:00",
        endTime: "15:00",
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
