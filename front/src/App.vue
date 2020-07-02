<template>
  <div id="app">
    <v-app id="inspire">
      <Header />
      <v-content>
        <router-view class="router-content" />
      </v-content>
      <Footer />
    </v-app>
  </div>
</template>

<script>
import Header from "./views/Header";
import Footer from "./views/Footer";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">
* :not(.v-icon) {
  font-family: "Hiragino Kaku Gothic Pro", "メイリオ", sans-serif !important;
}

.router-content {
  width: 90%;
  margin: 50px auto 100px;
}

#inspire {
  background-color: var(--v-background-base);
  color: var(--v-text_color-base);
}
</style>
