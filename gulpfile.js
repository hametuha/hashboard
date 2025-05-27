const gulp = require( 'gulp' );
const fs = require( 'fs' );
const $ = require( 'gulp-load-plugins' )();
const mozjpeg = require( 'imagemin-mozjpeg' );
const pngquant = require( 'imagemin-pngquant' );
const mergeStream = require( 'merge-stream' );
const webpack = require( 'webpack-stream' );
const webpackBundle = require( 'webpack' );
const named = require( 'vinyl-named' );
const browserSync = require( 'browser-sync' ).create();
const sass = require( 'gulp-sass' ); //( require( 'sass' ) );

// Sassのタスク
gulp.task( 'sass', function() {
	return gulp.src( [
		'./src/scss/**/*.scss',
	] )
		.pipe( $.plumber( {
			errorHandler: $.notify.onError( '<%= error.message %>' )
		} ) )
		.pipe( $.sourcemaps.init( { loadMaps: true } ) )
		.pipe( $.sassGlob() )
		.pipe( sass( {
			errLogToConsole: true,
			outputStyle: 'compressed',
			includePaths: [
				'./src/scss',
				'./node_modules/bootstrap/scss',
			],
		} ) )
		.pipe( $.autoprefixer() )
		.pipe( $.sourcemaps.write( './map' ) )
		.pipe( gulp.dest( './assets/css' ) );
} );

// Lint SCSS
gulp.task( 'stylelint', () => gulp.src( [ './src/scss/**/*.scss' ] )
	.pipe( $.stylelint( {
		failAfterError: false,
		reporters: [
			{
				formatter: 'string',
				console: true,
			},
		],
	} ) )
);

// Bundle Javascript
gulp.task( 'js', () => {
	return gulp.src( [ './src/js/**/*.js' ] )
		.pipe( $.plumber( {
			errorHandler: $.notify.onError( 'JS ERROR: <%= error.message %>' )
		} ) )
		.pipe( named( function( file ) {
			return file.relative.replace( /\.[^.]+$/, '' );
		} ) )
		.pipe( webpack( require( './webpack.config' ), webpackBundle ) )
		.pipe( gulp.dest( './assets/js/' ) );
} );

// JS Hint
gulp.task( 'eslint', function() {
	return gulp.src( [
		'./src/js/**/*.js',
	] )
		.pipe( $.eslint( { useEslintrc: true } ) )
		.pipe( $.eslint.format() );
} );

// Build modernizr
gulp.task( 'copylib', function() {
	return mergeStream(
		// copy js
		gulp.src( [
			'./node_modules/bootstrap/dist/js/bootstrap.min.js',
			'./node_modules/bootstrap/dist/js/bootstrap.min.js.map',
			'./node_modules/popper.js/dist/umd/popper.min.js',
			'./node_modules/popper.js/dist/umd/popper.min.js.map',
			'./node_modules/vue/dist/vue.min.js',
			'./node_modules/moment/min/moment-with-locales.min.js',
			'./node_modules/chart.js/dist/Chart.min.js',
			'./node_modules/vue-chartjs/dist/vue-chartjs.min.js',
			'./node_modules/vue-chartjs/dist/vue-chartjs.js.map',
		] )
			.pipe( gulp.dest( './assets/js' ) )
	);
} );

// Image min
gulp.task( 'imagemin', function() {
	return gulp.src( './src/img/**/*' )
		.pipe( $.imagemin( [
			pngquant( {
				quality: [ .65, .8 ],
				speed: 1,
				floyd: 0,
			} ),
			mozjpeg( {
				quality: 85,
				progressive: true,
			} ),
			$.imagemin.svgo(),
			$.imagemin.optipng(),
			$.imagemin.gifsicle(),
		] ) )
		.pipe( gulp.dest( './assets/img' ) );
} );

// Pug task
gulp.task( 'pug', function() {
	return gulp.src( [ 'src/pug/**/*', '!src/pug/**/_*' ] )
		.pipe( $.plumber( {
			errorHandler: $.notify.onError( 'HTML ERROR: <%= error.message %>' ),
		} ) )
		.pipe( $.pug( {
			pretty: true,
		} ) )
		.pipe( gulp.dest( 'assets' ) )
} );

// watch browser sync
gulp.task( 'server', function() {
	return browserSync.init( {
		files: [ 'assets/**/*' ],
		server: {
			baseDir: './assets',
			index: 'index.html',
		},
		reloadDelay: 2000,
	} );
} );

gulp.task( 'reload', function() {
	gulp.watch( 'assets/**/*', function() {
		return browserSync.reload();
	} );
} );

// watch
gulp.task( 'watch', function() {
	// Make SASS
	gulp.watch( 'src/scss/**/*.scss', gulp.parallel( 'sass', 'stylelint' ) );
	// JS
	gulp.watch( [ 'src/js/**/*.js' ], gulp.parallel( 'js', 'eslint' ) );
	// Minify Image
	gulp.watch( 'src/img/**/*', gulp.parallel( 'imagemin' ) );
	// Compile HTML
	gulp.watch( 'src/pug/**/*', gulp.parallel( 'pug' ) );
} );

// Build
gulp.task( 'build', gulp.parallel( 'copylib', 'eslint', 'js', 'sass', 'imagemin' ) );

// HTML task
gulp.task( 'html', gulp.series( 'build', 'watch', 'server', 'reload' ) );

// Default Tasks
gulp.task( 'default', gulp.parallel( 'watch' ) );
