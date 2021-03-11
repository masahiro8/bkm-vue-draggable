<template>
  <button class="btn" @click="onclick">
    <img :class="value?'open':'close'" :src="trashbox" alt="" />
  </button>
</template>
<script>
  export default {
    data: () => {
      return {
        value: true,
        trashbox: require("../assets/arrow_down.svg"),
      };
    },
    methods: {
      onclick(e) {
        e.stopPropagation();
        this.value = !this.value;
        this.$emit("onChange",this.value);
      },
    },
  };
</script>
<style lang="scss" scoped>
@import "./ui.scss";
@include btn;
.btn {
  img {
    transition: transform .1s ease-out;
    &.close {
      transform:rotate(180deg);
    }
  }
  height: 24px;
}
</style>
