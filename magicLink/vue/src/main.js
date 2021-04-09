import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports';
import 'bootstrap/dist/css/bootstrap.css'
import './assets/styles/cognito-login.css';

Amplify.configure(awsconfig);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
