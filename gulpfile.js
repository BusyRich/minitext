 var gulp = require('gulp'),
     jshint = require('gulp-jshint'),
     rename = require('gulp-rename'),
     uglify = require('gulp-uglify'),
     concat = require('gulp-concat');

gulp.task('lint', function(cb) {
  gulp.src('./minitext.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  cb(null);
});

gulp.task('compress', ['lint'], function(cb) {
  gulp.src('./minitext.js')
    .pipe(uglify())
    .pipe(rename('minitext.min.js'))
    .pipe(gulp.dest('./'));

  gulp.src('./ext/ext.js')
    .pipe(uglify())
    .pipe(rename('ext.min.js'))
    .pipe(gulp.dest('./ext'));

  cb(null);
});

gulp.task('default', ['compress'], function() {
  gulp.src([
      './ext/lib/*.js',
      './minitext.min.js',
      './ext/ext.min.js'
    ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./'));
});
