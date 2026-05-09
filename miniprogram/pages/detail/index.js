const { getTheme } = require("../../config/index");
const { saveReceiptImage } = require("../../services/image-export-service");
const { buildReceiptLayout } = require("../../services/receipt-layout");
const { deleteRecord, getRecord } = require("../../services/stub-repository");

Page({
  data: {
    id: "",
    record: null,
    theme: null,
    layout: null,
    canvasWidth: 750,
    canvasHeight: 900,
    missing: false,
    savingImage: false,
    saveMessage: "",
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

    getRecord(id)
      .then((record) => {
        const theme = record ? getTheme(record.themeId) : null;
        const layout = record ? buildReceiptLayout(record) : null;

        this.setData({
          record,
          theme,
          layout,
          canvasHeight: layout ? layout.height : 900,
          missing: !record,
        });
      })
      .catch(() => {
        this.setData({
          record: null,
          theme: null,
          layout: null,
          missing: true,
        });
        wx.showToast({
          title: "读取失败",
          icon: "none",
        });
      });
  },

  saveAgain() {
    if (!this.data.record || this.data.savingImage) return;

    this.setData({
      savingImage: true,
      saveMessage: "",
    });

    saveReceiptImage({
      page: this,
      canvasId: "detailReceiptCanvas",
      record: this.data.record,
      theme: this.data.theme,
      layout: this.data.layout,
    })
      .then(() => {
        this.setData({
          savingImage: false,
          saveMessage: "这张存根又保存到相册了。",
        });
        wx.showToast({
          title: "已保存",
          icon: "success",
        });
      })
      .catch((error) => {
        this.setData({
          savingImage: false,
          saveMessage: error.message || "保存失败，可以稍后重试。",
        });
        wx.showToast({
          title: "保存失败",
          icon: "none",
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
        deleteRecord(this.data.record.id)
          .then(() => {
            wx.showToast({
              title: "已删除",
              icon: "success",
            });
            wx.navigateBack({
              fail: () => wx.redirectTo({ url: "/pages/archive/index" }),
            });
          })
          .catch(() => {
            wx.showToast({
              title: "删除失败",
              icon: "none",
            });
          });
      },
    });
  },

  goArchive() {
    wx.navigateBack({
      fail: () => wx.redirectTo({ url: "/pages/archive/index" }),
    });
  },
});
