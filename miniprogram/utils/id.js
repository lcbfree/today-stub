function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}

function createStubId(dateKey) {
  return createId(`stub_${dateKey.replace(/-/g, "")}`);
}

module.exports = {
  createId,
  createStubId,
};
