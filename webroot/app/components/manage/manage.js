'use strict';

angular
	.module('app.component.manage', [])
	.controller('ManageController', [function MySettingsController() {
		var vm = this;
		vm.mysettings = {};
	}]);
