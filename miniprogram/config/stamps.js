const stamps = [
  {
    id: "stamp_today_counts",
    label: "今天也算数",
  },
  {
    id: "stamp_gently_done",
    label: "轻轻结算",
  },
  {
    id: "stamp_rest_allowed",
    label: "允许休息",
  },
  {
    id: "stamp_not_perfect",
    label: "不必满分",
  },
];

function getStamp(stampId) {
  return stamps.find((stamp) => stamp.id === stampId) || stamps[0];
}

function pickStamp() {
  return stamps[0];
}

module.exports = {
  getStamp,
  pickStamp,
  stamps,
};
