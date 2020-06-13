<template>
  <div v-scroll="onScroll" id="entire-component">
    <h1>プロジェクト</h1>
    <br />
    <CampaignBox text="おめでとうございます！<br>あなたはプロジェクトを申請して最大21億4748万3647円を受け取るチャンスを得ました。"></CampaignBox>
    <br />

    <ListHeading text="承認待ちプロジェクト" append="/projects/create"></ListHeading>

    <div class="approval-summary-wrapper">
      <div class="approval-summary" style="float: left">
        <v-chip x-small chip color="cyan lighten-4">ソフト会計</v-chip>
        <div>{{ openApprovalSummary.soft.count }} プロジェクト</div>
        <div>{{ openApprovalSummary.soft.budget | addComma }} 円</div>
      </div>
      <div class="approval-summary" style="float: right">
        <v-chip x-small chip color="orange lighten-4">ハード会計</v-chip>
        <div>{{ openApprovalSummary.hard.count }} プロジェクト</div>
        <div>{{ openApprovalSummary.hard.budget | addComma }} 円</div>
      </div>
    </div>
    <div v-if="!openApprovals.length" style="max-width: 420px; margin: auto">承認待ちのプロジェクトはまだありません</div>
    <v-row dense>
      <v-col v-for="(approval,index) in openApprovals" :key="index" cols="12" sm="12" md="6" lg="4">
        <v-card height="100%" class="approval.project-card" @click="openDialog(approval.project)">
          <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
              <img
                class="card-profile-icon"
                :src="getIconUrl(approval.project.leader)"
                v-if="!isDebug"
              />
              <img v-else src="@/assets/shika.jpg" />
            </v-list-item-avatar>
            <v-list-item-content class="card-header-text">
              <v-list-item-title class="headline">{{ approval.project.title }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  x-small
                  chip
                  :color="approval.project.accountingType == 'soft' ? 'cyan lighten-4' : 'orange lighten-4'"
                  text-color="grey darken-3"
                  class="chip-wrapper"
                >{{ approval.project.accountingType }}</v-chip>
                <v-chip
                  x-small
                  chip
                  class="chip-wrapper"
                >{{ approval.project.closed ? "完了" : "進行中" }}</v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <div>
              <v-chip x-small chip color="amber lighten-4">支出</v-chip>
              {{ approval.project.sumPurchasePrice | addComma }}円 /
              <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
              {{ approval.project.sumBudget | addComma }}円
              +
              <span
                class="important-text"
              >{{ approval.budgetAmount | addComma }}円</span>
            </div>

            <br />

            <Markdown
              style="height: 80px; overflow: hidden"
              :src="summarize(approval.project.description)"
            ></Markdown>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <ListHeading text="その他のプロジェクト" append="/projects/create"></ListHeading>
    <br />
    <input type="checkbox" id="hard" value="hard" v-model="shCheck.hard" />
    <label for="hard">HARD</label>
    <input type="checkbox" id="soft" value="soft" v-model="shCheck.soft" />
    <label for="soft">SOFT</label>
    <input type="checkbox" id="closed" value="closed" v-model="closedCheck.closed" />
    <label for="closed">完了</label>
    <input type="checkbox" id="inProgress" value="inProgress" v-model="closedCheck.inProgress" />
    <label for="inProgress">進行中</label>
    <br />

    <div class="project-list">
      <v-row dense>
        <v-col
          v-for="(project,index) in projects"
          :key="index"
          v-show="shCheck[project.accountingType] && (closedCheck.closed & project.closed || closedCheck.inProgress && !project.closed)"
          cols="12"
          sm="12"
          md="6"
          lg="4"
        >
          <v-card height="100%" class="project-card" @click="openDialog(project)">
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <img class="card-profile-icon" :src="getIconUrl(project.leader)" v-if="!isDebug" />
                <img v-else src="@/assets/shika.jpg" />
              </v-list-item-avatar>
              <v-list-item-content class="card-header-text">
                <v-list-item-title class="headline">{{ project.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    x-small
                    chip
                    :color="project.accountingType == 'soft' ? 'cyan lighten-4' : 'orange lighten-4'"
                    text-color="grey darken-3"
                    class="chip-wrapper"
                  >{{ project.accountingType }}</v-chip>
                  <v-chip v-if="!project.closed" x-small chip class="chip-wrapper">進行中</v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <div>
                <v-chip x-small chip color="amber lighten-4">支出</v-chip>
                {{ project.sumPurchasePrice | addComma }}円 /
                <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
                {{ project.sumBudget | addComma }}円
              </div>

              <br />
              <Markdown
                style="height: 80px; overflow: hidden"
                :src="summarize(project.description)"
              ></Markdown>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <Dialog
      v-bind:project="dialogProject"
      v-bind:editable="dialogProject.leader && dialogProject.leader.id == userId && !dialogProject.closed"
      ref="detailDialog"
      originUrl="/projects"
      :editPath="'/projects/' + dialogProjectId + '/edit'"
    ></Dialog>
  </div>
</template>

<script>
import api from "@/api";
import * as utils from "@/utils";
import router from "@/router";

import CampaignBox from "@/components/CampaignBox";
import Dialog from "@/components/Dialog";
import ListHeading from "@/components/ListHeading";
import Markdown from "@/components/Markdown";

export default {
  data() {
    return {
      projects: [],
      openApprovals: [],
      isShow: [],
      shCheck: {
        soft: true,
        hard: true
      },
      closedCheck: {
        closed: true,
        inProgress: true
      },
      dialogProject: {},
      projectOffset: 0,
      isLoading: false
    };
  },
  watch: {
    routerPath: function() {
      if (this.$route.path.match(/^\/projects\/?$/)) {
        this.$refs.detailDialog.close();
      } else {
        this.$refs.detailDialog.open();
      }
      return this.$route.path;
    }
  },
  computed: {
    routerPath: function() {
      return this.$route.path;
    },
    userId: function() {
      return this.$store.getters.getUserId;
    },
    dialogProjectId: function() {
      return this.$route.params.id;
    },
    openApprovalSummary: function() {
      const defaultApprovalSummary = {
        soft: {
          count: 0,
          budget: 0
        },
        hard: {
          count: 0,
          budget: 0
        }
      };
      if (!this.openApprovals) {
        return defaultApprovalSummary;
      }
      return this.openApprovals.reduce((prev, item) => {
        if (item.project.accountingType === "soft") {
          prev.soft.count += 1;
          prev.soft.budget += item.budgetAmount;
        } else {
          prev.hard.count += 1;
          prev.hard.budget += item.budgetAmount;
        }
        return prev;
      }, defaultApprovalSummary);
    },
    isDebug: () => utils.isDebug()
  },
  created() {
    (async () => {
      try {
        this.openApprovals = Array.from(
          utils.camelize(
            (
              await api.get("/v1/approvals/", {
                params: { is_open: true }
              })
            ).data
          )
        );
        this.loadProjects();
        if (this.dialogProjectId) {
          this.openDialog(
            utils.camelize(
              (await api.get(`/v1/projects/${this.dialogProjectId}/`)).data
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    })();
  },
  methods: {
    openDialog: function(project) {
      this.dialogProject = project;
      this.$refs.detailDialog.open();
      let project_path = `/projects/${project.id}`;
      if (this.$route.path != project_path) router.push(project_path);

      (async () => {
        try {
          let dialog_project = this.dialogProject;

          dialog_project.detail = utils.camelize(
            (await api.get(`/v1/projects/${project.id}/`)).data
          );

          if (project.leader) {
            dialog_project.leaderDetail = project.leader;
          }

          this.$set(this.dialogProject, dialog_project);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    summarize: function(text, maxLength, maxLines) {
      return utils.summarize(text, maxLength, maxLines);
    },
    loadProjects: function() {
      (async () => {
        this.isLoading = true;
        try {
          let projects = Array.from(
            utils.camelize(
              (
                await api.get("/v1/projects/", {
                  params: { limit: 10, offset: this.projectOffset }
                })
              ).data.results
            )
          );
          projects.forEach(() => {
            this.isShow.push(false);
          });
          Array.prototype.push.apply(this.projects, projects);
          let approvalable_project_ids = new Set(
            this.openApprovals.map(approval => approval.project.id)
          );
          this.projects = this.projects.filter(
            project => !approvalable_project_ids.has(project.id)
          );
          this.projectOffset += projects.length;
        } catch (error) {
          console.log(error);
        }
        this.isLoading = false;
      })();
    },
    getIconUrl: function(user) {
      return utils.getIconUrl(user);
    },
    onScroll: function() {
      let bottomOfWindow =
        document.documentElement.offsetHeight -
          (document.documentElement.scrollTop + window.innerHeight) <
        10;
      if (!this.isLoading && bottomOfWindow) {
        this.loadProjects();
      }
    }
  },
  name: "Projects",
  components: {
    Markdown,
    Dialog,
    CampaignBox,
    ListHeading
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  width: 380px;
  margin: auto;
}

.chip-wrapper {
  padding: 8px;
  margin: 2px;
}
.chip-icon {
  margin-right: 4px;
}

.project-card {
  position: relative;
  padding-bottom: 50px;
}



.project-list {
  margin: auto;
}

.important-text {
  font-weight: 900;
}

.approval-summary-wrapper {
  height: 120px;
  max-width: 380px;
  margin: auto;
  padding-top: 30px;
  padding-bottom: 10px;
}

.approval-summary {
  width: 50%;
  max-width: 320px;
}
</style>
