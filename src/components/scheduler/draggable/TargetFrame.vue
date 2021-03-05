<template>
  <div class="DayFrame">
      <div class="DayFrame-name">{{type.name}}</div>
      <slot/>
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
  },
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