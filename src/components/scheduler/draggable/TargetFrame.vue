<template>
  <div class="DayFrame" :style="style()">
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
    },
  },
  methods:{
    style(){
      let _style =`height:${this.innerHeight}px;`;
      return _style;
    }
  }
}
</script>
<style lang="scss" scoped>
.DayFrame{
  width:100%;
}
</style>