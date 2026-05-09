const { buildReceiptLayout } = require("./receipt-layout");

const CANVAS_SCALE = 2;

function drawDivider(ctx, y, theme) {
  ctx.setStrokeStyle(theme.divider || "rgba(47, 41, 36, 0.22)");
  ctx.setLineWidth(2);
  ctx.beginPath();
  ctx.moveTo(54, y);
  ctx.lineTo(696, y);
  ctx.stroke();
}

function drawRows(ctx, rows, y, theme) {
  ctx.setFontSize(26);
  rows.forEach((row) => {
    ctx.setFillStyle(theme.muted || theme.foreground);
    ctx.setTextAlign("left");
    ctx.fillText(row.label, 54, y);
    ctx.setFillStyle(theme.foreground);
    ctx.setTextAlign("right");
    ctx.fillText(row.value, 696, y);
    y += 40;
  });
  return y;
}

function drawLines(ctx, lines, x, y, lineHeight, fontSize, color) {
  ctx.setFillStyle(color);
  ctx.setFontSize(fontSize);
  ctx.setTextAlign("left");
  lines.forEach((line) => {
    ctx.fillText(line, x, y);
    y += lineHeight;
  });
  return y;
}

function drawReceipt(ctx, record, theme, existingLayout) {
  const layout = existingLayout || buildReceiptLayout(record);
  const width = layout.width;
  const height = layout.height;
  let y = 58;

  ctx.setFillStyle(theme.background);
  ctx.fillRect(0, 0, width, height);

  ctx.setFillStyle(theme.muted || theme.foreground);
  ctx.setFontSize(24);
  ctx.setTextAlign("left");
  ctx.fillText(layout.header, 54, y);

  y += 46;
  ctx.setFillStyle(theme.foreground);
  ctx.setFontSize(48);
  ctx.fillText(layout.title, 54, y);

  y += 34;
  drawDivider(ctx, y, theme);
  y += 44;

  y = drawRows(ctx, layout.rows, y, theme);
  y += 14;

  if (layout.lifeModules.length) {
    drawDivider(ctx, y, theme);
    y += 40;
    ctx.setFillStyle(theme.muted || theme.foreground);
    ctx.setFontSize(24);
    ctx.setTextAlign("left");
    ctx.fillText("LIFE TRACE", 54, y);
    y += 42;
    y = drawRows(ctx, layout.lifeModules.map((module) => ({
      label: module.label,
      value: module.value,
    })), y, theme);
    y += 14;
  }

  drawDivider(ctx, y, theme);
  y += 42;
  ctx.setFillStyle(theme.muted || theme.foreground);
  ctx.setFontSize(24);
  ctx.fillText("我写下的今天", 54, y);
  y += 44;
  y = drawLines(ctx, layout.selfSentenceLines, 54, y, 38, 31, theme.foreground);
  y += 18;

  if (layout.proofLines.length) {
    ctx.setFillStyle(theme.muted || theme.foreground);
    ctx.setFontSize(24);
    ctx.fillText("今日证据", 54, y);
    y += 38;
    y = drawLines(ctx, layout.proofLines, 54, y, 32, 25, theme.muted || theme.foreground);
    y += 18;
  }

  if (layout.optionalNoteLines.length) {
    ctx.setFillStyle(theme.muted || theme.foreground);
    ctx.setFontSize(22);
    ctx.fillText("补充一点", 54, y);
    y += 34;
    y = drawLines(ctx, layout.optionalNoteLines, 54, y, 30, 23, theme.muted || theme.foreground);
    y += 16;
  }

  drawDivider(ctx, y, theme);
  y += 40;
  ctx.setFillStyle(theme.muted || theme.foreground);
  ctx.setFontSize(24);
  ctx.fillText("候选短语", 54, y);
  y += 38;
  y = drawLines(ctx, layout.verdictLines, 54, y, 34, 26, theme.foreground);

  y += 42;
  ctx.setStrokeStyle(theme.accent);
  ctx.setLineWidth(3);
  ctx.beginPath();
  ctx.rect(54, y - 34, 196, 56);
  ctx.stroke();
  ctx.setFillStyle(theme.accent);
  ctx.setFontSize(25);
  ctx.setTextAlign("center");
  ctx.fillText(layout.stampLabel, 152, y);

  ctx.setTextAlign("right");
  ctx.setFontSize(22);
  ctx.setFillStyle(theme.muted || theme.foreground);
  ctx.fillText(layout.objectLabel, 696, y);

  y += 72;
  drawDivider(ctx, y, theme);
  y += 34;
  ctx.setFontSize(20);
  ctx.setTextAlign("center");
  ctx.fillText("THIS DAY COUNTS", width / 2, y);

  return layout;
}

function renderReceiptToImage(options) {
  const { canvasId, page, record, theme } = options;
  const layout = options.layout || buildReceiptLayout(record);

  if (typeof wx === "undefined") {
    return Promise.reject(new Error("WeChat runtime is required for canvas rendering."));
  }

  return new Promise((resolve, reject) => {
    const ctx = wx.createCanvasContext(canvasId, page);
    drawReceipt(ctx, record, theme, layout);
    ctx.draw(false, () => {
      wx.canvasToTempFilePath(
        {
          canvasId,
          width: layout.width,
          height: layout.height,
          destWidth: layout.width * CANVAS_SCALE,
          destHeight: layout.height * CANVAS_SCALE,
          success: (result) => resolve({
            tempFilePath: result.tempFilePath,
            layout,
          }),
          fail: reject,
        },
        page
      );
    });
  });
}

module.exports = {
  CANVAS_SCALE,
  drawReceipt,
  renderReceiptToImage,
};
