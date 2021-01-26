<template>
  <div>
    <div class="header">
      <div class="headerLabel"><slot name="headerLabel"></slot></div>
    </div>
    <div class="body">
      <div class="bodyLabel"><slot name="bodyLabel"></slot></div>
      <div class="bodyMain"><slot name="bodyMain"></slot></div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.header {
}
.body {
  display: flex;
}
.bodyLabel {
  display: flex;
}
.bodyMain {
  display: flex;
}
</style>