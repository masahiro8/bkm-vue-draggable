<template>
  <div class="DayFrame"
    :style="'min-width:' + (config.targetWidth * config_reserve_type_ids.length) + 'px;'"
  >
    <div
      v-for="(type,index) in config_reserve_type_ids"
      :key="index"
      class="DayFrame-name"
    >
      {{type.name}}
    </div>
  </div>
</template> 
<script>
export default {
  data:()=>{
    return {
    }
  },
  props:{
    type:{
      type:Object
    },
    config: {
      type: Object,
    },
    config_reserve_type_ids:{
      type:Array
    }
  },
}
</script>
<style lang="scss" scoped>
.DayFrame{
  width:100%;
  height:16px;
  display: flex;
  flex:1;
  border-left:1px solid #ddd;
}
.DayFrame-name{
  font-size:8px;
  flex:1;
}
</style>