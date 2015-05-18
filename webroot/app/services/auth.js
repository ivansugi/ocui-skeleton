'use strict';

angular
	.module('app.service.auth', [])
	.factory('authService', function authService($http) {
		return {
			isAuthenticated: function isAuthenticated() {

			},
			login: function login(input) {
				$http.post('/api/authenticate', input)
				.then(function authenticateThen() {

				});
			},
			logout: function logout() {

			}
		};
	});
