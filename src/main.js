/*
 * @Author: 羊驼
 * @Date: 2023-10-27 16:15:23
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-10-31 10:53:15
 * @Description: file content
 */
import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import Element from "element-ui"
Vue.config.productionTip = false
Vue.use(Element)
new Vue({
  render: h => h(App),
}).$mount('#app')
