'use strict';

angular
	.module('app.component.login', [])
	.controller('LoginController', function loginController($modalInstance) {
		console.log('inside controller');
		var vm = this;
		vm.input = {
			username: '',
			password: ''
		};
		vm.submit = function submit(input) {
			console.log('test');
		};
		vm.close = function dismiss() {
			$modalInstance.$close();
		}
		vm.dismiss = function dismiss() {
			$modalInstance.$dismiss();
		}
	});
