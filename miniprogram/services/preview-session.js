const SESSION_KEY = "today_stub_preview_record";
let fallbackRecord = null;

function setPreviewRecord(record) {
  fallbackRecord = record;

  if (typeof wx === "undefined") return;

  wx.setStorageSync(SESSION_KEY, record);
}

function getPreviewRecord() {
  if (typeof wx === "undefined") return fallbackRecord;

  return wx.getStorageSync(SESSION_KEY) || fallbackRecord;
}

function clearPreviewRecord() {
  fallbackRecord = null;

  if (typeof wx === "undefined") return;

  wx.removeStorageSync(SESSION_KEY);
}

module.exports = {
  SESSION_KEY,
  clearPreviewRecord,
  getPreviewRecord,
  setPreviewRecord,
};
