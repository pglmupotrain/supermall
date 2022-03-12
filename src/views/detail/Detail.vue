<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
<!-- ↑↑ 注意：@titleClick="titleClick"里，等号右侧只有 方法名 ，并没有(index)，但下面调用是有(index)的。
是我将vue和小程序的写法记混了？-->
    <scroll class="content2" ref="scroll"
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref='params' :param-info="paramInfo"/>
      <detail-comment-info ref='comment' :comment-info="commentInfo"/>
      <goods-list ref='recommend' :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from "./childComps/DetailBaseInfo"
import DetailShopInfo from "./childComps/DetailShopInfo"
import Scroll from "components/common/scroll/Scroll"
import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
import DetailParamInfo from "./childComps/DetailParamInfo"
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import GoodsList from "components/content/goods/GoodsList";
import {itemListenerMixin, backTopMixin} from "common/mixin";
import {debounce} from "../../common/utils";
import DetailBottomBar from "./childComps/DetailBottomBar";
import { mapActions } from 'vuex'


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar

  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: '',
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null

    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      //console.log('res======'+res);
      const data = res.result;
      //1.获取顶部的轮播图片数据
      this.topImages = data.itemInfo.topImages
      //2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
      //3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);
      //4.保存商品的详情数据
      this.detailInfo = data.detailInfo;
      //5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
      //6.取出评论的信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    })

    //3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    //4.给getThemeTopY赋值  疑问：为什么是在created里进行？
    this.getThemeTopY = debounce(() => {
      //获取[商品、参数、评论、推荐]四个模块对应的offsetTop值
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      //方案2：hacker做法，使用Number的最大值
      this.themeTopYs.push(Number.MAX_VALUE)

      console.log('themeTopYs======',this.themeTopYs);

    },100)

  },
  mounted() {
    //console.log('detail/mounted()');
    /*
        //1.监听item中图片加载完成(监听itemImgLoad事件)
        const refresh = debounce(this.$refs.scroll.refresh,500)
        this.itemImgListener = () => {
          refresh()
        }
        this.$bus.$on('itemImgLoad', this.itemImgListener)
    */

  },
  destroyed() {
    //1.取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
/*    ...mapActions({
      add: 'addCart'
    }),*/
    imageLoad() {
      //图片加载完，刷新scroll对象的scrollerHeight属性(即scroll的高度)
      this.$refs.scroll.refresh();

      //获取[商品、参数、评论、推荐]四个模块对应的offsetTop值
      this.getThemeTopY();

    },
    titleClick(index) {
      //注意：@titleClick="titleClick"，等号右侧只有一个方法名，并没有(index)。是和小程序的写法记混了？

      //console.log('index======'+index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)

    },
    contentScroll(position) {
      //1.获取Y值
      const positionY = -position.y

      //2.positionY和主题中的值进行对比
      //[0,7938,9120,9452]

/*    positionY在 =0~7938    ，index = 0; (if条件：(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1] ))
      positionY在 =7938~9120 ，index = 1; ↑↑同上
      positionY在 =9120~9452 ，index = 2; ↑↑同上

      positionY在 >= 9452    ，index = 3; (if条件：(i == length - 1 && positionY >= this.themeTopYs[i]))
      */

      let length = this.themeTopYs.length

      //方案1：普通做法，比较复杂。
      /*for(let i = 0; i < length; i++) {
        if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i]
        && positionY < this.themeTopYs[i+1]  ) || (i == length - 1 && positionY
          >= this.themeTopYs[i]))){
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }*/

      //方案2：hacker做法，相对简单。
      for(let i = 0; i < length - 1 ; i++) {
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY <
        this.themeTopYs[i+1])) {
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      //3.是否显示"回到顶部"
      this.listenShowBackTop(position);

    },
    addToCart() {
      //console.log('detail/addToCart()---------------');
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;//已纠正。
      product.iid = this.iid;

      //2.将商品添加到购物车里(1.返回promise 2.mapActions)
      //this.$store.commit('addCart', product)

      //1.返回promise的方式
/*      this.$store.dispatch('addCart',product).then(res => {
        console.log(res);
      })*/

      //2.mapActions的方式
      this.addCart(product).then(res => {
        this.$toast.show(res, 2000)
      })

    }
    }

}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content2 {
    height: calc(100% - 44px - 49px);
  }

</style>
