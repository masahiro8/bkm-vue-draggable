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
        this.$emit("onDelete");
      },
    },
  };
</script>
<style lang="scss" scoped>
  .btn {
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    opacity: 0.5;
    outline: none;
    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
</style>
