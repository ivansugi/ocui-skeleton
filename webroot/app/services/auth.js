'use strict';

angular
	.module('app.service.auth', [])
	.factory('ocuiAuthService', function ocuiAuthService($http) {
		return {
			isAuthenticated: function isAuthenticated() {

			},
			login: function login(input, cb) {
				return $http.post('/api/tokens', input).then(
					function requestSuccess(response) {
					    console.log('data', response.data);
						return response.data;
					}, function requestFailed(response) {
						console.log('data', response.data);
						if (response.status === 400) {
							throw new Error(response.data);
						} else {
							throw new Error(JSON.stringify({
								unexpected_errors: [response.data]
							}));
						}
					});
			},
			logout: function logout() {

			}
		};
	});
