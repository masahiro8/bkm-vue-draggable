<template>
  <div class="scheduler">
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
        <div class="bodyHeaderLabel">
          <slot name="bodyHeaderLabel"></slot>
        </div>
        <div class="bodyMainScroll">
          <slot name="bodyMain"></slot>
        </div>
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
        const _bodyMainRect = bodyMain.getBoundingClientRect();
        const bodyMainRect = {
          x:_bodyMainRect.x,
          y:_bodyMainRect.y,
          left:_bodyMainRect.left,
          top:_bodyMainRect.top,
          width:_bodyMainRect.width,
          height:_bodyMainRect.height
        }
        const scroll = bodyMainRect.top - bodyRect.top - CONFIG_SCHEDULER.grid15min;
        // console.log("scroll",_bodyMainRect,bodyMainRect, CONFIG_SCHEDULER.grid15min);
        UIObserver.putValue("bodyScroll",scroll);
        UIObserver.putValue("bodyMainRect",bodyMainRect);
      });

      //初期設定する
      const bodyRect = body.getBoundingClientRect();
      const _bodyMainRect = bodyMain.getBoundingClientRect();
      const bodyMainRect = {
        x:_bodyMainRect.x,
        y:_bodyMainRect.y,
        left:_bodyMainRect.left,
        top:_bodyMainRect.top,
        width:_bodyMainRect.width,
        height:_bodyMainRect.height
      }
      const scroll = bodyMainRect.top - bodyRect.top - CONFIG_SCHEDULER.grid15min;
      UIObserver.putValue("bodyScroll",scroll);
      UIObserver.putValue("bodyMainRect",bodyMainRect);
      
    },
    computed: {
      getScrollStyle() {
        return `top:${8}px;height:${this.bodyRect.height}px`;
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
        UIObserver.putValue("headerRect",{
          top:headerrect.top ,
          height:headerrect.height
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
<style lang="scss">
  @import "./ui.scss";
  @import "./uiTable.scss";
</style>
<style lang="scss" scoped>
  .body {
    display: inline-flex;
    overflow-x: hidden;
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
    position: sticky;
    left:0;
    min-width: 42px;
    justify-content: flex-end;
  }
  .bodyMain {
    position:relative;
    min-width:calc(100% - 32px);
  }
  .bodyMainScroll{
    display: flex;
    flex:1;
    overflow: hidden;
  }
  .bodyHeaderLabel{
    position: sticky;
    top:0;
    left:0;
    height: 24px;
    flex:1;
    background-color: white;
    z-index: 3;
    display: flex;
    border-bottom:1px solid #ddd;
  }
  .scheduler{
    margin-right:8px;
  }
</style>
