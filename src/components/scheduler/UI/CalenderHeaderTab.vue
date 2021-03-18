<template>
  <div class="calenderHeader--tab">
    <router-link v-for="type in scheduler_types"
      :key="type.id"
      :to="type.to"
      class="tab--item"
      :class="scheduleTypeId===type.id?'select':''"
    >
      <div>{{type.title}}</div>
    </router-link>
  </div>
</template>
<script>
import {SCHEDULER_TYPE } from "../config";

export default {
  data:()=>{
    return {
      scheduler_types: SCHEDULER_TYPE
    }
  },
  props:{
    scheduleTypeId:{
      type: Number
    }
  }
}
</script>
<style lang="scss" scoped>

.calenderHeader--tab {
  display: flex;
  height: 32px;
  padding: 0 16px;
  align-items: center;

  .tab--item {
    padding: 4px 8px;
    min-width:48px;
    min-height:16px;
    text-decoration: none;
    color: black;
    opacity: 0.5;
    font-size:10px;
    background-color: #fbfbfb;
    text-align: center;
    box-sizing: border-box;

    &.select{
      font-weight: bold;
      background-color: #eee;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
}
</style>