import * as api from './api.js'

const UserList = {
  data() {
    return {
      user_lists: [],
    }
  },
  template: `
  <div>
    <h1>UserList</h1>
    <ul>
      <li v-for="user in user_lists">
        <router-link :to="{ name: 'user_detail', params: {id: user.id}}">
          {{ user.display_name }}
        </router-link>
      </li>
    </ul>
  </div>
  `,
  created() {
    api.get('/v1/api/users/')
      .then(response => {
        this.user_lists = response.data;

      })
      .catch(error => {
        console.log(error);
      });
  }
};

const UserDetail = {
  data() {
    return {
      user_info: {},
    }
  },
  template: `
  <div>
    <h1>UserInfo</h1>
        名前: {{ user_info.display_name }} <br>
        メールアドレス: {{ user_info.email }} <br>
        <a v-bind:href="user_info.email" v-bind:id="id">メールを送る</a><br>
        リーダーをしているプロジェクト <br>
        <ul>
          <li v-for="project in user_info.projects">
            {{ project.description }} <br>
            会計種別: {{ project.accounting_type }} <br>
            完了フラグ: {{ project.closed }} <br>
            承認済予算: {{ project.sum_budget }} <br>
          </li>
        </ul>
    </ul>
  </div>
  `,
  created() {
    const user_id = this.$route.params.id;
    api.get('/v1/api/users/' + user_id)
      .then(response => {
        this.user_info = response.data;
                
        this.user_info.email = "mailto:" + this.user_info.email;
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export { UserList, UserDetail };