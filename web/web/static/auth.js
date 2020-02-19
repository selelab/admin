import { router } from './router.js'
import * as api from './api.js'

const Login = {
  template: `
    <div style="width:100%">
      <div class="row">
        <form ref="form">
          <div class="col-md-16">
              <br>
              <h4>ログイン</h4>
              <br>
              <div class="form-group">
                  <label>Email</label>
                  <input type="text" class="form-control">
              </div>
              <div class="form-group">
                  <label>パスワード</label>
                  <input type="password" class="form-control">
              </div>
              <div class="form-group">
                  <button type="submit" class="btn btn-dark btn-block" @click="login">ログイン</button>
              </div>
          </div>
        </form>
      </div>
    </div>
    `,
  methods: {
    login: function () {
      console.log(this.input);
      State.login();
      router.push(this.$route.query.redirect || '/');
    }
  }
};

const State = {
  loggedIn: false,
  login: function (params) {
    api.post(
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
