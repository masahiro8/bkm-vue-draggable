<template>
  <div class="page">
    <div class="pageHeader">
      <slot name="pageHeader" />
    </div>
    <div class="pageBody">
      <div class="pageBody--main">
        <slot name="pageBodyMain" />
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>

.page{
  background-color: #eee;
  height: 100%;
}
.pageHeader {
  height: 48px;
}
.pageBody {
  display: flex;
  height: 100%;
}
.pageBody--main {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
}
</style>