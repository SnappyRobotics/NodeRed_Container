const fs = require('fs')
const path = require('path')
const sync = require('synchronize')
const debug = require('debug')('NodeRed_Container:getRedFile');

var dir
var check = function (dir_, cb) {
  if (!dir) {
    dir = dir_
  }

  const noderedPath = path.join(dir, "..", "node-red", "red.js")
  debug("Searching for Node RED at ", noderedPath)
  try {
    var fs.accessSync(noderedPath)
    debug("Node RED found");
    cb()

  } catch (err) {
    debug("Node RED not Found")
    download(function (err) {
      cb(err)
    })
  }
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

if (require.main === module) {
  debug("start")
  var data = sync.await(check(__dirname, sync.defer()))
  debug(data)
  /*check(__dirname, function (r) {
    debug(r)
  })*/
} else {
  check(__dirname, function (er) {
    if (er) {
      throw er
    } else {
      module.exports = true
    }
  })
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
