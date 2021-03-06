<template>
  <ScheduleLayout
    :innerHeight="getInnerHeight"
  >
    <!-- スケジュールヘッダー -->
    <template #headerLabel="{ onChangeLayout }">
      <ScheduleHeader
        :config="config"
        :config_reserve_type_ids="config_reserve_type_ids"
        :week="week" 
        :hasTable="true"
        :holiday="holiday"
        @onChange="onChangeLayout"
      />
    </template>
    <!-- 固定のテーブルヘッダーラベル -->
    <template #bodyHeaderLabel>
      <TableHeaderLabel 
        v-for="(date, index) in week"
        :key="index"
        :date="date"
        :config="config"
        :config_reserve_type_ids="config_reserve_type_ids"
        :innerHeight="getInnerHeight" 
        :holiday="holiday[date]"
      />
    </template>
    <!-- スケジュールラベル -->
    <template #bodyLabel>
      <!-- 時間表示 -->
      <GuideFrame :config="config" />
    </template>
    <!-- スケジュール表 -->
    <template #bodyMain>
      <!-- 曜日ごと＆属性ごとのデータに分類 -->
      <TargetDay
        v-for="(date, index) in week"
        :key="index"
        :date="date"
        :config_reserve_type_ids="config_reserve_type_ids"
        :innerHeight="getInnerHeight"
      >
        <!-- 属性ごとのテーブルを作成 -->
        <TargetFrame
          v-for="(type,frame_index) in config_reserve_type_ids"
          :key="frame_index"
          :type="type"
          :innerHeight="getInnerHeight"
        >
          <DragTarget
            :date="date"
            :type_id="type.type_id"
            :types_size="config_reserve_type_ids.length"
            :frame_index="frame_index"
            :grid="{ x: 1, y: config.grid15min }"
            :fit0="{ x: true, y: false }"
            :limit="{ vertical: true, horizontal: false }"
            :style="getStyle"
            :isClickToAdd="config.isClickToAdd"
            :isDropTarget="type.isDropTarget"
            v-slot="{ params }"
          >
            <!-- フレーム内の後ろに表示 -->
            <ListBox 
              :isDropTarget="type.isDropTarget"
              :index="index"
              :last="index === week.length - 1"
              :holiday="holiday[date]"
            ></ListBox>
            <!-- 背景のグリッド線 -->
            <GridFrame :config="config" />
            <!-- 出社/退社ライン -->
            <ScheduleLine time="09:00" :fitGrid="params.grid" color="ff0000" />
            <ScheduleLine time="17:00" :fitGrid="params.grid" color="0000ff" />
            <!-- スケジュール表示 -->
              <DraggableItem
                v-for="item in params.lists"
                :key="item['itemId']"
                :itemId="item['itemId']"
                :item="item"
                :type_id="type.type_id"
                :date="date"
                :isTargetDetect="true"
                :fixHorizontal="true"
                :fixVertical="false"
                :fitGridX="params.grid.x"
                :fitGridY="params.grid.y"
                @onclick="onClickItem"
                @onhover="onHoverItem"
                v-slot="{
                  target,
                  position,
                  expand,
                  expandCallback,
                  fitGrid,
                  isMoving,
                  startTime,
                }"
              >
                <!-- スケジュール内の予定 -->
                <DraggableExpandBox
                  :initialPosition="{
                    position,
                    expand,
                  }"
                  :target="target"
                  :fitGrid="fitGrid"
                  :isMoving="isMoving"
                  @callback-expand="expandCallback"
                  v-slot="{ expandTime, isDragging }"
                >
                  <!-- アイテム内の表示UI -->
                  <ItemBox
                    :id="item['itemId']"
                    :isMoving="isMoving"
                    :isDragging="isDragging"
                    :date="date"
                    :startTime="startTime"
                    :expandTime="expandTime"
                  /> </DraggableExpandBox
              ></DraggableItem>
          </DragTarget>
        </TargetFrame>
      </TargetDay>
      <!-- ツールチップ -->
      <Tooltip
        v-slot="{tooltipValue}"
      >
        <TooltipBody :tooltipValue="tooltipValue" />
      </Tooltip>
    </template>
  </ScheduleLayout>
</template>

<script>
  import TargetDay from "./draggable/TargetDay";
  import TargetFrame from "./draggable/TargetFrame";
  import DraggableItem from "./draggable/DraggableItem";
  import DragTarget from "./draggable/DragTarget";
  import DraggableExpandBox from "./expand/DraggableExpandBox";
  import ItemBox from "./UI/ItemBox";
  import ListBox from "./UI/ListBox";
  import GridFrame from "./UI/GridFrame";
  import GuideFrame from "./UI/GuideFrame";
  import ScheduleLayout from "./UI/ScheduleLayout";
  import ScheduleHeader from "./ScheduleHeader";
  import TableHeaderLabel from "./UI/TableHeaderLabel";
  import ScheduleLine from "./UI/ScheduleLine";
  import { CONFIG_SCHEDULER,HOLIDAY_TYPE } from "./config";
  import { Tooltips } from "./store/ScheduleStore";
  import Tooltip from "./tooltip/Tooltip";
  import TooltipBody from "./UI/TooltipBody";

  export default {
    name: "Scheduler",
    data: () => {
      return {
        gridLines: [],
        resizeHeader:false,
        HOLIDAY_TYPE
      };
    },
    props: {
      config: {
        type: Object,
      },
      week: {
        type: Array,
      },
      config_reserve_type_ids:{
        type: Array,
      },
      holiday:{
        type: Object
      }
    },
    components: {
      TargetDay,
      TargetFrame,
      DraggableItem,
      DragTarget,
      DraggableExpandBox,
      ScheduleLayout,
      ScheduleHeader,
      TableHeaderLabel,
      ItemBox,
      ListBox,
      GridFrame,
      GuideFrame,
      ScheduleLine,
      Tooltip,
      TooltipBody
    },
    computed: {
      getStyle() {
        const height = this.config.hour * this.config.grid15min * 4;
        return `min-width:${this.config.targetWidth}px;height:${height}px;`;
      },
      getInnerHeight() {
        return CONFIG_SCHEDULER.innerHeight;
      }
    },
    methods:{
      onClickItem({itemId,item}){
        console.log(itemId,item);
      },
      onHoverItem({itemId,item,point}){
        //ツールチップ表示フラグ
        if(!this.config.isTooltipOnSchedule) return;
        if(itemId && item && point){
          Tooltips.setValues([{itemId,item,point}]);
        }else {
          Tooltips.setValues([]);
        }
      }
    }
  };
</script>
