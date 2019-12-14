var gulp = require('gulp');
var aglio = require('gulp-aglio');
gulp.task('docs', function (done) {
    gulp.src('*.apib')
        .pipe(aglio({ template: 'default' }))
        .pipe(gulp.dest('docs'));
    done();
});