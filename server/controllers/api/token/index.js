'use strict';

var jwt = require('jsonwebtoken');
var conf = require('./conf.js');

conf.load();

module.exports = {
	index: function(req, res) {
		res.send('index');
	},
	show: function(req, res) {
		res.send('show');
	},
	new: function(req, res) {
		res.send('new');
	},
	create: function(req, res) {
		res.send('create');
	},
	edit: function(req, res) {
		res.send('edit');
	},
	update: function(req, res) {
		res.send('update');
	},
	destroy: function(req, res) {
		res.send('delete');
	}
};
