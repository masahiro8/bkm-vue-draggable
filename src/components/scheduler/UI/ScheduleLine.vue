<template>
  <div class="line" :style="getLineStyle">
    <div class="line__point" :style="getPointStyle"></div>
  </div>
</template>
<script>
 import {
    getYpxFromTime,
    getTimeObjectFromString
  } from "../util/timeUtil";
  
export default {
  data:()=>{
    return {
      position:{x:0,y:0}
    }
  },
  props:{
    time:{
      type:String
    },
    fitGrid: {
      type: Object,
    },
    color:{
      type: Number
    }
  },
  mounted(){
   this.$watch(
     ()=>[this.time,this.fitGrid],
     (newValue)=>{
       const time = newValue[0];
       const fitGrid = newValue[1];

       if(fitGrid && time) {
        const _time = getTimeObjectFromString(time);
        const localPosition = {
          x: 0,
          y: getYpxFromTime({ time: _time, grid15min: fitGrid.y }),
        };
        this.position = localPosition;
       }
     },
     {
       immediate:true,
       deep:true
      })
  },
  computed: {
      //現在の時間を取得
      getLineStyle() {
        return `top:${this.position.y}px;background-color:#${this.color};`;
      },
      getPointStyle(){
        return `background-color:#${this.color};`;
      },
    },
}
</script>
<style lang="scss" scoped>
  .line {
    user-select: none;
    position: absolute;
    width: 80%;
    left:10%;
    height:2px;
    background-color: red;
    z-index: 2;

    .line__point{
      width:8px;
      height:8px;
      border-radius: 4px;
      position: absolute;
      right:0;
      top:-3px;
      background-color: red;
    }

    &.hide {
      display:none;
    }
  }
</style>style