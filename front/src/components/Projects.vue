<template>
  <div>
    <h1>プロジェクト</h1>
    <canvas id="myChart"></canvas>
    <div class="box">
      <br />
      <p>
        おめでとうございます！
        <br />あなたはプロジェクトを申請して500億円を受け取る資格を得ました。
      </p>
      <router-link to="/projects/create" class="myButton">
        <p>こちらをクリック！</p>
      </router-link>
    </div>
    <h2>承認待ち予算</h2>
    <ul class="approvals">
      <li
        v-for="(approval,index) in open_approvals"
        :key="index"
        style="line-style:none;margin-bottom:2em;"
      >
        <h3>{{ approval.project.title }}</h3>
        申請予算: {{ approval.budget_amount }}
        <br />
      </li>
    </ul>

    <input type="checkbox" id="hard" value="hard" v-model="sh_check.hard" />
    <label for="hard">HARD</label>
    <input type="checkbox" id="soft" value="soft" v-model="sh_check.soft" />
    <label for="soft">SOFT</label>
    <input type="checkbox" id="closed" value="closed" v-model="closed_check.closed" />
    <label for="closed">完了</label>
    <input type="checkbox" id="in_progress" value="in_progress" v-model="closed_check.in_progress" />
    <label for="in_progress">進行中</label>
    <br />

    <h2>プロジェクト一覧</h2>

    <ul class="projects">
      <li
        v-for="(project,index) in projects"
        :key="index"
        style="line-style:none;margin-bottom:2em;"
        v-show="sh_check[project.accounting_type]&&(closed_check.closed&project.closed||closed_check.in_progress&&!project.closed)"
      >
        <h3 v-on:click="show(index)" style="cursor:pointer;margin-bottom:0px">> {{ project.title }}</h3>
        <div v-show="isShow[index]" class="project_info">
          <span v-html="project.description"></span>
          <br />
          会計種別: {{ project.accounting_type }}
          <br />
          <p v-if="project.closed">状態: 完了</p>
          <p v-else>状態: 進行中</p>
          承認済予算: {{ project.sum_budget }}
          <br />
          支出済予算: {{ project.sum_purchase_price }}
          <br />
          <!-- <router-link :to="{ name: 'project_detail', params: {id: project.id}}">
            審査
            <br />
            <br />
          </router-link>-->
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../api";
import Vue from "vue";

export default {
  data() {
    return {
      projects: [],
      open_approvals: [],
      isShow: [],
      url: [],
      sh_check: {
        soft: true,
        hard: true
      },
      closed_check: {
        closed: true,
        in_progress: true
      },
      isShowDead: [],
      num_soft: 0,
      num_hard: 0,
      soft_fee: 0,
      hard_fee: 0
    };
  },
  created() {
    api
      .post("/jwt-token/", {
        email: "user1@example.com",
        password: "12345678"
      })
      .then(response => {
        Vue.$cookies.set("jwt", response.data.token);
        api
          .get("/v1/api/projects/")
          .then(response => {
            this.projects = Array.from(response.data);
            this.projects.forEach(project => {
              this.isShow.push(false);
              project.description = project.description.replace(
                "/(https?://[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/gi",
                "<a href='$1' target='_blank'>$1</a>"
              );
              if (project.accounting_type === "soft") {
                this.soft_fee += project.sum_purchase_price;
                this.num_soft += 1;
              } else {
                this.hard_fee += project.sum_purchase_price;
                this.num_hard += 1;
              }
            });
            this.createGraph();
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    show: function(index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    }
  },
  name: "Projects"
};
</script>

<style scoped>
</style>
