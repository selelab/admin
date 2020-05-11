<template>
  <div>
    <v-app-bar flat color="primary" dark app :hide-on-scroll="showBottomNavi" clipped-left>
      <v-app-bar-nav-icon v-if="showMenuDetailButton" @click="menu_detail_clicked"></v-app-bar-nav-icon>

      <img alt="SEL" src="@/assets/SEL_180x180.png" width="24px" style="margin-right: 10px" />
      <v-toolbar-title>エレラ簿</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" dark icon v-on="on">
            <v-avatar size="36" color="grey darken-3" v-if="hasValidJwtToken">
              <img class="card-profile-icon" :src="getIconUrl(userInfo)" v-if="!isDebug" />
              <img class="card-profile-icon" src="@/assets/shika.jpg" v-else />
            </v-avatar>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img class="card-profile-icon" :src="getIconUrl(userInfo)" v-if="!isDebug" />
                <img class="card-profile-icon" src="@/assets/shika.jpg" v-else />
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link to="/profile/">
              <v-list-item-content>
                <v-list-item-title class="title">{{userInfo && userInfo.displayName}}</v-list-item-title>
                <v-list-item-subtitle>{{userInfo && userInfo.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item @click="changeAuth">
              <v-list-item-content>
                <v-list-item-title>ログアウト</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer app clipped v-model="drawer" mobile-break-point="600">
      <v-list nav dense>
        <v-list-item-group v-model="group" color="primary">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>総合</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/projects">
            <v-list-item-icon>
              <v-icon>mdi-buffer</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>プロジェクト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/manage">
            <v-list-item-icon>
              <v-icon>mdi-stamper</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>承認・運営</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import router from "@/router";
import * as utils from "@/utils";

export default {
  data: () => ({
    drawer: window.innerWidth >= 960,
    showNaviDrawerAlways: window.innerWidth >= 960,
    showMenuDetailButton: window.innerWidth >= 600 && window.innerWidth < 960,
    showBottomNavi: window.innerWidth < 600,
    group: null
  }),
  computed: {
    isDebug: () => utils.isDebug(),
    hasValidJwtToken() {
      return this.$store.getters.hasValidJwtToken;
    },
    userInfo() {
      return this.$store.getters.getUserInfo;
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
    getIconUrl: function(user) {
      return utils.getIconUrl(user);
    },
    changeAuth: function() {
      if (this.hasValidJwtToken) {
        this.$store.dispatch("setJwtToken", undefined);
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