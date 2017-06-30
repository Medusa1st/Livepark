import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/index/index'
import Profile from '@/views/profile/index'
import Record from '@/views/record/index'
import readyToPark from '@/views/parking/ready-to-park'
import onParkingStatus from '@/views/parking/on-parking-status'
import Order from '@/views/parking/order'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Index', component: Index },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/record', name: 'Record', component: Record },
    { path: '/ready-to-park', name: 'readyToPark', component: readyToPark },
    { path: '/on-parking-status/:sn/:pn', name: 'onParkingStatus', component: onParkingStatus },
    { path: '/order/:sn/:pn', name: 'Order', component: Order },
  ]
})
