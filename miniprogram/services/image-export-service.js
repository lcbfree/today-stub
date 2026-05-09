const { renderReceiptToImage } = require("./receipt-renderer");

function getWx() {
  if (typeof wx !== "undefined") return wx;
  return null;
}

function isAlbumAuthDenied(error) {
  const message = String((error && error.errMsg) || error || "");
  return message.indexOf("auth deny") >= 0 || message.indexOf("authorize no response") >= 0;
}

function toExportError(error, phase) {
  if (phase === "album" && isAlbumAuthDenied(error)) {
    return {
      code: "album_auth_denied",
      phase,
      message: "没有相册权限，暂时不能保存图片。你可以重新尝试或去设置里打开权限。",
      original: error,
    };
  }

  if (phase === "render") {
    return {
      code: "render_failed",
      phase,
      message: "图片生成失败，可以稍后重试。",
      original: error,
    };
  }

  return {
    code: "album_save_failed",
    phase,
    message: "图片保存失败，可以稍后重试。",
    original: error,
  };
}

function saveImageFile(filePath) {
  const runtime = getWx();

  if (!runtime) {
    return Promise.reject(toExportError(new Error("WeChat runtime is required."), "album"));
  }

  return new Promise((resolve, reject) => {
    runtime.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: (error) => reject(toExportError(error, "album")),
    });
  });
}

function saveReceiptImage(options) {
  const { tempFilePath } = options;
  const renderPromise = tempFilePath
    ? Promise.resolve({ tempFilePath, layout: options.layout })
    : renderReceiptToImage(options).catch((error) => Promise.reject(toExportError(error, "render")));

  return renderPromise
    .then((renderResult) => saveImageFile(renderResult.tempFilePath).then(() => ({
      tempFilePath: renderResult.tempFilePath,
      layout: renderResult.layout,
    })));
}

function openAlbumSettings() {
  const runtime = getWx();

  if (!runtime) {
    return Promise.reject(new Error("WeChat runtime is required."));
  }

  return new Promise((resolve, reject) => {
    runtime.openSetting({
      success: resolve,
      fail: reject,
    });
  });
}

module.exports = {
  isAlbumAuthDenied,
  openAlbumSettings,
  saveReceiptImage,
  toExportError,
};
