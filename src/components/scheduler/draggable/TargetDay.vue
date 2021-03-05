<template>
  <div class="MainTable">
    <slot :types="types" />
  </div>
</template>
<script>
import { dragStore } from "../DragStore";
export default {
  data: () => {
    return {
      //属性に分類
      types: {
        //日付
        date:null,
        //属性
        config:[],
        //属性ごとのデータに分類
        lists: {},
      },
    };
  },
  props: {
    date: {
      type: String,
    },
    config_reserve_type_ids: {
      type: Array
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      dragStore.setCallback(({ allItems }) => {

        //日付ごとのデータを取得
        const items = allItems.filter((item) => {
          return item.date === this.date;
        });

        //属性ごとのデータに分類
        const types = {...this.types};
        types.config = this.config_reserve_type_ids;
        types.date = this.date;
        this.config_reserve_type_ids.forEach( type => {
           const list = items.filter(item => {
             return item.type_id === type.type_id;
           });
           if(type.type_id in types.lists == false) {
             types.lists[`${type.type_id}`] = {};
           }
           types.lists[`${type.type_id}`] = list;
        });
        this.types = types;
      });
    },
  }
}
</script>
<style lang="scss" scoped>
  .MainTable {
    display: flex;
    width: 100%;
  }
</style>