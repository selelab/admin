import * as api from './api.js'
import { router } from './router.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      dead_project_lists: [],
      on_going_project_lists: [],
      isShow: [],
      num_soft: 0,
      num_hard: 0,
      soft_fee: 0,
      hard_fee: 0
    }
  },
  template: `
  <div>
    <h1>ProjectList</h1>
    <canvas id="myChart" width="400" height="400"></canvas>
    soft_fee:{{soft_fee}}
    hard_fee:{{hard_fee}}
    num_soft:{{num_soft}}
    num_hard:{{num_hard}}
  
    <p>おめでとうございます！</p>
    <p>あなたはプロジェクトを申請して500億円を受け取る資格を得ました。</p>
  
    <router-link to="/projects/create" class="myButton">  
      <p>こちらをクリック！</p>
    </router-link>
    
    <br>
    <br>

    <ul class="projects">
    <div class="floatco1">
      <h3>許可されたプロジェクト</h3>
          <li v-for="(project,index) in on_going_project_lists">
              <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
              <div v-show="isShow[index]" >
                説明: {{ project.description }} <br>
                会計種別: {{ project.accounting_type }} <br>
                承認済予算: {{ project.sum_budget }} <br>
                完了フラグ: {{ project.closed }} <br>
                支出済予算: {{ project.sum_purchase_price }} <br>
              </div>
          </li>
    </div>
    
     <div class="floatco1"> 
      <h3>まだ許可が下りていないプロジェクト</h3>
        <li v-for="(project,index) in dead_project_lists">
              <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
              <div v-show="isShow[index]">
                説明: {{ project.description }} <br>
                会計種別: {{ project.accounting_type }} <br>
                承認済予算: {{ project.sum_budget }} <br>
                支出済予算: {{ project.sum_purchase_price }} <br>
              </div>
        </li>
    </div>
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
          if (project.accounting_type === "soft")
          {
            this.soft_fee += project.sum_purchase_price;
            this.num_soft += 1; 
          }
          else
          {
            this.hard_fee += project.sum_purchase_price;
            this.num_hard += 1;
          }
          if (project.closed)
          {
            this.dead_project_lists.push(project);
          }
          else
          {
            this.on_going_project_lists.push(project);
          }
          this.isShow.push(false);
          this.createGraph();
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  mounted: function(){
    this.createGraph()
  },
  methods: {
    show: function (index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    },
      createGraph: function(){
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ['ハード', 'ソフト'],
              datasets: [{
                  label: '合計費用',
                  data: [this.hard_fee, this.soft_fee],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      });
      },
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
      closed: true
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
          closed: true
        }
      )
      .then(response => {
      })
      .catch(error => {
        console.log(error);
      });
      router.push('/projects/');
    }
  },
  template: `
           <form class="form-signin border" style="width:300px;margin:auto;margin-auto:5%;">
           &nbsp
           <p>こちらの質問にお答えください。</p>
            <p>タイトル
              <input type="text" v-model="title" class="form-control">
            </p>
            <p>説明
              <input type="text" v-model="description"　class="form-control">
            </p>
            <p>会計種別
            <select v-model="accounting_type" size=1 class="form-control">
              <option value="hard">ハードウェア会計</option>
              <option value="soft">ソフトウェア会計</option>
            </select>
            </p>
            <p>リーダー
              <select  v-model="leader" class="form-control">
                <option v-for="(user) in user_lists" :value="user.id">
                {{user.display_name}}
                </option> 
              </select>
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
