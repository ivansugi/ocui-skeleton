'use strict';

angular
	.module('app.component.manage', [])
	.controller('ManageController', function manageController(toaster, SOUNDS) {
		var vm = this;
		vm.studyOptions = [
			{
				id: 'S_MSCMICU'
			},
			{
				id: 'S_MSCONC'
			}
		];
		vm.studyOptions2 = ['S_MSCMICU', 'S_MSCONC'];
		vm.studyChanged = function(newStudy) {
			toaster.pop({
				type: 'success',
				title: 'Study changed',
				body: 'Study changed to: <strong>' + newStudy + '</strong>',
				bodyOutputType: 'trustedHtml'
			});
			SOUNDS.success.play();
		};
		toaster.pop({
			type: 'info',
			title: 'What is this page for?',
			body: 'This page gives you the ability to switch between MICU and Oncology studies.' +
				'You would only see the link if you have permissions.',
			bodyOutputType: 'trustedHtml'
		});
	});
