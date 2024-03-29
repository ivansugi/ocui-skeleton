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
		'ui.bootstrap.modal',
		'ui.bootstrap.accordion',
		'ui.bootstrap.dropdown',
		'ui.bootstrap.position',
		'ui.bootstrap.tooltip',
		'trNgGrid',
		'angular-loading-bar',
		'toaster',
		'http-auth-interceptor',
		'angular-jwt',
		'monospaced.elastic', // for textarea auto-expansion
		'app.service.loghttp',
		'app.service.exceptionhandler',
		'app.service.httpinterceptor',
		'app.service.auth',
		'app.service.study',
		'app.main',
		'app.dialog.content',
		'app.component.dashboard',
		'app.component.manage',
		'app.component.login'
	]).factory('AuthInterceptor', ['$window', '$q', '$injector', function ($window, $q, $injector) {
	 return {
	  responseError: function (response) { 
	   if(response.status === 401){
		$window.location = '/app/login';
	   }else if(response.status === 403){
		$('.modal').modal('hide');
		$injector.get('$state').transitionTo('forbidden');
	   }
	   return $q.reject(response);
	  }
	 };
	}]).factory('ResponseInterceptor', ['$window', '$q', '$injector', function ($window, $q, $injector) {
	 return {
	  responseError: function (response) { 
	  //TODO : add with 500 error page
	   if(response.status === 500){
		$window.location = '/app/login';
	   }
	   return $q.reject(response);
	  }
	 };
	}])
	.config(function config(
			$provide,
			$locationProvider,
			$httpProvider,
			$stateProvider,
			$urlRouterProvider,
			$mdThemingProvider,
			jwtInterceptorProvider,
			cfpLoadingBarProvider
	) {
		$provide.decorator('$log', function $log($delegate, logHttpService) {
			// var logError = $delegate.error;
			$delegate.error = function error(message) {
				//console.error(message);
				logHttpService.postLog(message);
			};
			return $delegate;
		});
		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('httpInterceptor');
		jwtInterceptorProvider.tokenGetter = [function(myService) {
			return localStorage.getItem('id_token');
		}];
		$httpProvider.interceptors.push('jwtInterceptor');
		$mdThemingProvider.definePalette('dark-grey', {
			'50': '999999',
			'100': '888888',
			'200': '777777',
			'300': '666666',
			'400': '555555',
			'500': '444444',
			'600': '333333',
			'700': '222222',
			'800': '111111',
			'900': '000000',
			'A100': '888888',
			'A200': '777777',
			'A400': '555555',
			'A700': '222222',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': ['50', '100', '200', '300', 'A100', 'A200'],
			'contrastLightColors': undefined
		});
		$mdThemingProvider.definePalette('clinica-blue', {
			'50': 'e3eefa',
			'100': 'd3deea',
			'200': 'bacbdd',
			'300': '9db6cf',
			'400': '89a7c5',
			'500': '7699bd',
			'600': '6b8bac',
			'700': '5f7c99',
			'800': '536c86',
			'900': '3d5062',
			'A100': 'd3deea',
			'A200': 'bacbdd',
			'A400': '89a7c5',
			'A700': '5f7c99',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': ['50', '100', '200', '300', 'A100', 'A200'],
			'contrastLightColors': undefined
		});
		$mdThemingProvider.definePalette('open-orange', {
			'50': 'fdeee1',
			'100': 'fbd7b9',
			'200': 'f9c08f',
			'300': 'f7a661',
			'400': 'f59340',
			'500': 'f58220',
			'600': 'de761d',
			'700': 'c7691a',
			'800': 'ae5c16',
			'900': '804410',
			'A100': 'fbd7b9',
			'A200': 'f9c08f',
			'A400': 'f59340',
			'A700': 'c7691a',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': ['50', '100', '200', '300', 'A100', 'A200'],
			'contrastLightColors': undefined
		});
		 $httpProvider.interceptors.push('AuthInterceptor');
		 $httpProvider.interceptors.push('ResponseInterceptor');
		$mdThemingProvider.theme('default')
			.primaryPalette('clinica-blue')
			.accentPalette('open-orange');
		cfpLoadingBarProvider.includeSpinner = false;
		$urlRouterProvider.otherwise('/app/dashboard/'+ localStorage.getItem('role_active'));
		$stateProvider
			.state('dashboard', {
				url: '/app/dashboard/:studyId',
				controller: 'DashboardController',
				controllerAs: 'dashboard',
				templateUrl: '/app/components/dashboard/dashboard.tpl.html'
			})
			.state('manage', {
				url: '/app/manage',
				controller: 'ManageController',
				controllerAs: 'manage',
				templateUrl: '/app/components/manage/manage.tpl.html'
			})
			.state('login', {
				url: '/app/login',
				onEnter: function loginModalEnter($modal) {
					$modal.open({
						controller: 'LoginController',
						controllerAs: 'login',
						templateUrl: '/app/dialogs/login.tpl.html',
						size: 'sm',
						resolve: {

						}
					})
					.result.finally(function loginModalResultFinally() {
						console.log('inside finally');
					});
				}
			}).state(
				'logout', {
					url:'/app/logout',
					onEnter:function destroy($state) {
						console.log('inside finally');
						this.currentStudy = "";
						localStorage.clear();
						$state.go('login');
					}
				}
			)
			.state('forgot', {
				url: '/app/forgot',
				onEnter: function forgotModalEnter($modal) {
					$modal.open({
						controller: 'LoginController',
						controllerAs: 'login',
						templateUrl: '/app/dialogs/forgot.tpl.html',
						size: 'sm',
						resolve: {

						}
					})
					.result.finally(function loginModalResultFinally() {
						console.log('inside finally');
					});
				}
			});
	})
	.run(function() {
		TrNgGrid.defaultPagerMinifiedPageCountThreshold = 5;
	})
	.constant('SOUNDS', {
		click: new Howl({
			urls: ['/media/click.ogg']
		}),
		popup: new Howl({
			urls: ['/media/popup.ogg']
		}),
		success: new Howl({
			urls: ['/media/success.ogg']
		}),
		warning: new Howl({
			urls: ['/media/warning.ogg']
		}),
		error: new Howl({
			urls: ['/media/error.ogg']
		})
	});
