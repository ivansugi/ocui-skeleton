'use strict';

angular
	.module('app.component.manage', [])
	.controller('ManageController', function manageController(toaster) {
		var vm = this;
		var ua = navigator.userAgent;
		vm.isAndroidBrowser = (ua.indexOf('Android') > -1) && (ua.indexOf('AppleWebKit') > -1) && (ua.indexOf('Chrome') === -1);
		vm.isSamsungBrowser = (ua.indexOf('Android') > -1) && (ua.indexOf('AppleWebKit') > -1) && (ua.indexOf('SAMSUNG') > -1);
		vm.studyChanged = function(newStudy) {
			toaster.pop({
				type: 'success',
				title: 'Study changed',
				body: 'Study changed to: <strong>' + newStudy + '</strong>',
				bodyOutputType: 'trustedHtml'
			});
		};
		toaster.pop({
			type: 'info',
			title: 'What is this page for?',
			body: 'This page gives you the ability to switch between MICU and Oncology studies.' +
				'You would only see the link if you have permissions.',
			bodyOutputType: 'trustedHtml'
		});
	});
