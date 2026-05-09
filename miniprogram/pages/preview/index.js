const { getTheme, getThemes } = require("../../config/index");
const { createInitialDraft, generateRecord } = require("../../services/draft-service");
const { getPreviewRecord } = require("../../services/preview-session");
const { buildReceiptLayout } = require("../../services/receipt-layout");
const { renderReceiptToImage } = require("../../services/receipt-renderer");
const { saveRecord } = require("../../services/stub-repository");
const { formatDateKey } = require("../../utils/date");

Page({
  data: {
    record: null,
    themes: [],
    theme: null,
    layout: null,
    canvasWidth: 750,
    canvasHeight: 900,
    renderedImagePath: "",
    renderError: "",
    saved: false,
  },

  onLoad() {
    const record = getPreviewRecord() || generateRecord(createInitialDraft(formatDateKey(new Date())));
    this.setReceiptState(record, record.themeId);
  },

  setReceiptState(record, themeId) {
    const theme = getTheme(themeId || record.themeId);
    const nextRecord = {
      ...record,
      themeId: theme.id,
    };
    const layout = buildReceiptLayout(nextRecord);

    this.setData({
      record: nextRecord,
      themes: getThemes(),
      theme,
      layout,
      canvasHeight: layout.height,
      renderedImagePath: "",
      renderError: "",
    });
  },

  switchTheme(event) {
    if (!this.data.record) return;
    this.setReceiptState(this.data.record, event.currentTarget.dataset.id);
  },

  renderImage() {
    if (!this.data.record || !this.data.theme || !this.data.layout) return;

    this.setData({
      renderError: "",
    });

    renderReceiptToImage({
      page: this,
      canvasId: "receiptCanvas",
      record: this.data.record,
      theme: this.data.theme,
      layout: this.data.layout,
    })
      .then((result) => {
        this.setData({
          renderedImagePath: result.tempFilePath,
        });
        wx.showToast({
          title: "图片已生成",
          icon: "success",
        });
      })
      .catch(() => {
        this.setData({
          renderError: "图片生成失败，可以稍后重试。",
        });
        wx.showToast({
          title: "生成失败",
          icon: "none",
        });
      });
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
