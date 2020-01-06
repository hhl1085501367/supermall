import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 添加事件总线
Vue.prototype.$bus = new Vue()
// 安装toast插件，默认调用install函数
Vue.use(toast)

// 解决移动端点击延迟300ms的问题
Fastclick.attach(document.body)

// 使用懒加载插件
Vue.use(VueLazyLoad, {
  loading: require('assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
