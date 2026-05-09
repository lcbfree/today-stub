function buildCells(value) {
  const activeCount = Math.ceil(Number(value || 0) / 20);
  return [0, 1, 2, 3, 4].map((index) => ({
    id: index,
    active: index < activeCount,
  }));
}

Component({
  properties: {
    value: {
      type: Number,
      value: 50,
      observer(nextValue) {
        this.setData({
          cells: buildCells(nextValue),
        });
      },
    },
  },

  data: {
    cells: buildCells(50),
  },

  methods: {
    changeValue(event) {
      this.triggerEvent("change", {
        value: Number(event.detail.value),
      });
    },
  },
});
