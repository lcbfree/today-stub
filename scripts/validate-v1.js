const assert = require("node:assert/strict");

const config = require("../miniprogram/config");
const {
  createInitialDraft,
  generateRecord,
  updateDraftStatus,
} = require("../miniprogram/services/draft-service");
const { saveReceiptImage } = require("../miniprogram/services/image-export-service");
const {
  buildReceiptLayout,
  wrapText,
} = require("../miniprogram/services/receipt-layout");
const { drawReceipt } = require("../miniprogram/services/receipt-renderer");
const repository = require("../miniprogram/services/stub-repository");
const { buildArchiveMonths } = require("../miniprogram/utils/date");

function createWxMock() {
  const storage = {};

  return {
    storage,
    getStorage({ key, success, fail }) {
      if (Object.prototype.hasOwnProperty.call(storage, key)) {
        success({ data: storage[key] });
      } else if (fail) {
        fail({ errMsg: "getStorage:fail data not found" });
      }
    },
    setStorage({ key, data, success }) {
      storage[key] = data;
      success({ errMsg: "setStorage:ok" });
    },
    saveImageToPhotosAlbum({ success }) {
      success({ errMsg: "saveImageToPhotosAlbum:ok" });
    },
    removeStorageSync(key) {
      delete storage[key];
    },
    setStorageSync(key, data) {
      storage[key] = data;
    },
    getStorageSync(key) {
      return storage[key];
    },
  };
}

function createCanvasContextMock() {
  const calls = [];
  const ctx = new Proxy({}, {
    get(_, key) {
      return (...args) => {
        calls.push([key, ...args]);
        if (key === "draw") {
          const callback = args[1];
          if (typeof callback === "function") callback();
        }
      };
    },
  });

  return { ctx, calls };
}

async function main() {
  assert.equal(config.getStatuses().length, 4, "default statuses should exist");
  assert.equal(config.getLifeModuleDefinitions().length, 4, "default life modules should exist");
  assert.equal(config.getThemes().length, 3, "three receipt themes should exist");

  let draft = createInitialDraft("2026-05-09");
  draft = updateDraftStatus(draft, "bright");
  draft.selfSentence = "我想记住今天的一点亮。";
  draft.proof = "按时吃了晚饭，也推进了一点。";
  draft.lifeModules = draft.lifeModules.map((module) => (
    module.id === "small_spend"
      ? { ...module, enabled: true, value: "买了一杯热饮" }
      : module
  ));

  const record = generateRecord(draft);
  assert.equal(record.statusId, "bright");
  assert.equal(record.syncStatus, "local_only");
  assert.equal(record.lifeModules.length, 1);
  assert.equal(record.lifeModules[0].id, "small_spend");
  assert.equal(record.selfSentenceSource, "user");

  const emptyModuleRecord = generateRecord(createInitialDraft("2026-05-10"));
  assert.equal(emptyModuleRecord.lifeModules.length, 0, "no life module path should work");

  const layout = buildReceiptLayout(record);
  assert.ok(layout.height >= 720);
  assert.equal(layout.lifeModules.length, 1);
  assert.equal(layout.rows.length, 5);

  const longLines = wrapText("一段比较长的中文内容用来验证换行不会失控", 8, 2);
  assert.equal(longLines.length, 2);
  assert.ok(longLines[1].endsWith("…"));

  const forbiddenReceiptWords = /合计|预算|消费分类|总额|支付方式|找零|收银员/;
  assert.equal(forbiddenReceiptWords.test(JSON.stringify(layout)), false);

  for (const theme of config.getThemes()) {
    const { ctx, calls } = createCanvasContextMock();
    drawReceipt(ctx, record, theme, layout);
    assert.ok(calls.length > 20, `theme ${theme.id} should draw receipt`);
  }

  global.wx = createWxMock();
  const saved = await repository.saveRecord(record);
  assert.equal(saved.id, record.id);
  assert.equal((await repository.listRecords()).length, 1);
  assert.equal((await repository.listRecordsByDate("2026-05-09")).length, 1);
  assert.equal((await repository.listRecordsByMonth("2026-05")).length, 1);
  assert.equal((await repository.getRecord(record.id)).id, record.id);

  const second = {
    ...record,
    id: `${record.id}_second`,
    createdAt: record.createdAt + 1,
    updatedAt: record.updatedAt + 1,
  };
  await repository.saveRecord(second);
  const months = buildArchiveMonths(await repository.listRecords());
  assert.equal(months[0].days[0].count, 2, "same day stack count should work");

  await repository.deleteRecord(record.id);
  assert.equal(await repository.getRecord(record.id), null);
  await repository.clearRecords();
  assert.equal((await repository.listRecords()).length, 0);

  const exportResult = await saveReceiptImage({
    tempFilePath: "/tmp/today-stub-receipt.png",
    layout,
  });
  assert.equal(exportResult.tempFilePath, "/tmp/today-stub-receipt.png");

  console.log("V1 validation passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
