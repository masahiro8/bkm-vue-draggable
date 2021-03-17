<template>
  <div class="page-scheduler">
    <div class="page-scheduler__body">
      <div class="page-scheduler__side">
        <slot name="pageBodySide" />
      </div>
      <div class="page-scheduler__main">
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
.page-scheduler__side {
  width: 180px;
  height: 100%;
}
.page-scheduler__main {
  position: absolute;
  left: 180px;
  width: calc(100% - 180px);
  background-color: #F4F4F4;
}
</style>