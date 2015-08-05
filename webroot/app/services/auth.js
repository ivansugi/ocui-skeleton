'use strict';

angular
	.module('app.service.auth', [])
	.factory('authService', function authService($http) {
		return {
			isAuthenticated: function isAuthenticated() {

			},
			login: function login(input, cb) {
				$http.post('/api/tokens', input)
					.success(function postAuthSuccess(data) {
						cb(data);
					})
					.error(function postAuthFail(data, status) {
						cb(data);
					});
			},
			logout: function logout() {

			}
		};
	});
