<template>
  <div class="bottom-bar">

    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>

  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import {mapGetters} from "vuex"

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      },0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false
      //1.使用filter/ 性能低一些(要全部找一遍)
      //return !(this.cartList.filter(item => !item.checked).length)
      //2.使用find/ 更高性能(找到即时停止)
      return !(this.cartList.find(item => !item.checked))
      //↑↑ 如果全不选，返回false; 如果有一个不选中，返回false，否则(全选)返回true

      //3.普通遍历
/*      for(let item of this.cartList) {
        if (!item.checked) {
          return false
        }
      }
      return true*/

    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {//全部选中
        this.cartList.forEach(item => item.checked = false)
        } else {//部分不选中 或 全部不选中
        this.cartList.forEach(item => item.checked = true)
      }

    },
    calcClick() {
      //老师视频里的代码的逻辑有问题
      if(!this.checkLength) {
        this.$toast.show('请选择购买的商品',2000)
      }
    }

  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;

    height: 40px;
    line-height: 40px;

    background-color: #eee;
    font-size: 14px;

  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }

</style>
