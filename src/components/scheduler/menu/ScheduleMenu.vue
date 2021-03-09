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
        :ticket="ticket"
        :fitGridY="CONFIG.grid15min"
      >{{ticket.title}}</DraggableTicket>
    </DragTarget>
  </div>  
</template>
<script>
import { CONFIG_SCHEDULER } from "@/statics/config";
import DragTarget from "../draggable/DragTarget";
import DraggableTicket from "../draggable/DraggableTicket";
import { dragStore } from "../DragStore";

export default {
  data: () => {
      return {
        CONFIG: CONFIG_SCHEDULER,
        TICKETS:dragStore.getTags()
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