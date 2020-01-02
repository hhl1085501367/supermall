import Vue from "vue"
import Vuex from "vuex"
import mutations from './mutations'
import actions from './actions'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations,
  // 复杂的操作，如异步，不同情况，不同处理
  actions,
})

// 3.挂载到vue实例上
export default store