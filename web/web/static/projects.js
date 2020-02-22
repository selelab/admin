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
    <h1>ProjectList</h1>
    <ul class="projects">
        <li v-for="(project,index) in on_going_project_lists">
            <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
            <div v-show="isShow[index]">
              説明: {{ project.description }} <br>
              会計種別: {{ project.accounting_type }} <br>
              承認済予算: {{ project.sum_budget }} <br>
              支出済予算: {{ project.sum_purchase_price }} <br>
            </div>
        </li>
      -----------------------------------------------------------------

      
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

export { ProjectList };
