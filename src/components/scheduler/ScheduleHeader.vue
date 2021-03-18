<template>
  <div class="headerLabel">
    <div :style="'width:' + config.gideWidth + 'px;'">
      <!-- テーブル表示 -->
      <div v-if="hasTable">
        <!-- 開閉トグル -->
        <div class="headerLabel--togglebtn">
          <ToggleBtn @onChange="toggleTable" />
        </div>
        <!-- テーブルラベル -->
        <ScheduleHeaderTableLabel :isTableOpen="isTableOpen"/>
      </div>
    </div>
    <div class="headerLabel--labels">
      <div
        class="headerLabel--label"
        v-for="(date, index) in week"
        :key="index"
        :style="'min-width:' + (config.targetWidth * config_reserve_type_ids.length) + 'px;'"
      >
        <ScheduleLabel 
          :label="getLabel(date)"
          :holiday="holiday[date]"
        />
        <!-- テーブル表示 -->
        <div v-if="hasTable">
          <ScheduleHeaderTable
            :isTableOpen="isTableOpen"
            :holiday="holiday[date]"
          >
            <!-- 申請 -->
            <template v-slot:cell1>
              <!-- コンポーネントを作って、propsを渡す -->
            </template>
            <!-- 実績 -->
            <template v-slot:cell2>
              <!-- コンポーネントを作って、propsを渡す -->
            </template>
          </ScheduleHeaderTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ScheduleLabel from "./UI/ScheduleLabel";
  import ScheduleHeaderTable from "./UI/ScheduleHeader/ScheduleHeaderTable";
  import ScheduleHeaderTableLabel from "./UI/ScheduleHeader/ScheduleHeaderTableLabel";
  import { getLangDateFromDateFormat } from "./util/timeUtil";
  import ToggleBtn from "./UI/ToggleBtn";
  import {UIObserver} from "./store/ScheduleStore";

  export default {
    data:()=>{
      return {
        isTableOpen:true,
      }
    },
    components: {
      ScheduleLabel,
      ScheduleHeaderTable,
      ScheduleHeaderTableLabel,
      ToggleBtn
    },
    props: {
      config: {
        type: Object,
      },
      config_reserve_type_ids:{
        type: Array,
      },
      week: {
        type: Array,
      },
      hasTable: {
        type:Boolean,
        defaultValue:false
      },
      onchange:{
        type:Function
      },
      holiday:{
        type: Object,
      }
    },
    methods: {
      getLabel(date) {
        const label = getLangDateFromDateFormat({
          lang: "ja",
          date: date,
        });
        return `${label.dd}(${label.dayofweek})`;
      },
      toggleTable(v){
        this.$emit("onChange", v);
        this.isTableOpen = v;
        UIObserver.putValue("isHeaderTableOpen",v);
      }
    },
  };
</script>
<style lang="scss">
  .headerLabel--label {
    flex: 1;
    &:last-child{
      .scheduleheader--table{
        .scheduleheader--cell{
          &:before{
            display: none;
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .headerLabel {
    display: flex;
    background-color: white;
  }
  .headerLabel--labels {
    display: flex;
    flex: 1;
  }
  .headerLabel--label {
    flex: 1;
  }
  .headerLabel--togglebtn{
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>
