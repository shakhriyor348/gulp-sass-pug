const {gulp, src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sync = require('browser-sync').create();
const gp = require('gulp-load-plugins')();

const sourceFolder = 'app/src';
const buildFolder = 'app/build';


function styles() {
    return src(sourceFolder + '/styles/*.*')
        .pipe(sass())
        .pipe(gp.autoprefixer())
        .pipe(gp.groupCssMediaQueries())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gp.rename('styles.min.css'))
        .pipe(dest(buildFolder + '/styles').on('end', sync.reload))
}


function html() {
    return src(sourceFolder + '/*.{html,pug,jade}')
        .pipe(gp.include())
        .pipe(gp.pug())
        .pipe(dest(buildFolder + '/').on('end', sync.reload))
}


function img() {
    return src(sourceFolder + '/images/**/*.{png,jpg,gif,svg}')
        .pipe(gp.webp())
        .pipe(dest(buildFolder + '/images/').on('end', sync.reload))
}

function fonts() {
    return src(sourceFolder + '/fonts/**/**/*.*')
        .pipe(gp.ttf2woff2())
        .pipe(dest(buildFolder + '/fonts/').on('end', sync.reload))
}

function js() {
    return src(sourceFolder + '/script/**/*.*')
        .pipe(gp.sourcemaps.init())
        .pipe(gp.concat('all.js'))
        .pipe(gp.include())
        .pipe(gp.babel())
        .pipe(gp.babelMinify())
        .pipe(gp.rename('all.min.js'))
        .pipe(gp.sourcemaps.write())
        .pipe(dest(buildFolder + '/script/').on('end', sync.reload))
}


function serve() {
    sync.init({
        server: {
            baseDir: buildFolder
        }
    })

    watch([sourceFolder + '/*.{html,pug,jade}', sourceFolder + '/view/**/*.{html,pug,jade}'], series(html))
    watch(sourceFolder + '/styles/**/*.*', series(styles,html))
    watch(sourceFolder + '/script/**/*.*', series(js))
    watch(sourceFolder + '/images/**/*.{png,jpg,gif,svg}', series(img))
    watch(sourceFolder + '/fonts/**/*.*', series(fonts))
}


exports.build = series(styles, js, html, img, fonts);
exports.watch = series(styles, js, img, html, fonts, serve);



