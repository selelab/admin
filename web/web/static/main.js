import { router } from './router.js'
import { State } from './auth.js'

var app = new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  router,
  data: {
    title: "エレラボ会計システム",
    auth_text: "Log In",
    auth_path:  "/login"
  },
  created: function(){
    if(State.loggedIn){
      this.auth_text = "Log Out";
      this.auth_path = "/logout";
    }
    else{
      this.auth_text = "Log In";
      this.auth_path = "/login";
    }
  },
  methods:{
    auth_state: function() {
    }
  }
});
