<template>
<div class="col-lg-12 mx-auto p-3">
    <header>
        <div class="fs-2">JsonLogic demo</div>
        <p><a href="https://jsonlogic.com">JsonLogic</a> allows users to define expressions over data.  This tool is for testing and sharing those expressions.</p>
    </header>
    <main>
        <div class="row">
            <div class="col">
                <button type="button" class="btn btn-primary float-end" @click="expr={}; context=[]">Clear</button>
                <div class="fs-4">Expression</div>
                <text-editor :value="expr" @update="expr = $event"/>
                <json-editor :value="expr" @update="expr = $event" />
            </div>
            <div class="col">
                <div class="fs-4">Context</div>
                <context-table :value="context" :variables="variables" @update="context = $event" />
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
import TextExprEditor from './components/TextExprEditor';
import ContextTable from './components/ContextTable';
import * as jsonLogic from 'json-logic-js';

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
        'json-editor': JSONEditor,
        'text-editor': TextExprEditor,
        'context-table': ContextTable
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
            if (context.length>0) {
                helper({}, 0);
                // evaluate expression values for that array
                for (let comb of r) {
                    let val = jsonLogic.apply(this.expr, comb);
                    comb._value = val;
                }
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
        },
    },
    watch: {
        expr() {
            for (const dd of this.variables.filter(x => !this.dds.includes(x))) {
                this.context.push({name: dd, values: [null]});
            }
        },
    }
}
</script>
