function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatDateKey(input) {
  const date = input instanceof Date ? input : new Date(input);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatMonthKey(input) {
  const date = input instanceof Date ? input : new Date(input);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function groupRecordsByMonth(records) {
  const groups = records.reduce((map, record) => {
    const month = record.date.slice(0, 7);
    if (!map[month]) map[month] = [];
    map[month].push(record);
    return map;
  }, {});

  return Object.keys(groups)
    .sort()
    .reverse()
    .map((month) => ({
      month,
      records: groups[month],
    }));
}

module.exports = {
  formatDateKey,
  formatMonthKey,
  groupRecordsByMonth,
};
