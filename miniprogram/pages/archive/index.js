const { listRecords } = require("../../services/stub-repository");
const { groupRecordsByMonth } = require("../../utils/date");

Page({
  data: {
    records: [],
    grouped: [],
  },

  onShow() {
    listRecords().then((records) => {
      this.setData({
        records,
        grouped: groupRecordsByMonth(records),
      });
    });
  },

  openDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  },

  goToday() {
    wx.navigateBack({
      fail: () => wx.redirectTo({ url: "/pages/today/index" }),
    });
  },
});
