<docs>
Provides an editable list of context variables and their associated test values.

TODO: separate out the modal component?
TODO: fix data entry in modal
</docs>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>variable</th>
        <th>value(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="dd in context"
        v-bind:key="dd"
        :class="{
          'text-muted text-decoration-line-through': !variables.includes(
            dd.name
          ),
        }"
      >
        <td @click="openModal(dd)">{{ dd.name }}</td>
        <td>
          <span @click="openModal(dd)">{{ renderValues(dd.values) }}</span
          ><button
            v-if="!variables.includes(dd.name)"
            type="button"
            @click="removeVar(dd)"
            class="btn btn-light btn-sm float-end"
          >
            &times;
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="modal" tabindex="-1" ref="variableModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit variable: {{ current.name }}</h5>
        </div>
        <div class="modal-body">
          <table class="table">
            <tbody>
              <tr
                v-for="(value, idx) in current.values"
                v-bind:key="idx"
                :class="{ 'table-active': idx == modalState.valueIdx }"
              >
                <td>
                  <span @click="selectContextValue(idx)">{{
                    renderValue(current.values[idx])
                  }}</span>
                  <button
                    v-if="value != null"
                    type="button"
                    @click="removeValue(idx)"
                    class="btn btn-light btn-sm float-end"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="text"
            :value="contextValue"
            v-on:keyup.enter="updateContextValue"
            class="my-2 form-control"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import Shared from "./shared";

let varModal = null;

export default {
  props: {
    context: {
      type: Array,
      required: true,
    },
    variables: {
      type: Array,
      required: true,
    },
  },
  mixins: [Shared],
  emits: ['update'],
  mounted() {
    varModal = new Modal(this.$refs.variableModal);
  },
  data() {
    return {
      current: -1,
      modalState: {
        variableIdx: null,
        valueIdx: -1,
      },
    };
  },
  computed: {
    contextValue() {
      if (this.modalState.variableIdx > -1 && this.modalState.valueIdx > -1) {
        return this.renderValue(
          this.context[this.modalState.variableIdx].values[
            this.modalState.valueIdx
          ]
        );
      } else {
        return null;
      }
    },
  },
  methods: {
    renderValues(vals) {
      return vals.map((val) => this.renderValue(val)).join(", ");
    },
    removeVar(dd) {
      const clone = [...this.context];
      clone.splice(this.context.indexOf(dd),1);
      this.$emit("update", clone);
    },
    openModal(dd) {
      this.current = dd;
      this.modalState = {
        variableIdx: this.context.indexOf(dd),
        valueIdx: -1,
      };
      varModal.show();
    },
    selectContextValue(idx) {
      if (this.modalState.valueIdx == idx) {
        this.modalState.valueIdx = -1;
      } else {
        this.modalState.valueIdx = idx;
      }
    },
    updateContextValue(evt) {
      const clone =  [...this.context];
      if (this.modalState.valueIdx == -1) {
        clone[this.modalState.variableIdx].values.push(JSON.parse(evt.target.value));
      } else {
        clone[this.modalState.variableIdx].values[this.modalState.valueIdx].push(JSON.parse(evt.target.value));
      }
      this.$emit("update", clone);
      this.modalState.valueIdx = -1;
    },
    removeValue(idx) {
      const clone =  [...this.context];
      clone[this.modalState.variableIdx].values.splice(idx, 1);
      this.$emit("update", clone);
    },
  },
};
</script>