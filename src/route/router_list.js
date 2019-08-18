// import Index from '../views/index.vue'

const Routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue')
  }
]

export default Routes;