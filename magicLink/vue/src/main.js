import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Amplify.configure(awsconfig);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
