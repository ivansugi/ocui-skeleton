'use strict';

var conf = require('../conf.js');
var httpClient = require('../service/httpClient.js');

conf.load();

// Our own error classes.
function AuthenticationProviderError(message) {
	this.message = message;
	this.stack = Error().stack;
}
AuthenticationProviderError.prototype = Object.create(Error.prototype);
AuthenticationProviderError.prototype.name = 'AuthenticationProviderError';

module.exports = {
	AuthenticationProviderError: AuthenticationProviderError,

	get: function getUserRolesFromUsername(req, usernamePassObj) {
		return httpClient.post(req, {
			url: conf.get('authUrl') + conf.get('authenticationPath'),
			//this should be json
			json: usernamePassObj,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(
			function requestSuccess(data) {
				if (data.response.statusCode === 200) {
					console.log('Authentication successful!  Server responded with:', data.body);
					if (typeof data.body !== 'object') {
						data.body = JSON.parse(data.body);
					}
					return data;
				} else if (data.response.statusCode === 400) {
					console.log('Authentication rejected!  Server responded with:', data.body);
					throw new httpClient.InvalidSubmissionError(JSON.parse(data.body));
				} else {
					console.error('Unexpected response from authentication provider:', data.body);
					throw new AuthenticationProviderError('Unable to perform authentication');
				}
			});
	}
};

/* vim: set ts=4 sw=4 tw=132 noet: */
