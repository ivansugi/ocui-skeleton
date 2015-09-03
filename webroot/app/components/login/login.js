'use strict';

angular
	.module('app.component.login', [])
	.controller('LoginController', function loginController($modalInstance, ocuiAuthService, $state) {
		var vm = this;
		vm.input = {
			username: '',
			password: ''
		};
		vm.submit = function submit(input) {
			console.log('input:', input);
			ocuiAuthService.login(input).then(function loginSuccess (data) {
				if (data === void(0)) { return }
				console.log('data:', data);

				vm.input.password = '';
				$state.go('dashboard', {studyId: data.activeStudy});
				vm.dismiss();
			}, function loginFailed(error) {});
		};
		vm.close = function close() {
			$modalInstance.close();
		};
		vm.dismiss = function dismiss() {
			$modalInstance.dismiss();
		};
	});
