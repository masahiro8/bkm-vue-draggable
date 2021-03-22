<template>
  <div class="scheduler__calender">
    <table class="calender">
      <tr>
        <th class="calender__label"
          v-for="(day,index) in calenderLabel"
          :key="index"
          :style="getLabelStyle(index)"
        >{{day}}</th>
      </tr>
      <tr class="calender__week" v-for="(week,index) in calenderData" :key="index">
        <td class="calender__day" v-for="day in week" :key="day.day" :class="getClass(day)">
          <button class="day__label" :disable="day.enable" @click="update(day.day)">
            <div class="day__number">{{day.day}}</div>
          </button>
          <CalenderCell
            :year="year"
            :month="month"
            :day="day.day"
            :enable="day.enable"
            :today="day.today"
            :holiday="getHoliday(day.day)"
          />
        </td>
      </tr>
    </table>
  </div>  
</template>
<script>
import { Calender } from "../scheduler/util/calender";
import CalenderCell from "../scheduler/UI/CalenderCell";
import { getDateObjectFromDateFormat } from "./util/timeUtil";
import { HOLIDAY_TYPE } from "../scheduler/config";

export default {
  data:()=>{
    return {
      year:null,
      month:null,
      calenderLabel:null,
      calenderData:null,
    }
  },
  props:{
    todayObject:{
      type: Object,
    },
    holiday:{
      type: Object
    },
  },
  components:{
    CalenderCell
  },
  mounted(){
    this.$watch(
      () => [this.todayObject],
      (newValue) => {
        const {year,month,day} = newValue[0];
        const cal = Calender({year,month,day});
        this.calenderLabel = cal.getDayOfWeekLabel();
        let calenderData = cal.getDaysOfMonth();
        this.year = year;
        this.month = month;

        //選択日にcheck追加
        calenderData = calenderData.map(week=>{
          return week.map( w_day => {
            const _day = {...w_day};
            _day.today = +_day.day == +day;
            return _day;
          })
        });

        //6行目の有無
        const show6Line = calenderData[5].filter(d=>{
          return d.enable;
        });
        if(show6Line.length == 0) {
          calenderData[5] = null;
        }
        this.calenderData = calenderData;
      },
      {
        immediate:true,
        deep:true
      });
  },
  methods:{
    getClass(day){
      let classes = "";
      classes += day.enable?'':'disable '
      classes += day.enable&&day.today?'today ':'';
      return classes;
    },
    getLabelStyle(index){
      let h = HOLIDAY_TYPE.WEE;
      if( index === 0 ) h = HOLIDAY_TYPE.SUN;
      if( index === 6 ) h = HOLIDAY_TYPE.SAT;
      return `background-color:${h.color};`;
    },
    update(d){
      const ndate = new Date(`${this.year}-${this.month}-${d}`);
      const dateObject = getDateObjectFromDateFormat(ndate);
      this.$emit("updateDate", dateObject);
    },
    getHoliday(day){
      const _month = `${this.month}`.padStart(2,"0");
      const _day = `${day}`.padStart(2,"0");
      return this.holiday[`${this.year}-${_month}-${_day}`];
    }
  }
}
</script>
<style lang="scss" scoped>

table {
    border-spacing: 0;
    border-collapse: collapse;
}
td,th {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: center;
  &:first-child {
    color: #DD2667;
  }
  &:last-child {
    color: #0000FF;
  }
}

.scheduler__calender{
  width: calc(100% - 32px);
  margin:16px;
  box-sizing: border-box;
}
.calender__label{
  height:35px;
  font-size:13px;
  background-color: #fafafa;
}
.calender{
  width: 100%;
  background-color: white;
}
.calender__day {
  position: relative;
  height: 100px;
  padding:0;

  &.today {
    .day__label{
      color:white;
      &:before{
        content:"";
        position: absolute;
        top:0;
        left:0;
        width:36px;
        height:36px;
        z-index: 0;
        background-color: blue;
        border-radius:18px;
      }
    }
  }

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
  position: absolute;
  top:16px;
  right:16px;
  width:36px;
  height:36px;
  font-size: 24px;
  background:none;
  border:none;
  outline:none;
  text-align: center;
  padding:0;

  .day__number{
    position: relative;
    z-index: 1;
  }

  &:hover{
    cursor: pointer;
    &:before{
      content:"";
      position: absolute;
      top:0;
      left:0;
      width:36px;
      height:36px;
      z-index: 0;
      background-color: #ddd;
      border-radius:18px;
    }
  }
}

</style>