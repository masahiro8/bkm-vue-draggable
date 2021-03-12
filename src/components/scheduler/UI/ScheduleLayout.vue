<template>
  <div clss="scheduler">
    <div ref="header" class="header">
      <div ref="headerLabel" class="headerLabel">
        <slot name="headerLabel" :onChangeLayout="onChangeLayout" ></slot>
      </div>
    </div>
    <div ref="body" class="body" :style="getScrollStyle">
      <div class="bodyLabel">
        <slot name="bodyLabel"></slot>
      </div>
      <div ref="bodyMain" class="bodyMain" :style="getInnerStyle">
        <slot name="bodyMain"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { CONFIG_SCHEDULER } from "../config";
import { UIObserver } from "../store/ScheduleStore";
  export default {
    data: () => {
      return {
        bodyRect: {},
        scrollMarginBottom: 16,
      };
    },
    props:{
      innerHeight:{
        type:Number,
        defaultValue: CONFIG_SCHEDULER.innerHeight
      }
    },
    mounted() {
      //windowサイズの監視
      window.addEventListener("resize", () => {
        this.windowSizeChange();
      });
      this.windowSizeChange();

      //スクロールの監視
      const body = this.$refs.body;
      const bodyMain = this.$refs.bodyMain;
      body.addEventListener("scroll",()=>{
        const bodyRect = body.getBoundingClientRect();
        const bodyMainRect = bodyMain.getBoundingClientRect();
        const scroll = bodyMainRect.top - bodyRect.top - CONFIG_SCHEDULER.grid15min;
        UIObserver.putValue("bodyScroll",scroll);
      })
      UIObserver.putValue("bodyScroll",0);
      
    },
    computed: {
      getScrollStyle() {
        return `top:${-4}px;height:${this.bodyRect.height}px`;
      },
      getInnerStyle(){
        return `height:${this.innerHeight}px`;
      }
    },
    methods: {
      onChangeLayout(){
        setTimeout(()=>{
          this.windowSizeChange();
        },200);
      },
      windowSizeChange() {
        const headerrect = this.$refs.header.getBoundingClientRect();
        // const headerLabelRect = this.$refs.headerLabel.getBoundingClientRect();
        UIObserver.putValue("headerRect",{
          top:headerrect.top ,
          height:headerrect.height - (CONFIG_SCHEDULER.grid15min*2)
        });
        this.bodyRect = {
          top: headerrect.top + headerrect.height,
          height:
            window.innerHeight -
            (headerrect.top + headerrect.height) -
            this.scrollMarginBottom,
        };
      },
    },
  };
</script>
<style lang="scss" scoped>
  .scheduler{
  }
  .body {
    display: inline-flex;
    overflow-x: visible;
    overflow-y: scroll;
    position: relative;
    min-width:100%;
    transition: height .1s ease-out;
  }
  .header {
    display: inline-flex;
    margin-bottom: 8px;
    min-width:100%;
  }
  .headerLabel {
    box-shadow: 0 2px 2px rgba(104, 85, 85, 0.2);
    flex:1;
  }
  .bodyLabel {
    display: flex;
  }
  .bodyMain {
    display: flex;
    flex:1;
    overflow: hidden;
  }
</style>
