<template>
  <div class="list" :class="getClass()" :style="getStyle()">
    <div class="body"><slot /></div>
  </div>
</template>
<script>
export default {
  props: {
    last: {
      type: Boolean,
    },
    isDropTarget:{
      type: Boolean,
    },
    holiday:{
      type: Object,
    }
  },
  methods:{
    getClass(){
      let classes= "";
      classes += this.last?'last ':'';
      classes += this.isDropTarget?'isDrop ':'';
      return classes;
    },
    getStyle(){
      if(this.holiday && !this.holiday.color) return '';
      let style = '';
      style += `background-color:${this.holiday.color};`;
      return style;
    }
  }
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
  // pointer-events: none;

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

  &:hover{
    &.isDrop{
    }
  }

}
.body {
}
</style>