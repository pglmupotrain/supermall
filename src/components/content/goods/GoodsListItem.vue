<template>
  <div class="goods-item" @click="itemClick">
  <img v-lazy="showImage" alt="" @load="imageLoad" :key="showImage"/>
  <div class="goods-info">
    <p>{{goodsItem.title}}</p>
    <span class="price">{{goodsItem.price}}</span>
    <span class="collect">{{goodsItem.cfav}}</span>
  </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showImage() {
      //为什么逻辑或||的左右侧代码互换位置就会出问题？
      return this.goodsItem.img || this.goodsItem.image || (this.goodsItem.show && this.goodsItem.show.img)
    }
  },
  mounted: function () {
      //console.log("打印goodsItem------",this.goodsItem);
  },
  methods: {
    imageLoad() {
      this.$bus.$emit('itemImgLoad')


/*      方案2：*/
/*      if(this.$route.path.indexOf('/home')) {
        this.$bus.$emit('homeItemImageLoad');
      } else if(this.$route.path.indexOf('/detail')) {
        this.$bus.$emit('detailItemImageLoad');
      }*/

    },
    itemClick() {

      //办法1：restful方式(例如：http://localhost:8080/detail/1m745k0)
      // 2.跳转到详情页面
      this.$router.push('/detail/' + this.goodsItem.iid)

      //办法2：query方式(例如：http://localhost:8081/detail?iid=1m70y5k)，但和我的路由配置不符。
      // 1.获取iid
      // let iid = this.goodsItem.iid;
      // this.$router.push({path: '/detail', query: {iid}}) 
      //↑↑ 为什么这样写不行？自答：对比老师和我的项目里的router/index.js里detail路由的配置的不同。
      //restful方式的显示：路由：/detail/:iid，对应：/detail/+ iid的值，直接拼接。
      //query方式的显示：路由：/detail，对应{path: '/detail', query: {iid}}。
    

    }
  }
}
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    /* position:relative，相对定位，这个定位是相对什么物体而言的？ */
    position: relative;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute; /* 为什么这里使用了绝对定位？ */
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;

  }



</style>
