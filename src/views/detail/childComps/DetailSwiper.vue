<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="item in topImages">
      <img :src="item" alt="">
      <!-- src前面的冒号: ，一定不要漏掉，不然无法显示图片 -->
      <!-- ↑↑ 这里的item不需要{}。问题：什么时候需要{}，什么时候不需要？-->
    </swiper-item>
  </swiper>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'

export default {
  name: "DetailSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    topImages: {
      type: Array,
      default() {
        return []
      }
    }
  }

}
</script>

<style scoped>
  .detail-swiper {
    height: 300px;
    overflow: hidden;
  }

</style>
