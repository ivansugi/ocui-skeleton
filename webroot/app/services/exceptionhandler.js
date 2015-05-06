'use strict';

angular
	.module('app.service.exceptionhandler', [])
	.factory('$exceptionHandler', function $exceptionHandler($log) {
		return function exceptionHandler(exception, cause) {
			var lines = [
				'number Code',
				'name Name',
				'message Message',
				'description Message',
				'fileName File',
				'lineNumber Line',
				'columnNumber Column',
				'stack Stack',
			];
			var message = _.map(lines, function(line) {
				var parts = line.split(' ');
				var key = parts[0];
				var label = parts[1];
				var value = exception[key];
				return value ? label + ': ' + value + '\n' : '';
			})
			.join('') + (cause ? 'Cause: ' + cause + '\n' : '');
			$log.error(message);
		};
	});
