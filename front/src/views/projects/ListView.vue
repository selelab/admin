<template>
  <div v-scroll="onScroll" id="entire_component">
    <h1>プロジェクト</h1>
    <br />
    <CampaignBox text="おめでとうございます！<br>あなたはプロジェクトを申請して最大21億4748万3647円を受け取るチャンスを得ました。"></CampaignBox>
    <br />

    <ListHeading text="承認待ちプロジェクト" append="/projects/create"></ListHeading>

    <div class="approval_summary_wrapper">
      <div class="approval_summary" style="float: left">
        <v-chip x-small chip color="cyan lighten-4">ソフト会計</v-chip>
        <div>{{ openApprovalSummary.soft.count }} プロジェクト</div>
        <div>{{ openApprovalSummary.soft.budget | addComma }} 円</div>
      </div>
      <div class="approval_summary" style="float: right">
        <v-chip x-small chip color="orange lighten-4">ハード会計</v-chip>
        <div>{{ openApprovalSummary.hard.count }} プロジェクト</div>
        <div>{{ openApprovalSummary.hard.budget | addComma }} 円</div>
      </div>
    </div>
    <div v-if="!openApprovals.length" style="max-width: 420px; margin: auto">承認待ちのプロジェクトはまだありません</div>
    <v-row dense>
      <v-col v-for="(approval,index) in openApprovals" :key="index">
        <v-card height="100%" class="approval.project_card" @click="openDialog(approval.project)">
          <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
              <img class="card_profile_icon" src="@/assets/shika.jpg" />
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
              <v-chip x-small chip color="amber lighten-4">支出</v-chip>
              {{ approval.project.sum_purchase_price | addComma }}円 /
              <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
              {{ approval.project.sum_budget | addComma }}円
              +
              <span
                class="important_text"
              >{{ approval.budget_amount | addComma }}円</span>
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
    <input type="checkbox" id="in_progress" value="in_progress" v-model="closedCheck.in_progress" />
    <label for="in_progress">進行中</label>
    <br />

    <div class="project_list">
      <v-row dense>
        <v-col
          v-for="(project,index) in projects"
          :key="index"
          v-show="shCheck[project.accounting_type] && (closedCheck.closed & project.closed || closedCheck.in_progress && !project.closed)"
        >
          <v-card height="100%" class="project_card" @click="openDialog(project)">
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <img class="card_profile_icon" src="@/assets/shika.jpg" />
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
                <v-chip x-small chip color="amber lighten-4">支出</v-chip>
                {{ project.sum_purchase_price | addComma }}円 /
                <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
                {{ project.sum_budget | addComma }}円
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
        in_progress: true
      },
      dialogProject: {},
      maxlength: 60,
      maxLines: 4,
      projectOffset: 0
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
        if (item.project.accounting_type === "soft") {
          prev.soft.count += 1;
          prev.soft.budget += item.budget_amount;
        } else {
          prev.hard.count += 1;
          prev.hard.budget += item.budget_amount;
        }
        return prev;
      }, defaultApprovalSummary);
    }
  },
  created() {
    (async () => {
      try {
        this.openApprovals = Array.from(
          (
            await api.get("/v1/approvals/", {
              params: { is_open: true }
            })
          ).data
        );
        this.loadProjects();
        if (this.dialogProjectId) {
          this.openDialog(
            (await api.get(`/v1/projects/${this.dialogProjectId}/`)).data
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

          dialog_project.detail = (
            await api.get(`/v1/projects/${project.id}/`)
          ).data;

          if (project.leader) {
            dialog_project.leader_detail = project.leader;
          }

          this.$set(this.dialogProject, dialog_project);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    summarize: function(text) {
      const newLineCount = (text.match(/\n/g) || []).length;
      if (text.length < this.maxlength && newLineCount < this.maxLines) {
        return text;
      } else {
        return (
          text
            .substr(0, this.maxlength - 3)
            .split("\n")
            .slice(0, this.maxLines)
            .join("\n") + "..."
        );
      }
    },
    loadProjects: function() {
      (async () => {
        try {
          let projects = Array.from(
            (
              await api.get("/v1/projects/", {
                params: { limit: 10, offset: this.projectOffset }
              })
            ).data.results
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
      })();
    },
    onScroll: function() {
      let bottomOfWindow =
        document.documentElement.offsetHeight -
          (document.documentElement.scrollTop + window.innerHeight) < 10;
      if (bottomOfWindow) {
        console.log("bottom");
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

.approval_summary_wrapper {
  height: 120px;
  max-width: 380px;
  margin: auto;
  padding-top: 30px;
  padding-bottom: 10px;
}

.approval_summary {
  width: 50%;
  max-width: 320px;
}
</style>
