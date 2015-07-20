'use strict';

angular
	.module('app.main', [])
	.controller('MainController', function mainController($state, $modal) {
		var vm = this;
		vm.$state = $state;
		vm.canFullscreen = Modernizr.fullscreen;
		vm.sidenavExpanded = (document.body.clientWidth >= 768) ? true : false;
		vm.toggleSidenav = function toggleSidenav() {
			vm.sidenavExpanded = !vm.sidenavExpanded;
		};
		vm.toggleFullscreen = function toggleFullscreen() {
			if (!document.fullscreenElement &&
					!document.mozFullScreenElement &&
					!document.webkitFullscreenElement &&
					!document.msFullscreenElement) {
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		};
		vm.openContent = function openContent(size, contentFile) {
			$modal.open({
				templateUrl: '/app/dialogs/' + contentFile,
				controller: 'ContentModalController',
				size: size,
				resolve: {
				}
			});
		};
		vm.currentStudy = 'S_MICU';
	});
