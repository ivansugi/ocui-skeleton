'use strict';

var jwt = require('jsonwebtoken');
var conf = require('./conf.js');

conf.load();

module.exports = {
	index: function(request, response) {
		response.send('index');
	},
	show: function(request, response) {
		response.send('show');
	},
	new: function(request, response) {
		response.send('new');
	},
	create: function(request, response) {
		response.send('create');
	},
	edit: function(request, response) {
		response.send('edit');
	},
	update: function(request, response) {
		response.send('update');
	},
	destroy: function(request, response) {
		response.send('delete');
	}
}
