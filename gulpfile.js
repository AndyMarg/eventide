var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();

var config = {
    paths: {
        scss: './src/scss/**/*.scss',
        html: './public/index.html'
    },
    output: {
        cssName: '/css/bundle.min.css',
        path: './public'
    },
    isDevelop: true
};

gulp.task('scss', function () {
    return gulp.src(config.paths.scss)
        .pipe(plumber())
        .pipe(gulpIf(config.isDevelop,sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    });
    gulp.watch(config.paths.scss, ['scss']);
    gulp.watch(config.paths.html).on('change', browserSync.reload);
});

gulp.task('default', ['scss','serve']);