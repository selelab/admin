<template>
  <div class="list_header">
    <div class="list_header_text">{{text}}</div>
    <v-btn
      v-if="append"
      :to="append"
      class="mx-2 list_append_button"
      fab
      dark
      x-small
      depressed
      color="primary"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    append: String
  }
};
</script>

<style scoped>
.list_header {
  padding-top: 20px;
  padding-bottom: 20px;
  height: 10px;
}

.list_header_text {
  margin-top: auto;
  margin-bottom: auto;
  width: 80%;
  max-width: 200px;
  float: left;
  font-size: 20px;
  font-weight: 700;
}
</style>
