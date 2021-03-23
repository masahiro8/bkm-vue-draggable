<template>
  <div
    ref="tooltip"
    class="tooltip"
    v-if="isVisible"
    :style="styles"
  >
    <slot :tooltipValue="val"></slot>
  </div>
</template>
<script>
/**
 * スケジューラの予定のためのツールチップ
 * 予定以外での使用は想定していない
 * 
 * 予定以外で使う場合は、
 * 座標をグローバルに変えてスクロール量などを考慮しないといけない
 */
import {Tooltips} from "../store/ScheduleStore";
export default {
  data:()=>{
    return {
      val:null,
      x:0,
      y:0,
      style:'',
      bodyScroll:0,
      bodyMainRect:{},
    }
  },
  computed:{
    isVisible(){
      return this.val?true:false;
    },
    styles(){
      let style = '';
      style += `top:${this.y}px;left:${this.x}px;`;
      return style;
    }
  },
  mounted(){
    Tooltips.getCallback( values =>{
      this.val = values&&values.length>0?{...values[0]}:null;
      if(!this.val) return;
      this.x = this.val.point.x;
      this.y = this.val.point.y;
    })
  },
}
</script>
<style lang="scss" scoped>
.tooltip {
  position: fixed;
  height: auto;
  width: auto;
  max-width: 240px;
  background-color: white;
  border: 1px solid #efefef;
  border-radius: 4px;
  z-index: 999;
  cursor: none;
  pointer-events: none;
}
</style>