<template>
  <div>
    <v-btn
      :disabled="sources.length == 0"
      :dark="sources.length > 0"
      color="primary"
      @click="handleClick"
      :id="'json-to-csv-' + _uid"
    >
      ダウンロード
      <v-icon right>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script>
import api from "@/api";

import flatten from "flat";

export default {
  props: {
    sources: {
      type: Array,
      required: true
    },
    showHeader: {
      type: Boolean,
      default: true,
      required: false
    },
    header: {
      type: Object,
      required: false
    },
    separator: {
      type: String,
      default: ",",
      required: false
    },
    newline: {
      type: String,
      default: "\r\n",
      required: false
    },
    quoteMark: {
      type: String,
      default: '"',
      required: false
    }
  },
  data: () => ({
    csvHeader: null,
    csvData: null
  }),
  destroyed() {
    this.csvHeader = null;
    this.csvData = null;
  },
  methods: {
    async handleClick() {
      this.sources.forEach(async source => {
        let hasErrorEvent = Object.keys(this._events).indexOf("error") > -1;
        let hasSuccessEvent = Object.keys(this._events).indexOf("success") > -1;
        const jsonData = (await api.get(source.apiPath)).data.map(item =>
          flatten(item)
        );

        if (source.header && !Object.keys(source.header).length) {
          this.handleError(`Error: Header are empty`, hasErrorEvent);
          return;
        }

        let headerConf = source.header || jsonData[0];

        this.csvHeader = this.showHeader
          ? this.createCsvHeader(headerConf)
          : "";
        this.csvData = this.createCsvContent(jsonData, headerConf);

        if (this.csvHeader === "error" || this.csvData === "error") {
          this.handleError(
            `Error: An error occurred while parsing the data.`,
            hasErrorEvent
          );
          return;
        }

        let hasSuccessDownload = this.downloadCsv(
          this._uid,
          this.csvHeader + this.csvData,
          source.title
        );

        if (!hasSuccessDownload)
          this.handleError(`An error has occurred`, hasErrorEvent);
        else if (hasSuccessEvent) this.$emit("success", true);
      });
    },
    handleError(msg, hasErrorEvent) {
      if (hasErrorEvent) this.$emit("error", msg);
      throw msg;
    },
    createCsvHeader(header) {
      const quoteMark = this.quoteMark;
      const newline = this.newline;

      try {
        return (
          Object.keys(header)
            .map(key => {
              if (header[key] && header[key].title)
                return quoteMark + header[key].title + quoteMark;
              else return quoteMark + key + quoteMark;
            })
            .join(this.separator) + newline
        );
      } catch (err) {
        console.log(err);
        return "error";
      }
    },
    createCsvContent(arr, header) {
      const numericTypes = new Set(["number", "float"]);

      const quoteMark = this.quoteMark;
      const separator = this.separator;
      const newline = this.newline;

      try {
        return arr
          .map(function(item) {
            return Object.keys(header)
              .map(function(key) {
                if (numericTypes.has(typeof item[key])) {
                  return item[key];
                } else {
                  return quoteMark + item[key] + quoteMark;
                }
              })
              .join(separator);
          })
          .join(newline);
      } catch (err) {
        console.log(err);
        return "error";
      }
    },
    downloadCsv(uid, csv, title) {
      try {
        let link = document.createElement("a");

        link.id = "csv-" + uid;
        link.href =
          "data:text/csv;charset=utf-8," + "\uFEFF" + encodeURIComponent(csv);
        link.style.visibility = "hidden";
        link.download = title + ".csv";

        document.body.appendChild(link);
        document.getElementById(link.id).click();

        setTimeout(function() {
          document.body.removeChild(link);
        });
        return true;
      } catch (err) {
        return false;
      }
    }
  }
};
</script>
