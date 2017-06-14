// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios'

import App from './App'

window.axios = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

document.querySelector('html').style.fontSize = `${Math.min(document.body.clientWidth, document.body.clientHeight) / 375 * 16}px`
