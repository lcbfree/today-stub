const statuses = [
  {
    id: "tired",
    label: "有点耗尽",
    icon: "moon",
    description: "今天用力比较安静",
    defaultEmotionBalance: -2,
    defaultEnergy: 42,
  },
  {
    id: "steady",
    label: "还算平稳",
    icon: "leaf",
    description: "没有满分，但也没有散掉",
    defaultEmotionBalance: 0,
    defaultEnergy: 58,
  },
  {
    id: "soft",
    label: "被轻轻接住",
    icon: "tea",
    description: "有一点暖的地方",
    defaultEmotionBalance: 2,
    defaultEnergy: 64,
  },
  {
    id: "bright",
    label: "有一点亮",
    icon: "sun",
    description: "今天留下了小小闪光",
    defaultEmotionBalance: 3,
    defaultEnergy: 72,
  },
];

function getStatuses() {
  return statuses.slice();
}

function getStatus(statusId) {
  return statuses.find((status) => status.id === statusId) || statuses[0];
}

module.exports = {
  getStatus,
  getStatuses,
  statuses,
};
