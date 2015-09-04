'use strict';

angular
	.module('app.component.manage', [])
	.controller('ManageController', function manageController(toaster, SOUNDS) {
		var vm = this;
		var rolesJson = localStorage.getItem("roles");
		var roles = JSON.parse(rolesJson);
		vm.studyOptions = [];
		vm.studyOptions2 = [];
		console.log("roles :", roles)
		for (index = 0, len = roles.length; index < len; ++index) {
		    console.log("role name :",roles[index].studyOID);
		    vm.studyOptions.push(roles[index].studyOID);
		    vm.studyOptions2.push(roles[index].studyOID);
		}
		/*
		
		vm.studyOptions = [
			{
				id: 'S_MSCMICU'
			},
			{
				id: 'S_MSCONC'
			}
		];
		//console.log("roles studyOptions:",  vm.studyOptions);
		//console.log("roles studyOptions2:",  vm.studyOptions2);
		vm.studyOptions2 = ['S_MSCMICU', 'S_MSCONC'];*/
		vm.studyChanged = function(newStudy) {
			localStorage.setItem("role_active", newStudy);
			vm.currentStudy = localStorage.getItem("role_active");
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
