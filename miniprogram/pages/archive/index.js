const { listRecords } = require("../../services/stub-repository");
const { buildArchiveMonths } = require("../../utils/date");

Page({
  data: {
    records: [],
    months: [],
    activeMonth: "",
    activeMonthData: null,
  },

  onShow() {
    this.loadArchive();
  },

  loadArchive() {
    listRecords()
      .then((records) => {
        const months = buildArchiveMonths(records);
        const monthExists = months.some((month) => month.month === this.data.activeMonth);
        const activeMonth = monthExists ? this.data.activeMonth : (months[0] && months[0].month) || "";

        this.setData({
          records,
          months,
          activeMonth,
          activeMonthData: months.find((month) => month.month === activeMonth) || months[0] || null,
        });
      })
      .catch(() => {
        this.setData({
          records: [],
          months: [],
          activeMonth: "",
          activeMonthData: null,
        });
        wx.showToast({
          title: "读取失败",
          icon: "none",
        });
      });
  },

  openDetail(event) {
    const id = event.detail && event.detail.id ? event.detail.id : event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  },

  switchMonth(event) {
    const activeMonth = event.currentTarget.dataset.month;
    this.setData({
      activeMonth,
      activeMonthData: this.data.months.find((month) => month.month === activeMonth) || null,
    });
  },

  goToday() {
    wx.navigateBack({
      fail: () => wx.redirectTo({ url: "/pages/today/index" }),
    });
  },
});
