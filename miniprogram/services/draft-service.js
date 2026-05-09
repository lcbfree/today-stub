const {
  getLifeModuleDefinitions,
  getStatus,
  pickObject,
  pickPhrase,
  pickStamp,
} = require("../config/index");
const { createStubId } = require("../utils/id");
const { clampNumber, cleanText } = require("../utils/text");

function createInitialDraft(dateKey) {
  const status = getStatus("steady");
  const openingPhrase = pickPhrase("opening");
  const statusPhrase = pickPhrase("status_selected", status.id);
  const verdict = pickPhrase("verdict");

  return {
    date: dateKey,
    statusId: status.id,
    emotionBalance: status.defaultEmotionBalance,
    energy: status.defaultEnergy,
    selfSentence: "",
    proof: "",
    optionalNote: "",
    lifeModules: getLifeModuleDefinitions().map((module) => ({
      id: module.id,
      label: module.label,
      value: "",
      enabled: false,
    })),
    openingPhraseId: openingPhrase.id,
    statusPhraseId: statusPhrase.id,
    verdictId: verdict.id,
    themeId: "thermal_default",
  };
}

function normalizeDraft(draft) {
  const status = getStatus(draft.statusId);
  const verdict = pickPhrase("verdict");

  return {
    ...draft,
    statusId: status.id,
    statusLabel: status.label,
    emotionBalance: clampNumber(draft.emotionBalance, -5, 5),
    energy: clampNumber(draft.energy, 0, 100),
    selfSentence: cleanText(draft.selfSentence),
    proof: cleanText(draft.proof),
    optionalNote: cleanText(draft.optionalNote),
    lifeModules: (draft.lifeModules || [])
      .filter((module) => module.enabled && cleanText(module.value))
      .map((module) => ({
        id: module.id,
        label: module.label,
        value: cleanText(module.value),
        enabled: true,
      })),
    verdict,
  };
}

function generateRecord(draft) {
  const normalized = normalizeDraft(draft);
  const statusPhrase = pickPhrase("status_selected", normalized.statusId);
  const verdict = normalized.verdict;
  const stamp = pickStamp();
  const object = pickObject();
  const now = Date.now();
  const fallbackSentence = verdict.text;
  const hasUserSentence = Boolean(normalized.selfSentence);

  return {
    id: createStubId(normalized.date),
    version: 1,
    date: normalized.date,
    statusId: normalized.statusId,
    statusLabel: normalized.statusLabel,
    emotionBalance: normalized.emotionBalance,
    energy: normalized.energy,
    selfSentence: hasUserSentence ? normalized.selfSentence : fallbackSentence,
    selfSentenceSource: hasUserSentence ? "user" : "fallback_phrase",
    proof: normalized.proof,
    optionalNote: normalized.optionalNote,
    lifeModules: normalized.lifeModules,
    openingPhraseId: normalized.openingPhraseId,
    statusPhraseId: statusPhrase.id,
    verdictId: verdict.id,
    verdict: verdict.text,
    stampId: stamp.id,
    objectId: object.id,
    themeId: normalized.themeId || "thermal_default",
    createdAt: now,
    updatedAt: now,
    syncStatus: "local_only",
  };
}

module.exports = {
  createInitialDraft,
  generateRecord,
  normalizeDraft,
};
