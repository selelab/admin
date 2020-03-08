import Vue from "vue";
import Router from "vue-router";
import Index from "./components/Index"
import Projects from "./components/Projects"
import Login from "./components/Login"
import NotFound from "./components/NotFound"
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
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.getters.hasValidJwtToken) {
    next();
  } else {
    next({ path: '/login', query: { redirect: to.fullPath } });
  }
});

export default router;
