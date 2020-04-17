<template>
  <div>
    <h1>登録情報</h1>
    <h2>ユーザー</h2>
    <v-form>
      <v-text-field label="表示名"></v-text-field>
      <v-file-input
        :rules="rules"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="Pick an avatar"
        prepend-icon="mdi-camera"
        v-model="avatar"
        label="Avatar"
      ></v-file-input>
      <v-btn class="mr-4" @click="upload_image">submit</v-btn>
    </v-form>
  </div>
</template>

<script>
import api from "@/api";
import Axios from "axios";

export default {
  data() {
    return {
      user_information: {},
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "2MB以下のファイルを選択してください！"
      ],
      avatar: null
    };
  },
  computed: {
    userId: function() {
      return this.$store.getters.getUserId;
    }
  },
  created() {
    this.retrive_user_information();
  },
  methods: {
    show: function(index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    },
    retrive_user_information: async function() {
      this.user_information = (
        await api.get(`/v1/api/users/${this.userId}/`)
      ).data;
    },
    save_information: async function() {
      let icon_media_key = "";
      if (this.avatar) {
        icon_media_key = await this.upload_image();
      }

      await api.patch(`/v1/api/users/${this.userId}/`, {
        icon_media_key,
      });
    },
    upload_image: async function() {
      try {
        const data = (
          await api.post("/v1/api/storaging/", {
            scope: "profile-images",
            content_type: this.avatar.type
          })
        ).data;

        await Axios({
          method: "PUT",
          url: data.pre_signed_url,
          headers: {
            "Content-Type": this.avatar.type
          },
          data: this.avatar
        });

        return data.id;
      } catch (error) {
        console.log(error);
      }
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
