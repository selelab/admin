import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';
import camelcaseKeys from "camelcase-keys";

import api from "@/api";

Vue.use(Vuex);

const threeHours = 3 * 60 * 60 * 1000;
const cookieExpireDateTime = new Date(new Date().getTime() + threeHours);

const store = new Vuex.Store({
  state: {
    userId: null,
    userInfo: null
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
  },
  getters: {
    getUserId(state) {
      return state.userId
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    async hasLoggedIn(state) {
      if (state.userId !== null) {
        return true
      }

      const userId = camelcaseKeys((await api.get("/v1/auth/")).data).userId;
      await store.commit("setUserId", userId);
      return state.userId !== null;
    },
  },
  actions: {
    async setJwtToken(context, payload) {
      await context.commit('setJwtToken', payload);
    },
    async retrieveUserInfo(context) {
      if (await context.getters.hasLoggedIn) {
        context.commit(
          'setUserInfo',
          camelcaseKeys((await api.get(`/v1/users/${context.getters.getUserId}/`)).data)
        )
      }
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
