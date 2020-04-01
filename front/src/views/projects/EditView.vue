<template>
  <div>
    <v-form ref="form">
      <v-alert
        v-model="alert"
        :value="!!error_message"
        type="error"
        style="margin: auto; margin-bottom: 30px"
        outlined
        dismissible
      >{{ error_message }}</v-alert>
      <h1>プロジェクト申請</h1>
      <v-text-field v-model="title" label="プロジェクト名" required></v-text-field>
      <v-textarea v-model="description" outlined required name="input-7-4" label="プロジェクト説明"></v-textarea>

      <v-select v-model="accounting_type" label="会計種別" :items="accounting_types"></v-select>
      <v-text-field v-model="budget" type="number" label="予算上限額" suffix="円"></v-text-field>
      <v-col class="text-right">
        <v-btn color="primary" @click="create_project">申請</v-btn>
      </v-col>
    </v-form>
    <v-dialog v-model="confirm_dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Use Google's location service?</v-card-title>

        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">Disagree</v-btn>

          <v-btn color="green darken-1" text @click="dialog = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "@/api";
import router from "@/router";
import { store } from "@/store";

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
      confirm_dialog: false,
    };
  },
  methods: {
    create_project: function() {
      (async () => {
        try {
          let create_project_result = await api.post("/v1/api/projects/", {
            title: this.title,
            description: this.description,
            accounting_type: this.accounting_type,
            leader: store.state.user_id
          });

          if (this.budget && this.budget > 0) {
            let project_id = create_project_result.data.id;

            await api.post("/v1/api/approvals/", {
              approver: null,
              project_id,
              budget_amount: this.budget
            });
          }

          router.push("/projects");
        } catch (error) {
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
        }
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
