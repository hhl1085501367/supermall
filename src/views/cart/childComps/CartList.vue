<template>
  <div class="cart-list">
    <scroll class="scroll">
      <cart-list-item 
          v-for="(item, index) in list" :key="index" 
          :itemInfo="item"/>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'

  import CartListItem from './CartListItem'

  import { mapGetters } from 'vuex'

  export default {
    name: 'CartList',
    computed: {
      ...mapGetters({
        list: 'cartList'
      })
    },
    components: {
      Scroll,
      CartListItem
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 40px);
  }

  .scroll {
    height: 100%;
  }
</style>