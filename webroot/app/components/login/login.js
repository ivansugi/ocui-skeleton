'use strict';

angular
	.module('app.component.login', [])

	.controller('LoginController', function loginController($modalInstance, ocuiAuthService, authService,
			$state, $rootScope) {

		var vm = this;
		vm.input = {
			username: '',
			password: ''
		};
		vm.submit = function submit(input) {
			console.log('input:', input);
			ocuiAuthService.login(input).then(function loginSuccess (data) {
				console.log('data:', data);
				vm.input.password = '';
				// Store JWT token from server, needed by angular-jwt
				localStorage.setItem('id_token', data.id_token);
				localStorage.setItem('roles', data.roles);
				console.log('roles:', data.roles);
				// Trigger event from angular-http-auth
				authService.loginConfirmed(data);

				$rootScope.user = data;
				console.log('authService', authService);
				localStorage.setItem('roles', JSON.stringify(data.roles));
				$state.go('dashboard', {studyId: data.roles[0].studyOID});
				//$state.go('dashboard', {studyId: data.activeStudy});
				$modalInstance.dismiss();
			}, function loginFailed (error) {
				// Trigger event from angular-http-auth
				authService.loginCancelled(JSON.parse(error.message), 'loginFailure');
				console.log('error:', data);

			});
		};
		vm.close = function close() {
			$modalInstance.close();
		};
		vm.dismiss = function dismiss() {
			$modalInstance.dismiss();
		};
	});
