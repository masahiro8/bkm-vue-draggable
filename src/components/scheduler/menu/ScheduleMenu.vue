<template>
  <div class="dragMenu">
    <div class="dragMenu__header">
      <div class="header__bar"></div>
      <div class="header__id">21-0000-3200</div>
      <div class="header__title">駅前工事</div>
      <div class="header__toggle">
        <ToggleBtn @onChange="toggleMenu" />
      </div>
    </div>
    <div class="dragMenu__body" :class="toggleOpen?'show':''" :style="getBodyHeight">
      <DragTarget
        ref="TicketTarget"
        :type_id="9999"
        :fit0="{ x: true, y: false }"
        :limit="{ vertical: true, horizontal: false }"
        :isClickToAdd="false"
        v-slot="{ params }"
      >
        <DraggableTicket
          v-for="(ticket,index) in TICKETS"
          :key="ticket.ticketId"
          :index="index"
          :target="params.targetRef"
          :ticket="ticket"
          :fitGridY="CONFIG.grid15min"
          :bodyScroll="bodyScroll"
          :isHeaderTableOpen="isHeaderTableOpen"
          :headerRect="headerRect"
          :bodyMainRect="bodyMainRect"
        >{{ticket.title}}</DraggableTicket>
      </DragTarget>
    </div>
    <div class="dragMenu__footer"></div>
  </div>  
</template>
<script>
import { CONFIG_SCHEDULER } from "../config";
import DragTarget from "../draggable/DragTarget";
import DraggableTicket from "../draggable/DraggableTicket";
import { dragStore } from "../DragStore";
import ToggleBtn from "../UI/ToggleBtn";
 
export default {
  data: () => {
      return {
        toggleOpen:true,
        CONFIG: CONFIG_SCHEDULER,
        TICKETS:[]
      };
    },
  components:{
    DragTarget,
    DraggableTicket,
    ToggleBtn
  },
  mounted(){
    this.TICKETS = dragStore.getTags();
  },
  props:{
    bodyScroll:{
      type:Number,
      defaultValue: 0
    },
    isHeaderTableOpen:{
      type:Boolean
    },
    headerRect:{
      type:Object
    },
    bodyMainRect:{
      type:Object
    }
  },
  computed:{
    //チケット数から高さを返す
    getBodyHeight(){
      const ticket_height = 27;
      const body_height = ticket_height * this.TICKETS.length;
      return `height:${body_height}px`;
    }
  },
  methods:{
    toggleMenu(v){
      this.toggleOpen = v;
    }
  }
}
</script>
<style lang="scss" scoped>
  .dragMenu {
    border-radius: 4px;
    background-color: white;
    box-sizing: border-box;
    padding-bottom:8px;
    margin:8px;
  }
  .dragMenu__header{
    height:48px;
    position: relative;
    display: flex;
    justify-content:center;
    align-items: flex-start;
    flex-direction: column;

    .header__bar{
      width:4px;
      height:100%;
      background-color: red;
      border-top-left-radius: 4px;
      position: absolute;
      left:0;
      top:0;
    }
    .header__id{
      text-align: left;
      font-size:10px;
      color:#898A8D;
      margin-left:8px;
    }
    .header__title{
      text-align: left;
      font-size:10px;
      font-weight: 600;
      margin-left:8px;
    }
  }
  .dragMenu__body{
    height:auto;
    display: none;
    &.show{
      display: block;
    }
  }
  .dragMenu__footer{
    height:4px;
  }
  .header__toggle{
    position: absolute;
    bottom:0;
    right:0;
    .btn{
      width:28px;
      text-align: center;
    }
  }
</style>