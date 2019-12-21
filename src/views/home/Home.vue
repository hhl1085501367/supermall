<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends" />
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import {getHomeMultidata} from 'network/home'
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: []
      }
    },
    components: {
      NavBar,
      HomeSwiper,
      RecommendView
    },
    created() {
      getHomeMultidata().then(res => {
        console.log(res)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    }
  }
</script>

<style scope>
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>