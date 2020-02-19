import * as api from './api.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
    }
  },
  template: `
  <div>
    <h1>ProjectList</h1>
    <ul>
        <li v-for="project in project_lists">
              プロジェクト名: {{ project.title }}<br>
              説明: {{ project.description }} <br>
              会計種別: {{ project.accounting_type }} <br>
              完了フラグ: {{ project.closed }} <br>
              承認済予算: {{ project.sum_budget }} <br>
              支出済予算: {{ project.sum_purchase_price }} <br>
        </li>
    </ul>
  </div>
  `,
  created() {
    api.get('/v1/api/projects/')
      .then(response => {
        this.project_lists = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export { ProjectList };