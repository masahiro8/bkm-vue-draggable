<template>
  <div>
    <div ref="header" class="header">
      <div class="headerLabel">
        <slot name="headerLabel"></slot>
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
  .header {
  }
  .body {
    display: flex;
    overflow: scroll;
    position: relative;
  }
  .header {
    display: flex;
    margin-bottom: 8px;
  }
  .headerLabel {
    display: flex;
    width: 100%;
    box-shadow: 0 2px 2px rgba(104, 85, 85, 0.2);
  }
  .bodyLabel {
    display: flex;
  }
  .bodyMain {
    display: flex;
    width: 100%;
  }
</style>
