import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index"
import Projects from "./views/projects/ListView"
import ProjectCreator from "./views/projects/CreateView"
import ProjectEditor from "./views/projects/EditView"
import Manager from "./views/manage/Home"
import Users from "./views/Users"
import Login from "./views/Login"
import NotFound from "./views/NotFound"
import { store } from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        })
      })
    } else if (!(to.path.startsWith(from.path) || from.path.startsWith(to.path))) {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
      meta: { requiresAuth: true }
    },
    {
      path: '/projects',
      component: Projects,
      name: 'projects',
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/create',
      component: ProjectCreator,
      name: 'create_project',
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id',
      component: Projects,
      name: 'project_detail',
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id/edit',
      component: ProjectEditor,
      name: 'project_editor',
      meta: { requiresAuth: true },
    },
    {
      path: '/manage',
      component: Manager,
      name: 'Manager',
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      component: Users,
      name: 'users',
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
    {
      path: '*',
      component: NotFound,
      meta: { requiresAuth: true },
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
