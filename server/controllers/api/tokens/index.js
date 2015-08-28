'use strict';

var jwt = require('jsonwebtoken');
var authSvc = require('../../../service/authenticate.js');
var httpClient = require('../../../service/httpClient.js');
var conf = require('../../../conf.js');

module.exports = {
	create: function tokenCreate(req, res) {
		console.log('req.body:', req.body);
		return authSvc.get(req, req.body).then(
			function authRequestSuccess(data) {
				// JWT data
				var tokenData = JSON.parse(JSON.stringify(data.content));
				delete data.content.apiKey;
				delete data.content.password;

				// Temporary replacement for apiKey
				var cookie_split = /JSESSIONID=(\w+); Path=([\w\/]+)/.exec(data.cookie);
				tokenData.sessionCookieValue = cookie_split[1];
				tokenData.sessionCookieUrl = conf.get('authUrl') + cookie_split[2];

				var token = jwt.sign(
					tokenData,
					new Buffer(conf.get('AUTH_SECRET'), 'base64'),
					{
						audience: conf.get('AUTH_ID'),
					});

				data.content.id_token = token;
				res.status(200).json(data.content);
			},
			function authRequestFailed(data) {
				if (data instanceof httpClient.InvalidSubmissionError) {
					res.status(400).json(data.message);
				}
				else {
					res.status(500).send('Unable to create access token, please contact website administrator');

					// Log error.
					if (data instanceof Error) {
						console.log(data.stack);
					} else {
						console.log(data);
					};
				}
			});
	}
};
