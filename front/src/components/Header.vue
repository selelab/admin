<template>
  <div>
    <v-app-bar flat color="primary" dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>エレラ簿</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-model="hasValidJwtToken"
        @click="auth_clicked"
        v-if="!isLoginPage"
        text
      >{{ hasValidJwtToken ? "ログアウト" : "ログイン" }}</v-btn>

      <v-list-item-avatar color="grey darken-3" v-if="hasValidJwtToken">
        <img class="card_profile_icon" src="../assets/shika.jpg" />
      </v-list-item-avatar>
    </v-app-bar>
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list nav dense>
        <v-list-item-group v-model="group" color="primary">
          <v-list-item to="/">
            <v-list-item-title>トップ</v-list-item-title>
          </v-list-item>

          <v-list-item to="/projects">
            <v-list-item-title>プロジェクト</v-list-item-title>
          </v-list-item>

          <v-list-item to="/users">
            <v-list-item-title>ユーザー</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import router from "../router";

export default {
  data: () => ({
    drawer: false,
    group: null
  }),
  computed: {
    hasValidJwtToken() {
      return this.$store.getters.hasValidJwtToken;
    },
    isLoginPage() {
      return this.$route.path == "/login";
    }
  },
  watch: {
    group() {
      this.drawer = false;
    }
  },
  methods: {
    auth_clicked: function() {
      if (this.hasValidJwtToken) {
        this.$store.commit("setJwtToken", undefined);
        router.push("/");
      } else {
        router.push("/login");
      }
    }
  }
};
</script>
