'use strict';

var studySvc = require('../../../service/study.js');

module.exports = {
	show: function studiesShow(req, res) {
		return studySvc.get(req, req.params.id).then(
			function getStudySuccess(data) {
				if (data.result) {
					res.status(data.response.statusCode).json(data.result);
				} else {
					res.status(data.response.statusCode).json(data.body);
				}
			},
			function getStudyFailed(data) {
				res.status(500).send('Unable to get study metadata, please contact website administrator');

				// Log error.
				if (data instanceof Error) {
					console.log(data.stack);
				} else {
					console.log(data);
				}
			}
		);
	}
};

/* vim: set ts=4 sw=4 tw=132 noet: */
