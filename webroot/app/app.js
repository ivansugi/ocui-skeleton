'use strict';

angular
	.module('app', [
		'ngResource',
		'ngSanitize',
		'ngAnimate',
		'ngAria',
		'ngMaterial',
		'ngTouch',
		'ui.router',
		'ui.bootstrap.tpls',
		'ui.bootstrap.accordion',
		'ui.bootstrap.modal',
		'ui.bootstrap.rating',
		'ui.grid',
		'mgcrea.ngStrap.datepicker',
		'mgcrea.ngStrap.timepicker',
		'ngStorage',
		'angular-loading-bar',
		'toaster',
		'app.service.loghttp',
		'app.service.exceptionhandler',
		'app.service.httpinterceptor',
		'app.main',
		'app.dialog.content',
		'app.component.dashboard',
		'app.component.manage'
	])
	.config(['$provide', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider',
			function config($provide, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
		$provide.decorator('$log', ['$delegate', 'logHttpService', function $log($delegate, logHttpService) {
			var logError = $delegate.error;
			$delegate.error = function error(message) {
				logError(message);
				logHttpService.postLog(message);
			};
			return $delegate;
		}]);
		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('httpInterceptor');
		$urlRouterProvider.otherwise('/app/dashboard');
		$stateProvider
			.state('dashboard', {
				url: '/app/dashboard',
				templateUrl: '/app/components/dashboard/dashboard.tpl.html',
				controller: 'DashboardController',
				controllerAs: 'dashboard'
			})
			.state('manage', {
				url: '/app/manage',
				templateUrl: '/app/components/manage/manage.tpl.html',
				controller: 'ManageController',
				controllerAs: 'manage'
			});
	}]);
