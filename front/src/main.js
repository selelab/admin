import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
Vue.use(Vuetify);
Vue.config.productionTip = false;

import { store } from './store';
import { setTokenToHeader } from './api';

Vue.filter('addComma', function (val) {
  return val.toLocaleString();
});

new Vue({
  router,
  vuetify: new Vuetify(),
  store,
  render: h => h(App),
  created() {
    setTokenToHeader(store.getters.getJwtToken);
  }
}).$mount('#app')
