Component({
  properties: {
    value: {
      type: Number,
      value: 0,
    },
  },

  methods: {
    changeValue(event) {
      this.triggerEvent("change", {
        value: Number(event.detail.value),
      });
    },
  },
});
