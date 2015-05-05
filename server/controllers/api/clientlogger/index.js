'use strict';

var moment = require('moment');
var chalk = require('chalk');

module.exports = {
	create: function clientloggerCreate(req, res) {
		console.error(chalk.gray('-------------------------------------------------------------------------------'));
		console.error(chalk.white.bgRed.bold('CLIENT LOG:'));
		console.error(chalk.blue('Timestamp:'), moment().format('YYYY-MM-DD HH:mm:ss:SSS'));
		console.error(chalk.blue('Agent:'), req.body.userAgent);
		console.error(chalk.blue('Dimensions:'), req.body.width + 'x' + req.body.height);
		console.error(chalk.red(req.body.message));
		console.error(chalk.gray('-------------------------------------------------------------------------------'));
		res.send(200, 'OK');
	}
};
