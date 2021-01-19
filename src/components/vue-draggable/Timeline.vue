<template>
  <div class="page">
    <div class="task-list">
      <h3>Task</h3>
      <draggable class="list-group" :list="list1" group="people" @change="log">
        <div
          class="task-item"
          v-for="(element, index) in list1"
          :key="element.name"
        >
          {{ element.name }} {{ index }}
        </div>
      </draggable>
    </div>
    <div class="timeline">
      <h3>Timeline</h3>
      <draggable class="list-group" :list="list2" group="people" @change="log">
        <div
          class="list-group-item"
          v-for="(element, index) in list2"
          :key="element.name"
        >
          {{ element.name }} {{ index }}
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
/**
 * VueDraggable
 */
import draggable from "vuedraggable";

export default {
  order: 1,
  components: {
    draggable,
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 },
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 },
      ],
      list2: [],
    };
  },
  methods: {
    // add: function () {
    //   this.list.push({ name: "Juan" });
    // },
    // replace: function () {
    //   this.list = [{ name: "Edgard" }];
    // },
    // clone: function (el) {
    //   return {
    //     name: el.name + " cloned",
    //   };
    // },
    log: function (evt) {
      window.console.log(evt);
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 280px;
  border: 1px solid blue;
  display: flex;
}

.task-list {
  width: 160px;
  background-color: #efefef;
  padding: 8px;
}

.task-item {
  height: 32px;
  width: 100%;
  background-color: white;
  margin: 2px 0;
  line-height: 32px;
  &:hover {
    cursor: move;
  }
}

.timeline {
  flex: 1;
  height: inherit;
  border: 1px solid green;
  background-color: #f8f8f8;
  overflow: scroll;
  .list-group {
    border: 1px solid red;
    height: 320px;
  }
}
</style>