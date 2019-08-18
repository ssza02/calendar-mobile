import Vue from 'vue'
import App from './App.vue'
import router from './route/router'
import store from './store'
import MintUI  from 'mint-ui';
import 'mint-ui/lib/style.css'
import './registerServiceWorker'
import './assets/js/rem'

Vue.use(MintUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
