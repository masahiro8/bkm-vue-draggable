<template>
  <div clss="scheduler">
    <div ref="header" class="header">
      <div class="headerLabel">
        <slot name="headerLabel" :onchange="onChange" ></slot>
      </div>
    </div>
    <div ref="body" class="body" :style="getScrollStyle">
      <div class="bodyLabel">
        <slot name="bodyLabel"></slot>
      </div>
      <div class="bodyMain">
        <slot name="bodyMain"></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data: () => {
      return {
        bodyRect: {},
        scrollMarginBottom: 16,
      };
    },
    mounted() {
      window.addEventListener("resize", () => {
        this.windowSizeChange();
      });
      this.windowSizeChange();
    },
    computed: {
      getScrollStyle() {
        return `top:${-4}px;height:${this.bodyRect.height}px`;
      },
    },
    methods: {
      onChange(){
        setTimeout(()=>{
          this.windowSizeChange();
        },200);
      },
      windowSizeChange() {
        const headerrect = this.$refs.header.getBoundingClientRect();
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
  }
</style>
