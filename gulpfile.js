var gulp  = require('gulp');
var shell = require('gulp-shell');
var atom  = require('gulp-atom');

// Build project
gulp.task('build', function() {
  return atom({
      srcPath: './src',
      releasePath: './release',
      cachePath: './cache',
      version: 'v0.12.4',
      //rebuild: true,
      platforms: ['osx']
  });
});

//Run project
gulp.task('run', shell.task([
  './release/v0.12.4/darwin/Vagrant.app/Contents/MacOS/Atom src/'
]));

gulp.task('default', ['atom']);