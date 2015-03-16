var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var fs = require("fs");


gulp.task('browserify', function(){
  browserify('./spec/ui.spec.js', {standalone: "test"})
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


gulp.task("build standalone", function() {
  browserify('./web/js/app.js', {standalone: "app"})
  .bundle().on("error", function(err){
    console.log(err);
  })
  .pipe(source('build.js').on("error", function(err){
    console.log(err);
  }))

  .pipe(gulp.dest('./web/standalone/app.js/').on("error", function(err){
    console.log(err);
  }));
  fs.createReadStream('./web/index.html').pipe(fs.createWriteStream('./web/standalone/index.html'));
});

gulp.task("watch", function(){
  gulp.watch("./web/js/*.js", ["browserify"]);
  gulp.watch("./spec/*.js", ["browserify"]);
})

gulp.task("default", ["browserify", "watch", "build standalone"]);