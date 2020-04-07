import Vue from 'vue';
import moment from 'moment';

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
  return (val || 0).toLocaleString();
});

Vue.filter('yymmdd', function (val) {
  return val && moment(val).format('YYYY年MM月DD日');
});

new Vue({
  router,
  el: '#app',
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#51a9dc',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',
          background: '#fffbf5',
          text_color: '#603e2a',
        },
        dark: false,
      },
      options: {
          customProperties: true,
      },
    }
  }),
  store,
  render: h => h(App),
  created() {
    setTokenToHeader(store.getters.getJwtToken);
  }
}).$mount('#app')
