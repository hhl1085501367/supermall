import Toast from './Toast'
const obj = {}

obj.install = function(Vue) {
  // 创建并挂载到 #app (会替换 #app)
  // new MyComponent().$mount('#app')

  // 同上
  // new MyComponent({ el: '#app' })

  // 或者，在文档之外渲染并且随后挂载
  // var component = new MyComponent().$mount()
  // document.getElementById('app').appendChild(component.$el)

  // 1.创建组件构造器
  const toastConstructor = Vue.extend(Toast)

  // 2.组件构造器，创建组件对象
  const toast = new toastConstructor()

  // 3.将组件对象在文档之外渲染并且随后挂载
  toast.$mount()

  // 4.将toast.$el手动挂载到body上
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast
}

export default obj