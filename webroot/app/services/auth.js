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
	}).factory('authinterceptor', function ($rootScope, $q, $window) {
		  return {
			request: function (config) {
			  config.headers = config.headers || {};
			  if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			  }
			  return config;
			},
			response: function (response) {
			  if (response.status === 401) {
				// handle the case where the user is not authenticated
			  }
			  return response || $q.when(response);
			}
		  };
		});
