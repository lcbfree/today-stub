const statuses = require("./statuses");
const lifeModules = require("./life-modules");
const phrases = require("./phrases");
const stamps = require("./stamps");
const objects = require("./objects");
const themes = require("./themes");

module.exports = {
  ...statuses,
  ...lifeModules,
  ...phrases,
  ...stamps,
  ...objects,
  ...themes,
};
