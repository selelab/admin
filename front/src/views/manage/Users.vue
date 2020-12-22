<template>
  <div>
    <h1>ユーザー管理</h1>

    <v-data-table :headers="listUserHeaders" :items="listUsers" class="elevation-1">
      <template v-slot:[`item.email`]="{ item }">
        <v-text-field
          v-model="item.email"
          style="height: 40px"
          solo
          flat
          dense
          required
          :disabled="!!(item.approver || item.approved)"
        ></v-text-field>
      </template>
    </v-data-table>
    <v-form ref="profileForm">
      <v-list-item>
        <v-list-item-content>
          <v-text-field label="ユーザー名" :disabled="isProcessing" v-model="displayName"></v-text-field>
          <v-text-field label="メールアドレス" :disabled="isProcessing" v-model="email"></v-text-field>
          <v-checkbox v-model="isSuperuser" label="管理者権限"></v-checkbox>
        </v-list-item-content>
      </v-list-item>
      <!-- <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="isProcessing || !isFormValueChanged"
          @click="saveChanges"
        >保存</v-btn>
        <v-btn color="grey" class="ma-2" dark>キャンセル</v-btn>
      </v-card-actions>-->
    </v-form>
    <Confirm ref="confirm"></Confirm>
  </div>
</template>

<script>
import api from "@/api";
import * as utils from "@/utils";

import Confirm from "@/components/Confirm";

export default {
  data() {
    return {
      isProcessing: false,
      displayName: "",
      email: "",
      isSuperuser: false,
      listUsers: [],
      listUserHeaders: [
        {
          text: "ユーザー名",
          align: "start",
          sortable: false,
          value: "displayName"
        },
        {
          text: "メールアドレス",
          align: "start",
          sortable: false,
          value: "email"
        },
        {
          text: "有効",
          align: "start",
          sortable: false,
          value: "isActive"
        },
        {
          text: "管理者権限",
          align: "start",
          sortable: false,
          value: "isSuperuser"
        }
      ]
    };
  },
  created() {
    (async () => {
      try {
        this.listUsers = Array.from(
          utils.camelize((await api.get("/v1/users/")).data)
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
    createUser() {
      api.post("/v1/users/", {
        email: "email@email.com"
      });
    }
  },
  components: {
    Confirm
  }
};
</script>

<style>
</style>
