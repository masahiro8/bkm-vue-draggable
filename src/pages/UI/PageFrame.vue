<template>
  <div class="page">
    <div class="pageHeader">
      <slot name="pageHeader" />
    </div>
    <div class="pageBody">
      <div class="pageBody--side">
        <slot name="pageBodySide" />
      </div>
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
}
.pageBody--side {
  width: 180px;
}
.pageBody--main {
  position: absolute;
  left: 180px;
  width: calc(100% - 180px);
  background-color: #F4F4F4;
}
</style>