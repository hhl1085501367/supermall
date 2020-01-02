<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新歌', '精选']" 
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true"
            @scroll="contentScroll"
            @pullingUp="loadMore"> 
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view/>
      <tab-control :titles="['流行', '新歌', '精选']" 
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {itemListenMixin, backTopMixin} from 'common/mixin'

  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    mixins: [itemListenMixin, backTopMixin],
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    components: { 
      HomeSwiper,
      RecommendView,
      FeatureView,

      NavBar,
      Scroll,
      TabControl,
      GoodsList,
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)

      // 刷新一次，以防出问题
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 取消监听函数
      // 不能只传一个事件，那样所有页面的监听函数都会被取消掉
      
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    destroyed() {
      console.log('销毁')
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      // 流行 新歌 精选切换
      tabClick(index) {
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
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // 监听滚动
      contentScroll(position) {
        // 1.当滚动到1000px时，出现返回顶部按钮BackTop
        this.listenShowBackTop(position)

        // 2.决定tabControl是否吸顶(position: fixed)
        // 不用减去导航栏44px，因为offsetTop的相对父节点是scroll，不是body
        this.isTabFixed = position.y < -(this.tabOffsetTop)
      },
      // 上拉加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      // 获取tabControl的offsetTop
      swiperImageLoad() {
        // 2.获取tabControl的offsetTop
        // 所有的组件都有一个属性$el，用于获取组件中元素
        // 在mounted中图片因为是异步加载，还未加载完成，所以获取到的位置是图片还没填充的位置，而在这些未加载的图片中，轮播图的图片影响最大，所以只要监听轮播图组件的图片加载即可
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      /**
       * 网络请求相关方法
       */
      // 获取轮播图信息
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      // 获取流行 精选等数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].page += 1
          this.goods[type].list.push(...res.data.list)

          this.$refs.scroll.finishPullUp()
        })
      }
    },
  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 在使用浏览器原生的滚动时才需要使用fixed。因为用了BScroll，所以导航栏可以不用fixed */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .tab-control{
    position: relative;
    z-index: 9;
    /* 非原生组件better-scroll中，sticky不起效 */
    /* position: sticky;
    top: 44px;
    z-index: 9; */
    /* 在BScroll中会出问题，因为fixed会随translate改变而改变位置 */
    /* position: fixed;
    top: 44px;
    left: 0;
    right: 0; */
  }

  /* .content {
    height: calc(100% - 49px);
    overflow: hidden;
  } */

  .content {
    /* height: 300px; */
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>