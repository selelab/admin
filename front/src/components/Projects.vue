<template>
  <div>
    <h1>プロジェクト</h1>
    <div class="campaign_box">
      <br />
      <p>
        おめでとうございます！
        <br />あなたはプロジェクトを申請して最大500億円を受け取る資格を得ました。
      </p>
      <router-link to="/projects/create" class="button">
        <p>こちらをクリック！</p>
      </router-link>
    </div>
    <br />
    <h2>予算申請中のプロジェクト</h2>新規申請
    <v-row dense>
      <v-col v-for="(approval,index) in open_approvals" :key="index">
        <v-card height="100%" class="approval.project_card" @click="open_dialog(approval.project)">
          <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
              <img class="card_profile_icon" src="../assets/shika.jpg" />
            </v-list-item-avatar>
            <v-list-item-content class="card_header_text">
              <v-list-item-title class="headline">{{ approval.project.title }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  x-small
                  chip
                  :color="approval.project.accounting_type == 'soft' ? 'cyan lighten-4' : 'orange lighten-4'"
                  text-color="grey darken-3"
                  class="chip_wrapper"
                >{{ approval.project.accounting_type }}</v-chip>
                <v-chip
                  x-small
                  chip
                  class="chip_wrapper"
                >{{ approval.project.closed ? "完了" : "進行中" }}</v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <div>
              <v-chip x-small chip color="amber lighten-4">支出額</v-chip>
              {{ approval.project.sum_purchase_price | addComma }}円 /
              <v-chip x-small chip>予算上限</v-chip>
              {{ approval.project.sum_budget | addComma }}円
              +
              <span
                class="important_text"
              >{{ approval.budget_amount | addComma }}円</span>
            </div>

            <br />

            <div style="height: 80px">{{ approval.project.desc_summary }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <h2>その他プロジェクト一覧</h2>新規プロジェクト
    <br />
    <input type="checkbox" id="hard" value="hard" v-model="sh_check.hard" />
    <label for="hard">HARD</label>
    <input type="checkbox" id="soft" value="soft" v-model="sh_check.soft" />
    <label for="soft">SOFT</label>
    <input type="checkbox" id="closed" value="closed" v-model="closed_check.closed" />
    <label for="closed">完了</label>
    <input type="checkbox" id="in_progress" value="in_progress" v-model="closed_check.in_progress" />
    <label for="in_progress">進行中</label>
    <br />

    <div class="project_list">
      <v-row dense>
        <v-col
          v-for="(project,index) in projects"
          :key="index"
          v-show="sh_check[project.accounting_type]&&(closed_check.closed&project.closed||closed_check.in_progress&&!project.closed)"
        >
          <v-card height="100%" class="project_card" @click="open_dialog(project)">
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <img class="card_profile_icon" src="../assets/shika.jpg" />
              </v-list-item-avatar>
              <v-list-item-content class="card_header_text">
                <v-list-item-title class="headline">{{ project.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    x-small
                    chip
                    :color="project.accounting_type == 'soft' ? 'cyan lighten-4' : 'orange lighten-4'"
                    text-color="grey darken-3"
                    class="chip_wrapper"
                  >{{ project.accounting_type }}</v-chip>
                  <v-chip v-if="!project.closed" x-small chip class="chip_wrapper">進行中</v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <div>
                <v-chip x-small chip color="amber lighten-4">支出額</v-chip>
                {{ project.sum_purchase_price | addComma }}円 /
                <v-chip x-small chip color="light-green lighten-4">予算上限</v-chip>
                {{ project.sum_budget | addComma }}円
              </div>

              <br />

              <div style="height: 80px">{{ project.desc_summary }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="project_detail_dialog" width="80%">
        <v-card width="100%">
          <v-card-title>
            <span class="headline">{{ dialog_project.title }}</span>
          </v-card-title>
          <v-list-item>
            <v-list-item-avatar>
              <img src="../assets/shika.jpg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                v-text="dialog_project.leader_detail && dialog_project.leader_detail.display_name"
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-card-text>{{dialog_project.description}}</v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import api from "../api";

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
      hard_fee: 0,
      project_detail_dialog: false,
      dialog_project: {}
    };
  },
  created() {
    let maxlength = 60;

    (async () => {
      try {
        let response = await api.get("/v1/api/approvals/", {
          params: { is_open: true }
        });
        let approvalable_project_ids = new Set();
        this.open_approvals = Array.from(response.data);
        this.open_approvals.forEach(approval => {
          if (approval.project.description.length < maxlength) {
            approval.project.desc_summary = approval.project.description;
          } else {
            approval.project.desc_summary =
              approval.project.description.substr(0, maxlength - 3) + "...";
          }
          approvalable_project_ids.add(approval.project.id);
        });

        response = await api.get("/v1/api/projects/", {
          params: { limit: 10 }
        });
        this.projects = Array.from(response.data.results);
        this.projects.forEach(project => {
          this.isShow.push(false);
          if (project.description.length < maxlength) {
            project.desc_summary = project.description;
          } else {
            project.desc_summary =
              project.description.substr(0, maxlength - 3) + "...";
          }

          if (project.accounting_type === "soft") {
            this.soft_fee += project.sum_purchase_price;
            this.num_soft += 1;
          } else {
            this.hard_fee += project.sum_purchase_price;
            this.num_hard += 1;
          }

          this.projects = this.projects.filter(
            project => !approvalable_project_ids.has(project.id)
          );
          // this.createGraph();
        });
      } catch (error) {
        console.log(error);
      }
    })();
  },
  methods: {
    show: function(index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    },
    open_dialog: function(project) {
      this.dialog_project = project;
      this.project_detail_dialog = true;

      (async () => {
        try {
          let dialog_project = this.dialog_project;
          let response = await api.get(`/v1/api/projects/${project.id}/`);
          dialog_project.detail = response.data;

          if (project.leader) {
            response = await api.get(`/v1/api/users/${project.leader}/`);
            dialog_project.leader_detail = response.data;
          } else {
            dialog_project.leader_detail = {
              display_name: "リーダーはまだいません。"
            };
          }

          this.$set(this.dialog_project, dialog_project);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  },
  name: "Projects"
};
</script>

<style lang="scss" scoped>
.v-card {
  width: 380px;
  margin: auto;
}

.card_header_text {
  padding-left: 20px;
}

.chip_wrapper {
  padding: 8px;
  margin: 2px;
}
.chip_icon {
  margin-right: 4px;
}

.project_card {
  position: relative;
  padding-bottom: 50px;
}

.card_actions {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.project_list {
  margin: auto;
}

.important_text {
  font-weight: 900;
}

.campaign_box {
  height: 250px;
  width: 100%;
  max-width: 380px;
  background: #808080;
  color: white;
  padding: 20px;
  position: relative;
  top: 150px;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.campaign_box .button {
  box-shadow: inset 0px 3px 0px 0px #cf866c;
  background: linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
  background-color: #d0451b;
  border-radius: 6px;
  border: 1px solid #942911;
  display: inline-block;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  padding: 10px 24px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #854629;
}

.campaign_box .button:hover {
  background: linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
  background-color: #bc3315;
}

.campaign_box .button:active {
  position: relative;
  top: 1px;
}
</style>
