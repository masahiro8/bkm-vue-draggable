<template>
  <draggable class="task-list" ghost-class="ghost" tag="ul" @end="onEnd">
    <li v-for="task in tasks" :key="task.id">
      <p class="task-name">{{ task.name }}</p>
    </li>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    tasks: {
      type: Array,
    },
  },
  components: {
    draggable,
  },
  methods: {
    onEnd(event) {
      //ドラッグ＆ドロップした対象の情報
      console.log(event);
      //console.log(JSON.stringify(this.departments, null, 2));
    },
  },
};
</script>
<style lang="scss" scoped>
ul {
  list-style-type: none;
  list-style-position: inside;
}

li {
  background: #d9d9d9;
}

.task-list {
  cursor: pointer;
  display: block;
  /* min-height: 8px; */
}
.task-name {
  padding: 8px 16px;
}
.ghost {
  opacity: 0.4;
  background: #42b983;
}
</style>