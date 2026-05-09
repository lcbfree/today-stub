Component({
  properties: {
    recordCount: {
      type: Number,
      value: 0,
    },
  },

  methods: {
    clearData() {
      this.triggerEvent("clear");
    },
  },
});
