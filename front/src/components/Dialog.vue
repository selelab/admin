<template>
  <v-dialog v-model="isOpen" @input="v => v || closeDialog()">
    <v-card width="100%">
      <v-card-title>
        <span class="headline">{{ title }}</span>
        <v-btn icon absolute right v-if="editable">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-list-item>
        <v-list-item-avatar>
          <img src="@/assets/shika.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="leaderName"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action></v-list-item-action>
      </v-list-item>

      <v-card-text>
        <div class="top_chips">
          <v-chip x-small chip color="amber lighten-4">支出</v-chip>
          {{ sumPurchasePrice | addComma }}円
        </div>
        <div class="top_chips">
          <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
          {{ sumBudget | addComma }}円
        </div>
        <div class="top_chips" v-if="sumReqBudget">
          <v-chip x-small chip color="green lighten-2" style="color: white">未承認</v-chip>
          {{ sumReqBudget | addComma }}円
        </div>
        <br />
        <br />
        <Markdown :src="description"></Markdown>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn small color="red" outlined rounded right v-if="editable">完了にする</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import router from "@/router";

import Markdown from "@/components/Markdown";

export default {
  props: {
    isOpen: Boolean,
    title: String,
    editable: Boolean,
    leaderName: String,
    sumPurchasePrice: Number,
    sumBudget: Number,
    sumReqBudget: Number,
    description: String,
    originUrl: String
  },
  methods: {
    closeDialog: function() {
      router.push(this.originUrl);
    }
  },
  components: {
    Markdown
  }
};
</script>

<style>
.top_chips {
  width: 100%;
  max-width: 160px;
  padding-left: 10px;
  padding-right: 10px;
  display: inline-block;
}
</style>
