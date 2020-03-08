import Vue from "vue";
import Router from "vue-router";
import { KJUR, b64utoutf8 } from 'jsrsasign'

import Index from "./components/Index"
import Projects from "./components/Projects"
import Login from "./components/Login"
import { store } from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
    },
    {
      path: '/projects',
      component: Projects,
      name: 'projects',
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    next();
    return;
  }

  let token = store.getters.getJwtToken;
  let has_valid_jwt_token = false;

  if (token) {
    let jwt_binary = b64utoutf8(token.split('.')[1]);
    let payload = KJUR.jws.JWS.readSafeJSONString(jwt_binary);
    has_valid_jwt_token = payload.exp >= (Date.now() / 1000);
  }

  if (has_valid_jwt_token) {
    next();
  } else {
    next({ path: '/login', query: { redirect: to.fullPath } });
  }
});

export default router;
