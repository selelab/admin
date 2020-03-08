import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    jwtToken: null
  },
  mutations: {
    setJwtToken(state, token) {
      state.jwtToken = token;
    }
  },
  getters: {
    getJwtToken(state) {
      return state.jwtToken;
    }
  },
  plugins: [createPersistedState()]
});

export { store }
