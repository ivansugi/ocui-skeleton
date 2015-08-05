'use strict';

var jwt = require('jsonwebtoken');
var authSvc = require('../../../service/authenticate.js');

module.export = {
	create: function tokenCreate(req, res) {
		console.log('req.body:', req.body);
		authSvc.get(req.body.username, function authGet(status, data) {
			res.status(status).send(data);
		});
	}
};
