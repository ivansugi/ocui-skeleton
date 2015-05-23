'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var errorhandler = require('errorhandler');
var requestLogger = require('morgan');
var compression = require('compression');
var chalk = require('chalk');
var path = require('path');
var ejwt = require('express-jwt');
require('express-resource-new');
var app = module.exports = express();
var server = require('http').createServer(app);

var env = process.env.NODE_ENV || 'development';
var isNotProduction = (env === 'development' || env === 'local');

var conf = require('./conf.js');
conf.load();
conf.outputToLog();

/**
 * Node config
 */
app.set('port', conf.get('PORT'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('controllers', __dirname + '/controllers/');

app.use(compression({
	threshold: conf.get('compressionThreshold')
}));

var webroot = path.join(__dirname, '../webroot');
app.use(express.static(webroot));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
app.get('/app/*',
	function browserRoutes(req, res) {
		res.sendFile('index.html', {root: webroot});
	}
);

/**
 * Resources not requiring authentication
 */
app.resource('api/clientlogger');

/**
 * Resources requiring authentication
 */
app.resource('api/studies', {id: 'id'});


/**
 * File not found
 */
app.use(function(req, res) {
	res.status(404).sendFile('404.html', {root: webroot});
});

/**
 * Server
 */
server.listen(app.get('port'), function listen() {
	console.log('Server is listening on port %d in %s mode:', conf.get('PORT'), app.settings.env);
	console.log(chalk.magenta(conf.get('siteProtocol') + '://' + conf.get('siteHost') + ':' + conf.get('PORT')));
	console.log('-------------------------------------------------------------------------------');
});
