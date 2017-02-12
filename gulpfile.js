const del = require('del');
const path = require('path');
const runSequence = require('run-sequence');
const fs = require('fs');
const gulp = require('gulp');
const run = require('gulp-run');
const git = require('gulp-git');
const bump = require('gulp-bump');

const debug = require('debug')('NodeRed_Container:Gulp');

var childProcess = require('child_process');
(function () {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;

  function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();

var nodePath = path.join(__dirname, "..", "..", "..", "node-red")

gulp.task('clean', function (done) {
  del([nodePath], {
      force: true,
      dot: true
    })
    .then(function () {
      done()
    })
})

gulp.task('download', function (done) {
  debug("Downloading Node-red .....");
  git.clone('https://github.com/node-red/node-red', {
    args: nodePath + ' --depth 1 --recurse-submodules'
  }, function (err) {
    if (err) {
      debug(err)
    }
    done()
  })
})

gulp.task('install', function (done) {
  debug('Installing ...')
  var install = childProcess.spawn('npm', ['install'], {
    cwd: nodePath,
    stdio: "inherit"
  });

  install.on('exit', function (code) {
    debug('child process exited with code ' + code.toString());
    done();
  });
})

gulp.task('build', function (done) {
  debug('Grunt building ...')
  var build = childProcess
    .spawn(path.join('node_modules', '.bin', 'grunt'), ['build'], {
      cwd: nodePath,
      stdio: "inherit"
    });

  build.on('exit', function (code) {
    debug('child process exited with code ' + code.toString());
    done();
  });
})

gulp.task('update-pkg', function () {
  return gulp.src('./package.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump', ['update-pkg'], function (cb) {
  projectPackage = {}
  projectPackage.version =
    JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  cb();
});

gulp.task('default', function () {
  runSequence('download', 'install', 'build')
})
