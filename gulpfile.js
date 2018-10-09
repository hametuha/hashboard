const gulp        = require( 'gulp' ),
      fs          = require( 'fs' ),
      $           = require( 'gulp-load-plugins' )(),
      eventStream = require( 'event-stream' ),
      webpack       = require( 'webpack-stream' ),
      webpackBundle = require( 'webpack' ),
      named         = require( 'vinyl-named' ),
      browserSync = require('browser-sync').create();

// Sassのタスク
gulp.task( 'sass', function() {
  return gulp.src([
    './src/scss/**/*.scss'
  ])
    .pipe( $.plumber({
      errorHandler: $.notify.onError( '<%= error.message %>' )
    }) )
    .pipe( $.sourcemaps.init({loadMaps: true}) )
    .pipe( $.sassBulkImport() )
    .pipe( $.sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: [
        './src/scss',
        './node_modules/bootstrap/scss'
      ]
    }) )
    .pipe( $.autoprefixer({browsers: [ 'last 2 version', '> 5%' ]}) )
    .pipe( $.sourcemaps.write( './map' ) )
    .pipe( gulp.dest( './assets/css' ) );
});


// Minify All
gulp.task( 'js', function() {
  return gulp.src([ './src/js/**/*.js' ])
    .pipe( $.plumber({
      errorHandler: $.notify.onError( '<%= error.message %>' )
    }) )
    .pipe( named( function( file ) {
      return file.relative.replace( /\.[^.]+$/, '' );
    }) )
    .pipe( webpack({
      mode: 'production',
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [ '@babel/preset-env' ]
              }
            }
          }
        ]
      }
    }, webpackBundle ) )
    .pipe( gulp.dest( './assets/js/' ) );
});


// JS Hint
gulp.task( 'eslint', function() {
  return gulp.src([
    './src/js/**/*.js'
  ])
    .pipe( $.eslint({ useEslintrc: true }) )
    .pipe( $.eslint.format() );
});

// Build modernizr
gulp.task( 'copylib', function() {
  return eventStream.merge(

    // copy js
    gulp.src([
      './node_modules/bootstrap/dist/js/bootstrap.min.js',
      './node_modules/bootstrap/dist/js/bootstrap.min.js.map',
      './node_modules/popper.js/dist/umd/popper.min.js',
      './node_modules/popper.js/dist/umd/popper.min.js.map',
      './node_modules/vue/dist/vue.min.js',
      './node_modules/moment/min/moment-with-locales.min.js',
      './node_modules/chart.js/dist/Chart.min.js',
      './node_modules/vue-chartjs/dist/vue-chartjs.min.js',
      './node_modules/vue-chartjs/dist/vue-chartjs.js.map'
    ])
      .pipe( gulp.dest( './assets/js' ) )
  );
});

// Image min
gulp.task( 'imagemin', function() {
  return gulp.src( './src/img/**/*' )
    .pipe( $.imagemin([
      $.imagemin.gifsicle({interlaced: true}),
      $.imagemin.jpegtran({progressive: true}),
      $.imagemin.optipng({optimizationLevel: 5}),
      $.imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ], {verbose: true}) )
    .pipe( gulp.dest( './assets/img' ) );
});

// Pug task
gulp.task('pug', function () {
  return gulp.src(['src/pug/**/*', '!src/pug/**/_*'])
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
    }))
    .pipe($.pug({
      pretty: true
    }))
    .pipe(gulp.dest('assets'))
});

// watch browser sync
gulp.task('server', function () {
  return browserSync.init({
    files: ["assets/**/*"],
    server: {
      baseDir: "./assets",
      index: "index.html"
    },
    reloadDelay: 2000
  });
});

gulp.task('reload', function () {
  gulp.watch('assets/**/*', function () {
    return browserSync.reload();
  });
});

// watch
gulp.task( 'watch', function() {

  // Make SASS
  gulp.watch( 'src/scss/**/*.scss', [ 'sass' ]);

  // JS
  gulp.watch([ 'src/js/**/*.js' ], [ 'js', 'eslint' ]);

  // Minify Image
  gulp.watch( 'src/img/**/*', [ 'imagemin' ]);

  // Compile HTML
  gulp.watch('src/pug/**/*', ['pug']);
});

// Build
gulp.task( 'build', [ 'copylib', 'eslint', 'js', 'sass', 'imagemin' ]);

// HTML task
gulp.task('html', ['build', 'watch', 'server', 'reload']);

// Default Tasks
gulp.task( 'default', [ 'watch' ]);
