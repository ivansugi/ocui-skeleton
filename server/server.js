'use strict';

// polyfill for promise
require('es6-promise').polyfill();
var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var requestLogger = require('morgan');
var compression = require('compression');
var chalk = require('chalk');
var path = require('path');
var jwt = require('express-jwt');
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
app.set('controllers', __dirname + '/controllers/');

var authenticate = jwt({
	secret: new Buffer(conf.get('AUTH_SECRET'), 'base64'),
	audience: conf.get('AUTH_ID')
});

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
	app.all('/*', function noCache(req, res, next) {
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

app.resource('api/tokens', function(){});

/**
 * Resources requiring authentication
 */
app.use('/api/studies', authenticate);
app.resource('api/studies', {id: 'id'});

app.use('/api/followups', authenticate);
app.resource('api/followups', function(){});


/**
 * File not found
 */
app.use(function(req, res) {
	console.error(chalk.red('NOT FOUND:'));
	console.error(chalk.red(' req.method:', req.method));
	console.error(chalk.red(' req.url:', req.url));
	if (req.body && (Object.keys(req.body).length > 0)) {
		console.error(chalk.red(' req.body:'), req.body);
	}
	if (req.url.indexOf('/app/') > -1) {
		res.status(404).sendFile('404.html', {root: webroot});
	} else {
		res.status(404).send(JSON.stringify({error: 'not found'}));
	}
});

/**
 * Server
 */
server.listen(app.get('port'), function listen() {
	console.log('Listening on port %d in %s mode:', conf.get('PORT'), app.settings.env);
	console.log(chalk.magenta(conf.get('siteProtocol') + '://' + conf.get('siteHost') + ':' + conf.get('PORT')));
	console.log('-------------------------------------------------------------------------------');
});
