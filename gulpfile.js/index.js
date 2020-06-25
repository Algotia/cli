const { series } = require("gulp");

const clean = require("./clean");
const transpile = require("./transpile");
const copyFiles = require("./copyFiles");
const watch = require("./watch");

const build = series(clean, transpile, copyFiles);

module.exports = {
  clean,
  transpile,
  copyFiles,
  watch,
  build
};
