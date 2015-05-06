'use strict';

angular
	.module('app.component.dashboard', ['gridster'])
	.controller('DashboardController', function dashboardController() {
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
			{
				row: 0,
				col: 0,
				sizeX: 3,
				sizeY: 1,
				icon: 'fa-table',
				title: 'Study table'
			},
			{
				row: 1,
				col: 0,
				sizeX: 2,
				sizeY: 1,
				icon: 'fa-bar-chart',
				title: 'Study bar chart'
			},
			{
				row: 1,
				col: 3,
				sizeX: 1,
				sizeY: 1,
				icon: 'fa-pie-chart',
				title: 'Study pie chart'
			},
			{
				row: 2,
				col: 0,
				sizeX: 2,
				sizeY: 1,
				icon: 'fa-line-chart',
				title: 'Study line chart'
			},
			{
				row: 2,
				col: 3,
				sizeX: 1,
				sizeY: 1,
				icon: 'fa-area-chart',
				title: 'Study area chart'
			}
		];
	});
