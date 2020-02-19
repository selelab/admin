import { router } from './router.js'

var app = new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  router,
  data: {
    title: "エレラボ会計管理システム"
  }
});
