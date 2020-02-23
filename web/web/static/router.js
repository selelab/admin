import { Login, State } from './auth.js';
import { UserList, UserDetail, CreateUser } from './users.js'
import { ProjectList, CreateProject } from './projects.js'
import { SampleList } from './samples.js'
import { Sample1 } from './sample/1.js'
import { Sample2 } from './sample/2.js'
import * as api from './api.js'

var About = {
  template: `
  <div>
    <div>
      <h1>About</h1>
      このサイトは上智大学エレクトロニクスラボの会計を管理するために作られたサイトです。
    </div>

    <div><br>
    <br>
    <br>
      <p> みて！くまモンがいるよ<br>
      かわいいね</p>
      <label for="trigger" class="open_button"><center><img src="/static/kumamon.png" /></center></label>
    </div>

    <div class="modal_wrap">
        <input id="trigger" type="checkbox">
        <div class="modal_overlay">
            <label for="trigger" class="modal_trigger">shit</label>
            <div class="modal_content">
                <label for="trigger" class="close_button">&#x2716;&#xfe0f;</label>
                <h2>shit</h2>
                <p>あなたがクリックしてしまったので<br>
                くまモンが隠れてしまいました<br>
                あ〜あ</p>
            </div>
        </div>
    </div>
    
  </div>
  </div>
  }
` };

var routes = [
  { path: '/', component: About, meta: { isPublic: true } },
  { path: '/users', component: UserList },
  { path: '/users/create', component: CreateUser },
  { path: '/users/:id', component: UserDetail, name: 'user_detail' },
  { path: '/samples',  component: SampleList },
  { path: '/samples/1', component: Sample1 },
  { path: '/samples/2', component: Sample2 },
  { path: '/projects', component: ProjectList },
  { path: '/projects/create', component: CreateProject },
  { path: '/login', component: Login, meta: { isPublic: true } },
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
