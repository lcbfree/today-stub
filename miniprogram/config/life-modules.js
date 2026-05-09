const lifeModules = [
  {
    id: "sleep",
    label: "睡眠",
    placeholder: "6.5h / 断断续续",
    examples: ["7h / 还不错", "没睡够", "午睡了 20 分钟"],
  },
  {
    id: "drink",
    label: "饮品",
    placeholder: "热拿铁",
    examples: ["茉莉花茶", "柠檬水", "晚上没有再喝咖啡"],
  },
  {
    id: "small_spend",
    label: "小花费",
    placeholder: "给自己买了花",
    examples: ["买了一杯热饮", "一张电影票", "一本小书"],
    guardrail: "只记录生活触感，不做总额、预算、分类统计。",
  },
  {
    id: "little_joy",
    label: "小确幸",
    placeholder: "下班路上看到了晚霞",
    examples: ["一口冰饮刚好很清爽", "和朋友聊了十分钟", "今天的风不冷"],
  },
];

function getLifeModuleDefinitions() {
  return lifeModules.map((module) => ({ ...module }));
}

function getLifeModuleDefinition(moduleId) {
  return lifeModules.find((module) => module.id === moduleId) || null;
}

module.exports = {
  getLifeModuleDefinition,
  getLifeModuleDefinitions,
  lifeModules,
};
