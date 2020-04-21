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
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="6" lg="6">
          <h2>プロフィール</h2>
          <v-card flat outlined>
            <v-form ref="profileForm">
              <v-list-item>
                <v-list-item-content>
                  <v-text-field label="名前" v-model="displayName" :rules="[notBlankValidation]"></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div v-if="!!croppedImage">
                    <h6>プロフィール画像</h6>
                    <br />
                    <v-card
                      @click="() => {
                      if (!uploading && (isUploadFailed || uploadProgress != 100)) this.dialog = true;}"
                    >
                      <v-progress-linear
                        v-if="uploading || uploadProgress != 100"
                        :value="uploadProgress"
                      ></v-progress-linear>
                      <v-list-item>
                        <v-list-item-avatar color="grey darken-3">
                          <img :src="croppedImage" />
                        </v-list-item-avatar>
                        <v-list-item-content style="overflow: hidden">{{imageName}}</v-list-item-content>
                        <v-list-item-icon>
                          <div v-if="!uploading">
                            <v-icon
                              v-if="uploadProgress == 100 && !isUploadFailed"
                              color="green"
                            >mdi-check</v-icon>
                            <v-icon v-else-if="isUploadFailed" color="red">mdi-cancel</v-icon>

                            <v-icon
                              v-if="uploadProgress == 0 || isUploadFailed"
                              @click="clearAvatar"
                            >mdi-close-circle</v-icon>
                          </div>
                        </v-list-item-icon>
                      </v-list-item>
                    </v-card>
                  </div>
                  <v-file-input
                    v-else
                    accept="image/png, image/jpeg, image/bmp"
                    prepend-icon="mdi-file-image-outline"
                    v-model="avatar"
                    label="プロフィール画像"
                  ></v-file-input>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" :disabled="!isFormValueChanged" @click="saveChanges">保存</v-btn>
                <v-btn color="grey" style="margin: 10px" dark>キャンセル</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6" lg="6">
          <v-card class="my-9" style="padding-bottom: 30px">
            <v-list-item class="grow">
              <h6>表示例</h6>
            </v-list-item>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <img class="card_profile_icon" :src="croppedImage" v-if="!!croppedImage" />
                <img class="card_profile_icon" :src="getIconUrl(userInfo)" v-else-if="!isDebug" />
                <img class="card_profile_icon" src="@/assets/shika.jpg" v-else />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{displayName}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-card-text
              class="blur"
            >猫は栗の演奏戸汁で野ねずみへ困る譜たまし。そしてたった気の毒たたというへんずまし。大丈夫ましたんたもないまた向うの生意気たちのままをははっと上手たたて、きみまで楽譜でおろしれのなない。云わ過ぎそこはセロを悪いなくて一生けん命のかっこうの雲曲をし第六先生みちのあんまをしてこいたます。</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="6" lg="6">
          <h2>ログイン情報</h2>

          <v-card flat outlined>
            <v-form @submit.prevent="submitHandler" ref="authInfoForm" id="authInfoForm">
              <v-list-item>
                <v-list-item-content>
                  <v-text-field
                    label="メールアドレス"
                    type="email"
                    autocomplete="email"
                    disabled
                    v-model="userInfo.email"
                  ></v-text-field>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-information</v-icon>
                    </template>
                    <span>メールアドレスの変更は管理者へ連絡してください</span>
                  </v-tooltip>
                </v-list-item-icon>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field
                    label="新しいパスワード"
                    type="password"
                    autocomplete="new-password"
                    v-model="newPassword"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field
                    label="新しいパスワード(再入力)"
                    type="password"
                    autocomplete="new-password"
                    :rules="[passwordValidation]"
                    v-model="newPasswordConfirm"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" :disabled="!isFormValueChanged" @click="saveChanges">保存</v-btn>
                <v-btn color="grey" style="margin: 10px" dark>キャンセル</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      @input="cancelSelect"
      :max-width="dialogMaxWidth"
      :max-height="dialogMaxHeight"
      :disabled="!imgSrc"
      width="640px"
    >
      <v-card>
        <v-card-title>大きさを調整してください</v-card-title>
        <v-card-text>
          <vue-cropper
            ref="cropper"
            :aspectRatio="1"
            :guides="true"
            :zoomable="false"
            :background="false"
            :auto-crop-area="1"
            :src="imgSrc"
            alt="Source Image"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" @click="crop" text>決定</v-btn>
          <v-btn color="blue darken-1" @click="cancelSelect" text>キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import api from "@/api";
import * as utils from "@/utils";

export default {
  props: {
    value: {},
    dialogMaxWidth: { default: "600px" },
    dialogMaxHeight: { default: "0.8vh" },
    maxWidth: { default: 512 },
    maxHeight: { default: 512 },
    objectUrl: { default: "" }
  },
  components: {
    VueCropper
  },
  data() {
    return {
      userInfo: {},
      displayName: "",
      alert: false,
      errorMessage: "",
      imgSrc: "",
      croppedImage: null,
      dialog: false,
      contentType: "image/jpeg",
      croppedBlob: null,
      uploadProgress: 0,
      uploading: false,
      isUploadFailed: false,
      validatedFile: null,
      newPassword: "",
      newPasswordConfirm: "",
      checkValidation: false
    };
  },
  computed: {
    isDebug: () => utils.isDebug(),
    userId: function() {
      return this.$store.getters.getUserId;
    },
    cropSrc() {
      return this.croppedImage || this.value;
    },
    imageName() {
      if (!this.avatar) return "";
      return utils.summarize(this.avatar.name, 18);
    },
    isFormValueChanged: function() {
      return this.isProfileChanged || this.isAuthInfoChanged;
    },
    isProfileChanged() {
      if (this.croppedImage) return true;
      if (this.displayName != this.userInfo.display_name) return true;
      return false;
    },
    isAuthInfoChanged() {
      if (this.newPassword != "" && this.newPasswordConfirm) return true;
      return false;
    },
    avatar: {
      get() {
        return this.validatedFile;
      },
      set(file) {
        if (!file) {
          this.validatedFile = null;
          return;
        }

        if (!file.type.includes("image/")) {
          this.validatedFile = null;
          this.errorMessage = "有効な画像を選択してください。";
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
          this.alert = true;
          return;
        }

        if (typeof FileReader === "function") {
          const reader = new FileReader();

          reader.onload = event => {
            this.imgSrc = event.target.result;
            this.$refs.cropper.replace(event.target.result);
            this.$emit("update:dataUrl", this.imgSrc);
          };

          reader.readAsDataURL(file);
          this.dialog = true;
          this.validatedFile = file;
        } else {
          this.validatedFile = null;
          this.errorMessage = "画像の読み込みに失敗しました。";
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
          this.alert = true;
        }
      }
    }
  },
  created() {
    this.retriveUserInfo();
  },
  methods: {
    getIconUrl: function(user) {
      return utils.getIconUrl(user);
    },
    show: function(index) {
      this.$set(this.isShow, index, !this.isShow[index]);
    },
    notBlankValidation: utils.notBlankValidation,
    passwordValidation: function(v) {
      if (!this.checkValidation) return true;

      if (this.newPassword != this.newPasswordConfirm) {
        return "上で入力したパスワードと一致しているか確認してください";
      }

      if (v.length > 100) {
        return "パスワードは100文字以下にしてください";
      }

      if (!v.match(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i)) {
        return "アルファベットと数字を使い、6文字以上のパスワードにしてください";
      }
      return true;
    },
    retriveUserInfo: async function() {
      this.userInfo = (await api.get(`/v1/users/${this.userId}/`)).data;
      this.displayName = this.userInfo.display_name;
    },
    cancelSelect: function() {
      if (!this.croppedImage) {
        this.clearAvatar();
      }
      this.dialog = false;
    },
    clearAvatar() {
      this.avatar = null;
      this.imgSrc = "";
      this.croppedImage = null;
      this.croppedBlob = null;
      this.isUploadFailed = false;
      this.uploadProgress = 0;
    },
    crop() {
      this.$refs.cropper
        .getCroppedCanvas({
          maxWidth: this.maxWidth,
          maxHeight: this.maxHeight
        })
        .toBlob(
          blob => {
            this.croppedImage = URL.createObjectURL(blob);
            this.croppedBlob = blob;
            this.$emit("update:objectUrl", this.croppedImage);
          },
          this.contentType,
          0.95
        );
      this.dialog = false;
    },
    saveChanges: async function() {
      this.checkValidation = true;
      if (
        (this.isProfileChanged && !this.$refs.profileForm.validate()) ||
        (this.isAuthInfoChanged && !this.$refs.authInfoForm.validate())
      ) {
        this.errorMessage = "入力内容に誤りがあります";
        this.alert = true;
        if (this.isProfileChanged && !this.$refs.profileForm.validate()) {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        } else {
          utils.scrollToElementById("authInfoForm");
        }
        this.checkValidation = false;
        return;
      }
      this.checkValidation = false;

      if (this.isProfileChanged) {
        let iconMediaKey = null;
        if (this.avatar) {
          iconMediaKey = await this.uploadImage();
        }

        let displayName =
          this.displayName != this.userInfo.display_name && this.displayName;

        await api.patch(
          `/v1/users/${this.userId}/`,
          utils.filterFalsy({
            display_name: displayName,
            icon_media_key: iconMediaKey
          })
        );
      }

      if (this.isAuthInfoChanged) {
        await api.patch(
          `/v1/users/${this.userId}/`,
          utils.filterFalsy({
            password: this.newPassword
          })
        );
        this.newPassword = "";
        this.newPasswordConfirm = "";
      }

      this.errorMessage = "";
      this.retriveUserInfo();
    },
    uploadImage: async function() {
      try {
        this.uploading = true;
        const iconMediaKey = await utils.uploadImage(
          this.croppedBlob,
          this.contentType,
          progressEvent => {
            this.uploadProgress =
              (progressEvent.loaded * 100) / this.croppedBlob.size;
          }
        );
        this.uploading = false;

        return iconMediaKey;
      } catch (error) {
        this.uploading = false;
        this.isUploadFailed = true;
        console.log(error);
        return null;
      }
    }
  },
  name: "users"
};
</script>

<style lang="scss">
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

.blur {
  filter: blur(3px);
}

.user_list_avatar {
  margin-top: auto !important;
  margin-bottom: auto !important;
}
.cropper-view-box {
  border-radius: 50% !important;
}
.cropper-face {
  border-radius: 50% !important;
}
</style>
