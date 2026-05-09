const objects = [
  {
    id: "warm_tea",
    label: "一杯热茶",
    symbol: "tea",
  },
  {
    id: "night_lamp",
    label: "一盏晚灯",
    symbol: "lamp",
  },
  {
    id: "pressed_flower",
    label: "一朵压花",
    symbol: "flower",
  },
  {
    id: "folded_paper",
    label: "一张折角纸",
    symbol: "paper",
  },
];

function getObject(objectId) {
  return objects.find((object) => object.id === objectId) || objects[0];
}

function pickObject() {
  return objects[0];
}

module.exports = {
  getObject,
  objects,
  pickObject,
};
