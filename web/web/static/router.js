import { Login, State } from './auth.js';
import { UserList, UserDetail } from './users.js'
import { ProjectList } from './projects.js'
import { SampleList } from './samples.js'
import { Sample1 } from './sample/1.js'
import { Sample2 } from './sample/2.js'
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
  { path: '/samples/1', component: Sample1 },
  { path: '/samples/2', component: Sample2 },
  { path: '/projects', component: ProjectList },
  { path: '/login', component: Login, meta: { isPublic: true } }
];

var router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic) && !State.loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export { router };
