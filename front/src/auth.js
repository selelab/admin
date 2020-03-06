import { router } from './router.js'

const Login = {
  data() {
    return {
      email: '',
      password: '',
      is_sign_in_disabled: false,
    }
  },
  methods: {
    login: async function () {
      await State.send_login_form({
        username: this.email,
        password: this.password
      });
      router.push(this.$route.query.redirect || '/');
    }
  },
  template: `
           <form class="form-signin border" style="width:300px;margin:auto;margin-auto:5%;">
            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
            <label for="inputEmail" class="sr-only">Email address</label>
            <input v-model="email" type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
            <label for="inputPassword" class="sr-only">Password</label>
            <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit" @click="login" :disabled="is_sign_in_disabled">Sign in</button>
          </form>
    `
};

const State = {
  loggedIn: false,
  send_login_form: async function () {
    this.is_sign_in_disabled = true;
    this.loggedIn = true;
  },
  remove_session: function () {
    // Cookies.remove('sessionid');
    this.$cookies.remove('sessionid');
    this.loggedIn = false;
  }
};

export { Login, State };
