<template>
  <div>
    <h1>プロジェクト</h1>
    <h2>ユーザー一覧</h2>
    <div class="user_list">
      <v-container fluid>
        <v-list three-line>
          <template v-for="(user, index) in users">
            <v-subheader v-if="user.header" :key="user.header" v-text="user.header"></v-subheader>

            <v-divider v-else-if="user.divider" :key="index" :inset="user.inset" style="padding: 0"></v-divider>

            <v-list-item v-else :key="user.email" style="padding: 4px" @click="open_dialog(user)">
              <v-list-item-avatar>
                <img src="../assets/shika.jpg" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="user.display_name"></v-list-item-title>
                <v-list-item-subtitle v-html="user.email"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>

        <v-dialog v-model="user_detail_dialog" width="80%">
          <v-card width="100%">
            <v-card-title>
              <span class="headline">{{ dialog_user.title }}</span>
            </v-card-title>
            <v-list-item>
              <v-list-item-avatar>
                <img src="../assets/shika.jpg" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title
                  v-text="dialog_user.display_name"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-text="dialog_user.email"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-card-text>登録日: {{dialog_user.date_registered | yymmdd}}</v-card-text>
            <v-card-actions></v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      users: [],
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
      user_detail_dialog: false,
      dialog_user: {}
    };
  },
  created() {
    api
      .get("/v1/api/users/")
      .then(response => {
        this.users = Array.from(response.data);
        for (let i = this.users.length - 1; i > 0; i--) {
          this.users.splice(i, 0, { divider: true, inset: true });
        }
        this.users.splice(0, 0, { header: "正会員" });
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    show: function(index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    },
    open_dialog: function(user) {
      this.dialog_user = user;
      this.user_detail_dialog = true;

      (async () => {
        try {
          let dialog_user = this.dialog_user;
          let response = await api.get(`/v1/api/users/${user.id}/`);
          dialog_user.detail = response.data;

          this.$set(this.dialog_user, dialog_user);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  },
  name: "users"
};
</script>

<style lang="scss" scoped>
.important_text {
  font-weight: 900;
}

.campaign_box {
  height: 250px;
  width: 300px;
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
