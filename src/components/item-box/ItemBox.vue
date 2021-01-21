<template>
  <div class="item"></div>
</template>
<script>
import { dragStore } from "../custom-draggable/DragStore";
export default {
  data: () => {
    return {
      params: {},
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
        this.params = dragStore.getItemById(newValue[0]);
      },
      { immediate: true }
    );
  },
};
</script>
<style lang="scss" scoped>
</style>