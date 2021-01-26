<template>
  <PageFrame>
    <template v-slot:pageHeader> Global Header </template>
    <template v-slot:pageBodySide> Side Menu </template>
    <template v-slot:pageBodyMain
      ><Scheduler :config="config" :lists="lists"
    /></template>
  </PageFrame>
</template>
<script>
import { dragStore } from "../components/DragStore";
import PageFrame from "../components/UI/PageFrame";
import Scheduler from "../components/scheduler/Scheduler";
import { CONFIG_SCHEDULER } from "../statics/config";

export default {
  data: () => {
    return {
      config: CONFIG_SCHEDULER,
      gridLines: [],
      lists: [
        {
          id: 100,
          label: "100",
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
          label: "101",
          items: [
            {
              itemId: 10002,
              targetId: 101,
              startTime: "10:00",
              endTime: "11:00",
            },
          ],
        },
        { id: 102, label: "102" },
        { id: 103, label: "103" },
        { id: 104, label: "104" },
      ],
    };
  },
  components: {
    PageFrame,
    Scheduler,
  },
  mounted() {
    dragStore.setUpdateCallback(({ items }) => {
      console.log("Published ", items);
    });
    this.setBodyOverflowHidden(true);
  },
  destroyed() {
    this.setBodyOverflowHidden(true);
  },
  methods: {
    setBodyOverflowHidden(b) {
      document.querySelector("body").style.overflow = b ? "hidden" : "auto";
    },
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
<style lang="scss">
</style>