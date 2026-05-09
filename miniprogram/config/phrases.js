const phrases = [
  {
    id: "open_001",
    scene: "opening",
    text: "今天不用解释太多。",
    tone: "soft",
  },
  {
    id: "open_002",
    scene: "opening",
    text: "把今天轻轻收好。",
    tone: "soft",
  },
  {
    id: "status_tired_001",
    scene: "status_selected",
    statusIds: ["tired"],
    text: "能到这里，已经不容易。",
    tone: "soft",
  },
  {
    id: "status_steady_001",
    scene: "status_selected",
    statusIds: ["steady"],
    text: "平稳也值得被保存。",
    tone: "soft",
  },
  {
    id: "status_soft_001",
    scene: "status_selected",
    statusIds: ["soft"],
    text: "有些暖，会留在今天。",
    tone: "soft",
  },
  {
    id: "status_bright_001",
    scene: "status_selected",
    statusIds: ["bright"],
    text: "这一点亮，已经很好。",
    tone: "soft",
  },
  {
    id: "verdict_001",
    scene: "verdict",
    text: "这一天，允许被保存。",
    tone: "soft",
  },
  {
    id: "verdict_002",
    scene: "verdict",
    text: "今天没有满分，但有证据。",
    tone: "soft",
  },
  {
    id: "saved_001",
    scene: "saved",
    text: "好了，今天被收好了。",
    tone: "soft",
  },
  {
    id: "archive_empty_001",
    scene: "archive_empty",
    text: "第一张存根，会从今天开始。",
    tone: "soft",
  },
];

function getPhrases(scene, statusId) {
  return phrases.filter((phrase) => {
    if (phrase.scene !== scene) return false;
    if (!phrase.statusIds || !statusId) return true;
    return phrase.statusIds.indexOf(statusId) >= 0;
  });
}

function getPhrase(phraseId) {
  return phrases.find((phrase) => phrase.id === phraseId) || null;
}

function pickPhrase(scene, statusId) {
  const candidates = getPhrases(scene, statusId);
  const fallback = getPhrases(scene);
  const pool = candidates.length ? candidates : fallback;
  return pool[0] || phrases[0];
}

module.exports = {
  getPhrase,
  getPhrases,
  phrases,
  pickPhrase,
};
