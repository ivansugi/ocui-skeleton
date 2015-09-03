/*
 * Gulp configuration on the module level.
 */

'use strict';

module.exports = {assets: {}};

module.exports.assets.jsBuild = [
	__dirname + '/index.js'];

module.exports.assets.jsTests = [];

module.exports.assets.jsDevel = Array.concat(
	module.exports.assets.jsBuild,
	module.exports.assets.jsTests, [
		__dirname + '/gulpConfig.js'
	]);

module.exports.unittest = function(gulp, plugins, helper) {
	var namespace = 'server_controllers_api_tokens';
	var testsTasks = [];
	var develTasks = [];

	helper.createGulpTaskMocha('test-' + namespace,
			module.exports.assets.jsTests);
	testsTasks.push('test-' + namespace);

	helper.createGulpTaskJscs('js-style-' + namespace,
			module.exports.assets.jsDevel);
	develTasks.push('js-style-' + namespace);

	helper.createGulpTaskJshint('js-hint-' + namespace,
			module.exports.assets.jsDevel);
	develTasks.push('js-hint-' + namespace);

	helper.createGulpTaskFlowType('js-typecheck-' + namespace,
			module.exports.assets.jsDevel);
	develTasks.push('js-typecheck-' + namespace);

	gulp.task('watch-' + namespace, function() {
		plugins.watch(
			module.exports.assets.jsTests,
			{
				read: false,
				readDelay: 5000
			},
			function() {
				gulp.start(testsTasks);
			});
		plugins.watch(
			module.exports.assets.jsDevel,
			{
				read: false,
				readDelay: 5000
			},
			function() {
				gulp.start(develTasks);
			});
	});

	return Array.concat(testsTasks, develTasks, ['watch-' + namespace]);
};

/* vim: set ts=4 sw=4 tw=132 noet: */
