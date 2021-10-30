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
            <button
              type="button"
              class="btn btn-primary float-end"
              :disabled="variables.length==0"
              data-bs-toggle="modal" data-bs-target="#shareModal"
            >
              Share
            </button>
          <div class="fs-4">Evaluation</div>
          <evaluation-table :expr="expr" :context="context" :variables="variables"/>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal -->
<div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="Share expression and variable values" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Share example via url</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Use the following url to share this example:</p>
        <a href="{{shareURL()}}">{{shareURL()}}</a>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import JSONEditor from "./components/JSONEditor";
import TextExprEditor from "./components/TextExprEditor";
import ContextTable from "./components/ContextTable";
import EvaluationTable from "./components/EvaluationTable";
import transformJS from "js-to-json-logic";
import renderJsonLogic from "json-logic-to-js";

export default {
  name: "App",
  data() {
    return {
      context: [],
      expr: {},
    };
  },
  components: {
    "json-editor": JSONEditor,
    "text-editor": TextExprEditor,
    "context-table": ContextTable,
    "evaluation-table": EvaluationTable,
  },
  created: function() {
    // initial data can be passed in the querystring
    // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('context')) {
      this.context = JSON.parse(urlParams.get('context'));
    }
    if (urlParams.get('expr')) {
      this.expr = transformJS(urlParams.get('expr'));
    }
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
  methods: {
    shareURL() {
      return process.env.BASE_URL + "?expr=" + encodeURIComponent(renderJsonLogic(this.expr)) + "&context=" + encodeURIComponent(JSON.stringify(this.context))
    }
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
