var gulp = require('gulp');
var git = require('gulp-git');
var debug = require('debug')('Gulp');

gulp.task('clean', function(done) {

});

gulp.task('download', function(done) {
    debug("Downloading Node-red .....");
    git.clone('https://github.com/node-red/node-red', {
        args: './sub/node-red --depth 1 --recurse-submodules',
        quiet: false
    }, function(err) {
        if (err) {
            debug(err)
        }
        done()
    });
});

gulp.task('default', ['download']);
