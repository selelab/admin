<template>
  <v-footer padless fixed height="30px" dark app style="padding: 0">
    <v-col class="text-center" cols="12" style="padding: 0; font-size: 12px">
      {{ new Date().getFullYear() }} —
      <strong>Sophia Electronics Lab</strong>
      <v-btn icon href="https://github.com/selelab/admin-api" target="_blank">
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
    </v-col>
  </v-footer>
</template>
