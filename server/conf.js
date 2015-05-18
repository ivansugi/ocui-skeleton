'use strict';

var nconf = require('nconf');
var chalk = require('chalk');

module.exports = {
	load: function getConf() {
		var homedir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
		var env = process.env.NODE_ENV || 'development';
		var appName = 'ocui';
		var isNotProduction = (env === 'development' || env === 'local');
		nconf
			.overrides()
			.env()
			.argv()
			.file({file: homedir + '/.config' + '/' + appName + '/' + env + 'ConfigOverrides.json'})
			.file({file: '../config/' + env + 'Config.json'})
			.defaults({
				PORT: 3000,
				siteProtocol: 'http',
				siteHost: 'localhost',
				compressionThreshold: 512,
				cookieSecret: 'CookieSecret',
				jwtSecret: 'TokenSecret'
			});
	},
	get: function get(key) {
		return nconf.get(key);
	},
	outputToLog: function outputToLog() {
		console.log(chalk.yellow('Current config:'));
		console.log('-------------------------------------------------------------------------------');
		console.dir(nconf.get());
		console.log('-------------------------------------------------------------------------------');
	}
}