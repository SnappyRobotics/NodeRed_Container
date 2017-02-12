const del = require('del');
const path = require('path');
const runSequence = require('run-sequence');
const fs = require('fs');
const gulp = require('gulp');
const run = require('gulp-run');
const git = require('gulp-git');
const bump = require('gulp-bump');

const debug = require('debug')('NodeRed_Container:Gulp');

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

gulp.task('install', ['download'], function (done) {
  debug('Installing ...')
  return run('cd ' + nodePath + ' && npm install').exec(function () {
    done()
  })
})

gulp.task('build', function (done) {
  debug('Grunt building ...')
  try {
    return run('cd ' + nodePath + ' && ./node_modules/.bin/grunt build').exec(function (e, d, er) {
        debug(e);
        debug(d);
        debug(er);
      })
      .pipe(process.stdout)
      .on('error', function handleError() {
        done();
      })
      .on('finish', done)
  } catch (er) {
    debug(er)
    done()
  }
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
  runSequence('clean', 'download', 'install', 'build')
})
