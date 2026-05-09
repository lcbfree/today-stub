const { getObject, getTheme, getThemes, pickPhrase } = require("../../config/index");
const { createInitialDraft, generateRecord } = require("../../services/draft-service");
const { openAlbumSettings, saveReceiptImage } = require("../../services/image-export-service");
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
    savingImage: false,
    saveStatus: "",
    saveMessage: "",
    saveHint: "",
    canOpenSettings: false,
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
      saveStatus: "",
      saveMessage: "",
      saveHint: "",
      canOpenSettings: false,
    });
  },

  switchTheme(event) {
    if (!this.data.record) return;
    if (this.data.savingImage) return;
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

    this.persistRecord()
      .then(() => {
        const savedPhrase = pickPhrase("saved");
        this.setData({
          saved: true,
          saveStatus: "success",
          saveMessage: savedPhrase.text,
          saveHint: "这张存根已经存入本地存档墙。",
          canOpenSettings: false,
        });
        wx.showToast({
          title: "存根已收好",
          icon: "success",
        });
      })
      .catch(() => {
        this.setData({
          saveStatus: "error",
          saveMessage: "本地存档失败，可以稍后重试。",
          saveHint: "当前票根还在预览页，不会因为这次失败而消失。",
          canOpenSettings: false,
        });
        wx.showToast({
          title: "存档失败",
          icon: "none",
        });
      });
  },

  saveImageAndArchive() {
    if (!this.data.record || this.data.savingImage) return;

    this.setData({
      savingImage: true,
      renderError: "",
      saveStatus: "",
      saveMessage: "",
      saveHint: "",
      canOpenSettings: false,
    });

    saveReceiptImage({
      page: this,
      canvasId: "receiptCanvas",
      record: this.data.record,
      theme: this.data.theme,
      layout: this.data.layout,
      tempFilePath: this.data.renderedImagePath,
    })
      .then((result) => this.persistRecord().then(() => result))
      .then((result) => {
        const savedPhrase = pickPhrase("saved");
        const object = getObject(this.data.record.objectId);

        this.setData({
          savingImage: false,
          saved: true,
          renderedImagePath: result.tempFilePath,
          saveStatus: "success",
          saveMessage: savedPhrase.text,
          saveHint: `图片已保存到相册，${object.label}也被夹进今天。可以自行发到微信状态、朋友圈或私聊。`,
        });
        wx.showToast({
          title: "已保存",
          icon: "success",
        });
      })
      .catch((error) => {
        this.setData({
          savingImage: false,
          saveStatus: "error",
          saveMessage: error.message || "保存失败，可以稍后重试。",
          saveHint: error.phase === "album"
            ? "当前存根内容还在，可以重新保存或仅存入今天。"
            : "当前票根还在预览页，不会因为这次失败而消失。",
          canOpenSettings: error.code === "album_auth_denied",
        });
        wx.showToast({
          title: "保存失败",
          icon: "none",
        });
      });
  },

  persistRecord() {
    return saveRecord(this.data.record).then((record) => {
      this.setData({
        record,
      });
      return record;
    });
  },

  openSettingsForAlbum() {
    openAlbumSettings().catch(() => {
      wx.showToast({
        title: "无法打开设置",
        icon: "none",
      });
    });
  },

  goArchive() {
    wx.redirectTo({
      url: "/pages/archive/index",
    });
  },
});
