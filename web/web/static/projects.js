import * as api from './api.js'
import { router } from './router.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      isShow: [],
      url: [],
      sh_check:{
        soft: true,
        hard: true,
      },
      approved_check:{
        approved: true,
        not_approved: true
      }
    }
  },
  template: `
  <div>
  <h1>Project List</h1>

    <router-link to="/projects/create">プロジェクト立ち上げ申請<br><br></router-link>
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
        <li v-for="(project,index) in project_lists" style="line-style:none;" v-show="sh_check[project.accounting_type]&&(approved_check.approved&project.closed||approved_check.not_approved&&!project.closed)">
        
            <p v-on:click="show(index)" style="cursor:pointer">{{ project.title }}</p>
            <div v-show="isShow[index]">
              <span v-html="project.description"> </span> <br>
              会計種別: {{ project.accounting_type }} <br>
              承認: <p v-if="project.closed">済 </p>
              <p v-else>無</p>  
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
          this.$set(this.url,cnt,this.project_lists[cnt].description.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi));
         
        }
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          this.project_lists[cnt].description = this.project_lists[cnt].description.replace(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi, "<a href=" + this.url[cnt] + ">"+ this.url[cnt] + "</a>");
          //console.log(this.project_lists[cnt].description.replace(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi, "<a href="  + this.url[cnt] + ">"+ this.url[cnt] + "</a>"));
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
        承認: <p v-if="project_info.closed">済 </p>
        <p v-else>無</p>
        承認済予算: {{ project_info.sum_budget }} <br>
        <button v-on:click="approve"　v-if="project_info.closed">取消</button>
        <button v-on:click="approve"　v-else>承認</button>

        </div>
        `
        ,
        methods:{
          approve: async function() {
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

const AddProject = {
  data() {
    return {
      project_info: {
        id: "",
        title: "",
        description: "",
        accounting_type: "soft",
        leader: "991cf939-8af4-4a30-95b3-82aa516a4bc4",
        closed: false,
        sum_budget: 0,
        sum_purchase_price: 0,
        admin_name: ""
      },
    }
  },
  template: `
  <div>
    <h1>ProjectInfo</h1>
    <input type="radio" id="hard" value="hard" v-model="project_info.accounting_type">
<label for="hard">Hard</label>
<input type="radio" id="soft" value="soft" v-model="project_info.accounting_type">
<label for="soft">Soft</label>
<br>
    <form class="form-signin border" style="width:300px;margin:auto;margin-auto:5%;">

          <h1 class="h3 mb-3 font-weight-normal">プロジェクト立ち上げ申請</h1>

          <label for="inputTitle" class="sr-only">Project Title</label>
          <input v-model="project_info.title" type="text" id="inputTitle" class="form-control" placeholder="Project title" required
              autofocus>
          <label for="inputAdminName" class="sr-only">Admin Name</label>
          <input v-model="project_info.admin_name" type="text" id="inputAdminName" class="form-control" placeholder="Admin name" required>
          <label for="inputBudget" class="sr-only">Budge</label>
          <input v-model="project_info.sum_budget" type="number" id="inputBudget" class="form-control" placeholder="Budget"
              required>
          <label for="inputDescription" class="sr-only">Description</label>
          <input v-model="project_info.description" type="text" id="inputDescription" class="form-control" placeholder="Description"
              required>
          <button class="btn btn-lg btn-primary btn-block" type="submit" @click="add_project">申請</button>
      </form>
        </div>
        `
        ,
        methods:{
          add_project: async function() {
            // console.log( this.project_info );
            await api.post("/v1/api/projects/",
            {
              title: this.project_info.title,
              description: this.project_info.description,
              accounting_type: this.project_info.accounting_type,
              leader: this.project_info.leader,
              closed: this.project_info.closed,
            }
            );
            router.push('/projects');       
          }
        }
  
};

export { ProjectList, ProjectDetail, AddProject };
