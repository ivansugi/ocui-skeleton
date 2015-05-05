'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var requestLogger = require('morgan');
var compression = require('compression');

var path = require('path');
var passport = require('passport');
require('express-resource-new');

var app = module.exports = express();
var server = require('http').createServer(app);

var nconf = require('nconf');
nconf
	.overrides()
	.env()
	.argv()
	.file({file: '../config.json'})
	.defaults({});

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'development';
var isNotProduction = (env === 'development' || env === 'local' || env === 'staging');
var compressionThreshold = nconf.get('compressionThreshold') || 512;
var cookieSecret = nconf.get('cookieSecret') || 'CookieSecret';
var siteProtocol = nconf.get('siteProtocol') || 'http';
var siteHost = nconf.get('siteHost') || 'localhost';

/**
 * Config
 */
app.set('port', port);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('controllers', __dirname + '/controllers');

app.use(compression({
	threshold: compressionThreshold
}));

app.use(express.static(path.join(__dirname, '../webroot')));

app.use(cookieParser(cookieSecret));

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

app.use(function(req, res) {
	res.status(404).send('Not Found');
});

/**
 * Server
 */
server.listen(app.get('port'), function listen() {
	console.log('Server is listening on port %d in %s mode:', server.address().port, app.settings.env);
	console.log(siteProtocol + '://' + siteHost + ':' + server.address().port);
	console.log('-------------------------------------------------------------------------------');
});
