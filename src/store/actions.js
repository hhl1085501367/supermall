import {
  ADD_COUTER, 
  ADD_TO_CART
} from './mutaion-types'

export default {
  // 本来是放到mutation中，但因为该函数不同情况，有不同处理，所以为了vuex好追踪，放到actions中
  // 对象的解构，本来是上下文参数context，解构成{state, commit}
  addCart({state, commit}, payLoad) {
    // 判断添加的商品是否已经在数组中
    let oldProduct = state.cartList.find(item => item.iid === payLoad.iid)
    if (oldProduct) {
      commit(ADD_COUTER, oldProduct)
    } else {
      payLoad.count = 1
      commit(ADD_TO_CART, payLoad)
    }
  }
}