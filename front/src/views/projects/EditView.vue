<template>
  <div>
    <v-alert
      v-model="alert"
      :value="!!error_message"
      type="error"
      style="margin: auto; margin-bottom: 30px"
      outlined
      dismissible
    >{{ error_message }}</v-alert>
    <h1>プロジェクト編集</h1>
    <h2>基本情報</h2>
    <v-form ref="form">
      <v-text-field v-model="title" label="プロジェクト名" :disabled="!readyToEdit" required></v-text-field>
      <v-textarea
        v-model="description"
        outlined
        :disabled="!readyToEdit"
        required
        name="input-7-4"
        label="プロジェクト説明"
      ></v-textarea>

      <v-select v-model="accounting_type" label="会計種別" :disabled="true" :items="accounting_types"></v-select>
      <v-col class="text-right">
        <v-btn color="grey" @click="cancelEditing" style="margin: 10px" dark>キャンセル</v-btn>
        <v-btn
          color="primary"
          :disabled="!readyToEdit || !(isProjectChanged || isBudgetChanged || isPurchaseChanged)"
          @click="updateProject"
        >保存</v-btn>
      </v-col>
    </v-form>

    <h2>予算関連</h2>
    <v-form ref="budget-form">
      <h3>
        支出予算報告
        <v-btn class="mx-2" fab dark x-small depressed color="primary" @click="appendPurchase">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </h3>

      <div class="top_chips">
        <v-chip x-small chip color="amber lighten-4">支出</v-chip>
        {{ formerProjectInfo.sum_purchase_price | addComma }}円
      </div>
      <div class="top_chips">
        <v-chip x-small chip color="orange lighten-3">返金済</v-chip>
        {{ sumReturned | addComma }}円
      </div>

      <v-card
        v-for="(purchase, index) in budgetInfo.purchases"
        :key="index"
        style="padding: 20px; margin: 20px 0px;"
      >
        <v-btn
          icon
          absolute
          right
          @click="removePurchase(index)"
          v-if="budgetInfo.purchases.length > 1"
        >
          <v-icon color="grey lighten-1">mdi-close-circle</v-icon>
        </v-btn>
        <div style="width: 90%; margin: auto">
          <h6>購入項目 {{index + 1}}</h6>
          <v-text-field v-model="purchase.title" label="購入名"></v-text-field>
          <v-text-field v-model="purchase.price" type="number" label="購入金額" suffix="円"></v-text-field>
          <v-fab-transition v-if="index == budgetInfo.purchases.length - 1">
            <v-btn color="primary" fab dark x-small absolute bottom right @click="appendPurchase">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </div>
      </v-card>

      <h3>予算上限</h3>
      <div class="top_chips">
        <v-chip x-small chip color="red lighten-2" style="color: white">予算上限額</v-chip>
        {{ formerProjectInfo.sum_budget | addComma }} 円
        <div
          style="display: inline-block"
          v-if="formerProjectInfo.sum_req_budget"
        >−(承認後)→ {{ formerProjectInfo.sum_budget + formerProjectInfo.sum_req_budget | addComma }} 円</div>
      </div>
      <div class="top_chips" v-if="formerProjectInfo.sum_req_budget">
        <v-chip x-small chip color="green lighten-2" style="color: white">未承認</v-chip>
        {{ formerProjectInfo.sum_req_budget | addComma }}円
      </div>

      <v-text-field
        v-model="budgetInfo.additionalBudgetAmount"
        type="number"
        :label="formerProjectInfo.sum_req_budget ? '変更後の超過申請' : '追加予算上限'"
        suffix="円"
      ></v-text-field>
      <v-col class="text-right">
        <v-btn color="grey" @click="cancelEditing" style="margin: 10px" dark>キャンセル</v-btn>
        <v-btn
          color="primary"
          :disabled="!readyToEdit || !(isBudgetChanged || isProjectChanged || isPurchaseChanged)"
          @click="updateProject"
        >保存</v-btn>
      </v-col>
    </v-form>
    <Confirm ref="confirm"></Confirm>
  </div>
</template>

<script>
import api from "@/api";
import router from "@/router";

import Confirm from "@/components/Confirm";

export default {
  data() {
    return {
      title: "",
      budget: 0,
      accounting_type: "",
      accounting_types: [
        { text: "ソフトウェア会計", value: "soft" },
        { text: "ハードウェア会計", value: "hard" }
      ],
      description: "### 概要\n### 予算内訳\n",
      error_message: "",
      alert: false,
      readyToEdit: false,
      confirm_dialog: false,
      formerProjectInfo: {},
      budgetInfo: {
        purchases: [
          {
            title: "",
            price: null
          }
        ],
        additionalBudgetAmount: 0
      }
    };
  },
  computed: {
    projectId: function() {
      return this.$route.params.id;
    },
    isProjectChanged: function() {
      return Object.entries(this.formerProjectInfo).some(([key, value]) => {
        if (this[key] != undefined && value != this[key]) return true;
        return false;
      });
    },
    isBudgetChanged: function() {
      if (
        this.budgetInfo.additionalBudgetAmount !=
        this.formerProjectInfo.sum_req_budget
      )
        return true;

      return false;
    },
    isPurchaseChanged: function() {
      return this.budgetInfo.purchases.some(item => {
        return !!(item.title || item.price);
      });
    },
    sumReturned: function() {
      return (
        this.formerProjectInfo.purchases &&
        this.formerProjectInfo.purchases
          .filter(item => {
            return item.approved;
          })
          .reduce((val, item) => {
            return val + item.price;
          }, 0)
      );
    },
    openApprovalId: function() {
      if (!this.formerProjectInfo || !this.formerProjectInfo.approvals) {
        return null;
      }
      let openApprovals = this.formerProjectInfo.approvals.filter(
        item => !item.approved
      );
      if (openApprovals && openApprovals.length > 0) {
        return openApprovals[0].id;
      } else {
        return null;
      }
    }
  },
  created() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    (async () => {
      try {
        this.formerProjectInfo = (
          await api.get(`/v1/api/projects/${this.projectId}/`)
        ).data;

        this.title = this.formerProjectInfo.title;
        this.accounting_type = this.formerProjectInfo.accounting_type;
        this.description = this.formerProjectInfo.description;
        this.budgetInfo.additionalBudgetAmount = this.formerProjectInfo.sum_req_budget;
        this.readyToEdit = true;
      } catch (error) {
        console.log(error);
      }
    })();
  },
  components: {
    Confirm
  },
  methods: {
    backToDetailPage: function() {
      router.push(`/projects/${this.projectId}`);
    },
    appendPurchase: function() {
      this.budgetInfo.purchases.push({
        title: "",
        price: null
      });
    },
    removePurchase: function(index) {
      this.budgetInfo.purchases.splice(index, 1);
    },
    cancelEditing: function() {
      (async () => {
        if (
          (!this.isProjectChanged &&
            !this.isBudgetChanged &&
            !this.isPurchaseChanged) ||
          (await this.$refs.confirm.open(
            "確認",
            "保存していない変更があります。<br>編集画面を閉じますか？",
            {
              color: "orange"
            }
          ))
        ) {
          this.backToDetailPage();
        }
      })();
    },
    requestErrorHandler(error) {
      let error_messages = {
        403: "この操作は許されていません。一旦ログアウトし、再度ログインしてからお試しください。",
        500: "サーバー内部でエラーが発生しました。しばらくしてからアクセスしてください。"
      };
      if (error.response) {
        this.error_message =
          error_messages[error.response.status] ||
          "正しく処理することができませんでした。管理者へお問い合わせください。";
        this.alert = true;
      } else {
        this.error_message =
          "サーバーにアクセスできませんでした。インターネット接続を確認し、管理者へお問い合わせください。";
        this.alert = true;
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    updateProject: function() {
      (async () => {
        try {
          if (this.isPurchaseChanged) {
            let sumNewPurchasePrice = this.budgetInfo.purchases.reduce(
              (acc, item) => acc + parseInt(item.price),
              0
            );
            console.log(
              sumNewPurchasePrice,
              this.formerProjectInfo.sum_purchase_price,
              this.formerProjectInfo.sum_req_budget
            );
            if (
              sumNewPurchasePrice + this.formerProjectInfo.sum_purchase_price >
              this.formerProjectInfo.sum_budget
            ) {
              this.error_message =
                "予算上限値を超えて購入を報告することはできません。";
              this.alert = true;
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
              return;
            }
          }

          if (this.isBudgetChanged) {
            if (this.openApprovalId) {
              await api.patch(`/v1/api/approvals/${this.openApprovalId}/`, {
                budget_amount: this.budgetInfo.additionalBudgetAmount
              });
            } else if (
              await this.$refs.confirm.open(
                "確認",
                "予算超過申請は幹部の承認を伴います。<br>予算超過申請を行いますか？",
                {
                  color: "orange"
                }
              )
            ) {
              await api.post("/v1/api/approvals/", {
                approver: null,
                project: this.projectId,
                budget_amount: this.budgetInfo.additionalBudgetAmount
              });
            } else {
              return;
            }
          }

          if (this.isProjectChanged) {
            await api.patch(`/v1/api/projects/${this.projectId}/`, {
              title: this.title,
              description: this.description
            });
          }

          if (this.isPurchaseChanged) {
            for (let i = 0; i < this.budgetInfo.purchases.length; i++) {
              const { title, price } = this.budgetInfo.purchases[i];
              await api.post("/v1/api/purchases/", {
                project: this.projectId,
                title,
                price
              });
            }
          }

          this.backToDetailPage();
        } catch (error) {
          this.requestErrorHandler(error);
        }
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
