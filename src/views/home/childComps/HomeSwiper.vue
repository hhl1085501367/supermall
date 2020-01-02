<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageload">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: 'HomeSwiper',
    props: {
      banners: {
        type: Array,
        default() {
          return []
        },
        required: true
      }
    },
    data() {
      return {
        isLoad: false
      }
    },
    components: {
      Swiper, SwiperItem
    },
    methods: {
      imageload() {
        if (!this.isLoad) {
          this.isLoad = true
          this.$emit('swiperImageLoad')
        }
        
      }
    },
  }
</script>

<style scoped>
  
</style>