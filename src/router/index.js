import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/index/index'
import Home from '@/views/home/index'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Index', component: Index },
    { path: '/home', name: 'Home', component: Home }
  ]
})
