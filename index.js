const fs = require('fs')
const path = require('path')
const debug = require('debug')('NodeRed_Container:getRedFile');

var getRED = function (dir, cb) {
  if (typeof dir == "function") {
    cb = dir
    dir = __dirname
  }

  const noderedPath = path.join(dir, "..", "node-red", "red.js")
  debug("Searching for node red")
  fs.access(noderedPath, fs.constants.R_OK, (err) => {
    debug("Search complete")
    if (err) {
      if (err.code === "ENOENT") {
        debug("Node red not Found")
        var gulpFile = require('./gulpfile.js')
        var gulp = require('gulp')
        debug("Starting downloading...")
        gulp.start('default', function (d, e) {
          debug("done");
          debug(d);
          debug(e);
          cb(require(noderedPath))
        })
      }
    } else {
      debug("already found");
      cb(require(noderedPath))
    }
  })
}

if (require.main === module) {
  getRED(function (r) {
    debug(r)
  })
} else {
  module.exports = {
    getRED: getRED
  }
}
