<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // 1.创建BScroll对象
      // click 为true时，其中的div可以绑定点击事件进行点击，为false时，就只有button可以点击
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', position => {
          this.$emit('scroll', position)
        })
      }
      
      // 3.上拉加载更多
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time=300) {
        // 此处的判断是防止外部调用时，scroll对象还未创建
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() { 
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    },
  }
</script>

<style scoped>

</style>