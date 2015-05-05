'use strict';

angular
	.module('app.service.httpinterceptor', [])
	.factory('httpInterceptor', ['$q', function httpInterceptor($q) {
		return {
			// On request success
			request: function httprequest(config) {
				config.headers['X-Request-Timestamp'] = new Date().toISOString();
				return config || $q.when(config);
			},
			// On request failure
			requestError: function httprequestError(rejection) {
				// if (canRecover(rejection)) {
				//  return responseOrNewPromise;
				// }
				return $q.reject(rejection);
			},
			// On response success
			response: function httpresponse(response) {
				return response || $q.when(response);
			},
			// On response failture
			responseError: function httpresponseError(rejection) {
				// if (canRecover(rejection)) {
				//  return responseOrNewPromise;
				// }
				return $q.reject(rejection);
			}
		};
	}]);
