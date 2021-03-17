<template>
  <div class="page-scheduler">
    <div class="page-scheduler__body">
      <div class="page-scheduler--main">
        <slot name="pageBodyMain" />
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>

.page-scheduler{
  background-color: #eee;
  height: 100%;
}
.page-scheduler__body {
  display: flex;
  height: 100%;
}
.page-scheduler--main {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
}
</style>