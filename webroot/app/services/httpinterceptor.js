'use strict';

angular
	.module('app.service.httpinterceptor', [])
	.factory('httpInterceptor', function httpInterceptor($q) {
		return {
			request: function httprequest(config) {
				config.headers['X-Request-Timestamp'] = new Date().toISOString();
				return config || $q.when(config);
			},
			requestError: function httprequestError(rejection) {
				return $q.reject(rejection);
			},
			response: function httpresponse(response) {
				return response || $q.when(response);
			},
			responseError: function httpresponseError(rejection) {
				return $q.reject(rejection);
			}
		};
	});
