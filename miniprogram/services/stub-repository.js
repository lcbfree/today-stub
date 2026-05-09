const STORAGE_KEY = "today_stub_records_v1";

function getStorageApi() {
  if (typeof wx !== "undefined") return wx;
  return null;
}

function sortRecords(records) {
  return records.slice().sort((a, b) => {
    if (b.createdAt !== a.createdAt) return b.createdAt - a.createdAt;
    return String(b.id).localeCompare(String(a.id));
  });
}

function readRecords() {
  const storage = getStorageApi();

  if (!storage) {
    return Promise.resolve([]);
  }

  return new Promise((resolve) => {
    storage.getStorage({
      key: STORAGE_KEY,
      success: (result) => resolve(Array.isArray(result.data) ? result.data : []),
      fail: () => resolve([]),
    });
  });
}

function writeRecords(records) {
  const storage = getStorageApi();

  if (!storage) {
    return Promise.resolve(sortRecords(records));
  }

  const sortedRecords = sortRecords(records);

  return new Promise((resolve, reject) => {
    storage.setStorage({
      key: STORAGE_KEY,
      data: sortedRecords,
      success: () => resolve(sortedRecords),
      fail: reject,
    });
  });
}

function listRecords() {
  return readRecords().then(sortRecords);
}

function listRecordsByDate(dateKey) {
  return listRecords().then((records) => records.filter((record) => record.date === dateKey));
}

function listRecordsByMonth(monthKey) {
  return listRecords().then((records) => records.filter((record) => record.date.slice(0, 7) === monthKey));
}

function getRecord(id) {
  return listRecords().then((records) => records.find((record) => record.id === id) || null);
}

function saveRecord(record) {
  const nextRecord = {
    ...record,
    updatedAt: Date.now(),
    syncStatus: record.syncStatus || "local_only",
  };

  return readRecords()
    .then((records) => records.filter((item) => item.id !== nextRecord.id).concat(nextRecord))
    .then(writeRecords)
    .then(() => nextRecord);
}

function deleteRecord(id) {
  return readRecords()
    .then((records) => records.filter((record) => record.id !== id))
    .then(writeRecords)
    .then(() => undefined);
}

function clearRecords() {
  return writeRecords([]).then(() => undefined);
}

module.exports = {
  STORAGE_KEY,
  clearRecords,
  deleteRecord,
  getRecord,
  listRecords,
  listRecordsByDate,
  listRecordsByMonth,
  saveRecord,
  sortRecords,
};
