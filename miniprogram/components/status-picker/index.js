Component({
  properties: {
    options: {
      type: Array,
      value: [],
    },
    value: {
      type: String,
      value: "",
    },
  },

  methods: {
    selectStatus(event) {
      this.triggerEvent("change", {
        value: event.currentTarget.dataset.id,
      });
    },
  },
});
