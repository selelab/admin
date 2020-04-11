<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4" v-html="message"></v-card-text>
      <div style="width: 80%; margin: auto">
        <v-text-field label="棄却理由" v-model="reason"></v-text-field>
      </div>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" outlined @click.native="agree">棄却</v-btn>
        <v-btn color="grey" outlined @click.native="cancel">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    reason: "",
    options: {
      color: "primary",
      width: 480,
      zIndex: 200
    }
  }),
  methods: {
    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      if (this.reason) {
        this.resolve(this.reason);
        this.reason = "";
        this.dialog = false;
      }
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    }
  }
};
</script>