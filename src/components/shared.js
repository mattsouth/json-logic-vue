// some shared functionality that can be added with mixin property

export default {
  methods: {
    renderValue(val) {
      if (val == null) {
        return "null";
      } else {
        return val.toString();
      }
    },
  }
}