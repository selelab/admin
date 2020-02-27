import * as api from './api.js'
import { router } from './router.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      isShow: [],
      url: [],
      sh_check: {
        soft: true,
        hard: true,
      },
      approved_check: {
        approved: true,
        not_approved: true
      },
      isShowDead: [],
      num_soft: 0,
      num_hard: 0,
      soft_fee: 0,
      hard_fee: 0
    }
  },
  template: `
  <div>
    <h1>Project List</h1>
    <canvas id="myChart"></canvas>
    <div class="box"><br>
      <p>おめでとうございます！<br>
        あなたはプロジェクトを申請して500億円を受け取る資格を得ました。</p>
      <router-link to="/projects/create" class="myButton">
        <p>こちらをクリック！</p>
      </router-link>
      </center>
    </div>

    <input type="checkbox" id="hard" value="hard" v-model="sh_check.hard">
    <label for="hard">HARD</label>
    <input type="checkbox" id="soft" value="soft" v-model="sh_check.soft">
    <label for="soft">SOFT</label>
    <input type="checkbox" id="approved" value="approved" v-model="approved_check.approved">
    <label for="approved">承認済</label>
    <input type="checkbox" id="not_approved" value="not_approved" v-model="approved_check.not_approved">
    <label for="not_approved">承認無</label>
    <br>
    <ul class="projects">
      <li v-for="(project,index) in project_lists" style="line-style:none;margin-bottom:2em;"
        v-show="sh_check[project.accounting_type]&&(approved_check.approved&project.closed||approved_check.not_approved&&!project.closed)">
        <h3 v-on:click="show(index)" style="cursor:pointer;margin-bottom:0px"> > {{ project.title }}</h3>
        <div v-show="isShow[index]" class="project_info">
          <span v-html="project.description"> </span> <br>
          会計種別: {{ project.accounting_type }} <br>
          承認: <p v-if="project.closed">済 </p> <p v-else>無</p>
          承認済予算: {{ project.sum_budget }} <br>
          支出済予算: {{ project.sum_purchase_price }} <br>
          <router-link :to="{ name: 'project_detail', params: {id: project.id}}">
            審査<br><br>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
  `,
  created() {
    api.get('/v1/api/projects/')
      .then(response => {
        //this.project_lists = response.data;
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          this.project_lists.push(response.data[cnt]);
          this.isShow.push(false);
        }
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          this.$set(this.url, cnt, this.project_lists[cnt].description.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi));
        }
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          this.project_lists[cnt].description = this.project_lists[cnt].description.replace(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi, "<a href=" + this.url[cnt] + ">" + this.url[cnt] + "</a>");
          //console.log(this.project_lists[cnt].description.replace(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi, "<a href="  + this.url[cnt] + ">"+ this.url[cnt] + "</a>"));
        }
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
          this.createGraph();
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  mounted: function () {
    this.createGraph()
  },
  methods: {
    show: function (index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    },
    showDead: function (index) {
      this.$set(this.isShowDead, index, !this.isShowDead[index]);
    },
    createGraph: function () {
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['ハード', 'ソフト'],
          datasets: [{
            label: '合計費用（円）',
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

const ProjectDetail = {
  data() {
    return {
      project_info: {
        id: "",
        title: "",
        description: "",
        accounting_type: "",
        leader: "991cf939-8af4-4a30-95b3-82aa516a4bc4",
        closed: false,
        sum_budget: 0,
        sum_purchase_price: 0
      },
    }
  },
  template: `
  <div>
    <h1>ProjectInfo</h1>
        タイトル: {{ project_info.title }} <br>
        会計種別: {{ project_info.accounting_type }} <br>
        承認: <p v-if="project_info.closed">済 </p>
        <p v-else>無</p>
        承認済予算: {{ project_info.sum_budget }} <br>
        <button v-on:click="approve" v-if="project_info.closed">取消</button>
        <button v-on:click="approve" v-else>承認</button>

        </div>
        `
  ,
  methods: {
    approve: async function () {
      console.log(this.project_info.id);
      let result = window.confirm("本当によろしいですか？。");
      await api.patch("/v1/api/projects/" + this.project_info.id + "/",
        {
          closed: this.project_info.closed ^ result
        });
      this.project_info.closed ^= result;
    }
  }
  ,
  created() {
    const project_id = this.$route.params.id;
    api.get('/v1/api/projects/' + project_id)
      .then(response => {
        this.project_info = response.data;
      })
      .catch(error => {
        console.log(error);
      });
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
          closed: false
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
              <input type="text" v-model="description" class="form-control">
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


export { ProjectList, ProjectDetail, CreateProject };
