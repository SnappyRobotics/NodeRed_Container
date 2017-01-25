const del = require('del');
const path = require('path');
const runSequence = require('run-sequence');

const gulp = require('gulp');
const run = require('gulp-run');
const git = require('gulp-git');

const debug = require('debug')('Gulp');

var nodePath = path.join(__dirname, "..", "node-red")

gulp.task('clean', function(done) {
  del([nodePath], {
      force: true,
      dot: true
    })
    .then(function() {
      done()
    })
})

gulp.task('download', function(done) {
  debug("Downloading Node-red .....");
  git.clone('https://github.com/node-red/node-red', {
    args: nodePath + ' --depth 1 --recurse-submodules'
  }, function(err) {
    if (err) {
      debug(err)
    }
    done()
  })
})

gulp.task('install', function(done) {
  debug('Installing ...')
  return run('cd ' + nodePath + ' && npm install').exec(function() {
    done()
  }).pipe(gulp.dest('output'))
})


gulp.task('build', function(done) {
  debug('Grunt building ...')
  return run('cd ' + nodePath + ' && ./node_modules/.bin/grunt build').exec(function() {
    done()
  }).pipe(gulp.dest('output'))
})

gulp.task('default', function() {
  runSequence('clean', 'download', 'install', 'build')
})
