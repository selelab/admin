import * as api from './api.js'

const UserList = {
  data() {
    return {
      user_lists: [],
    }
  },
  template: `
  <div>
    <router-link to="/users/create"> ユーザーを作る </router-link>
    <h1>UserList</h1>
    <ul>
      <li v-for="user in user_lists">
        <router-link :to="{ name: 'user_detail', params: {id: user.id}}">
          名前: {{ user.display_name }}<br>
        </router-link>
        メアド: {{ user.email }}
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
        メアド: {{ user_info.email }} <br>
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
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const CreateUser = {
  data() {
    return {
      display_name: "",
      password: "",
      email: "",
      icon_media_key: "",
      is_active: true,
      is_superuser: false
    }
  },
  methods: {
    create_user: function () {
      api.post(
        '/v1/api/users/',
        {
          display_name: this.display_name,
          password: this.password,
          email: this.email,
          icon_media_key: this.icon_media_key,
          is_active: true,
          is_superuser: false
        }
      )
      .then(response => {
      })
      .catch(error => {
        console.log(error);
      });
      router.push(this.$route.query.redirect || '/');
    }
  },
  template: `
           <form class="form-signin border" style="width:300px;margin:auto;margin-auto:5%;">
            <p>名前
              <input type="text" v-model="title" class="user_name">
            </p>
            <p>パスワード
              <input type="passward" v-model="passward">
            </p>
            <p>email
              <input type="email" v-model="email">
            </p>
          <p>icon_media_key
          <input type="file" v-model="icon_media_key">
          </p>
            <p>
              <input type="submit" @click="create_user">
            </p>

          </form>
    `
};



export { UserList, UserDetail, CreateUser};