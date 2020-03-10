import Vue from 'vue';
import Vuex from 'vuex';
import { KJUR, b64utoutf8 } from 'jsrsasign'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex);

const thirtyMinutes = 30 * 60 * 1000;
const cookieExpireDateTime = new Date(new Date().getTime() + thirtyMinutes);

const store = new Vuex.Store({
  state: {
    jwtToken: null,
    hasValidJwtToken: false
  },
  mutations: {
    setJwtToken(state, token) {
      state.jwtToken = token;
      state.hasValidJwtToken = this.getters.hasValidJwtToken
    }
  },
  getters: {
    getJwtToken(state) {
      return state.jwtToken;
    },
    hasValidJwtToken(state) {
      let has_valid_jwt_token = false;

      if (state.jwtToken) {
        let jwt_binary = b64utoutf8(state.jwtToken.split('.')[1]);
        let payload = KJUR.jws.JWS.readSafeJSONString(jwt_binary);
        has_valid_jwt_token = payload.exp >= (Date.now() / 1000);
      }
      return has_valid_jwt_token;
    }
  },
  plugins: [createPersistedState({
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) => Cookies.set(key, value, {
        sameSite: 'strict',
        expires: cookieExpireDateTime,
        secure: location.protocol == 'https:'
      }),
      removeItem: key => Cookies.remove(key)
    }
  })]
});

export { store }
