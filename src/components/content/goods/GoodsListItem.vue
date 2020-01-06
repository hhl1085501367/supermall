<template>
  <div class="goods-item" @click="itemClick">
    <!-- <img :src="showImage" alt="" @load="imageLoad"> -->
    <img v-lazy="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GoodsListItem',
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
        return this.goodsItem.image || this.goodsItem.show.img
      }
    },
    methods: {
      imageLoad() {
        this.$bus.$emit('itemImgLoad')
        // 不同页面调用该组件，传出不同的方法，因为页面图片加载完成，另一个页面也会调用同样的方法
        // if (this.$route.path.indexOf('/home')) {
        //   this.$bus.$emit('homeItemImgLoad')
        // } else if (this.$route.path.indexOf('/detail')) {
        //   this.$bus.$emit('DetailItemImgLoad')
        // }
      },
      itemClick() {
        // 传递参数的两种方式
        this.$router.push(`/detail/${this.goodsItem.iid}`)
        // this.$router.push({
        //   path: '/detail',
        //   query: {
        //     id
        //   }
        // })
      }
    }, 
  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    /* 商品信息用绝对定位主要是因为图片大小不一致 */
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    /* width: 100%; */
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
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px no-repeat;
  }
</style>