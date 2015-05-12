'use strict';

angular
	.module('app.component.login', [])
	.controller('LoginController', function loginController() {
		var vm = this;
		vm.input = {
			username: '',
			password: ''
		};
		vm.submit = function submit(input) {
			console.log('test');
		};
	});
