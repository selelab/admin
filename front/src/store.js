import Vue from 'vue';
import Vuex from 'vuex';
import { KJUR, b64utoutf8 } from 'jsrsasign'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

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
  plugins: [createPersistedState()]
});

export { store }
