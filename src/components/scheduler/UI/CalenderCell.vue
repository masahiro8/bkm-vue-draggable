<template>
  <div class="cell">
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .cell {
    height: 100%;
  }
  .cell__top{
    height: 50%;
  }
  .cell__bottom{
    height: 50%;
  }
</style>