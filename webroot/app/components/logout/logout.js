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
		vm.load =function submit(input) {
			$state.go('login');
			localStorage.clear();
		}
	});
