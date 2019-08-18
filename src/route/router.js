import Vue from 'vue'
import Router from 'vue-router'
import routerList from './router_list'


Vue.use(Router)
const routes =  routerList
const router = new Router({
  routes
})

export default router
