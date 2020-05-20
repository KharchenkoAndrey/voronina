let projectFolder = 'build';
let sourceFolder = 'source';

let path = {

  build: {
    html: projectFolder + '/',
    css: projectFolder + '/css/',
    js: projectFolder + '/js/',
    img: projectFolder + '/img/',
    fonts: projectFolder + '/fonts/',
  },

  source: {
    html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
    css: sourceFolder + '/less/style.less',
    js: sourceFolder + '/js/script.js',
    img: sourceFolder + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
    fonts: sourceFolder + '/fonts/*.ttf',
  },

  watch: {
    html: sourceFolder + '/**/*.html',
    css: sourceFolder + '/less/**/*.less',
    js: sourceFolder + '/js/**/*.js',
    img: sourceFolder + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
  },

  clean: './' + projectFolder + '/'
}

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  less = require('gulp-less'),
  sourcemap = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  svgSprite = require('gulp-svg-sprite');

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/'
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(path.source.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.source.css)
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleancss())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(sourcemap.write('.'))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.source.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.source.img)
    .pipe(webp({
      quality: 70
    }))
    .pipe(dest(path.build.img))
    .pipe(src(path.source.img))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

gulp.task('svgSprite', function() {
  return gulp.src([sourceFolder + '/iconsprite/*.svg'])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg',
          example: true
        }
      },
    }))
    .pipe(dest(path.build.img))
})

function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.img], images)
}

function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
