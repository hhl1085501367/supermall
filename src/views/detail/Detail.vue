<template>
  <div id="detail">
    {{$store.state.cartList.length}}
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" 
            ref="scroll" 
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :swiper-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  
  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'
  import {itemListenMixin, backTopMixin} from 'common/mixin'
  import {debounce} from 'common/utils'

  export default {
    name: 'Detail',
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex: 0,
      }
    },
    mixins: [itemListenMixin, backTopMixin],
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,

      GoodsList,
      Scroll
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid
      // 2.请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result
        // 1.获取轮播图图片
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.获取店铺信息
        this.shop = new Shop(data.shopInfo)

        // 4 .获取商品详细信息
        this.detailInfo = data.detailInfo

        // 6.保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 7.取出评论信息
        if (data.rate.cRate != 0) {
          this.commentInfo = data.rate.list[0]
        }
        // this.$nextTick(() => {
        // 可以放到update中
        // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM（不包含图片）
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs)
        // })
      })
      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

    },
    destroyed() { 
      // 取消监听函数
      // 不能只传一个事件，那样所有页面的监听函数都会被取消掉
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    methods: {
      imageLoad() { 
        this.refresh()
        // 将refresh函数放到data中，以后有监听函数需要用到防抖，就可以直接使用该函数，防止出现监听函数多次调用防抖函数，创建出多个防抖对象
        // const refresh = debounce(this.$refs.scroll.refresh, 50)
        // refresh()

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      },
      // 导航栏点击
      titleClick(index) {
        // 44为导航栏高度
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index]+44, 500)
      },
      // 监听滚动
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY和主题中值进行对比
        // 方法一
        // let length = this.themeTopYs.length
        // for(let i = 0; i < length; i++) {
        //   if (this.currentIndex !== i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[i]))) {
        //     this.currentIndex = i
        //     this.$refs.nav.currentIndex = this.currentIndex
        //   }
        // }
        // 方法二 Number.MAX_VALUE
        let length = this.themeTopYs.length
        for(let i = 0; i < length-1; i++) {
          if (this.currentIndex !== i && (i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        this.listenShowBackTop(position)
      },
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 2.将商品添加到购物车
        // this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product)
      }
    },
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

  .content {
    /* 100%相对父元素 */
    height: calc(100% - 44px - 49px);
  }
</style>