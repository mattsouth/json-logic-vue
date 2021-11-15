// some shared functionality that can be added with mixin property

export default {
  methods: {
    renderValue(val) {
      if (val == null) {
        return "null";
      } else {
        if (typeof val == "string") {
          return '"' + val + '"';
        } else if (typeof val == "object") {
          return JSON.stringify(val);
        } else {
          return val.toString();
        }
      }
    },
  }
}
