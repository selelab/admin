import { router } from './router.js'
import * as api from './api.js'

const UserList = {
  data() {
    return {
      user_lists: [],
    }
  },
  template:
  `
  <div id="user_list_wrapper">
    <h1>User List</h1>
    <div id="users">
      <li>
        <router-link to="/users/create">
          ユーザーを作る<br>
          <img class="profile_image" src="/static/images/create_button.png"/>
        </router-link>
      </li>
      <li v-for="user in user_lists">
          <router-link :to="{ name: 'user_detail', params: {id: user.id}}">

            {{ user.display_name }} <br>
            <img class="profile_image" :src="'/static/images/' + (user.icon_media_key || '43db3fc4-f249-4909-9954-1a7fc7d5129d') + '.jpg'"/>

          </router-link>
      </li>
    </div>
  </div>
  `,
  created() {
    api.get('/v1/api/users/')
      .then(response => {
        this.user_lists = response.data;
        this.user_lists.sort(function(a, b) {
          return (new Date(b.date_registered)) - (new Date(a.date_registered));
        });

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
        <a v-bind:href="user_info.email" v-bind:id="id">Outlookでメールを送る</a><br>
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

const CreateUser = {
  data() {
    return {
      display_name: "",
      email: "",
      password: "",
      icon_media_key: "991cf939-8af4-4a30-95b3-82aa516a4bc4",
      is_active: true,
      is_superuser: false,
      media_options: [
        { text: "猫", value: "991cf939-8af4-4a30-95b3-82aa516a4bc4" },
        { text: "蛇", value: "f2b34d83-b890-45ff-aedd-1d11a92cb9f5" },
        { text: "鶏", value: "380ac58d-1595-4614-a8e2-5e881b51d18a" },
        { text: "犬", value: "43db3fc4-f249-4909-9954-1a7fc7d5129d" },
        { text: "兎", value: "ddc74f28-1a8e-4f30-bb0e-7f4ed9875a8e" },
        { text: "馬", value: "1c92c930-8682-4d42-8555-80c7725a1986" },
        { text: "猪", value: "73c5d0ab-271d-4f17-8265-80aa24ec1147" },
        { text: "龍", value: "e9d82887-ae62-4e65-9dd4-e4f9d05e31f0" },
        { text: "羊", value: "2336774e-c3fc-4ee3-ba42-f13e4807a20e" },
        { text: "鼠", value: "7a55ddb8-10f7-4bc6-b4aa-60e4f3b6e53f" },
        { text: "猿", value: "345865f9-c7ee-4107-9149-57dc35db0b79" },
        { text: "牛", value: "87e65a9b-9ada-475d-bbb5-a20e2d3ce875" },
      ]
    }
  },
  template: `
  <div>
      <form class="form-signin border" style="width:300px;margin:auto;margin-auto:5%;">

          <h1 class="h3 mb-3 font-weight-normal">ユーザー登録</h1>

          <label for="inputName" class="sr-only">User name</label>
          <input v-model="display_name" type="text" id="inputName" class="form-control" placeholder="User name" required
              autofocus>
          <label for="inputEmail" class="sr-only">Email</label>
          <input v-model="email" type="text" id="inputEmail" class="form-control" placeholder="Email" required>
          <label for="inputPassword" class="sr-only">Password</label>
          <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password"
              required>
          <label for="inputIconMediaKey" class="sr-only">IconMediaKey</label>
          <select v-model="icon_media_key" type="text" id="inputIconMediaKey" class="form-control" placeholder="猫"
              required>
              <option v-for="option in media_options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
          </select>
          <img class="profile_image" v-bind:src="'/static/images/' + icon_media_key + '.jpg'" />
          <button class="btn btn-lg btn-primary btn-block" type="submit" @click="create_user">Sign up</button>
      </form>
  </div>
  `,
  methods: {
    create_user: async function () {
      await api.post("/v1/api/users/",
      {
        display_name: this.display_name,
        email: this.email,
        password: this.password,
        icon_media_key: this.icon_media_key,
        is_active: this.is_active,
        is_superuser: this.is_superuser,
      }
      );
      router.push('/users');
    }
  }
};

export { UserList, UserDetail, CreateUser };
