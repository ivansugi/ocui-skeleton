'use strict';

angular
	.module('app.service.loghttp', [])
	.factory('logHttpService', function logHttpService($window) {
		return {
			postLog: function postLog(message) {
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/api/clientlogger', true);
				xhr.setRequestHeader('content-type', 'application/json;charset=utf-8');
				xhr.send(JSON.stringify({
					url: $window.location.href,
					userAgent: window.navigator.userAgent,
					width: window.screen.width,
					height: window.screen.height,
					message: message
				}));
			}
		};
	});
