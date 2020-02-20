import { router } from './router.js'
import { store } from './store.js'
var app = new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  router,
  store,
  data: {
    title: "エレラボ会計管理システム"
  },
});
