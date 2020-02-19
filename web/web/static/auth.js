import { router } from './router.js'
import * as api from './api.js'

const Login = {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      State.login({
        username: this.email,
        password: this.password
      });
      router.push(this.$route.query.redirect || '/');
    }
  },
  template: `
           <form>
            <!-- text -->
            <p>
              <input type="text" v-model="email">
            </p>
            <!-- password -->
            <p>
              <input type="password" v-model="password">
            </p>
            </p>
            <!-- button -->
            <p>
              <input type="submit" @click="login">
            </p>
          </form>
    `
};

const State = {
  loggedIn: false,
  login: function (params) {
    api.form(
      '/api-auth/login/',
      params
    );
    api.get(
      '/v1/api/users/'
    );
    this.loggedIn = true;
  },
  logout: function () { this.loggedIn = false }
};

export { Login, State };
