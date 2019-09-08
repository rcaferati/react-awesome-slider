const concat = require('gulp-concat');
const gulp = require('gulp');

gulp.task('dist-scss', () => {
  return gulp
    .src(['src/core/styles.scss'])
    .pipe(concat('styles.scss').pipe(gulp.dest('dist/')));
});

gulp.task('default', gulp.series('dist-scss'));
