const { createInitialDraft, generateRecord } = require("../../services/draft-service");
const { getPreviewRecord } = require("../../services/preview-session");
const { saveRecord } = require("../../services/stub-repository");
const { formatDateKey } = require("../../utils/date");

Page({
  data: {
    record: null,
    saved: false,
  },

  onLoad() {
    const record = getPreviewRecord() || generateRecord(createInitialDraft(formatDateKey(new Date())));
    this.setData({ record });
  },

  saveToArchive() {
    if (!this.data.record) return;

    saveRecord(this.data.record).then(() => {
      this.setData({ saved: true });
      wx.showToast({
        title: "存根已收好",
        icon: "success",
      });
    });
  },

  goArchive() {
    wx.navigateTo({
      url: "/pages/archive/index",
    });
  },
});
