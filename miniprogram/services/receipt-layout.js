const { getObject, getStamp } = require("../config/index");
const { cleanText } = require("../utils/text");

const RECEIPT_WIDTH = 750;
const CONTENT_WIDTH = 642;

function textUnits(char) {
  return /^[\x00-\x7F]$/.test(char) ? 0.55 : 1;
}

function wrapText(text, maxUnits, maxLines) {
  const source = cleanText(text);
  if (!source) return [];

  const lines = [];
  let current = "";
  let units = 0;

  source.split("").forEach((char) => {
    const nextUnits = textUnits(char);
    if (units + nextUnits > maxUnits && current) {
      lines.push(current);
      current = char;
      units = nextUnits;
    } else {
      current += char;
      units += nextUnits;
    }
  });

  if (current) lines.push(current);

  if (!maxLines || lines.length <= maxLines) return lines;

  const visibleLines = lines.slice(0, maxLines);
  const lastIndex = visibleLines.length - 1;
  visibleLines[lastIndex] = `${visibleLines[lastIndex].slice(0, Math.max(0, visibleLines[lastIndex].length - 1))}…`;
  return visibleLines;
}

function formatDateLabel(dateKey) {
  return String(dateKey || "").replace(/-/g, ".");
}

function formatReceiptNumber(record) {
  const datePart = String(record.date || "").replace(/-/g, "");
  const idPart = String(record.id || "0000").slice(-4).toUpperCase();
  return `DAY-${datePart}-${idPart}`;
}

function buildReceiptLayout(record) {
  const lifeModules = (record.lifeModules || []).filter((module) => module.enabled && cleanText(module.value));
  const stamp = getStamp(record.stampId);
  const object = getObject(record.objectId);
  const selfSentenceLines = wrapText(record.selfSentence || record.verdict, 18, 4);
  const proofLines = wrapText(record.proof, 22, 3);
  const optionalNoteLines = wrapText(record.optionalNote, 22, 2);
  const verdictLines = wrapText(record.verdict, 18, 2);

  const rows = [
    { label: "日期", value: formatDateLabel(record.date) },
    { label: "编号", value: formatReceiptNumber(record) },
    { label: "今日状态", value: record.statusLabel },
    { label: "情绪余额", value: String(record.emotionBalance) },
    { label: "能量值", value: `${record.energy}/100` },
  ];

  let height = 122;
  height += rows.length * 40;
  height += 36;

  if (lifeModules.length) {
    height += 52 + lifeModules.length * 40 + 24;
  }

  height += 48 + selfSentenceLines.length * 38 + 26;

  if (proofLines.length) {
    height += 44 + proofLines.length * 32 + 22;
  }

  if (optionalNoteLines.length) {
    height += 42 + optionalNoteLines.length * 30 + 20;
  }

  height += 48 + verdictLines.length * 34 + 86;
  height += 86;

  return {
    width: RECEIPT_WIDTH,
    contentWidth: CONTENT_WIDTH,
    height: Math.max(720, height),
    header: "DAILY LIFE STUB",
    title: "今日存根",
    rows,
    lifeModules,
    selfSentenceLines,
    proofLines,
    optionalNoteLines,
    verdictLines,
    stampLabel: stamp.label,
    objectLabel: object.label,
    receiptNumber: formatReceiptNumber(record),
  };
}

module.exports = {
  CONTENT_WIDTH,
  RECEIPT_WIDTH,
  buildReceiptLayout,
  formatDateLabel,
  formatReceiptNumber,
  wrapText,
};
