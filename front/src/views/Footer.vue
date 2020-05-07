<template>
  <div class="overflow-hidden">
    <v-bottom-navigation
      class="bottom_navigation"
      v-if="showBottomNavi"
      fixed
      color="primary"
      dark
      grow
      app
    >
      <v-btn to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn to="/projects">
        <v-icon>mdi-file-chart-outline</v-icon>
      </v-btn>

      <v-btn to="/profile">
        <v-icon>mdi-account-group</v-icon>
      </v-btn>

      <v-btn to="/alerts">
        <v-icon>mdi-bell-ring</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-footer padless fixed height="30px" dark app style="padding: 0">
      <v-col class="text-center" cols="12" style="padding: 0; font-size: 12px">
        {{ new Date().getFullYear() }} —
        <strong>Sophia Electronics Lab</strong>
        <v-btn icon href="https://github.com/selelab/admin" target="_blank">
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    showBottomNavi: window.innerWidth < 600
  }),
  methods: {
    handleResize: function() {
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
