import { Login, State } from './auth.js';

var About = { template: '<h1>About</h1>' };
var Dashboard = { template: '<h1>Dashboard</h1>' };

var routes = [
  { path: '/', component: About, meta: { isPublic: true } },
  { path: '/dashboard', component: Dashboard },
  { path: '/login', component: Login, meta: { isPublic: true } }
];

var router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // isPublic でない場合(=認証が必要な場合)、かつ、ログインしていない場合
  if (to.matched.some(record => !record.meta.isPublic) && !State.loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export { router };
