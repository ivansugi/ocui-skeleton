'use strict';

var conf = require('../../../conf.js');
var request = require('request');

conf.load();


module.exports = {
	create: function followupCreate(req, res) {

		var payload = {};
		payload.EntityID = req.body.studyEventOID;
		payload.Ordinal = "1";
		payload.EntityName = "start_date";
		payload.SS_OID = req.body.studySubjectOID;
		payload.NoteType = "Query";
		payload.Status = req.body.status;
		payload.AssignedUser = "";
		payload.Owner = "";
		payload.Description = "Follow-Up";
		payload.DetailedNote = req.body.message;
		payload.DN_Id = req.body.parentId;

		//TODO: pass in APIKEY of logged in user
		var username = "2870f236b393493dba48ad7fb4d38571";
		var auth = "Basic " + new Buffer(username + ":").toString("base64");
		request(
		{
			url : conf.get('authUrl') + '/pages/auth/api/v1/discrepancynote/dnote',
			headers : {
				"Authorization" : auth
			},
			method: 'POST',
			json: payload
		},function (error, response, body) {
			if (error) {
				//TODO: do something
				return console.error('failed:', error);
			}
			console.log('successful');
			res.writeHead(200, { 'Content-Type': 'text/plain'});
			res.end();
		})
	}
};

