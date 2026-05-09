const { deleteRecord, getRecord } = require("../../services/stub-repository");

Page({
  data: {
    id: "",
    record: null,
    missing: false,
  },

  onLoad(options) {
    const id = options.id || "";
    this.setData({ id });
    this.loadRecord(id);
  },

  loadRecord(id) {
    if (!id) {
      this.setData({ missing: true });
      return;
    }

    getRecord(id).then((record) => {
      this.setData({
        record,
        missing: !record,
      });
    });
  },

  confirmDelete() {
    if (!this.data.record) return;

    wx.showModal({
      title: "删除这张存根？",
      content: "删除后，这张本地存根不会再出现在存档墙。",
      confirmText: "删除",
      confirmColor: "#B85C4B",
      success: (result) => {
        if (!result.confirm) return;
        deleteRecord(this.data.record.id).then(() => {
          wx.navigateBack();
        });
      },
    });
  },
});
