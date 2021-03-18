<template>
  <div class="DayFrame"
    :style="getStyle()"
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
    },
    holiday:{
      type: Object,
    }
  },
  methods:{
    getStyle(){
      let style = 'min-width:' + (this.config.targetWidth * this.config_reserve_type_ids.length) + 'px;';
      if(this.holiday && !this.holiday.color) return style;
      
      style += `background-color:${this.holiday.color};`;
      return style;
    }
  }
}
</script>
<style lang="scss" scoped>
.DayFrame{
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  flex:1;
  border-left:1px solid #ddd;
}
.DayFrame-name{
  font-size:8px;
  flex:1;
}
</style>