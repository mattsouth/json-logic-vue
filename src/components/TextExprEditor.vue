<docs>
A text input component that reflects and can edit a Javascript serialisation of a Json Logic expression.

Updates are debounced to avoid too much chatter.
TODO: Expose an error state if the textbox value cannot be deserialised
TODO: Use a slot to pass styling classes from consumer
</docs>

<template>
  <input ref="textEditor" type="text" v-model="render" class="form-control" />
  <div class="small text-secondary">JavaScript<span class="small text-danger" v-if="!valid"> - {{validation}}</span></div>
</template>

<script>
import renderJsonLogic from "json-logic-to-js";
import transformJS from "js-to-json-logic";

let timeout;

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      validation: ""
    }
  },
  emits: ['update', 'valid'],
  computed: {
    render: {
      get: function () {
        if (this.valid) {
            return renderJsonLogic(this.value);
        } else {
          return this.$refs.textEditor.value;
        }
    },
      set: function (text) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          try {
            const json = transformJS(text);
            if (!this.valid) {
              this.valid = true;
              this.$emit("valid", true);
              this.validation = "";
            }
            if (this.value != json) {
              this.$emit("update", json);
            }
          } catch (e) {
            if (this.valid) {
              this.valid = false;
              this.$emit("valid", false);
            }
            this.validation = e.message;
            //console.info('conversion error:', text, e.message);
          }
        }, 400);
      },
    },
  },
};
</script>
