'use strict';

var studySvc = require('../../../service/study.js');

module.exports = {
	show: function showStudy(req, res) {
		studySvc.get(req.params.id, function(studyData) {
			res.status(200).send(studyData);
		});
	}
};
