const fs = require('fs')
const path = require('path')
const debug = require('debug')('NodeRed_Container:getRedFile');

var dir
var check = function (dir_, cb) {
  if (!dir) {
    dir = dir_
  }

  const noderedPath = path.join(dir, "..", "node-red", "red.js")
  debug("Searching for Node RED at ", noderedPath)

  fs.access(noderedPath, fs.constants.R_OK, (err) => {
    debug("Search complete")
    if (err) {
      if (err.code === "ENOENT") {
        debug("Node RED not Found")
        download(function (err) {
          cb(err)
        })
      }
    } else {
      debug("Node RED found");
      cb()
    }
  })
}

var download = function (cb) {
  var gulpFile = require('./gulpfile.js')
  var gulp = require('gulp')
  debug("Starting downloading...")
  gulp.start('default', function () {
    debug("done")
    cb()
  })
}

//data = sync.await(fs.readFile(fname, sync.defer()))

if (require.main === module) {
  check(__dirname, function (r) {
    debug(r)
  })
} else {
  /*
  module.exports = {
    getRED: getRED,
    getHelper: function (cb1) {
      debug("Getting red in helper")
      getRED(function (red) {
        const noderedPath = path.join(dir, "..", "node-red", "red.js")
      })
    }
  }*/
}
