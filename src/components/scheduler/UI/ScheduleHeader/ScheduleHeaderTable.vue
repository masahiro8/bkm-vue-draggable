<template>
  <div class="scheduleheader--table"
    :class="isTableOpen?'open':'close'"
    :style="getStyle()"
  >
    <div class="scheduleheader--cell">
      <slot name="cell1"></slot>
    </div>
    <div class="scheduleheader--cell">
      <slot name="cell2"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isTableOpen:{
      type: Boolean
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
}
</script>
<style lang="scss" scoped>
@import "../ui.scss";
.scheduleheader--table{
  height: 96px;
  overflow: hidden;
  transition: all .2s ease-in-out;
  &.close {
    height: 0;
  }
}
.scheduleheader--cell{
  height:48px;
  border-top:1px solid $grid-color;
  position: relative;
  text-align: center;
  &:before {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: $grid-color;
  }
}
</style>