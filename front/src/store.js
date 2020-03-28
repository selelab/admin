import Vue from 'vue';
import Vuex from 'vuex';
import { KJUR, b64utoutf8 } from 'jsrsasign'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex);

const threeHours = 3 * 60 * 60 * 1000;
const cookieExpireDateTime = new Date(new Date().getTime() + threeHours);
const getPayload = function(state) {
  let payload = null;
  if (state.jwtToken) {
    let jwt_binary = b64utoutf8(state.jwtToken.split('.')[1]);
    payload = KJUR.jws.JWS.readSafeJSONString(jwt_binary);
  }
  return payload;
};

const store = new Vuex.Store({
  state: {
    jwtToken: null,
    hasValidJwtToken: false,
    user_id: null,
  },
  mutations: {
    setJwtToken(state, token) {
      state.jwtToken = token;
      state.hasValidJwtToken = this.getters.hasValidJwtToken;
      state.user_id = this.getters.getUserId;
    }
  },
  getters: {
    getJwtToken(state) {
      return state.jwtToken;
    },
    getUserId(state) {
      let payload = getPayload(state);
      if (payload) {
        return payload.user_id;
      } else {
        return null;
      }
    },
    hasValidJwtToken(state) {
      let has_valid_jwt_token = false;
      let payload = getPayload(state);

      if (payload){
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
    },
    reducer: state => ({
      jwtToken: state.jwtToken
    })
  })]
});

export { store }
