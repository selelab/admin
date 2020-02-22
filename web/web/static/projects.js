import * as api from './api.js'

const ProjectList = {
  data() {
    return {
      project_lists: [],
      isShow: [],
      url: [],
      sorting: 0,
      sort_options: [
        {
          text: "昇順", value:0,
          text: "降順", value:1
        }
      ]
    }
  },
  template: `
  <div>
    <h1>ProjectList</h1>
    <select v-model="sorting"  type="text" id="inputSorting" class="form-control" placeholder="昇順" required>
  <option v-for="option in sort_options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
    <ul class="projects">
        <li v-for="(project,index) in project_lists">
              <p v-on:click="show(index)" style="cursor:pointer">プロジェクト名: {{ project.title }}</p>
              <div v-show="isShow[index]">
                説明: <span v-html="project.description"> </span> <br>
                会計種別: {{ project.accounting_type }} <br>
                承認: <p v-if="project.closed">済 </p>
                <p v-else>削除 </p>
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
          //this.project_lists.push(response.data[cnt]);
          this.isShow.push(false);
        }
        /*
        this.project_lists.sort(function(a, b) {
          if ( this.sorting ) {
            return b.sum_budget - a.sum_budget;
          }
          else {
            return a.sum_budget - b.sum_budget;
          }
        });*/
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          this.$set(this.url,cnt,this.project_lists[cnt].description.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi));
         
        }
        for (let cnt = 0; cnt < response.data.length; cnt++) {
          this.project_lists[cnt].description = this.project_lists[cnt].description.replace(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi, "<a href=" + this.url[cnt] + ">"+ this.url[cnt] + "</a>");
          console.log(this.project_lists[cnt].description.replace(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/gi, "<a href="  + this.url[cnt] + ">"+ this.url[cnt] + "</a>"));
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
        <p v-else>削除 </p>
        承認済予算: {{ project_info.sum_budget }} <br>
        <button v-on:click="approve"　v-if="project_info.closed">取消</button>
        <button v-on:click="approve"　v-else>承認</button>
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
