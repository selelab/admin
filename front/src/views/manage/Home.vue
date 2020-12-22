<template>
  <div>
    <v-alert
      v-model="alert"
      :value="!!errorMessage"
      type="error"
      style="margin: auto; margin-bottom: 30px"
      outlined
      dismissible
    >{{ errorMessage }}</v-alert>
    <h1>管理画面</h1>
    <h2>承認系</h2>
    <h3>購入報告</h3>
    <v-data-table :headers="purchaseHeaders" :items="openPurchases" class="elevation-1">
      <template v-slot:[`item.price`]="{ item }">{{ item.price | addComma }} 円</template>
      <template v-slot:[`item.date_created`]="{ item }">{{ getDateText(item.date_created) }}</template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" color="green" @click="approvePurchase(item)">mdi-check</v-icon>
        <v-icon small color="red" @click="rejectPurchase(item)">mdi-cancel</v-icon>
      </template>
    </v-data-table>
    <v-divider class="my-5"></v-divider>
    <h3>予算申請・予算超過申請</h3>
    <v-data-table :headers="approvalHeaders" :items="openApprovals" class="elevation-1">
      <template v-slot:[`item.budget_amount`]="{ item }">{{ item.budget_amount | addComma }} 円</template>
      <template
        v-slot:[`item.project.sum_budget`]="{ item }"
      >{{ item.project.sum_budget | addComma }} → {{ item.project.sum_budget + item.budget_amount | addComma }} 円</template>
      <template v-slot:[`item.date_created`]="{ item }">{{ getDateText(item.date_created) }}</template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" color="green" @click="approveBudget(item)">mdi-check</v-icon>
        <v-icon small color="red" @click="rejectBudget(item)">mdi-cancel</v-icon>
      </template>
    </v-data-table>
    <h2>運営系</h2>
    <h3>CSVダウンロード</h3>
    <v-card>
      <v-card-text>
        <v-checkbox
          v-for="source in csvSources"
          :key="source.apiPath"
          v-model="source.download"
          :label="source.title"
          required
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <CsvExport :sources="downloadCsvSources"></CsvExport>
      </v-card-actions>
    </v-card>
    <Confirm ref="confirm"></Confirm>
    <ConfirmWithTextInput ref="confirmWithTextInput"></ConfirmWithTextInput>
  </div>
</template>

<script>
import api from "@/api";
import * as utils from "@/utils";
import moment from "moment";

import Confirm from "@/components/Confirm";
import ConfirmWithTextInput from "@/components/ConfirmWithTextInput";
import CsvExport from "@/components/CsvExport";

export default {
  data() {
    return {
      openApprovals: [],
      openPurchases: [],
      errorMessage: "",
      alert: false,
      approvalHeaders: [
        {
          text: "プロジェクト名",
          align: "start",
          sortable: false,
          value: "project.title"
        },
        {
          text: "リーダー",
          align: "start",
          sortable: false,
          value: "project.leader.display_name"
        },
        {
          text: "申請金額",
          align: "right",
          value: "budget_amount"
        },
        {
          text: "予算上限値の変化",
          align: "center",
          value: "project.sum_budget"
        },
        {
          text: "申請日",
          align: "center",
          value: "date_created"
        },
        {
          text: "",
          value: "actions",
          sortable: false
        }
      ],
      purchaseHeaders: [
        {
          text: "プロジェクト名",
          align: "start",
          sortable: false,
          value: "project.title"
        },
        {
          text: "リーダー",
          align: "start",
          sortable: false,
          value: "project.leader.display_name"
        },
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
          text: "",
          value: "actions",
          sortable: false
        }
      ],
      csvSources: [
        {
          apiPath: "/v1/projects/",
          title: "プロジェクト一覧",
          header: {
            title: { title: "プロジェクト名" },
            description: { title: "説明" },
            "leader.display_name": { title: "リーダー" },
            closed: { title: "完了フラグ" },
            sum_budget: { title: "予算上限額" },
            sum_purchase_price: { title: "予算支出額" },
            date_created: { title: "作成日" },
            date_updated: { title: "最終更新日" }
          },
          download: true
        },
        {
          apiPath: "/v1/purchases/",
          title: "購入品目一覧",
          header: {
            title: { title: "購入項目" },
            "project.title": { title: "プロジェクト" },
            "project.leader.display_name": { title: "リーダー" },
            comment: { title: "コメント" },
            price: { title: "購入金額" },
            approved: { title: "返金済みフラグ" },
            date_created: { title: "作成日" }
          },
          download: true
        }
      ]
    };
  },
  computed: {
    downloadCsvSources: function() {
      return this.csvSources.filter(item => item.download);
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

        this.openPurchases = Array.from(
          (
            await api.get("/v1/purchases/", {
              params: { is_open: true }
            })
          ).data
        );
      } catch (error) {
        console.log(error);
      }
    })();
  },
  methods: {
    requestErrorHandler(error) {
      if (error && error.response) {
        this.errorMessage = utils.getErrorMessage(error.response);
        this.alert = true;
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    removeProcessedItem(item, array) {
      array.splice(
        array.findIndex(seek => seek.id == item.id),
        1
      );
    },
    approveBudget(item) {
      (async () => {
        try {
          if (
            await this.$refs.confirm.open(
              item.project.title.endsWith("プロジェクト")
                ? item.project.title
                : item.project.title + " プロジェクト",
              `プロジェクト ${item.project.title} の予算を本当に承認しますか？`,
              {
                color: "orange"
              }
            )
          ) {
            this.errorMessage = "";
            await api.patch(`/v1/approvals/${item.id}/`, {
              approved: true,
              approver: this.$store.getters.getUserId
            });
            this.removeProcessedItem(item, this.openApprovals);
          }
        } catch (error) {
          this.requestErrorHandler(error);
        }
      })();
    },
    rejectBudget(item) {
      (async () => {
        try {
          const reason = await this.$refs.confirmWithTextInput.open(
            item.project.title.endsWith("プロジェクト")
              ? item.project.title
              : item.project.title + " プロジェクト",
            "予算を本当に棄却しますか？",
            {
              color: "red"
            }
          );
          if (reason) {
            this.errorMessage = "";
            await api.patch(`/v1/approvals/${item.id}/`, {
              approved: false,
              approver: this.$store.getters.getUserId,
              comment: reason
            });
            this.removeProcessedItem(item, this.openApprovals);
          }
        } catch (error) {
          this.requestErrorHandler(error);
        }
      })();
    },
    approvePurchase(item) {
      (async () => {
        try {
          if (
            await this.$refs.confirm.open(
              item.project.title.endsWith("プロジェクト")
                ? item.project.title
                : item.project.title + " プロジェクト",
              `品目 ${item.title} を承認し、返却済みとしますか？<br>この操作を行うにはプロジェクトリーダーに<b>返金済みである必要</b>があります。`,
              {
                color: "orange"
              }
            )
          ) {
            this.errorMessage = "";
            await api.patch(`/v1/purchases/${item.id}/`, {
              approved: true,
              approver: this.$store.getters.getUserId
            });
            this.removeProcessedItem(item, this.openPurchases);
          }
        } catch (error) {
          this.requestErrorHandler(error);
        }
      })();
    },
    rejectPurchase(item) {
      (async () => {
        try {
          const reason = await this.$refs.confirmWithTextInput.open(
            item.project.title.endsWith("プロジェクト")
              ? item.project.title
              : item.project.title + " プロジェクト",
            `本当に品目 ${item.title} を棄却しますか？`,
            {
              color: "red"
            }
          );
          if (reason) {
            this.errorMessage = "";
            await api.patch(`/v1/purchases/${item.id}/`, {
              approved: false,
              approver: this.$store.getters.getUserId,
              comment: reason
            });
            this.removeProcessedItem(item, this.openPurchases);
          }
        } catch (error) {
          this.requestErrorHandler(error);
        }
      })();
    },
    getDateText(datetime) {
      return (
        datetime &&
        moment(datetime)
          .format("YYYY年MM月DD日")
          .replace(`${new Date().getFullYear()}年`, "")
      );
    }
  },
  components: {
    Confirm,
    ConfirmWithTextInput,
    CsvExport
  }
};
</script>

<style>
</style>
