<template>
<div class="col-lg-8 mx-auto p-3 py-md-5">
    <header>
        <span class="fs-4">json-logic</span>
    </header>
    <main>
        <div class="row">
            <div class="col">
                Data
                <json-editor :value="context" @update="context = $event" />
            </div>
            <div class="col">
                Expression
                <json-editor :value="expr" @update="expr = $event" />
                <input type="text" v-model="render" />
            </div>
            <div class="col">
                Result
                <input type="text" :value="JSON.stringify(result)" />
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
            context: { age: 56 },
            expr: { ">=": [{var: "age"}, 18]}
        }
    },
    components: {
        'json-editor': JSONEditor
    },
    computed: {
        result() {
            return jsonLogic.apply(this.expr, this.context);
        },
        render: {
            get: function() {
                return renderJsonLogic(this.expr);
            },
            set: function(text) {
                // console.log('render:set', text);
                // console.log(JSON.stringify(transformJS(text)));
                this.expr = transformJS(text);
            }
        }
    }
}
</script>
