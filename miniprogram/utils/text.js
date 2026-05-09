function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

module.exports = {
  clampNumber,
  cleanText,
};
