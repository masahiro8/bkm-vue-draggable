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
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.schedulelabel {
  width: 100%;
  position: relative;
  transition: all .2s ease-in-out;
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
}
</style>