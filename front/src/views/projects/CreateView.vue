<template>
  <div>
    <v-form ref="form">
      <v-alert
        v-model="alert"
        :value="!!errorMessage"
        type="error"
        style="margin: auto; margin-bottom: 30px"
        outlined
        dismissible
      >{{ errorMessage }}</v-alert>
      <h1>プロジェクト申請</h1>
      <v-text-field v-model="title" label="プロジェクト名" required></v-text-field>
      <v-textarea v-model="description" outlined required name="input-7-4" label="プロジェクト説明"></v-textarea>

      <v-select v-model="accountingType" label="会計種別" :items="accountingTypes"></v-select>
      <v-text-field v-model="budget" type="number" label="予算上限額" suffix="円"></v-text-field>
      <v-col class="text-right">
        <v-btn color="primary" @click="createProject">申請</v-btn>
      </v-col>
    </v-form>
  </div>
</template>

<script>
import api from "@/api";
import * as utils from "@/utils";
import router from "@/router";

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
    };
  },
  methods: {
    createProject: function() {
      (async () => {
        try {
          let createProject_result = await api.post("/v1/projects/", {
            title: this.title,
            description: this.description,
            accounting_type: this.accountingType,
            leader: this.$store.getters.getUserId
          });

          if (this.budget && this.budget > 0) {
            let project = createProject_result.data.id;

            await api.post("/v1/approvals/", {
              approver: null,
              project,
              budget_amount: this.budget
            });
          }

          router.push("/projects");
        } catch (error) {
          if (error && error.response) {
            this.errorMessage = utils.getErrorMessage(error.response)
            this.alert = true;
          }
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
