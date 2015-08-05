'use strict';

angular
	.module('app.component.login', [])
	.controller('LoginController', function loginController($modalInstance, authService) {
		var vm = this;
		vm.input = {
			username: '',
			password: ''
		};
		vm.submit = function submit(input) {
			console.log('input:', input);
			authService.login(input, function loginAuth(data) {
				console.log('data:', data);
			});
		};
		vm.close = function close() {
			$modalInstance.close();
		};
		vm.dismiss = function dismiss() {
			$modalInstance.dismiss();
		};
	});
