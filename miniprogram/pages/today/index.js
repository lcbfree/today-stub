const { createInitialDraft } = require("../../services/draft-service");
const { listRecordsByDate } = require("../../services/stub-repository");
const { formatDateKey } = require("../../utils/date");

Page({
  data: {
    todayKey: "",
    draft: null,
    todayRecords: [],
  },

  onLoad() {
    const todayKey = formatDateKey(new Date());
    this.setData({
      todayKey,
      draft: createInitialDraft(todayKey),
    });
  },

  onShow() {
    if (!this.data.todayKey) return;

    listRecordsByDate(this.data.todayKey).then((todayRecords) => {
      this.setData({ todayRecords });
    });
  },

  goPreview() {
    wx.navigateTo({
      url: "/pages/preview/index",
    });
  },

  goArchive() {
    wx.navigateTo({
      url: "/pages/archive/index",
    });
  },

  goSettings() {
    wx.navigateTo({
      url: "/pages/settings/index",
    });
  },
});
