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
				
				console.log('roles:', data.roles);
				// Trigger event from angular-http-auth
				authService.loginConfirmed(data);

				$rootScope.user = data;
				$rootScope.generalActiveStudy = data.roles[0].studyOID;
				console.log('authService', authService);
				localStorage.setItem('roles', JSON.stringify(data.roles));
				localStorage.setItem('role_active',  data.roles[0].studyOID);
				console.log("role_active : ",data.roles[0].studyOID);
				vm.currentStudy = data.roles[0].studyOID;
				$state.go('dashboard', {studyId: localStorage.getItem('role_active')});

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
