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

function buildArchiveMonths(records) {
  return groupRecordsByMonth(records).map((group) => {
    const dayMap = group.records.reduce((map, record) => {
      if (!map[record.date]) map[record.date] = [];
      map[record.date].push(record);
      return map;
    }, {});

    const days = Object.keys(dayMap)
      .sort()
      .reverse()
      .map((date) => ({
        date,
        day: date.slice(-2),
        count: dayMap[date].length,
        records: dayMap[date],
      }));

    return {
      month: group.month,
      count: group.records.length,
      days,
      records: group.records,
    };
  });
}

module.exports = {
  buildArchiveMonths,
  formatDateKey,
  formatMonthKey,
  groupRecordsByMonth,
};
