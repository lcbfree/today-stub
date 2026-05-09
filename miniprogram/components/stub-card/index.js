Component({
  properties: {
    record: {
      type: Object,
      value: null,
    },
    stackCount: {
      type: Number,
      value: 1,
    },
  },

  methods: {
    openCard() {
      if (!this.properties.record) return;
      this.triggerEvent("open", {
        id: this.properties.record.id,
      });
    },
  },
});
