<template>
  <div class="schedulelabel">
    <div class="schedulelabel--date">{{ label }}</div>
  </div>
</template>
<script>
export default {
  name: "ScheduleLabel",
  props: {
    label: {
      type: String,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.schedulelabel {
  width: 100%;
  position: relative;
  &:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: $grid-color;
  }
  /* &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: $grid-color;
  } */
}
.schedulelabel--date,
.schedulelabel--sub {
  height: 42px;
  position: relative;
  /* &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: $grid-color;
  } */
}
</style>