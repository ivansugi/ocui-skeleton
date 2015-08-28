'use strict';

var httpClient = require('../service/httpClient.js');
var conf = require('../conf.js');

var localStorage = require('localStorage');
conf.load();

// our own error class
function AuthenticationProviderError(message) {
	this.message = message;
	this.stack = Error().stack;
}
AuthenticationProviderError.prototype = Object.create(Error.prototype);
AuthenticationProviderError.prototype.name = "AuthenticationProviderError";

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
				console.log('checked', data.body);
				console.log('send', usernamePassObj);
				console.log('ret', data.response.statusCode);
				console.log('cookie', data.response.headers['set-cookie'][0]);
				if (data.response.statusCode == 200) {
					console.log('Authentication successful!  Server responded with:', data.body);
					localStorage.setItem("apiKey",data.body.apiKey);
					return {
						cookie: data.response.headers['set-cookie'][0],
						content: data.body
					};
				} else if (data.response.statusCode == 400) {
					console.log('Authentication rejected!  Server responded with:', data.body);
					throw new httpClient.InvalidSubmissionError(JSON.parse(data.body));
				} else {
					console.error('Unexpected response from authentication provider:', data.body);
					throw new AuthenticationProviderError('Unable to perform authentication');
				}
			});
	}
};
