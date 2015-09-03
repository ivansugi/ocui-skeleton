'use strict';

var conf = require('../../../conf.js');
var httpClient = require('../../../service/httpClient');

conf.load();

module.exports = {
	create: function followupCreate(req, res) {

		var payload = {};
		payload.EntityID = req.body.studyEventOID;
		payload.Ordinal = '1';
		payload.EntityName = 'start_date';
		payload.SS_OID = req.body.studySubjectOID;
		payload.NoteType = 'Query';
		payload.Status = req.body.status;
		payload.AssignedUser = '';
		payload.Owner = '';
		payload.Description = 'Follow-Up';
		payload.DetailedNote = req.body.message;
		payload.DN_Id = req.body.parentId;

		return httpClient.post(
            req,
            {
                url : conf.get('authUrl') + '/pages/auth/api/v1/discrepancynote/dnote',
    			headers : {
	    			'Accept': 'application/json'
		    	},
			    json: payload
    		}
        ).then(
            function getFollowUpSuccess(data) {
                if (data.response.statusCode === 200 ||
                        (data.response.statusCode >= 400 && data.response.statusCode < 500)) {
                    res.status(data.response.statusCode).json(data.body);
                } else {
                    res.status(500).send('Unable to get followups metadata, please contact website administrator');
                }
            },
            function getFollowUpFailed(data) {
                res.status(500).send('Unable to get followups metadata, please contact website administrator');

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
