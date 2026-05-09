const { clearRecords } = require("../../services/stub-repository");

Page({
  clearLocalData() {
    wx.showModal({
      title: "清空本地存根？",
      content: "这只会清空本机保存的今日存根，不会影响相册里的图片。",
      confirmText: "清空",
      confirmColor: "#B85C4B",
      success: (result) => {
        if (!result.confirm) return;
        clearRecords().then(() => {
          wx.showToast({
            title: "已清空",
            icon: "success",
          });
        });
      },
    });
  },
});
