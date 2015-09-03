'use strict';

/*
 * Create HttpClient for OC rest API.
 */

var request = require('request');
request.debug = true;

// Our own error classes.
function ConnectionError(message) {
	this.message = message;
	this.stack = Error().stack;
}
ConnectionError.prototype = Object.create(Error.prototype);
ConnectionError.prototype.name = 'ConnectionError';

function InvalidSubmissionError(message) {
	this.message = message;
	this.stack = Error().stack;
}
InvalidSubmissionError.prototype = Object.create(Error.prototype);
InvalidSubmissionError.prototype.name = 'InvalidSubmissionError';

function createRequest(method, req, options) {
	if (req.user && req.user.apiKey) {
		// Use apiKey from OC, stored in JWT (client side), to authenticate
		// to OC.
		var username = req.user.apiKey;
		var auth = 'Basic ' + new Buffer(username + ':').toString('base64');
		options.headers = options.headers || {};
		options.headers['Authorization'] = auth;
	}

	return new Promise(function promiseWorker(resolve, reject) {
		request[method](
			options,
			function requestCallback(error, response, body) {
				if (error) {
					reject(new ConnectionError(error));
				} else {
					resolve({response: response, body: body});
				}
			});
	});
}

module.exports = {
	ConnectionError: ConnectionError,
	InvalidSubmissionError: InvalidSubmissionError,

	get: function(req, data) { return createRequest('get', req, data); },
	post: function(req, data) { return createRequest('post', req, data); }
};

/* vim: set ts=4 sw=4 tw=132 noet: */
