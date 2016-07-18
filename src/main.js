import Vue from 'vue'
import App from './App'
import VueSocketio from 'vue-socket.io'

Vue.use(VueSocketio, 'http://localhost:3000');

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
