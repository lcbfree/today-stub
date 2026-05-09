const {
  getLifeModuleDefinitions,
  getPhrase,
  getStatuses,
} = require("../../config/index");
const {
  createInitialDraft,
  generateRecord,
  refreshDraftPhrase,
  updateDraftStatus,
} = require("../../services/draft-service");
const { setPreviewRecord } = require("../../services/preview-session");
const { listRecordsByDate } = require("../../services/stub-repository");
const { formatDateKey } = require("../../utils/date");

function getPhraseText(phraseId) {
  const phrase = getPhrase(phraseId);
  return phrase ? phrase.text : "";
}

Page({
  data: {
    todayKey: "",
    draft: null,
    statuses: [],
    lifeModuleDefinitions: [],
    openingPhraseText: "",
    statusPhraseText: "",
    verdictText: "",
    todayRecords: [],
  },

  onLoad() {
    const todayKey = formatDateKey(new Date());
    const draft = createInitialDraft(todayKey);

    this.setData({
      todayKey,
      statuses: getStatuses(),
      lifeModuleDefinitions: getLifeModuleDefinitions(),
    });
    this.setDraft(draft);
  },

  onShow() {
    if (!this.data.todayKey) return;

    listRecordsByDate(this.data.todayKey).then((todayRecords) => {
      this.setData({ todayRecords });
    });
  },

  goPreview() {
    if (!this.data.draft) return;

    const record = generateRecord(this.data.draft);
    setPreviewRecord(record);

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

  setDraft(draft) {
    this.setData({
      draft,
      openingPhraseText: getPhraseText(draft.openingPhraseId),
      statusPhraseText: getPhraseText(draft.statusPhraseId),
      verdictText: getPhraseText(draft.verdictId),
    });
  },

  onStatusChange(event) {
    this.setDraft(updateDraftStatus(this.data.draft, event.detail.value));
  },

  onEmotionChange(event) {
    this.setDraft({
      ...this.data.draft,
      emotionBalance: event.detail.value,
    });
  },

  onEnergyChange(event) {
    this.setDraft({
      ...this.data.draft,
      energy: event.detail.value,
    });
  },

  onTextInput(event) {
    const field = event.currentTarget.dataset.field;

    this.setDraft({
      ...this.data.draft,
      [field]: event.detail.value,
    });
  },

  onLifeModulesChange(event) {
    this.setDraft({
      ...this.data.draft,
      lifeModules: event.detail.value,
    });
  },

  refreshPhrase(event) {
    const scene = event.currentTarget.dataset.scene || "opening";
    this.setDraft(refreshDraftPhrase(this.data.draft, scene));
  },
});
