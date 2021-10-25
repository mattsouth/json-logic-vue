<template>
<div class="col-lg-12 mx-auto p-3">
    <header>
        <div class="fs-2">JsonLogic demo</div>
        <p><a href="https://jsonlogic.com">JsonLogic</a> allows users to define expressions over data.  This tool is for testing and sharing those expressions.</p>
    </header>
    <main>
        <div class="row">
            <div class="col">
                <div class="fs-4">Expression</div>
                <input type="text" v-model="render" class="my-2 form-control"/>
                <json-editor :value="expr" @update="expr = $event" />
            </div>
            <div class="col">
                <div class="fs-4">Context</div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>variable</th>
                            <th>value(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dd in context" v-bind:key="dd" :class="{'text-muted text-decoration-line-through': !(variables.includes(dd.name))}">
                            <td>{{dd.name}}</td>
                            <td>{{renderValues(dd.values)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col">
                <div class="fs-4">Evaluation</div>
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th v-for="name in variables" v-bind:key="name">{{name}}</th>
                            <th>value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="res in result" v-bind:key="res">
                            <td v-for="name in variables" v-bind:key="name">{{renderValue(res[name])}}</td>
                            <td>{{renderValue(res._value)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>
</template>

<script>
import JSONEditor from './components/JSONEditor';
import * as jsonLogic from 'json-logic-js';
import renderJsonLogic from 'json-logic-to-js';
import transformJS from 'js-to-json-logic';

export default {
    name: 'App',
    data() {
        return {
            context: [
                {name: "age", values: [null, -Infinity, 0, 17, 18, 19, Infinity]},
                {name: "presentable", values: [null, false, true]}
            ],
            expr: { "and": [{">=": [{var: "age"}, 18]}, {var: "presentable"}]}
        }
    },
    components: {
        'json-editor': JSONEditor
    },
    computed: {
        result() {
            const r = [];
            const context = this.filtered;
            const dds = this.variables;
            function helper(obj, i) {
                for (var j=0, l=context[i].values.length; j<l; j++) {
                    var o = { ...obj }; // clone obj
                    o[dds[i]]= context[i].values[j];
                    if (i==(context.length-1))
                        r.push(o);
                    else
                        helper(o, i+1);
                }
            }
            // form an array of possible combination values of context.
            helper({}, 0);
            // evaluate expression values for that array
            for (let comb of r) {
                let val = jsonLogic.apply(this.expr, comb);
                comb._value = val;
            }
            return r;
        },
        dds() {
            return this.context.map((val) => val.name);
        },
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
        filtered() {
            return this.context.filter((val) => this.variables.includes(val.name));
        },
        render: {
            get: function() {
                return renderJsonLogic(this.expr);
            },
            set: function(text) {
                this.expr = transformJS(text);
            }
        }
    },
    methods: {
        renderValue(val) {
            if (val == null) {
                return "null";
            } else {
                return val.toString();
            }
        },
        renderValues(vals) {
            return vals.map((val) => this.renderValue(val)).join(", ");
        }
    }
}
</script>
