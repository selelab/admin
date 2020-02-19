import { Login, State } from './auth.js';
import { UserList } from './users.js'

var About = { template: '<h1>About</h1>' };

var routes = [
  { path: '/', component: About, meta: { isPublic: true } },
  { path: '/users', component: UserList },
  { path: '/login', component: Login, meta: { isPublic: true } }
];

var router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic) && !State.loggedIn && Cookies.get('sessionid') === undefined) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export { router };
