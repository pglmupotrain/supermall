import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";
import {BACK_POSITION} from "common/const";

import {POP, NEW, SELL} from "./const";

export const itemListenerMixin = {
/*  components: {
  },
  methods: {
  },*/
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    //1.监听item中图片加载完成(监听itemImgLoad事件)
    const refresh = debounce(this.$refs.scroll.refresh,500)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    //console.log('我是混入的内容');
  }
}


export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = -position.y > BACK_POSITION;
    }
  }
}


export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick2(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}
