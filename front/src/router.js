import Vue from "vue";
import Router from "vue-router";

import Index from "./components/Index"
import Projects from "./components/Projects"

Vue.use(Router);

export default new Router({
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
    },
  ]
});
