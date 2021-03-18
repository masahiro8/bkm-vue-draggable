<template>
  <div class="schedulelabel" :style="getStyle()">
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
    holiday:{
      type: Object,
    }
  },
  methods:{
    getStyle(){
      if(this.holiday && !this.holiday.color) return '';
      let style = ``;
      if(this.holiday) style += `background-color:${this.holiday['color']}`;
      return style;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./ui.scss";
.schedulelabel {
  width: 100%;
  height: 48px;
  position: relative;
  transition: all .2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;

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