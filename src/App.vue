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
                <table class="table">
                    <thead>
                        <tr>
                            <th>variable</th>
                            <th>value(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dd in context" v-bind:key="dd" :class="{'text-muted text-decoration-line-through': !(variables.includes(dd.name))}">
                            <td @click="openModal(dd)">{{dd.name}}</td>
                            <td><span @click="openModal(dd)">{{renderValues(dd.values)}}</span><button v-if="!(variables.includes(dd.name))" type="button" @click="removeVar(dd)" class="btn btn-light btn-sm float-end">&times;</button></td>
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
    <div class="modal" tabindex="-1" ref="variableModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit variable: {{current.name}}</h5>
          </div>
          <div class="modal-body">
            <table class="table">
                <tbody>
                    <tr v-for="(value, idx) in current.values" v-bind:key="idx" :class="{'table-active': (idx==modalState.valueIdx)}">
                        <td>
                            <span @click="selectContextValue(idx)">{{renderValue(current.values[idx])}}</span>
                            <button v-if="value!=null" type="button" @click="removeValue(idx)" class="btn btn-light btn-sm float-end">&times;</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <input type="text" :value="contextValue" v-on:keyup.enter="updateContextValue" class="my-2 form-control"/>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import JSONEditor from './components/JSONEditor';
import TextExprEditor from './components/TextExprEditor';
import * as jsonLogic from 'json-logic-js';
import { Modal } from 'bootstrap';

let varModal = null;

export default {
    name: 'App',
    data() {
        return {
            context: [
                {name: "age", values: [null, -Infinity, 0, 17, 18, 19, Infinity]},
                {name: "presentable", values: [null, false, true]}
            ],
            current: -1,
            modalState: {
                variableIdx: null,
                valueIdx: -1
            },
            expr: { "and": [{">=": [{var: "age"}, 18]}, {var: "presentable"}]}
        }
    },
    mounted() {
        varModal =  new Modal(this.$refs.variableModal);
    },
    components: {
        'json-editor': JSONEditor,
        'text-editor': TextExprEditor
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
        contextValue() {
            if (this.modalState.variableIdx>-1 && this.modalState.valueIdx>-1) {
                return this.renderValue(this.context[this.modalState.variableIdx].values[this.modalState.valueIdx]);
            } else {
                return null;
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
        },
        removeVar(dd) {
            this.context.splice(this.context.indexOf(dd),1);
        },
        openModal(dd) {
            this.current = dd;
            this.modalState = {
                variableIdx: this.context.indexOf(dd),
                valueIdx: -1
            };
            varModal.show();
        },
        selectContextValue(idx) {
            if (this.modalState.valueIdx == idx) {
                this.modalState.valueIdx=-1;
            } else {
                this.modalState.valueIdx=idx;
            }
        },
        updateContextValue(evt) {
            if (this.modalState.valueIdx == -1) {
                this.context[this.modalState.variableIdx].values.push(JSON.parse(evt.target.value));
            } else {
                this.context[this.modalState.variableIdx].values[this.modalState.valueIdx].push(JSON.parse(evt.target.value));
            }
            this.modalState.valueIdx = -1;
        },
        removeValue(idx) {
            this.context[this.modalState.variableIdx].values.splice(idx, 1);
        }
     },
    watch: {
        expr() {
            for (const dd of this.variables.filter(x => !this.dds.includes(x))) {
                this.context.push({name: dd, values: [null]});
            }
        }
    }
}
</script>
