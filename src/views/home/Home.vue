<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClickX"
                 ref="tabcontrol1" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view @featureImageLoad="featureImageLoad"/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClickX"
                    ref="tabcontrol2"
                    class="tab-control"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>
    <!-- ↑↑ 为什么isShowBackTop没用到{{}}语法？？(可能是和小程序的知识点混淆了)-->

    <!-- ul>li{列表$}*100 ，再按'Tab'键-->
    <!--<ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
      <li>列表11</li>
      <li>列表12</li>
      <li>列表13</li>
      <li>列表14</li>
      <li>列表15</li>
      <li>列表16</li>
      <li>列表17</li>
      <li>列表18</li>
      <li>列表19</li>
      <li>列表20</li>
      <li>列表21</li>
      <li>列表22</li>
      <li>列表23</li>
      <li>列表24</li>
      <li>列表25</li>
      <li>列表26</li>
      <li>列表27</li>
      <li>列表28</li>
      <li>列表29</li>
      <li>列表30</li>
      <li>列表31</li>
      <li>列表32</li>
      <li>列表33</li>
      <li>列表34</li>
      <li>列表35</li>
      <li>列表36</li>
      <li>列表37</li>
      <li>列表38</li>
      <li>列表39</li>
      <li>列表40</li>
      <li>列表41</li>
      <li>列表42</li>
      <li>列表43</li>
      <li>列表44</li>
      <li>列表45</li>
      <li>列表46</li>
      <li>列表47</li>
      <li>列表48</li>
      <li>列表49</li>
      <li>列表50</li>
      <li>列表51</li>
      <li>列表52</li>
      <li>列表53</li>
      <li>列表54</li>
      <li>列表55</li>
      <li>列表56</li>
      <li>列表57</li>
      <li>列表58</li>
      <li>列表59</li>
      <li>列表60</li>
      <li>列表61</li>
      <li>列表62</li>
      <li>列表63</li>
      <li>列表64</li>
      <li>列表65</li>
      <li>列表66</li>
      <li>列表67</li>
      <li>列表68</li>
      <li>列表69</li>
      <li>列表70</li>
      <li>列表71</li>
      <li>列表72</li>
      <li>列表73</li>
      <li>列表74</li>
      <li>列表75</li>
      <li>列表76</li>
      <li>列表77</li>
      <li>列表78</li>
      <li>列表79</li>
      <li>列表80</li>
      <li>列表81</li>
      <li>列表82</li>
      <li>列表83</li>
      <li>列表84</li>
      <li>列表85</li>
      <li>列表86</li>
      <li>列表87</li>
      <li>列表88</li>
      <li>列表89</li>
      <li>列表90</li>
      <li>列表91</li>
      <li>列表92</li>
      <li>列表93</li>
      <li>列表94</li>
      <li>列表95</li>
      <li>列表96</li>
      <li>列表97</li>
      <li>列表98</li>
      <li>列表99</li>
      <li>列表100</li>
    </ul>-->
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";

//import Swiper from "components/common/swiper/Swiper"
//import SwiperItem from "components/common/swiper/SwiperItem"
import {getHomeMultidata, getHomeGoods} from "network/home";
import Scroll from "components/common/scroll/Scroll";
import {itemListenerMixin, backTopMixin} from "common/mixin";


export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    Scroll,
    TabControl,
    GoodsList,

  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: [], position: -526},
        'new': {page: 0, list: [], position: -526},
        'sell': {page: 0, list: [], position: -526}
      },
      currentType: 'pop',
      tabOffsetTopArray: [],
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      typeOrderArray: [0, 0, 0],
      preType:''

    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }

  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata();
    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');

  },
  mounted() {

    /*    //1.对刷新函数refresh进行防抖处理
        const refresh = debounce(this.$refs.scroll.refresh,500) //注意：老师在第二个班的视频里使用了let,不是const.
        //↑↑ 注意：由于下面的闭包结构里的refresh对上面这行里的refresh进行了引用，所以上面行的refresh不会被回收。
        //(↓↓闭包结构↓↓)3.监听item中图片加载完成(监听itemImgLoad事件)
        this.itemImgListener = () => {
          refresh()
        }
        this.$bus.$on('itemImgLoad', this.itemImgListener)*/

  },
  destroyed() {
    console.log('home/destroyed-----');
  },
  activated() {
    //注意：新版的BS2.0，下面的两句代码要互换位置，要先refresh()再滚动到对应的位置。
    // 疑问：续上句，能不能不要refresh()?
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    //2.取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)

  },
  methods: {
    //bug04--老师的bug我来解决
    /*perPosition(index) {
      //我的代码 doing
      this.typeOrderArray.push(index);
      const tempIndex = this.typeOrderArray[this.typeOrderArray.length-2];

      switch (tempIndex) {
        case 0:
          this.preType = 'pop'
          break
        case 1:
          this.preType = 'new'
          break
        case 2:
          this.preType = 'sell'
          break
      }

      const yy = this.$refs.scroll.getScrollY();
      console.log("上一个type对应的y值-----------",yy);

      this.goods[this.preType].position = yy;
      console.log("preType--------------",this.preType);

      this.$refs.scroll.scrollTo(0, this.goods[this.currentType].position, 0);

      //this.typeOrderArray.shift();

    },*/

    //2.获取tabControl的offsetTop
    swiperImageLoad() {
      //老师的代码(bug:出现2个tabControl)
      //this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop

      //老师留下的bugs我来解决
      this.tabOffsetTopArray.push(this.$refs.tabcontrol2.$el.offsetTop);
      this.maxOffsetTop();

    },
    featureImageLoad() {
      //老师留下的bugs我来解决
      this.tabOffsetTopArray.push(this.$refs.tabcontrol2.$el.offsetTop);
      this.maxOffsetTop();

    },
    //老师留下的bugs我来解决
    //获取offsetTopArray里的最大值
    maxOffsetTop() {
      const arr = this.tabOffsetTopArray;
      if (arr.length === 2){
        let max = arr[0];
        for(let i = 1; i < arr.length; i++) {
          let cur = arr[i];
          cur > max ? max = cur : null
        }
        this.tabOffsetTop = max;
        console.log("home/tabOffsetTop----------------",this.tabOffsetTop);
      }
    },
    /**
     *  加载更多的方法
     */
    loadMore() {
      console.log('上拉加载更多------');
      this.getHomeGoods(this.currentType)
    },
    /**
     * 事件监听相关的方法
     */
    tabClickX(index) {
      //console.log('index======>',index);
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabcontrol1.currentIndex = index;
      this.$refs.tabcontrol2.currentIndex = index;

      //bug04--老师留下的bug我来解决
      //this.perPosition(index);

    },
    contentScroll(position) {
      //1.判断BackTop是否显示
      this.listenShowBackTop(position);

      //2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop

    },

    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
          //this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        }
      )
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1 ;
      getHomeGoods(type, page).then(res => {
          //...数组：“数组的解构”的语法
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
          //疑问：第181行第一次执行时，还没调用pullingUp就调用finishPullUp是不是不妥？
          //并且，我在Scroll.vue里的finishPullUp()方法里也没设置 this.scroll && 语句，也不报错，为什么不报错？

        }
      )
    }
  }

}
</script>

<style scoped>
  /*方案1*/
/*   #home {
    height: 100vh;
  }*/

  /*方案2*/
/*  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }*/

  /*方案3*/
  #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*以下注释的多行代码，方案2需要，方案3则不需要 */
    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
/*  position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;*/

  }

/*  使用better-scroll后.tab-control样式已失效 */
/*  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }*/

  /*方案1*/
/*  .content {
    height: calc(100% - 93px);
    overflow: hidden;
    !*方案1，要把下句代码注释掉。因为.content之上的第二个tabControl(本身高度44px)已经占了44px，
    就不再需要margin-top:44px。当home.vue里只有一个tabControl时，才需要下面这句代码*!
    !*margin-top: 44px;*!
  }*/

  /*方案3*/
  /*方案2*/
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0px;
    right: 0px;
  }

  .tab-control {
    position: relative;
    z-index: 9;

  }

</style>
