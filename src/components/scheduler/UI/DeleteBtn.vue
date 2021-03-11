<template>
  <button class="btn" @click="onclick">
    <img :src="trashbox" alt="" />
  </button>
</template>
<script>
  export default {
    data: () => {
      return {
        trashbox: require("../assets/delete.svg"),
      };
    },
    methods: {
      onclick(e) {
        e.stopPropagation();
        this.$emit("onDelete",e);
      },
    },
  };
</script>
<style lang="scss" scoped>
@import "./ui.scss";
@include btn;
</style>
