<docs>
Provides a truth table that enumerates all combinations of context variable values and the associated expression value.
</docs>

<template>
  <table class="table table-sm">
    <thead>
      <tr>
        <th v-for="name in variables" v-bind:key="name">{{ name }}</th>
        <th>result</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="res in combinations" v-bind:key="res">
        <td v-for="name in variables" v-bind:key="name">
          {{ renderValue(res[name]) }}
        </td>
        <td>{{ renderValue(res._value) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Shared from "./shared";
import * as jsonLogic from 'json-logic-js';

export default {
  props: {
    context: {
      type: Array,
      required: true,
    },
    expr: {
      type: Object,
      required: true,
    },
    variables: {
      type: Array,
      required: true
    }
  },
  mixins: [Shared],
  computed: {
    combinations() {
      const r = [];
      const filtered = this.context.filter((val) => this.variables.includes(val.name));
      const dds = this.variables;
      function helper(obj, i) {
        for (var j = 0, l = filtered[i].values.length; j < l; j++) {
          var o = { ...obj }; // clone obj
          o[dds[i]] = filtered[i].values[j];
          if (i == filtered.length - 1) r.push(o);
          else helper(o, i + 1);
        }
      }
      // form an array of possible combination values of context.
      if (filtered.length > 0) {
        helper({}, 0);
        // evaluate expression values for that array
        for (let comb of r) {
          let val = jsonLogic.apply(this.expr, comb);
          comb._value = val;
        }
      }
      return r;
    },
  },
};
</script>
