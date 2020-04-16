<template>
  <div>
    <h1>登録情報</h1>
    <h2>ユーザー</h2>
  </div>
</template>

<script>
import api from "@/api";

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

.user_list_avatar {
  margin-top: auto !important;
  margin-bottom: auto !important;
}
</style>
