'use strict';

angular
	.module('app.service.loghttp', [])
	.factory('logHttpService', ['$window', function logHttpService($window) {
		return {
			postLog: function postLog(message) {
				_.defer(function() {
					try {
						$.post('/api/clientlogger', {
							url: $window.location.href,
							userAgent: window.navigator.userAgent,
							width: window.screen.width,
							height: window.screen.height,
							message: message
						});
					} catch (e) {}
				});
			}
		};
	}]);
