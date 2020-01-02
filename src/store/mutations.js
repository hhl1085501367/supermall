import {
  ADD_COUTER, 
  ADD_TO_CART
} from './mutaion-types'

export default {
  // mutation唯一的目的就是修改state中状态
  // mutations中每个方法尽可能完成的事件单一一点，方便跟踪
  // 数量加一
  [ADD_COUTER](state, payLoad) {
    payLoad.count++
  },
  [ADD_TO_CART](state, payLoad) {
    state.cartList.push(payLoad)
  }
}