<template>
  <div class="DayFrame" :style="style">
      <div class="DayFrame-name">{{type.name}}</div>
      <slot/>
  </div>
</template> 
<script>
import { CONFIG_SCHEDULER } from "../config";
export default {
  data:()=>{
    return {
    }
  },
  props:{
    type:{
      type:Object
    },
    innerHeight:{
      type:Number,
      defaultValue: CONFIG_SCHEDULER.innerHeight
    }
  },
  computed:{
    style(){
      return `height:${this.innerHeight}px`;
    }
  }
}
</script>
<style lang="scss" scoped>
.DayFrame{
  width:100%;
}
.DayFrame-name{
  font-size:8px;
}
</style>