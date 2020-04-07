<template>
  <div>
    <h1>会計管理システム</h1>
    <v-card>
      <v-card-title class="font-weight-bold">概要</v-card-title>
      <v-card-text>
        上智大学エレクトロニクスラボの会計管理システムです。フロントエンドは
         <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a> で、サーバーサイドは
         <a href="https://www.django-rest-framework.org/" target="_blank">Django REST framework</a> で作られています。
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Index"
};
</script>

<style scoped>
</style>