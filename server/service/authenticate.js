'use strict';

var request = require('request');
var conf = require('../conf.js');

conf.load();

module.export = {
	get: function getUserRolesFromUsername(username, cb) {
		console.log('getUsername', username);
		request.get(conf.get('authUrl') + conf.get('authenticationPath') + username, function requestStudy(error, response, body) {
			if (!error && response.statusCode === 200) {
				var result = [];
				result = JSON.parse(body);
				console.log('result:', result);
				cb(200, result);
			}
			else {
				console.error('Unsuccessful authentication:', error);
				cb(response.statusCode, error);
			}
		});
	}
};
