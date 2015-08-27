'use strict';

var jwtSecret = 'TokenSecret';
angular
	.module('app.component.login', [])
	.controller('LoginController', function loginController($modalInstance, authService, $state, $window) {
		var vm = this;
		vm.input = {
			username: '',
			password: ''
		};
		vm.submit = function submit(input) {
			console.log('input:', input);
			authService.login(input, function loginAuth(data) {
				 // If login is successful, redirect to the users state
				// var token = jwt.sign(data, jwtSecret);
				console.log('data:', data);
				
				$window.sessionStorage.token = data.token;
				$state.go('dashboard',{studyId:'S_MSCMICU'});
				$modalInstance.dismiss();
				//res.redirect("/");
				//console.log('token:', token);
			});
		};
		vm.close = function close() {
			$modalInstance.close();
		};
		vm.dismiss = function dismiss() {
			$modalInstance.dismiss();
		};
	});
