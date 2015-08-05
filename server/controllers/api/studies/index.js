'use strict';

var studySvc = require('../../../service/study.js');

module.exports = {
	show: function studiesShow(req, res) {
		studySvc.get(req.params.id, function studyGet(status, data) {
			res.status(status).send(data);
		});
	}
};
