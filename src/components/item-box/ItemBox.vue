<template>
  <div class="item">{{ params.id }}</div>
</template>
<script>
import { dragStore } from "../custom-draggable/DragStore";
export default {
  data: () => {
    return {
      params: { id: "" },
    };
  },
  props: {
    id: {
      type: Number,
    },
  },
  mounted() {
    this.$watch(
      () => [this.id],
      (newValue, oldValue) => {
        console.log("item =", newValue[0]);
        this.params = dragStore.getItemById(newValue[0]);
      },
      { immediate: true }
    );
  },
};
</script>
<style lang="scss" scoped>
</style>