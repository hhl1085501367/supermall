import {debounce} from 'common/utils'

export const itemListenMixin = {
  data() {
    return {
      itemImgListener: null,
      // 将refresh函数放到data中，以后有监听函数需要用到防抖，就可以直接使用该函数，防止出现监听函数多次调用防抖函数，创建出多个防抖对象
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 50)
    // 1.监听goodsItem图片加载完成，事件总线发射
    // home组件created中调用组件scroll中的对象scroll，可能会因为图片来的太快，此时scroll对象还没有创建，就会报undifine错误，所以应该在mounted中写
    this.itemImgListener = () => {
      this.refresh()
    }
    // 其他页面调用相同方法，第二个参数同名不会覆盖，会标明页面，可以打印尝试
    this.$bus.$on('itemImgLoad', this.itemImgListener)
  },
}


import BackTop from 'components/content/backTop/BackTop'

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false,
    }
  },
  components: {
    BackTop,
  },
  methods: {
    // 返回顶部
    backClick(e) {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      // 3.当滚动到1000px时，出现返回顶部按钮BackTop
      this.isShowBackTop = position.y < -1000
    }
  },
  
}