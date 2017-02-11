const fs = require('fs')
const path = require('path')
const debug = require('debug')('NodeRed_Container:getRedFile');

var RED

const noderedPath = path.join(__dirname, "..", "node-red", "red.js")
fs.access(noderedPath, fs.constants.R_OK, (err) => {
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
      })
    } else {
      debug("already found");
    }
  }
})
