const path = require('path');
const gulp = require('gulp');
const git = require('gulp-git');
const debug = require('debug')('Gulp');

gulp.task('clean', function(done) {

});

gulp.task('download', function(done) {
    debug("Downloading Node-red .....");
    git.clone('https://github.com/node-red/node-red', {
        args: path.join(__dirname, "..", "node-red") + ' --depth 1 --recurse-submodules'
    }, function(err) {
        if (err) {
            debug(err)
        }
        done()
    });
});

gulp.task('default', ['download']);
