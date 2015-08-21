'use strict';

var request = require('request');
var conf = require('../conf.js');

conf.load();

module.exports = {
	get: function getUserRolesFromUsername(usernamePassObj, cb) {
		request.post(
			{
				url: conf.get('authUrl') + conf.get('authenticationPath'),
				json: usernamePassObj
			}, 
			function optionalCallback(err, httpResponse, body) {
				if (err) {
					console.error('Unsuccessful authentication:', error);
					cb(response.statusCode, error);
				}
				console.log('Authentication successful!  Server responded with:', body);
				var result = JSON.parse(JSON.stringify(body));
				console.log('result:', result);
				cb(200, result);

			});
	}
};
