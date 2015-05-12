'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var errorhandler = require('errorhandler');
var requestLogger = require('morgan');
var compression = require('compression');
var jwt = require('express-jwt');

var path = require('path');
var passport = require('passport');
require('express-resource-new');

var app = module.exports = express();
var server = require('http').createServer(app);

var nconf = require('nconf');
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
		cookieSecret: 'CookieSecret'
	});
console.log('Current config:');
console.log('-------------------------------------------------------------------------------');
console.log(nconf.get());
console.log('-------------------------------------------------------------------------------');

/**
 * Node config
 */
app.set('port', nconf.get('PORT'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('controllers', __dirname + '/controllers');

app.use(compression({
	threshold: nconf.get('compressionThreshold')
}));

app.use(express.static(path.join(__dirname, '../webroot')));

app.use(cookieParser(nconf.get('cookieSecret')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

if (isNotProduction) {
	app.use(requestLogger('dev'));
	app.use(errorhandler());
	app.get('/*', function noCache(req, res, next) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next();
	});
}
else {
	app.use(requestLogger('short'));
}

/**
 * Routes not requiring authentication
 */
app.get('/index.html', function indexRoute(req, res) {
	res.sendFile(path.join(__dirname, '../webroot/index.html'));
});
app.get('/app/*', function browserRoutes(req, res) {
	res.sendFile(path.join(__dirname, '../webroot/index.html'));
});

/**
 * Resources not requiring authentication
 */
app.resource('api/clientlogger');

/**
 * Resources requiring authentication
 */

/**
 * File not found
 */

app.use(function(req, res) {
	res.status(404).sendFile(path.join(__dirname, '../webroot/404.html'));
});

/**
 * Server
 */
server.listen(app.get('port'), function listen() {
	console.log('Server is listening on port %d in %s mode:', nconf.get('PORT'), app.settings.env);
	console.log(nconf.get('siteProtocol') + '://' + nconf.get('siteHost') + ':' + nconf.get('PORT'));
	console.log('-------------------------------------------------------------------------------');
});
