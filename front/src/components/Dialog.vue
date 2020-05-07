<template>
  <v-dialog v-model="isOpen" @input="v => v || close()" width="640px">
    <v-card class="main">
      <v-card-text style="padding-top: 20px" v-if="alert && !!errorMessage">
        <v-alert
          v-model="alert"
          :value="!!errorMessage"
          type="error"
          style="margin: auto;"
          outlined
          dismissible
        >{{ errorMessage }}</v-alert>
      </v-card-text>
      <v-card-title>
        <span class="headline">{{ project.title }}</span>
        <v-list-item-subtitle>
          <div>
            <v-chip
              x-small
              chip
              :color="project.accounting_type == 'soft' ? 'cyan lighten-4' : 'orange lighten-4'"
              text-color="grey darken-3"
              class="chip_wrapper"
            >{{ project.accounting_type }}</v-chip>
            <v-chip x-small chip class="chip_wrapper">{{ project.closed ? "完了" : "進行中" }}</v-chip>
          </div>
        </v-list-item-subtitle>
        <v-btn icon absolute right :to="editPath" v-if="editable">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-list-item>
        <v-list-item-avatar>
          <img :src="getIconUrl(project.leader)" v-if="!isDebug" />
          <img v-else src="@/assets/shika.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="projectLeaderName"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action></v-list-item-action>
      </v-list-item>

      <v-card-text>
        <div class="top_chips">
          <v-chip x-small chip color="amber lighten-4">支出</v-chip>
          {{ project.sum_purchase_price | addComma }}円
        </div>
        <div class="top_chips">
          <v-chip x-small chip color="orange lighten-3">返金済</v-chip>
          {{ sumReturned | addComma }}円
        </div>
        <div class="top_chips">
          <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
          {{ project.sum_budget | addComma }}円
        </div>
        <div class="top_chips" v-if="project.detail && project.detail.sum_req_budget">
          <v-chip x-small chip color="green lighten-2" style="color: white">未承認</v-chip>
          {{ project.detail.sum_req_budget | addComma }}円
        </div>
        <br />
        <br />
        <Markdown :src="project.description"></Markdown>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn small color="red" outlined rounded right v-if="editable" @click="closeProject">完了にする</v-btn>
      </v-card-actions>

      <v-card-text
        v-if="project.detail && project.detail.purchases && project.detail.purchases.length > 0"
      >
        <v-divider class="my-5"></v-divider>
        <h3>購入一覧</h3>
        <div width="100%" max-width="400">
          <v-data-table :headers="purchaseHeaders" :items="project.detail.purchases">
            <template v-slot:item.date_created="{ item }">{{ getDateText(item.date_created) }}</template>
            <template v-slot:item.status="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon
                      small
                      class="mr-2"
                      color="green"
                      v-if="getStatus(item)=='approved'"
                    >mdi-check</v-icon>
                    <v-icon small color="red" v-else-if="getStatus(item)=='rejected'">mdi-cancel</v-icon>
                    <div v-else></div>
                  </v-btn>
                </template>
                <span>{{getStatusMessage(item)}}</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    <Confirm ref="confirm"></Confirm>
  </v-dialog>
</template>

<script>
import api from "@/api";
import router from "@/router";
import * as utils from "@/utils";
import moment from "moment";

import Confirm from "@/components/Confirm";
import Markdown from "@/components/Markdown";

export default {
  props: {
    project: Object,
    title: String,
    editable: Boolean,
    leaderName: String,
    sumPurchasePrice: Number,
    sumBudget: Number,
    sumReqBudget: Number,
    description: String,
    originUrl: String,
    editPath: String
  },
  data() {
    return {
      isOpen: false,
      errorMessage: "",
      alert: false,
      purchaseHeaders: [
        {
          text: "品目",
          align: "center",
          value: "title"
        },
        {
          text: "金額",
          align: "right",
          value: "price"
        },
        {
          text: "申請日",
          align: "center",
          value: "date_created"
        },
        {
          text: "状態",
          align: "center",
          value: "status"
        }
      ]
    };
  },
  computed: {
    projectLeaderName: function() {
      return (
        (this.project &&
          this.project.leader_detail &&
          this.project.leader_detail.display_name) ||
        "リーダーはまだいません。"
      );
    },
    sumReturned: function() {
      return (
        this.project.detail &&
        this.project.detail.purchases
          .filter(item => {
            return item.approved;
          })
          .reduce((val, item) => {
            return val + item.price;
          }, 0)
      );
    },
    isDebug: () => utils.isDebug()
  },
  methods: {
    open: function() {
      this.isOpen = true;
    },
    close: function() {
      this.isOpen = false;
      if (this.$route.path != this.originUrl) router.push(this.originUrl);
    },
    getDateText(datetime) {
      return (
        datetime &&
        moment(datetime)
          .format("YYYY年MM月DD日")
          .replace(`${new Date().getFullYear()}年`, "")
      );
    },
    getStatus(item) {
      if (item.approved) return "approved";
      if (!item.approver) return "pending";
      return "rejected";
    },
    getStatusMessage(item) {
      switch (this.getStatus(item)) {
        case "approved":
          return "承認済み";
        case "pending":
          return "審査中";
        case "rejected":
          return "不承認: " + item.comment;
      }
    },
    getIconUrl: function(user) {
      return utils.getIconUrl(user);
    },
    requestErrorHandler(error) {
      if (error) {
        this.errorMessage = utils.getErrorMessage(error.response);
        this.alert = true;
      }
    },
    closeProject() {
      (async () => {
        try {
          if (
            await this.$refs.confirm.open(
              this.project.title.endsWith("プロジェクト")
                ? this.project.title
                : this.project.title + " プロジェクト",
              "本当に完了にしますか？<br>この操作は管理者でないと取り消せません。",
              {
                color: "red"
              }
            )
          ) {
            await api.patch(`/v1/projects/${this.project.id}/`, {
              closed: true
            });
          }
        } catch (error) {
          this.requestErrorHandler(error);
        }
      })();
    }
  },
  components: {
    Markdown,
    Confirm
  }
};
</script>

<style scoped>
.top_chips {
  width: 100%;
  max-width: 140px;
  padding-left: 10px;
  padding-right: 10px;
  display: inline-block;
}
</style>
