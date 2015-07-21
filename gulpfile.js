/**
 * Gulp tasks file
 * Requires [gulp](http://gulpjs.com):
 * `sudo npm install -g gulp`
 *
 * List all tasks:
 * `gulp -T`
 *
 * Prepare for production:
 * `gulp prod`
 *
 * Run server in dev mode:
 * `gulp`
 */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var flow = require('gulp-flowtype');
var mocha = require('gulp-mocha');
var scsslint = require('gulp-scss-lint');
var ngAnnotate = require('gulp-ng-annotate');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var minifyHtml = require('gulp-minify-html');
var gulpDocs = require('gulp-ngdocs');
var jsdoc = require('gulp-jsdoc');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
// var spa = require('browser-sync-spa');

var browserReload = browserSync.reload;

// browserSync.use(spa({
// 	selector: "[ng-app]"
// }));

// get version to make sure production minified assets are cached to the version
var version = require('./package.json').version;

// main assets file
var assets = require('./websrc/assets.json');

// destination for processed files (minimized, etc.)
var indexDest = './webroot';
var processedDest = indexDest + '/dist';


/**
 * PRIVATE HELPER FUNCTIONS
 * ========================
 */

/**
 * @private
 * Creates a new instance of an object
 * @param  {object} obj source object
 * @return {object}     cloned object
 */
var clone = function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * TASKS
 * =====
 */

/**
 * js-code-style
 * Checks code style on our own JS
 */
gulp.task('js-style', function jsStyle() {
	return gulp.src(assets.jsBodyCustom, {base: './webroot/'})
		.pipe(cache('js-cs'))
		.pipe(jscs());
});

/**
 * js-custom-lint
 * Lints our custom javascript libraries
 */
gulp.task('js-hint', function jsHint() {
	return gulp.src(assets.jsBodyCustom, {base: './webroot/'})
		.pipe(cache('js-custom-lint'))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

/**
 * js-custom-typecheck
 * Checks for common type mismatch errors in our custom javascript libraries
 */
gulp.task('js-typecheck', function jsLint() {
	return gulp.src(assets.jsBodyCustom, {base: './webroot/'})
		.pipe(cache('js-custom-typecheck'))
		.pipe(flow({
			all: false,
			weak: false,
			declarations: './declarations',
			killFlow: false,
			beep: true,
			abort: false
		}));
});

/**
 * css-lint
 * Lints our custom css rules
 */
gulp.task('css-lint', function cssLint() {
	var files = ['./websrc/**/*.scss'];
	return gulp.src(files, {base: './websrc/'})
		.pipe(cache('css-lint'))
		.pipe(scsslint());
});

/**
 * js-server-test
 * Run server unit tests
 */
gulp.task('js-server-test', function jsServerTest() {
	return gulp.src('./server/**/*.spec.js')
		.pipe(cache('js-server-test'))
		.pipe(mocha({reporter: 'spec'}));
});

/**
 * js-head-min
 * Creates a single minified javascript file from all code that is meant to run before the page is rendered
 */
gulp.task('js-head-min', function jsHeadMin() {
	return gulp.src(assets.jsHead, {base: './webroot/'})
		.pipe(sourcemaps.init())
//		.pipe(babel())
		.pipe(concat('head.min.js', {newLine: ';\n'}))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(processedDest));
});

/**
 * js-body-min
 * Creates a single minified javascript file from all code that is meant to run after the page is rendered
 */
gulp.task('js-body-min', function jsBodyMin() {
	var files = clone(assets.jsBodyVendor);
	files = files.concat(assets.jsBodyCustom);
	return gulp.src(files, {base: './webroot/'})
		.pipe(sourcemaps.init())
//		.pipe(babel())
		.pipe(concat('body.min.js', {newLine: ';\n'}))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(processedDest));
});

/**
 * css-process
 * Creates css from sass file
 * Add css browser prefixed declarations for the last 2 major releasees of a browser that has over 5% of the global market share
 */
gulp.task('css-process', function cssProcess() {
	return gulp.src('./websrc/main.scss', {base: './websrc'})
		.pipe(sourcemaps.init())
		.pipe(sass({errLogToConsole: true}))
		.pipe(autoprefixer('> 5%', 'last 2 versions'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(processedDest));
});

/**
 * font
 * Move fonts to location expected when minifying/concating all vendor css
 */
gulp.task('fonts-fix', function fontsFix() {
	var fontawesome = gulp.src('./webroot/vendor/fontawesome/fonts/**/*')
		.pipe(gulp.dest(indexDest + '/fonts/'));
	var opensans = gulp.src('./webroot/vendor/open-sans-fontface/fonts/**/*')
		.pipe(gulp.dest(processedDest + '/fonts/'));
	return merge(fontawesome, opensans);
});

/**
 * css-min
 * Minifies our css file
 */
gulp.task('css-min', ['css-process', 'fonts-fix'], function cssMin() {
	var files = clone(assets.cssVendor);
	files.push(assets.cssCustomProcessed);
	return gulp.src(files, {base: './webroot/'})
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat('all.min.css'))
		.pipe(minifyCss({keepSpecialComments: 0}))
		.pipe(replace('../font/', '/bower_components/fontawesome/font/'))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(processedDest));
});

gulp.task('img-min', function imageMin() {
	 return gulp.src('./websrc/img/*')
		.pipe(imagemin({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true,
			multipass: true,
			svgoPlugins:[
				{removeViewBox: true},
				{removeUselessStrokeAndFill: true},
				{removeEmptyAttrs: true},
			]
		}))
		.pipe(gulp.dest('./webroot/img'));
});

/**
 * index
 * Creates a development-mode index.html with references to the source versions of the dependencies
 */
gulp.task('index-dev', ['css-process'], function indexDev() {
	var cssAndJs = [];
	cssAndJs = cssAndJs.concat(
		assets.cssVendor,
		assets.cssCustomProcessed,
		assets.jsBodyVendor,
		assets.jsBodyCustom
	);
	var jsHead = [];
	jsHead = jsHead.concat(assets.jsHead);
	return gulp.src('./websrc/*.html')
		.pipe(inject(gulp.src(cssAndJs, {read: false}), {ignorePath: '/webroot/'}))
		.pipe(inject(gulp.src(jsHead, {read: false}), {ignorePath: '/webroot/', starttag: '<!-- inject:head:{{ext}} -->'}))
		.pipe(gulp.dest(indexDest));
});

/**
 * index-prod
 * Create a production-mode index.html with references to the minimized versions of the dependencies
 */
gulp.task('index-prod', ['js-head-min', 'js-body-min', 'css-min', 'img-min'], function indexProd() {
	gutil.log('Creating \'' + gutil.colors.cyan(version) + '\' production index');
	return gulp.src('./websrc/*.html')
		.pipe(inject(gulp.src(['./webroot/dist/all.min.css',
			'./webroot/dist/body.min.js'],
			{read: false}),
			{ignorePath: '/webroot/'}))
		.pipe(inject(gulp.src('./webroot/dist/head.min.js',
			{read: false}),
			{ignorePath: '/webroot/', starttag: '<!-- inject:head:{{ext}} -->'}))
		.pipe(replace('min.js', 'min.js?v=' + version))
		.pipe(replace('min.css', 'min.css?v=' + version))
		.pipe(minifyHtml({conditionals: true, cdata: true, empty: true}))
		.pipe(gulp.dest(indexDest));
});

/**
 * watch
 * When a certain file type changes, run the appropriate task
 */
gulp.task('watch-dev', function watch() {
	gulp.watch('./websrc/**/*.scss', ['css-lint', 'css-process']);
	gulp.watch(assets.jsBodyCustom, ['js-lint']);
	gulp.watch(['./websrc/index.html', './websrc/assets.json'], ['index-dev', browserReload]);
	gulp.watch(['./websrc/img/**.*'], ['img-min']);
});

/**
 * server
 * Run the node server in a dev mode that restart server when certain files change
 */
gulp.task('server-dev', ['css-process', 'img-min', 'index-dev', 'watch-dev'], function server(cb) {
	var called = false;
	return nodemon({
		script: './server/server.js',
		ignore: [
			'webroot/',
			'websrc/',
		],
		watch: ['server/'],
		ext: 'js json',
		delay: 1,
		env: {'NODE_ENV': process.env.NODE_ENV || 'development'}
	})
	.on('start', function onStart() {
		if (!called) {
			cb();
		}
		called = true;
	})
	.on('change', ['watch-dev'])
	.on('restart', function onRestart() {
		setTimeout(function delayedBSReload() {
			browserReload({
				stream: false
			});
		}, 500); // .5 sec delay
	});
});

/**
 * browser-sync
 * Reload/update browser on changes
 */
gulp.task('browser-sync', ['server-dev'], function syncServer() {
	setTimeout (function delayedBSStart() {
		browserSync({
			proxy: 'http://localhost:3000',
			port: 8000,
			files: ['./webroot/**/*.css', './webroot/**/*.js', './webroot/**/*.html'],
			notify: false,
			reloadDebounce: 200,
			open: 'external'
		});
	}, 500);
});

/**
 * docs
 * Create automatically generated documentation
 */
gulp.task('docs-angular', function docsAngular() {
	return gulp.src('./webroot/app/**/*.js')
		.pipe(gulpDocs.process())
		.pipe(gulp.dest('./docs/angular/'));
});

gulp.task('docs-node', function docsNode() {
	return gulp.src('./server/**/*.js')
		.pipe(jsdoc('./docs/node/'));
})

/**
 * SHORTCUT COMMANDS
 * =================
 */

/**
 * js-lint
 * All javascript linting in one command
 */
gulp.task('js-lint', ['js-style', 'js-hint', 'js-typecheck']);

/**
 * lint
 * All linting in one command
 */
gulp.task('lint', ['js-lint', 'css-lint']);

/**
 * test
 * All testings in one command
 */
gulp.task('test', ['js-server-test']);

/**
 * js-min
 * All javascript minification in one command
 */
gulp.task('js-min', ['js-head-min', 'js-body-min']);

/**
 * min
 * All minification in one command
 */
gulp.task('min', ['js-head-min', 'js-body-min', 'css-min']);

/**
 * dev
 * All development mode tasks in one command
 */
gulp.task('dev', ['lint', 'test', 'browser-sync']);

/**
 * prod
 * All production mode tasks in one command
 */
gulp.task('prod', ['index-prod']);

/**
 * docs
 * Generated both angular and node documentation
 */
gulp.task('docs', ['docs-angular', 'docs-node']);

/**
 * default
 * Command to run if no task is specified
 */
gulp.task('default', ['dev']);
