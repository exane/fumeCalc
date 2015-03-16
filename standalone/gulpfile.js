var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var fs = require("fs");
var babelify = require("babelify");
var livereload = require("gulp-livereload");
livereload({start: true});

//fast install
//npm i --save-dev browserify vinyl-source-stream babelify gulp-livereload gulp


gulp.task('browserify', function(){
  browserify('./js/app.js', {standalone: "app", debug: true})
  .transform(babelify)
  .bundle().on("error", function(err){
    console.log(err);
  })
  .pipe(source('bundle.js').on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./build/').on("error", function(err){
    console.log(err);
  }));
});

gulp.task('sass', function(){
  gulp.src('./scss/*.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }).on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./public/assets/css/').on("error", function(err){
    console.log(err);
  }))
  .pipe(livereload().on("error", function(err){
    console.log(err);
  }));
});

gulp.task("watch", function(){
  gulp.watch("./js/*", ["browserify"]);
})

gulp.task("default", ["watch", "browserify"]);
