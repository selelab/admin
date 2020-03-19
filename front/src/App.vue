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
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  components: {
    Header,
    Footer
  }
};
</script>

<style lang="scss">
* :not(.v-icon) {
  font-family: "Hiragino Kaku Gothic Pro", "メイリオ", sans-serif !important;
}

.router-content {
  width: 80%;
  margin: 50px auto 100px;
}
</style>
