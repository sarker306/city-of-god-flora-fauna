var path = require('path');


var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');

var autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
		gzip = require('gulp-gzip');

gulp.task('less', function() {
  gulp.src(__dirname+'/'+'../public/assets/styles/less/styles.less')
    .pipe(less())
    .pipe(gulp.dest(__dirname+'/'+'../public/assets/styles/css'));
    //.pipe(livereload());
});

gulp.task('minify', function(){
	//Minifying CSS
	gulp.src([ 
		__dirname+'/'+'../public/assets/styles/css/styles.css'
	])
	.pipe(autoprefixer('last 2 version'))
	.pipe(gulp.dest(__dirname+'/../public/assets/styles/css/'))
	.pipe(concat('styles-production.css'))
	.pipe(rename({suffix: '.min'} ))
	.pipe(minifycss())
	.pipe(gulp.dest(__dirname+'/'+'../public/assets/styles/css/'))
	.pipe(gzip())
	.pipe(gulp.dest(__dirname+'/'+'../public/assets/styles/css/'));

	//Minifying External JS
	gulp.src([
		//
	])
	.pipe(concat('production-external-files.js'))
	.pipe(gulp.dest(__dirname+'/../public/assets/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(__dirname+'/../public/assets/scripts/'))
	.pipe(gzip())
	.pipe(gulp.dest(__dirname+'/../public/assets/scripts/'));

	//Minifying Internal JS
	gulp.src([
		//__dirname+'/../public/app/app.js',
		//__dirname+'/../public/app/controllers/homeCtrl.js',
	])
	.pipe(concat('production-internal-files.js'))
	.pipe(gulp.dest(__dirname+'/../public/assets/scripts/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest(__dirname+'/../public/assets/scripts/'))
	.pipe(gzip())
	.pipe(gulp.dest(__dirname+'/../public/assets/scripts/'));

});

gulp.task('watch', function() {
  //livereload.listen();
  gulp.watch(__dirname+'/'+'../public/assets/styles/less/*.less', ['less']);
});