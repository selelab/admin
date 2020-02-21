import { Login, State } from './auth.js';
import { UserList, UserDetail } from './users.js'
import { ProjectList } from './projects.js'
import { SampleList } from './samples.js'
import { Sample1 } from './sample/1.js'

import * as api from './api.js'
var About = {
  template: `
  <div>
    <h1>About</h1>
    このサイトは上智大学エレクトロニクスラボの会計を管理するために作られたサイトです。
  </div>
` };

var routes = [
  { path: '/', component: About, meta: { isPublic: true } },
  { path: '/users', component: UserList },
  { path: '/users/:id', component: UserDetail, name: 'user_detail' },
  { path: '/samples',  component: SampleList },
  { path: '/samples/1', component: Sample1},
  { path: '/projects', component: ProjectList },
  { path: '/login', component: Login, meta: { isPublic: true } }
];

var router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic) && !State.loggedIn) {
    // projectsが取れるかどうかでログイン状態を判別する
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
