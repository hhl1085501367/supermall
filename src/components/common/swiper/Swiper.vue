<template>
  <div id="hy-swiper">
    <div class="swiper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <slot></slot>
    </div>
    <slot name="indicator"></slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIndicator && slideCount>1">
        <div v-for="(item, index) in slideCount" :key="index" class="indi-item" :class="{active: index == currentIndex-1}">
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Swiper',
    props: {
      // 间隔，多久滚动图片
      interval: {
        type: Number,
        default: 3000
      },
      // 动画过渡效果的时间
      animDuration: {
        type: Number,
        default: 300
      },
      // 移动多少百分比换图
      moveRatio: {
        type: Number,
        default: 0.25
      },
      // 显示下方的指示器，如小圆圈
      showIndicator: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        slideCount: 0, // 元素个数
        totalWidth: 0, //幻灯片容器的宽度，即单个幻灯片的宽度
        swiperStyle: {}, // swiper样式
        currentIndex: 1, // 当前的幻灯片index
        scrolling: false, // 是否在滚动
      }
    },
    mounted() {
      /**
       * let swiperEl = document.querySelector('.swiper')
       * let slideEls = swiperEl.getElementsByClassName('slide')
       * 这样取slideEls可能取不到，因为slide还未加载到dom树上，所以要用定时器，
       * 如果只设置为100ms也有可能取不到，因为slide越多，需要的加载时间越多
       * 所以我这里设置了120ms
       */
      setTimeout(() => {
        // 1.操作DOM，在前后添加slide
        this.handleDom()
        // 2.开启定时器
        this.startTimer()
      }, 120);
    },
    methods: {
      /**
       * 定时器操作
       */
      startTimer() {
        this.playTimer = setInterval(() => {
          this.currentIndex++
          this.scrollCorrect(-this.currentIndex * this.totalWidth )
        }, this.interval)
      },
      stopTimer() {
        clearInterval(this.playTimer)
      },

      /**
       * 滚动到正确的位置
       */
      scrollCorrect(currentPosition) {
        // 1.设置状态，代表该幻灯片正在滚动，滚动时不能拖动
        this.scrolling = true

        // 2.开始滚动动画，样式中的transform属性改变，动画效果持续300ms
        this.swiperStyle.transition = `transform ${this.animDuration}ms`
        this.setTransform(currentPosition)

        // 3.判断滚动到的位置
        this.checkPosition()

        // 4.滚动完成，以此为状态，滚动时不能拖动
        this.scrolling = false
      },

      /**
       * 校验正确的位置
       */
      checkPosition() {
        // 300ms后动画结束，将动画时间设为0，判断是否为特殊情况，然后因为动画时间为0，瞬间完成index变换，就不会出现动画，让用户看出效果
        setTimeout(() => {
          // 1.校验正确的位置
          this.swiperStyle.transition = '0ms';
          //只有在下面两种情况下才需要变换位置
          if (this.currentIndex >= this.slideCount + 1) {
            this.currentIndex = 1 
            this.setTransform(-this.currentIndex * this.totalWidth)
          } else if (this.currentIndex <= 0) {
            this.currentIndex = this.slideCount
            this.setTransform(-this.currentIndex * this.totalWidth)
          }
          
          // 2.结束移动后的回调，现在没用上，只是提供了一个方法传给页面使用
          this.$emit('transitionEnd', this.currentIndex-1);
        }, this.animDuration);
        
      },

      /**
       * 操作DOM, 在DOM前后添加Slide
       */
      handleDom() {
        // 1.获取到要操作的元素
        let swiperEl = document.querySelector('.swiper')
        let slideEls = swiperEl.getElementsByClassName('slide')

        // 2.保存个数
        this.slideCount = slideEls.length
        
        // 3.如果大于1个, 那么在前后分别添加一个slide
        // 下面的判断其实没有必要，如果只有一个slide，这些操作都没有必要
        if(this.slideCount > 1) { 
          let cloneFirst = slideEls[0].cloneNode(true)
          let cloneLast = slideEls[this.slideCount - 1].cloneNode(true)
          // slidesEls是一个集合对象，不是数组，所以不能用push方法
          // console.log(typeof(slidesEls))
          // slideEls.push(cloneLast)
          // slideEls.unshift(cloneFirst)
          swiperEl.insertBefore(cloneLast, slideEls[0])
          swiperEl.appendChild(cloneFirst)
          //offsetWidth 水平方向 width + 左右padding + 左右border-width
          this.totalWidth = swiperEl.offsetWidth
          this.swiperStyle = swiperEl.style
        }

        //当前显示的是最后一个图片，所以为了显示第一张图片，需要左移totalWidth
        this.setTransform(-this.totalWidth)
      },

      /**
       * 设置滚动的位置
       */
      setTransform(position) {
        //position是一个幻灯片宽度的负数，代表向左滑动
        this.swiperStyle.transfrom = `translate3d(${position}px, 0, 0)`
        this.swiperStyle['-webkit-transform'] = `translate3d(${position}px, 0, 0)`
        this.swiperStyle['-moz-transform'] = `translate3d(${position}px, 0, 0)`
        this.swiperStyle['-ms-transform'] = `translate3d(${position}px, 0, 0)`
      },

      /**
       * 拖动事件的处理
       */
      touchStart(e) {
        // 1.如果正在滚动，不可以拖动
        if (this.scrolling) return 

        // 2.停止定时器
        this.stopTimer()

        // 3.保存开始滚动的位置
        this.startX = e.touches[0].pageX
      },

      touchMove(e) {
        // 1.计算出用户拖动的距离
        this.currentX = e.touches[0].pageX
        this.distance = this.currentX - this.startX
        let currentPosition = -this.currentIndex * this.totalWidth
        let moveDistance = this.distance + currentPosition

        // 2.设置当前位置
        this.setTransform(moveDistance)
      },

      touchEnd(e) {
        // 1.获取移动距离
        let currentMove = Math.abs(this.distance)

        // 2.判断最终移动的距离是否到达了设定的ratio，以此来移动幻灯片
        if (this.distance === 0) {
          return
        } else if (this.distance > 0 && currentMove > this.totalWidth * this.moveRatio) { // 右边移动超过0.25
          this.currentIndex --
        } else if (this.distance < 0 && currentMove > this.totalWidth * this.moveRatio) { // 向左移动超过0.25
          this.currentIndex++
        }

        // 3.设置拖动后的幻灯片位置
        this.scrollCorrect(-this.currentIndex * this.totalWidth)

        // 4.移动完成后重新开启定时器
        this.startTimer();
      },

      /**
       * 控制上一个, 下一个
       */
      previous: function () {
        this.changeItem(-1);
      },

      next: function () {
        this.changeItem(1);
      },

      changeItem: function (num) {
        // 1.移除定时器
        this.stopTimer();

        // 2.修改index和位置
        this.currentIndex += num;
        this.scrollContent(-this.currentIndex * this.totalWidth);

        // 3.添加定时器
        this.startTimer();
      }
    },
  }
</script>

<style scoped>
  #hy-swiper {
    overflow: hidden;
    position: relative;
  }

  .swiper {
    display: flex;
  }

  .indicator {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    bottom: 8px;
  }

  .indi-item {
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #fff;
    line-height: 8px;
    text-align: center;
    font-size: 12px;
    margin: 0 5px;
  }

  .indi-item.active {
    background-color: rgba(212,62,46,1.0);
  }
</style>