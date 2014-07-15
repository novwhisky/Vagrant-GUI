var gulp = require('gulp');
var downloadatomshell = require('gulp-download-atom-shell');

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
        version: '0.13.3',
        outputDir: './binaries'
    }, cb);
});

gulp.task('default', ['downloadatomshell']);
