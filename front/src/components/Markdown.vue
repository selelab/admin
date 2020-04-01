<template>
  <div>
    <div v-html="convertedMarkdown"></div>
  </div>
</template>

<script>
import marked from "marked";
import sanitizeHTML from "sanitize-html";
const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a/, '<a target="_blank" rel="nofollow" ');
};
renderer.image = function(href, title, text) {
  if (title) {
    var size = title.split("x");
    if (size[1]) {
      size = "width=" + size[0] + " height=" + size[1];
    } else {
      size = "width=" + size[0];
    }
  } else {
    size = "";
  }
  return (
    '<img src="' +
    href +
    '" alt="' +
    text +
    '" style="max-width: 100%; height: auto;"' +
    size +
    ">"
  );
};
marked.setOptions({
  sanitize: true
});
export default {
  props: {
    src: String,
  },
  computed: {
    convertedMarkdown: function() {
      return this.convertToSafeHTML(this.src)
    }
  },
  methods: {
    convertToSafeHTML: function(raw_text) {
      return marked(sanitizeHTML(raw_text), { renderer });
    }
  }
};
</script>

<style scoped>
</style>