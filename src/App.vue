<docs>
A tool for testing and sharing Json Logic expressions.

TODO: Fix "Will-change memory consumption is too high" shown in firefox console.
</docs>

<template>
  <div class="col-lg-12 mx-auto p-3">
    <header>
      <div class="fs-2">JsonLogic demo</div>
      <p>
        <a href="https://jsonlogic.com">JsonLogic</a> allows users to define
        expressions over data. This tool is for testing and sharing those
        expressions.
      </p>
    </header>
    <main>
      <div class="row">
        <div class="col">
          <button
            type="button"
            class="btn btn-primary float-end"
            @click="
              expr = {};
              context = [];
            "
          >
            Clear
          </button>
          <div class="fs-4">Expression</div>
          <text-editor :value="expr" @update="expr = $event" />
          <json-editor :value="expr" @update="expr = $event" />
        </div>
        <div class="col">
          <div class="fs-4">Context</div>
          <context-table
            :context="context"
            :variables="variables"
            @update="context = $event"
          />
        </div>
        <div class="col">
          <div class="fs-4">Evaluation</div>
          <evaluation-table :expr="expr" :context="context" :variables="variables"/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import JSONEditor from "./components/JSONEditor";
import TextExprEditor from "./components/TextExprEditor";
import ContextTable from "./components/ContextTable";
import EvaluationTable from "./components/EvaluationTable";

export default {
  name: "App",
  data() {
    return {
      context: [
        { name: "age", values: [null, -Infinity, 0, 17, 18, 19, Infinity] },
        { name: "presentable", values: [null, false, true] },
      ],
      expr: { and: [{ ">=": [{ var: "age" }, 18] }, { var: "presentable" }] },
    };
  },
  components: {
    "json-editor": JSONEditor,
    "text-editor": TextExprEditor,
    "context-table": ContextTable,
    "evaluation-table": EvaluationTable,
  },
  computed: {
    variables() {
      function helper(expr, vals) {
        if (Object.keys(expr).includes("var")) {
          vals.push(expr.var);
          return vals;
        } else {
          const keys = Object.keys(expr);
          if (keys.length > 0) {
            const val = expr[Object.keys(expr)[0]];
            if (Array.isArray(val)) {
              for (const arrexpr of val) {
                vals = vals.concat(helper(arrexpr, []));
              }
              return vals;
            } else {
              return helper(val, vals);
            }
          } else {
            return vals;
          }
        }
      }
      return helper(this.expr, []);
    },
  },
  watch: {
    expr() {
      const dds = this.context.map((dd) => dd.name);
      for (const dd of this.variables.filter((x) => !dds.includes(x))) {
        this.context.push({ name: dd, values: [null] });
      }
    },
  },
};
</script>
