<docs>
A version of the ace-editor that edits a Json Logic object.
</docs>

<template>
  <v-ace-editor
    v-model:value="text"
    lang="json"
    theme="textmate"
    :options="{ tabSize: 2, useWorker: true }"
    style="height: 300px; border-radius: .25rem; border: 1px solid #ced4da;"
  />
</template>

<script>
import { VAceEditor } from "vue3-ace-editor";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import workerJsonUrl from "file-loader?esModule=false!ace-builds/src-noconflict/worker-json.js";

ace.config.setModuleUrl("ace/mode/json_worker", workerJsonUrl);

export default {
  props: {
    value: Object,
  },
  data: function () {
    return {
      jsonValid: true,
    };
  },
  components: {
    VAceEditor,
  },
  computed: {
    text: {
      // JSON text for atom editor
      get: function () {
        return JSON.stringify(this.value, null, 2);
      },
      set: function (text) {
        if (text.length > 0) {
          let json;
          try {
            if (text !== this.text) {
              json = JSON.parse(text);
              this.jsonValid = true;
              this.$emit("update", json);
            }
          } catch (e) {
            // assumes exception caused by hand editing the JSON
            this.jsonValid = false;
          }
        }
      },
    },
    style() {
      return (
        "height: 300px; border: " +
        (this.jsonValid ? "grey" : "red") +
        " 1px dashed"
      );
    },
  },
};
</script>
