const { createInitialDraft, generateRecord } = require("../../services/draft-service");
const { saveRecord } = require("../../services/stub-repository");
const { formatDateKey } = require("../../utils/date");

Page({
  data: {
    record: null,
    saved: false,
  },

  onLoad() {
    const draft = createInitialDraft(formatDateKey(new Date()));
    const record = generateRecord(draft);
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
