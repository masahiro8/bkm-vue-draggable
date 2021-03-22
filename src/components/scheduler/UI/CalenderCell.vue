<template>
  <div class="cell" :style="getStyle()">
    <div class="cell__top"></div>
    <div class="cell__bottom"></div>
  </div>
</template>
<script>
export default {
  props:{
    year:{
      type:Number,
    },
    month:{
      type:Number
    },
    day:{
      type:Number
    },
    enable:{
      type:Boolean
    },
    today:{
      type:Boolean
    },
    holiday:{
      type: Object,
    }
  },
  methods:{
    getStyle(){
      if(this.holiday && !this.holiday.color) return '';
      let style = '';
      style += `background-color:${this.holiday.color};`;
      return style;
    }
  }
}
</script>
<style lang="scss" scoped>
  .cell {
    height: 100%;
    padding:0;
  }
  .cell__top{
    height: 50%;
  }
  .cell__bottom{
    height: 50%;
  }
</style>