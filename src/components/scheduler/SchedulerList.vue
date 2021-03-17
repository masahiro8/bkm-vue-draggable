<template>
  <div ref="schedulerList" class="scheduler__list" :style="listHeight">
    <slot :list="list" />
  </div>  
</template>
<script>
import { Calender } from "./util/calender";

export default {
  data:()=>{
    return {
      year:null,
      month:null,
      calenderData:null,
      listRect:{top:null,height:null},
      list:[]
    }
  },
  props:{
    todayObject:{
      type: Object,
    },
  },
  mounted(){
    window.addEventListener("resize",()=>{
      this.onResize();
    });
    this.onResize();

    this.$watch(
      () => [this.todayObject],
      (newValue) => {
        const {year,month,day} = newValue[0];
        const cal = Calender({year,month,day});
        let calenderData = cal.getDaysOfList();
        this.year = year;
        this.month = month;

        //選択日にcheck追加
        calenderData = calenderData.map(w_day=>{
          const _day = {...w_day};
          _day.today = +_day.day == +day;
          return _day;
        });
        this.list = calenderData;
      },
      {
        immediate:true,
        deep:true
      }
    );
  },
  computed:{
    listHeight(){
      return `height:${this.listRect.height}px`;
    }
  },
  methods:{
    onResize(){
      const rect = this.$refs.schedulerList.getBoundingClientRect();
      const listRect = {
        top:rect.top,
        height:window.innerHeight - rect.top - 16,//マージン16px
      }
      this.listRect = listRect;
    },
  }
}
</script>
<style lang="scss" scoped>

.scheduler__list{
  overflow-y: auto;
  width: calc(100% - 32px);
  margin:16px;
  box-sizing: border-box;
  background-color: white;
}

table {
    border-spacing: 0;
    border-collapse: collapse;
}

.calender__day {
  position: relative;
  height: 100px;

  &.disable{
    .day__label{
      color:#ccc;
      pointer-events: none;
      &:hover{
        cursor: default;
        &:before{
          display: none;
        }
      }
    }
  }
}

.day__label{
  .day__number{
    position: relative;
    z-index: 1;
  }
}

</style>