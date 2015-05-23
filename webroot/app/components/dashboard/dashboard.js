'use strict';

angular
	.module('app.component.dashboard', ['gridster'])
	.controller('DashboardController', function dashboardController(studyService) {
		var vm = this;
		vm.placeholder = function placeholder(element) {
			return element.clone().addClass('placeholder');
		};
		vm.hint = function hint(element) {
			return element.clone().addClass('hint').height(element.height()).width(element.width());
		};
		vm.change = function change(element) {
			console.log(element);
		};
		vm.remove = function remove(widget) {
			vm.widgets.splice(vm.widgets.indexOf(widget), 1);
		};
		vm.gridOptions = {
			columns: 3,
			defaultSizeX: 2,
			defaultSizeY: 1,
			isMobile: true,
			margins: [10, 10],
			mobileBreakPoint: 687,
			rowHeight: 200,
			swapping: true,
			maxSizeY: 2,
			draggable: {
				handle: '.panel-heading'
			}
		};
		vm.widgets = [
			// {
			// 	row: 1,
			// 	col: 0,
			// 	sizeX: 2,
			// 	sizeY: 1,
			// 	icon: 'fa-bar-chart',
			// 	title: 'Study bar chart'
			// },
			// {
			// 	row: 1,
			// 	col: 3,
			// 	sizeX: 1,
			// 	sizeY: 1,
			// 	icon: 'fa-pie-chart',
			// 	title: 'Study pie chart'
			// },
			// {
			// 	row: 2,
			// 	col: 0,
			// 	sizeX: 2,
			// 	sizeY: 1,
			// 	icon: 'fa-line-chart',
			// 	title: 'Study line chart'
			// },
			// {
			// 	row: 2,
			// 	col: 3,
			// 	sizeX: 1,
			// 	sizeY: 1,
			// 	icon: 'fa-area-chart',
			// 	title: 'Study area chart'
			// }
		];
		studyService.get(function getResults(data) {
			vm.mockData = data;
			console.log(vm.studyResult);
		});
		// vm.mockData = [
		// 	{
		// 		'Flag': false,
		// 		'ID Number': '14C-0005',
		// 		'Time': '2015-03-03 18:15',
		// 		'Category': 'Pain Medication',
		// 		'Concern Level': 8,
		// 		'Status': '1-New'
		// 	},
		// 	{
		// 		'Flag': false,
		// 		'ID Number': '14C-0004',
		// 		'Time': '2015-02-03 14:15',
		// 		'Category': 'Communication',
		// 		'Concern Level': 7,
		// 		'Status': '2-In-Progress'
		// 	},
		// 	{
		// 		'Flag': false,
		// 		'ID Number': '14C-0003',
		// 		'Time': '2015-02-02 21:15',
		// 		'Category': 'Infection',
		// 		'Concern Level': 6,
		// 		'Status': '2-In-Progress'
		// 	},
		// 	{
		// 		'Flag': false,
		// 		'ID Number': '14C-0002',
		// 		'Time': '2015-02-02 19:15',
		// 		'Category': 'Plan of Care',
		// 		'Concern Level': 9,
		// 		'Status': '2-In-Progress'
		// 	},
		// 	{
		// 		'Flag': false,
		// 		'ID Number': '14C-0001',
		// 		'Time': '2015-02-01 13:15',
		// 		'Category': 'Pain',
		// 		'Concern Level': 5,
		// 		'Status': '3-Closed'
		// 	}
		// ];
	});
