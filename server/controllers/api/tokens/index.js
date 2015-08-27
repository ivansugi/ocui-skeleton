'use strict';

var jwt = require('jsonwebtoken');
var authSvc = require('../../../service/authenticate.js');

module.exports = {
	create: function tokenCreate(req, res) {
		console.log('req.body:', req.body);
		authSvc.get(req.body, function authGet(status, data) {
			console.log('req.body:', data);
			res.status(status).send(data);
		});
	}
};
