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

      <v-select v-model="accountingType" label="会計種別" :disabled="true" :items="accountingTypes"></v-select>
      <v-col class="text-right">
        <v-btn
          color="primary"
          :disabled="!readyToEdit || !(isProjectChanged || isBudgetChanged || isPurchaseChanged)"
          @click="updateProject"
        >保存</v-btn>
        <v-btn color="grey" @click="cancelEditing" class="ma-2" dark>キャンセル</v-btn>
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

      <div class="top-chips">
        <v-chip x-small chip color="amber lighten-4">支出</v-chip>
        {{ formerProjectInfo.sumPurchasePrice | addComma }}円
      </div>
      <div class="top-chips">
        <v-chip x-small chip color="orange lighten-3">返金済</v-chip>
        {{ sumReturned | addComma }}円
      </div>

      <v-data-table dense :headers="purchaseHeaders" selected-key="id" :items="purchases">
        <template v-slot:item.disposeButton="{ item }">
          <v-btn
            icon
            @click="removePurchase(item)"
            v-if="!(item.approver || item.approved) && purchases.length > 1"
          >
            <v-icon color="grey lighten-1">mdi-close-circle</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.title="{ item }">
          <v-text-field
            v-model="item.title"
            style="height: 40px"
            solo
            flat
            dense
            required
            :disabled="!!(item.approver || item.approved)"
          ></v-text-field>
        </template>
        <template v-slot:item.price="{ item }">
          <v-text-field
            dense
            style="height: 40px"
            class="right-aligned-input"
            v-model="item.price"
            type="number"
            suffix="円"
            solo
            flat
            required
            :disabled="!!(item.approver || item.approved)"
          ></v-text-field>
        </template>
        <template v-slot:item.dateCreated="{ item }">{{ getDateText(item.dateCreated) }}</template>
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
        <template v-slot:extension>
          <v-btn fab color="cyan accent-2" bottom left absolute @click="appendPurchase">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <h3>予算上限</h3>
      <div class="top-chips">
        <v-chip x-small chip color="red lighten-2" style="color: white">予算上限額</v-chip>
        {{ formerProjectInfo.sumBudget | addComma }} 円
        <div
          style="display: inline-block"
          v-if="formerProjectInfo.sumReqBudget"
        >−(承認後)→ {{ formerProjectInfo.sumBudget + formerProjectInfo.sumReqBudget | addComma }} 円</div>
      </div>
      <div class="top-chips" v-if="formerProjectInfo.sumReqBudget">
        <v-chip x-small chip color="green lighten-2" style="color: white">未承認</v-chip>
        {{ formerProjectInfo.sumReqBudget | addComma }}円
      </div>

      <v-text-field
        v-model="budgetInfo.additionalBudgetAmount"
        type="number"
        :label="formerProjectInfo.sumReqBudget ? '変更後の超過申請' : '追加予算上限'"
        suffix="円"
      ></v-text-field>
      <v-col class="text-right">
        <v-btn
          color="primary"
          :disabled="!readyToEdit || !(isBudgetChanged || isProjectChanged || isPurchaseChanged)"
          @click="updateProject"
        >保存</v-btn>
        <v-btn color="grey" @click="cancelEditing" class="ma-2" dark>キャンセル</v-btn>
      </v-col>
    </v-form>
    <Confirm ref="confirm"></Confirm>
  </div>
</template>

<script>
import moment from "moment";

import api from "@/api";
import * as utils from "@/utils";
import router from "@/router";

import Confirm from "@/components/Confirm";

export default {
  data() {
    return {
      title: "",
      budget: 0,
      accountingType: "",
      accountingTypes: [
        { text: "ソフトウェア会計", value: "soft" },
        { text: "ハードウェア会計", value: "hard" }
      ],
      description: "### 概要\n### 予算内訳\n",
      errorMessage: "",
      alert: false,
      readyToEdit: false,
      formerProjectInfo: {},
      purchases: [],
      budgetInfo: {
        additionalBudgetAmount: 0
      },
      purchaseHeaders: [
        {
          text: "品目",
          align: "center",
          value: "title",
          sortable: false
        },
        {
          text: "金額",
          align: "center",
          value: "price",
          sortable: false,
          width: "200px"
        },
        {
          text: "申請日",
          align: "center",
          value: "dateCreated"
        },
        {
          text: "状態",
          align: "center",
          value: "status"
        },
        {
          text: "",
          align: "center",
          value: "disposeButton"
        }
      ]
    };
  },
  computed: {
    projectId: function() {
      return this.$route.params.id;
    },
    isProjectChanged: function() {
      return Object.entries(this.formerProjectInfo).some(([key, value]) => {
        if (key == "purchases") return false;

        if (this[key] != undefined && value != this[key]) return true;
        return false;
      });
    },
    isBudgetChanged: function() {
      if (
        this.budgetInfo.additionalBudgetAmount !=
        this.formerProjectInfo.sumReqBudget
      )
        return true;

      return false;
    },
    purchasesDict: function() {
      return this.formerProjectInfo.purchases
        .filter(item => item.id)
        .reduce((result, current) => {
          result[current.id] = current;
          return result;
        }, {});
    },
    isPurchaseChanged: function() {
      if (
        this.purchases.some(item => {
          if (!item || item.approver || item.approved) return false;
          if (item.id) {
            return item.price != this.purchasesDict[item.id].price;
          }
          return !!(item.title || item.price);
        })
      )
        return true;

      if (this.isPurchaseDeleted) return true;

      return false;
    },
    isPurchaseDeleted: function() {
      const formPurchasesIds = new Set(
        this.purchases.map(item => item.id).filter(item => item)
      );

      return Object.keys(this.purchasesDict).some(
        id => !formPurchasesIds.has(id)
      );
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
          await api.get(`/v1/projects/${this.projectId}/`)
        ).data;

        this.title = this.formerProjectInfo.title;
        this.accountingType = this.formerProjectInfo.accountingType;
        this.description = this.formerProjectInfo.description;
        this.budgetInfo.additionalBudgetAmount = this.formerProjectInfo.sumReqBudget;
        this.readyToEdit = true;
        if (this.formerProjectInfo.purchases)
          this.purchases = JSON.parse(
            JSON.stringify(this.formerProjectInfo.purchases)
          );
        this.appendPurchase();
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
      this.purchases.push({
        title: "",
        price: null,
        id: null,
        approved: null,
        approver: null
      });
    },
    removePurchase: function(item) {
      this.purchases.splice(
        this.purchases.findIndex(seek => seek.id == item.id),
        1
      );
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
    updateProject: function() {
      (async () => {
        try {
          if (this.isPurchaseChanged) {
            let sumPurchasePrice = this.purchases.reduce(
              (acc, item) => acc + parseInt(item.price),
              0
            );
            if (sumPurchasePrice > this.formerProjectInfo.sumBudget) {
              this.errorMessage =
                "予算上限値を超えて購入を報告することはできません。";
              this.alert = true;
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
              return;
            }
            if (sumPurchasePrice < 0) {
              this.errorMessage =
                "支出予算の合計値を負の値にすることはできません。";
              this.alert = true;
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
              return;
            }
          }

          if (this.isPurchaseDeleted) {
            if (
              !(await this.$refs.confirm.open(
                "確認",
                "一部の購入報告が削除されます。<br>本当によろしいですか？",
                {
                  color: "orange"
                }
              ))
            ) {
              return;
            }
          }

          if (this.isBudgetChanged) {
            if (this.openApprovalId) {
              await api.patch(`/v1/approvals/${this.openApprovalId}/`, {
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
              await api.post("/v1/approvals/", {
                approver: null,
                project: this.projectId,
                budget_amount: this.budgetInfo.additionalBudgetAmount
              });
            } else {
              return;
            }
          }

          if (this.isPurchaseDeleted) {
            const formPurchasesIds = new Set(
              this.purchases.map(item => item.id).filter(item => item)
            );
            const purchaseIds = Object.keys(this.purchasesDict);

            for (let i = 0; i < purchaseIds.length; i++) {
              if (!formPurchasesIds.has(purchaseIds[i])) {
                await api.delete(`/v1/purchases/${purchaseIds[i]}/`);
              }
            }
          }

          if (this.isProjectChanged) {
            await api.patch(`/v1/projects/${this.projectId}/`, {
              title: this.title,
              description: this.description
            });
          }

          if (this.isPurchaseChanged) {
            for (let i = 0; i < this.purchases.length; i++) {
              const purchase = this.purchases[i];
              if (purchase.approver || purchase.approved) continue;
              const { title, price } = purchase;
              if (!title || !price) continue;

              if (!purchase.id) {
                await api.post("/v1/purchases/", {
                  project: this.projectId,
                  title,
                  price
                });
              } else if (
                purchase.price != this.purchasesDict[purchase.id].price
              ) {
                await api.patch(`/v1/purchases/${purchase.id}/`, {
                  title,
                  price
                });
              }
            }
          }

          this.backToDetailPage();
        } catch (error) {
          console.log(error);
          this.requestErrorHandler(error);
        }
      })();
    }
  }
};
</script>

<style scoped>
.right-aligned-input >>> input {
  text-align: right;
}
</style>