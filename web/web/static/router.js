import { Login, State } from './auth.js';
import { UserList } from './users.js'
import { ProjectList } from './projects.js'
import * as api from './api.js'
var About = { template: `
  <div>
    <h1>About</h1>
    このサイトは上智大学エレクトロニクスラボの会計を管理するために作られたサイトです。
  </div>
` };

var routes = [
  { path: '/', component: About, meta: { isPublic: true } },
  { path: '/users', component: UserList },
  { path: '/projects', component: ProjectList },
  { path: '/login', component: Login, meta: { isPublic: true } }
];

var router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic) && !State.loggedIn && Cookies.get('sessionid') === undefined) {
    api.get('/v1/api/projects/')
      .then(response => {
        next();
      })
      .catch(error => {
        next({ path: '/login', query: { redirect: to.fullPath } });
      });

  } else {
    next();
  }
});

export { router };
