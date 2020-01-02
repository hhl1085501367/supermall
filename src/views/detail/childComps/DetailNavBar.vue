<template>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item, index) in titles" 
             :key="index" 
             class="title-item" 
             @click="itemClick(index)" 
             :class="{active: currentIndex === index}">
          {{item}}
        </div>
      </div>
    </nav-bar>
  
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  export default {
    name: 'DetailNavBar',
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index
        this.$emit('titleClick', index)
      },
      backClick() {
        // this.$router.go()返回前几个
        this.$router.back()
      }
    },
  }
</script>

<style scoped>
  .back img{
    /* 替换元素img垂直居中的方法之一：父元素设line-height = height，img元素如下设置 */
    vertical-align: middle;
  }
  
  .title {
    display: flex;
    /* justify-content: space-around; */
    font-size: 13px;
  }

  .title .title-item {
    flex: 1;
  }
  
  .active {
    color: var(--color-high-text);
  }
</style>