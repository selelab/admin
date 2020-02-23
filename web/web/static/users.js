import * as api from './api.js'
import { router } from './router.js'

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
      icon: "",
      is_active: true,
      uploadedImage: '',
      img_name: '',
      is_superuser: false
    }
  },
  methods: {
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.createImage(files[0]);
      this.img_name = files[0].name;
    },
    // アップロードした画像を表示
    createImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    remove() {
      this.uploadedImage = false;
    },
    create_user: function () {
      api.post(
        '/v1/api/users/',
        {
          display_name: this.display_name,
          password: this.password,
          email: this.email,
          icon: this.icon,
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
              <input type="text" v-model="display_name" class="user_name form-control">
            </p>
            <p>パスワード
              <input type="passward" v-model="password" class="form-control">
            </p>
            <p>email
              <input type="email" v-model="email" class="form-control">
            </p>
          

            <div class="contents">
            <label v-show="!uploadedImage" class="input-item__label" 
              >アイコンを選択
              <input type="file" @change="onFileChange" class="form-contorol" v-on="icon"/>
            </label>
            <div class="preview-item">
              <img
                v-show="uploadedImage"
                class="preview-item-file"
                :src="uploadedImage"
                alt=""
              />
              <div v-show="uploadedImage" class="preview-item-btn" @click="remove">
                <p class="preview-item-name">{{ img_name }}</p>
              </div>
            </div>
          </div>

            <p>
              <input type="submit" @click="create_user">
            </p>


            
          </form>
    `
};



export { UserList, UserDetail, CreateUser };
