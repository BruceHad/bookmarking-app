var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');

gulp.task('default', function(){

  gulp.watch('src/stylesheets/**/*.scss', ['styles']);
  gulp.watch('src/javascripts/**/*.js', ['js']);

});

gulp.task('styles', function(){
  gulp.src('src/stylesheets/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(gulp.dest('./public/stylesheets'))
});

gulp.task('js', function(){
  gulp.src('src/javascripts/**/*.js')
  .pipe(minify({
    exclude: ['tasks'],
    ignoreFiles: ['.combo.js', '-min.js']
  }))
  .pipe(gulp.dest('./public/javascripts'))
})
