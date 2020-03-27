<template>
  <div>
    <v-app-bar flat color="primary" dark app :hide-on-scroll="showBottomNavi" clipped-left>
      <v-app-bar-nav-icon v-if="showMenuDetailButton" @click="menu_detail_clicked"></v-app-bar-nav-icon>

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

    <v-navigation-drawer app clipped v-model="drawer" mobile-break-point="600">
      <v-list nav dense>
        <v-list-item-group v-model="group" color="primary">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>トップ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/projects">
            <v-list-item-icon>
              <v-icon>mdi-file-chart-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>プロジェクト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/users">
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ユーザー</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/alerts">
            <v-list-item-icon>
              <v-icon>mdi-bell-ring</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>通知</v-list-item-title>
            </v-list-item-content>
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
    drawer: window.innerWidth >= 960,
    showNaviDrawerAlways: window.innerWidth >= 960,
    showMenuDetailButton: window.innerWidth >= 600 && window.innerWidth < 960,
    showBottomNavi: window.innerWidth < 600,
    group: null
  }),
  computed: {
    hasValidJwtToken() {
      return this.$store.getters.hasValidJwtToken;
    },
    isLoginPage() {
      return this.$route.path == this.loginPage;
    },
    loginPage() {
      return "/login";
    }
  },
  watch: {
    group() {
      this.drawer = window.innerWidth >= 960;
    }
  },
  methods: {
    auth_clicked: function() {
      if (this.hasValidJwtToken) {
        this.$store.commit("setJwtToken", undefined);
        if (!this.isLoginPage) router.push(this.loginPage);
      } else {
        router.push(this.loginPage);
      }
    },
    menu_detail_clicked: function() {
      if (!this.showNaviDrawerAlways) {
        this.drawer = !this.drawer;
      } else {
        this.drawer = true;
      }
    },
    handleResize: function() {
      this.showNaviDrawerAlways = window.innerWidth >= 960;
      if (this.showNaviDrawerAlways) {
        this.drawer = true;
      }
      if (
        window.innerWidth >= 600 &&
        window.innerWidth < 960 &&
        !this.showMenuDetailButton
      ) {
        this.drawer = false;
      }
      this.showMenuDetailButton =
        window.innerWidth >= 600 && window.innerWidth < 960;
      this.showBottomNavi = window.innerWidth < 600;
    }
  },
  mounted: function() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style lang="scss">
.v-navigation-drawer__content {
  background-color: var(--v-background-base);
}
</style>