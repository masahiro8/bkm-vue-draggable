<template>
  <div>
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
        :ticketId="ticket.ticketId"
        :fitGridY="CONFIG.grid15min"
      >{{ticket.title}}</DraggableTicket>
    </DragTarget>
  </div>  
</template>
<script>
import { CONFIG_SCHEDULER } from "@/statics/config";
import DragTarget from "../draggable/DragTarget";
import DraggableTicket from "../draggable/DraggableTicket";
export default {
  data: () => {
      return {
        CONFIG: CONFIG_SCHEDULER,
        TICKETS:[
          {ticketId:90000,title:"設計", color:"#ffff00"},
          {ticketId:90001,title:"資料作成", color:"#ff8800"},
          {ticketId:90002,title:"調書作成", color:"#ff0000"}
        ]
      };
    },
  components:{
    DragTarget,
    DraggableTicket
  }
}
</script>
<style lang="sass" scoped>

</style>