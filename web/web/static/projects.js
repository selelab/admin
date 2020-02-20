import * as api from './api.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      isShow:{}
    }
  },
  template: `
  <div>
    <h1>ProjectList</h1>
    <ul>
        <li v-for="project in project_lists">
              <p v-on:click="show(project.title)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
              <div v-show="isShow[project.title]">
                説明: {{ project.description }} <br>
                会計種別: {{ project.accounting_type }} <br>
                完了フラグ: {{ project.closed }} <br>
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
        for (let cnt = 0;cnt < response.data.length;cnt ++ ){
          this.$set(this.isShow,response.data[cnt].title,false);
        }
        console.log(this.isShow);
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods:{
    show: function( title ){
      this.$set(this.isShow,title,!this.isShow[title]);
    }
  }

};

export { ProjectList };
