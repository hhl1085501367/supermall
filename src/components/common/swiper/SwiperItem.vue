<template>
  <div class="slide">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Slide',
  }
</script>

<style scoped>
  .slide {
    width: 100%;
    /* 设置为0，不会因为flex自适应压缩 */
    flex-shrink: 0;
  }

  .slide img {
    width: 100%;
  }
  
</style>