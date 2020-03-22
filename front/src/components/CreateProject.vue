<template>
  <div>
    <h1>プロジェクト申請</h1>
    <v-form ref="form">
      <v-text-field v-model="title" label="プロジェクト名" required></v-text-field>

      <v-textarea v-model="description" outlined required name="input-7-4" label="プロジェクト説明"></v-textarea>
      <v-text-field v-model="budget" type="number" label="予算上限額" suffix="円"></v-text-field>
      <v-col class="text-right">
        <v-btn color="primary">申請</v-btn>
      </v-col>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      budget: 0,
      description: "## 概要\n## 予算内訳\n"
    };
  }
};
</script>

<style lang="scss" scoped>
</style>