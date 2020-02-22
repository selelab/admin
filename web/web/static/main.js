import { router } from './router.js'
import { State } from './auth.js'

var app = new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  router,
  data: {
    title: "エレラボ会計管理システム",
    auth_text: "ログイン",
    auth_path:  "/login"
  },
  created: function(){
    if(State.loggedIn){
      this.auth_text = "ログアウト";
      this.auth_path = "/logout";
    }
    else{
      this.auth_text = "ログイン";
      this.auth_path = "/login";
    }
  },
  methods:{
    auth_state: function() {
    }
  }
});
