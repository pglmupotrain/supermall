<template>
  <grid-view>
    <goods-list-item v-for="(item, index) in categoryDetail" :key="index" :goods-item="item"></goods-list-item>
  </grid-view>
</template>

<script>
  import GridView from 'components/common/gridView/GridView'
  //import GoodsListItem from 'views/home/childComps/GoodsListItem'
  import GoodsListItem from 'components/content/goods/GoodsListItem' //<==这个GoodsListItem和上一个不一样？

  export default {
    name: "TabContentDetail",
    components: {
      GridView,
      GoodsListItem
    },
    props: {
      categoryDetail: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
