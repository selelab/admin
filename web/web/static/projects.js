import * as api from './api.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      dead_project_lists: [],
      on_going_project_lists: [],
      isShow: []
    }
  },
  template: `
  <div>
    <router-link to="/projects/create"> プロジェクトを作る </router-link>
    <h1>ProjectList</h1>
    <h3>許可されたプロジェクト</h3>
    <ul class="projects">
        <li v-for="(project,index) in on_going_project_lists">
            <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
            <div v-show="isShow[index]" class="detail" style="background-color:red;">
              説明: {{ project.description }} <br>
              会計種別: {{ project.accounting_type }} <br>
              承認済予算: {{ project.sum_budget }} <br>
              完了フラグ: {{ project.closed }} <br>
              支出済予算: {{ project.sum_purchase_price }} <br>
            </div>
        </li>
      <p>-----------------------------------------------------------------</p>
      &nbsp
      <h3>却下されたプロジェクト</h3>

        <li v-for="(project,index) in dead_project_lists">
              <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
              <div v-show="isShow[index]">
                説明: {{ project.description }} <br>
                会計種別: {{ project.accounting_type }} <br>
                承認済予算: {{ project.sum_budget }} <br>
                支出済予算: {{ project.sum_purchase_price }} <br>
              </div>
        </li>
    </ul>
    <img src="/static/image.jpg" />
  </div>
  `,
  created() {
    api.get('/v1/api/projects/')
      .then(response => {
        this.project_lists = response.data;
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          let project = response.data[cnt];
          if (project.closed)
          {
            this.dead_project_lists.push(project);
          }
          else
          {
            this.on_going_project_lists.push(project);
          }
          this.isShow.push(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    show: function (index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    }
  }

};


const CreateProject = {
  data() {
    return {
      title: "",
      description: "",
      accounting_type: "",
      leader: "",
      user_lists: [],
      closed: false
    }
  },
  methods: {
    create_project: function () {
      api.post(
        '/v1/api/projects/',
        {
          title: this.title,
          description: this.description,
          accounting_type: this.accounting_type,
          leader: this.leader,
          closed: false
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
            <p>タイトル
              <input type="text" v-model="title" class="form-control">
            </p>
            <p>説明
              <input type="text" v-model="description">
            </p>
            <p>会計種別
            <select v-model="accounting_type" size=1>
              <option value="hard">ハードウェア会計</option>
              <option value="soft">ソフトウェア会計</option>
            </select>
            </p>
            <p>リーダー
            <select type="text" v-model="leader">
            <option v-for="(user) in user_lists" :value="user.id">
            {{user.display_name}}
            </option> 

          </p>
            </p>
            <p>
              <input type="submit" @click="create_project">
            </p>

          </form>
    `,
    created() {
      api.get('/v1/api/users/')
        .then(response => {
          this.user_lists = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
};


export { ProjectList, CreateProject };
