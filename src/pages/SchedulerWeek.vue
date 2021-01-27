<template>
  <PageFrame>
    <template v-slot:pageHeader> Global Header </template>
    <template v-slot:pageBodySide> Side Menu </template>
    <template v-slot:pageBodyMain
      ><SchedulerWeek :config="config" :lists="lists"
    /></template>
  </PageFrame>
</template>
<script>
import { dragStore } from "../components/scheduler/DragStore";
import PageFrame from "./UI/PageFrame";
import SchedulerWeek from "../components/scheduler/SchedulerWeek";
import { CONFIG_SCHEDULER } from "../statics/config";

export default {
  data: () => {
    return {
      config: CONFIG_SCHEDULER,
      gridLines: [],
      lists: [],
    };
  },
  components: {
    PageFrame,
    SchedulerWeek,
  },
  async mounted() {
    const res = await fetch("/json/schedule.json");
    if (res.ok) {
      const response = await res.json();
      this.lists = response.schedule;
    } else {
      throw new Error();
    }

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