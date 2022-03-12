<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!--商品的列表-->
    <cart-list></cart-list>

    <!--底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { mapGetters } from 'vuex';
import CartList from "./childComps/CartList";
import CartBottomBar from './childComps/CartBottomBar'


export default {
  name: "Cart",
  components: {CartList, NavBar, CartBottomBar},
  computed: {
    //两种写法
    //写法1：
    //...mapGetters(['cartLength','cartList']),
    //写法2：
    ...mapGetters({
      length: 'cartLength'
    })


  }
}
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

  .cart {
    height: 100vh;
  }

</style>
