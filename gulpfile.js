/*! gulpfile.js */

var exec = require('child_process').exec;
var webbuild = require('gulp-webbuild');
var gulp = webbuild.gulp;
var buildJs = webbuild.buildJs;
var buildCss = webbuild.buildCss;
var buildMove = webbuild.buildMove;
var buildInject = webbuild.buildInject;
var buildFileSys = webbuild.buildFileSys;

// project
var proj = 'C:/Voliware/Web/WebUtil/';

// source
var src = {};
src.root = proj;
buildFileSys(src, 'src');

// dist
var dist = {};
dist.root = proj;
buildFileSys(dist, 'dist');

/**
 * Build the util module
 * @returns {*}
 */
function buildUtil(){
	var js = [
		src.src.js + 'util.js',
		src.src.js + 'util-jquery.js',
		src.src.js + 'eventSystem.js',
		src.src.js + 'manager.js',
		src.src.js + 'pool.js'
	];
	buildJs(js, dist.dist.js, 'util');

	return buildCss(src.src.css + 'util.css', dist.dist.css, 'util');
}

/**
 * Build js doc
 */
function buildJsDoc(){
	var cmd = 'jsdoc -c conf.json';
	return exec(cmd, function(error, stdout, stderr) {
		console.log('js doc done');
	});
}

// tasks
gulp.task('all', function(){
	buildJsDoc();
	return buildUtil();
});

gulp.task('util', function(){
	return buildUtil();
});

gulp.task('jsdoc', function(){
	buildJsDoc();
});