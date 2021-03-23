<template>
  <div class="tooltip_body">
    <div>{{content.startTime}} - {{content.endTime}}</div>
  </div>
</template>
<script>
export default {
  data:()=>{
    return {
      content:{
        date:null,
        startTime:null,
        endTime:null,
      }
    }
  },
  props:{
    tooltipValue:{
      type:Object,
    }
  },
  watch:{
    tooltipValue:{
      immediate:true,
      deep:true,
      handler(newValue,oldValue) {
        if(JSON.stringify(newValue)!==JSON.stringify(oldValue)) {
          let _content = {...this.content};
          _content.date = newValue.item.date;
          _content.startTime = newValue.item.startTime;
          _content.endTime = newValue.item.endTime;
          this.content = _content;
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip_body{

}
</style>