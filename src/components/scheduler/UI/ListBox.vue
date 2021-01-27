<template>
  <div class="list" :class="last ? 'last' : null">
    <div class="header">
      <div class="label">{{ label }}</div>
    </div>
    <div class="body"><slot /></div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      defaultValue: "",
    },
    id: {
      type: Number,
    },
    last: {
      type: Boolean,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fcfcfc;
  pointer-events: none;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-left: 1px solid $grid-color;
  }

  &.last {
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid $grid-color;
    }
  }
}
.body {
}
</style>