'use strict';

angular
	.module('app.service.auth', [])
	.factory('ocuiAuthService', function ocuiAuthService($http, $rootScope, authService, $state) {
		return {
			isAuthenticated: function isAuthenticated() {
				return !!$rootScope.user;
			},
			login: function login(input, cb) {
				return $http.post('/api/tokens', input).then(
					function requestSuccess(response) {
					    console.log('data', response.data);
						if (response === void(0)) { return }

						// Store JWT token from server, needed by angular-jwt
						localStorage.setItem('id_token', response.data.id_token);
						delete response.data.id_token;
						localStorage.setItem('roles', JSON.stringify(response.data.roles));

						if (!response.data.activeStudy && response.data.roles.length) {
							response.data.activeStudy = response.data.roles[0].studyOID;
						}
						localStorage.setItem('role_active',  response.data.activeStudy);

						$rootScope.user = response.data;
						// Trigger event from angular-http-auth
						authService.loginConfirmed(response.data);

						return response.data;
					}, function requestFailed(response) {
						console.log('data', response.data);
						var message;

						if (response.status == 400) {
							message = JSON.parse(response.data);
						} else {
							message = {unexpected_errors: [response.data]};
						}

						$rootScope.user = null;
						localStorage.clear();
						// Trigger event from angular-http-auth
						authService.loginCancelled(message, 'loginFailure');
					});
			},
			logout: function logout() {
				$rootScope.user = null;
				localStorage.clear();
				// Trigger event from angular-http-auth
				authService.loginCancelled(null, 'logout');
				$state.go('login');
			}
		};
	});

/* vim: set ts=4 sw=4 tw=132 noet: */
