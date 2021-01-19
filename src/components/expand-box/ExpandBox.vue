<template>
  <div class="expandbox" ref="root">
    <DraggableVertical
      ref="parent"
      name="parent"
      :fixY="fixY"
      :targetRect="rootRect"
      :initialPosition="initialPosition.parent"
      :fitGridY="8"
      :forceHeight="16"
      @set-rect="setHandleRectTop"
      v-slot="{ params }"
      ><DraggableVertical
        ref="child"
        name="child"
        :targetRect="params.rect"
        :initialPosition="initialPosition.child"
        :fitGridY="8"
        :forceHeight="16"
        @set-rect="setHandleRectBottom"
        >Bottom</DraggableVertical
      ></DraggableVertical
    >
    <div class="expandbox--frame" :style="frameStyle"></div>
  </div>
</template>
<script>
import DraggableVertical from "./DraggableVertical";
export default {
  data: () => {
    return {
      handleRects: {
        top: { x: null, y: null, width: null, height: null },
        bottom: { x: null, y: null, width: null, height: null },
      },
      rootRect: { x: null, y: null, width: null, height: null },
      parentRect: { x: null, y: null, width: null, height: null },
    };
  },
  props: {
    fixY: {
      type: Boolean,
    },
    initialPosition: {
      type: Object,
      defaultValue: {
        parent: { x: 0, y: 0 },
        child: { x: 0, y: 200 },
      },
    },
  },
  components: {
    DraggableVertical,
  },
  computed: {
    frameStyle() {
      return `top:${this.handleRects.top.y}px;height:${
        this.handleRects.bottom.y + this.handleRects.bottom.height
      }px;`;
    },
  },
  mounted() {
    const rootRect = this.$refs.root.getBoundingClientRect();
    this.rootRect = {
      x: rootRect.x,
      y: this.fixY ? 0 : rootRect.y,
      width: rootRect.width,
      height: rootRect.height,
    };
  },
  methods: {
    setHandleRectTop(rect) {
      let handleRects = { ...this.handleRects };
      handleRects.top = rect;
      this.handleRects = handleRects;
    },
    setHandleRectBottom(rect) {
      let handleRects = { ...this.handleRects };
      handleRects.bottom = rect;
      this.handleRects = handleRects;
    },
  },
};
</script>
<style lang="scss" scoped>
.expandbox {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #eee;
}
.expandbox--frame {
  background-color: red;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
}
</style>