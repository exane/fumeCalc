var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');


gulp.task('browserify', function() {
    return browserify('./spec/ui.spec.js', {standalone: "test"})
        .bundle().on("error", function(err){
            console.log(err);
        })
        .pipe(source('ui.spec.js').on("error", function(err){
            console.log(err);
        }))

        .pipe(gulp.dest('./spec/build/').on("error", function(err){
            console.log(err);
        }));
});

gulp.task("watch", function(){
    gulp.watch("./web/js/*.js", ["browserify"]);
    gulp.watch("./spec/*.js", ["browserify"]);
})

gulp.task("default", ["browserify", "watch"]);