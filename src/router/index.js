import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/index/index'
import Profile from '@/views/profile/index'
import Record from '@/views/record/index'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Index', component: Index },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/record', name: 'Record', component: Record }
  ]
})
