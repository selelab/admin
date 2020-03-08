<template>
  <v-app id="app">
    <Header />
    <router-view />
    <Footer />
  </v-app>
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
</style>
