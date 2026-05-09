const { clearRecords, listRecords } = require("../../services/stub-repository");

Page({
  data: {
    recordCount: 0,
  },

  onShow() {
    this.refreshRecordCount();
  },

  refreshRecordCount() {
    listRecords()
      .then((records) => {
        this.setData({
          recordCount: records.length,
        });
      })
      .catch(() => {
        this.setData({ recordCount: 0 });
        wx.showToast({
          title: "读取失败",
          icon: "none",
        });
      });
  },

  clearLocalData() {
    wx.showModal({
      title: "清空本地存根？",
      content: "这只会清空本机保存的今日存根，不会影响相册里的图片。",
      confirmText: "清空",
      confirmColor: "#B85C4B",
      success: (result) => {
        if (!result.confirm) return;
        clearRecords()
          .then(() => {
            this.refreshRecordCount();
            wx.showToast({
              title: "已清空",
              icon: "success",
            });
          })
          .catch(() => {
            wx.showToast({
              title: "清空失败",
              icon: "none",
            });
          });
      },
    });
  },
});
