'use strict';

var jwt = require('jsonwebtoken');

var authSvc = require('../../../service/authenticate.js');
var conf = require('../../../conf.js');
var httpClient = require('../../../service/httpClient.js');

module.exports = {
	create: function tokenCreate(req, res) {
		console.log('req.body:', req.body);

		return authSvc.get(req, req.body).then(
			function authRequestSuccess(data) {
				// Clone.
				var tokenData = JSON.parse(JSON.stringify(data.body));

				// Hide sensitive data from client.
				delete data.body.apiKey;
				delete data.body.password;

				// JWT data.
				var token = jwt.sign(
					tokenData,
					new Buffer(conf.get('AUTH_SECRET'), 'base64'),
					{
						audience: conf.get('AUTH_ID'),
					});
				data.body['id_token'] = token;

				res.status(200).json(data.body);
			},
			function authRequestFailed(data) {
				if (data instanceof httpClient.InvalidSubmissionError) {
					res.status(400).json(data.message);
				} else {
					res.status(500).send('Unable to create access token, please contact website administrator');

					// Log error.
					if (data instanceof Error) {
						console.log(data.stack);
					} else {
						console.log(data);
					}
				}
			});
	}
};

/* vim: set ts=4 sw=4 tw=132 noet: */
