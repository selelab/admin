import * as api from './api.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      isShow: []
    }
  },
  template: `
  <div>
    <h1>ProjectList</h1>
    <ul class="projects">
        <li v-for="(project,index) in project_lists">
              <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
              <div v-show="isShow[index]">
                説明: {{ project.description }} <br>
                会計種別: {{ project.accounting_type }} <br>
                完了フラグ: {{ project.closed }} <br>
                承認済予算: {{ project.sum_budget }} <br>
                支出済予算: {{ project.sum_purchase_price }} <br>
                <router-link :to="{ name: 'project_detail', params: {id: project.id}}">
                  審査
                </router-link>
              </div>
        </li>
    </ul>
  </div>
  `,
  created() {
    api.get('/v1/api/projects/')
      .then(response => {
        this.project_lists = response.data;
        for (let cnt = 0; cnt < response.data.length; cnt++) {
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
        完了フラグ: {{ project_info.closed }} <br>
        承認済予算: {{ project_info.sum_budget }} <br>
        <button v-on:click="approve"　v-if="project_info.closed">取消</button>
        <button v-on:click="approve"　v-if="!project_info.closed">承認</button>
        </div>
        `
        ,
        methods:{
          approve: async function() {
            
            let result = window.confirm("本当によろしいですか？。");
            if ( result ){
              await api.patch("/v1/api/projects/" + this.project_info.id + "/",
              {
                closed: true
              });
              this.project_info.closed = !this.project_info.closed;
            }            
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

export { ProjectList, ProjectDetail };
