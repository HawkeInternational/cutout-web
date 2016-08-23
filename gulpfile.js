var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');

gulp.task('ts-compile-server', function () {
    return gulp.src(['./src/server/**/*.ts', '!./node_modules/**/*.ts', '!./typings/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript({
            locale: 'en-US',
            module: 'commonjs',
            noEmitOnError: true,
            sourceMap: true,
            target: 'es6'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/server'))
});

gulp.task('ts-compile-client', function () {
    return gulp.src(['./src/client/**/*.ts', '!./src/client/lib/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript({
            locale: 'en-US',
            module: 'amd',
            noEmitOnError: true,
            sourceMap: true,
            target: 'es5',
            jsx: 'react'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/client'))
});

gulp.task('ts-lint', function () {
    return gulp.src(['./src/server/**/*.ts', './src/client/**/*.ts', '!./src/client/lib/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tslint())
        .pipe(tslint({
            formatter: 'verbose',
        }))
        .pipe(tslint.report({
            emitError: false,
            sumarrizeFailureOutput: true
        }))
});

gulp.task('ts-compile', ['ts-compile-server', 'ts-compile-client']);

