<docs>
A text input component that reflects and can edit a Javascript serialisation of a Json Logic expression.

Updates are debounced to avoid too much chatter.
TODO: Expose an error state if the textbox value cannot be deserialised
TODO: Use a slot to pass styling classes from consumer
</docs>

<template>
  <input type="text" v-model="render" class="mb-2 form-control" />
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
  computed: {
    render: {
      get: function () {
        return renderJsonLogic(this.value);
      },
      set: function (text) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          try {
            this.$emit("update", transformJS(text));
          } catch (e) {
            console.log(text, e);
          }
        }, 400);
      },
    },
  },
};
</script>
