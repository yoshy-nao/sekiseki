// ディレクトリ
var path = {
  // 'distRootPath': 'docs', // 公開rootディレクトリ
  'destRootPath': 'docs', // 開発用rootディレクトリ
  'destImagePath': 'docs/common/img', // 開発用画像格納ディレクトリ
  'destCssPath': 'docs/common/css', // 開発用css格納ディレクトリ
  'destJsPath': 'docs/common/js', // 開発用js格納ディレクトリ
  'sassPath': 'src/sass', // 作業領域sass格納ディレクトリ
  'ejsPath': 'src/ejs', // 作業領域ejs格納ディレクトリ
  'imagePath': 'src/img', // 作業領域画像格納ディレクトリ
  'cssPath': 'src/css', // 作業領域css格納ディレクトリ
  'jsPath': 'src/js' // 作業領域js格納ディレクトリ
}

// 使用パッケージ
var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var ejs = require('gulp-ejs');
var htmlbeautify = require('gulp-html-beautify');
var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var changed  = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var imageminJpg = require('imagemin-jpeg-recompress');
var imageminPng = require('imagemin-pngquant');
var imageminGif = require('imagemin-gifsicle');
var svgmin = require('gulp-svgmin');
var plumber = require('gulp-plumber'); // コンパイルエラーが出てもwatchを止めない

// 不要ファイル削除
gulp.task('clean', ['copy'], function(){
  del([
    path.distRootPath + '/**/.DS_Store',
    path.distRootPath + '/**/Thumbs.db',
    path.distRootPath + '/**/*.map'
  ]);
});

// ファイルコピー
gulp.task('cleandist', function () {
  del([
    path.distRootPath + '/**/*'
  ]);
});
gulp.task('copy', ['cleandist'], function () {
  return gulp.src(path.destRootPath + '/**/*')
  .pipe(gulp.dest(path.distRootPath + '/'))
});

// 開発→公開ファイル移動
gulp.task('updist', ['clean']);

// jpg,png,gif画像の圧縮タスク
gulp.task('imagemin', function(){
  var srcGlob = path.imagePath + '/**/*.+(jpg|jpeg|png|gif)';
  var dstGlob = path.destImagePath;
  gulp.src( srcGlob )
  .pipe(changed( dstGlob ))
  .pipe(imagemin([
    imageminPng({
      quality: [0.3, 0.7],
    }),
    imageminJpg({
      max: 75
    }),
    imageminGif({
      interlaced: false,
      optimizationLevel: 3,
      colors:180
    })
  ]
))
.pipe(gulp.dest( dstGlob ));
});
// svg画像の圧縮タスク
gulp.task('svgmin', function(){
    var srcGlob = path.imagePath + '/**/*.+(svg)';
    var dstGlob = path.destImagePath;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(svgmin())
    .pipe(gulp.dest( dstGlob ));
});

// ejs
gulp.task('ejs', function(){
  gulp.src( [ path.ejsPath + '/**/*.ejs', '!' + path.ejsPath + '/**/_*.ejs' ] )
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename( {extname: ".html"} ) ) // htmlにリネーム
    .pipe(htmlbeautify( {indent_char: ' ', indent_size: 2} )) // ソース整形
    .pipe(gulp.dest(path.destRootPath + '/'))
});

// sass
gulp.task('sass', function(){
  gulp.src(path.sassPath + '/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(prefix({
      grid: true
    }))
    .pipe(pleeease({
      minifier: true,
      mqpacker: true,
    }))
    .pipe(gulp.dest(path.destCssPath + '/'))
});

// ファイル変更監視
gulp.task('watch', function() {
  gulp.watch(path.sassPath + '/**/*.scss', function(event){
    gulp.run(['sass'])
  });
  gulp.watch(path.ejsPath + '/**/*.ejs', function(event){
    gulp.run('ejs')
  });
  gulp.watch(path.imagePath + '/**/*', ['imagemin', 'svgmin']);
});

// タスク実行
gulp.task('default', ['watch']); // デフォルト実行
