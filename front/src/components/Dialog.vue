<template>
  <v-dialog v-model="isOpen" @input="v => v || close()" width="640px">
    <v-card class="main">
      <v-card-title>
        <span class="headline">{{ project.title }}</span>
        <v-list-item-subtitle>
          <div>
            <v-chip
              x-small
              chip
              :color="project.accounting_type == 'soft' ? 'cyan lighten-4' : 'orange lighten-4'"
              text-color="grey darken-3"
              class="chip_wrapper"
            >{{ project.accounting_type }}</v-chip>
            <v-chip x-small chip class="chip_wrapper">{{ project.closed ? "完了" : "進行中" }}</v-chip>
          </div>
        </v-list-item-subtitle>
        <v-btn icon absolute right :to="editPath" v-if="editable">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-list-item>
        <v-list-item-avatar>
          <img src="@/assets/shika.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="projectLeaderName"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action></v-list-item-action>
      </v-list-item>

      <v-card-text>
        <div class="top_chips">
          <v-chip x-small chip color="amber lighten-4">支出</v-chip>
          {{ project.sum_purchase_price | addComma }}円
        </div>
        <div class="top_chips">
          <v-chip x-small chip color="red lighten-2" style="color: white">上限</v-chip>
          {{ project.sum_budget | addComma }}円
        </div>
        <div class="top_chips" v-if="project.detail && project.detail.sum_req_budget">
          <v-chip x-small chip color="green lighten-2" style="color: white">未承認</v-chip>
          {{ project.detail.sum_req_budget | addComma }}円
        </div>
        <br />
        <br />
        <Markdown :src="project.description"></Markdown>
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
    project: Object,
    title: String,
    editable: Boolean,
    leaderName: String,
    sumPurchasePrice: Number,
    sumBudget: Number,
    sumReqBudget: Number,
    description: String,
    originUrl: String,
    editPath: String
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    projectLeaderName: function() {
      return (
        (this.project &&
          this.project.leader_detail &&
          this.project.leader_detail.display_name) ||
        "リーダーはまだいません。"
      );
    }
  },
  methods: {
    open: function() {
      this.isOpen = true;
    },
    close: function() {
      this.isOpen = false;
      if (this.$route.path != this.originUrl) router.push(this.originUrl);
    }
  },
  components: {
    Markdown
  }
};
</script>

<style scoped>
.top_chips {
  width: 100%;
  max-width: 160px;
  padding-left: 10px;
  padding-right: 10px;
  display: inline-block;
}
</style>
