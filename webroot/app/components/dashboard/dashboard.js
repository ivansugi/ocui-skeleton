'use strict';

angular
	.module('app.component.dashboard', ['gridster'])
	.controller('DashboardController', function dashboardController($scope, $modal, $stateParams, studyService, toaster) {
		var vm = this;
		studyService.get($stateParams.studyId, function getResults(data) {
			vm.tableData = data;
		});
		$scope.selectedItems = [];
		$scope.$watchCollection('selectedItems', function() {
			if ($scope.selectedItems.length > 0) {
				$modal.open({
					templateUrl: '/app/components/dashboard/rowdetail.tpl.html',
					controller: 'RowDetailModalController as rowDetail',
					size: 'lg',
					resolve: {
						selectedItem: function() {
							return $scope.selectedItems[0];
						}
					}
				})
				.result.then(function() {
					$scope.selectedItems = [];
				});
			}
		});
		toaster.pop({
			type: 'info',
			title: 'Did you know?',
			body: 'You can click any row to get more details about a case',
			bodyOutputType: 'trustedHtml'
		});
	})
	.controller('RowDetailModalController', function rowDetailController($modalInstance, toaster, selectedItem, SOUNDS,$http) {
		var vm = this;
		vm.selectedItem = selectedItem;
		console.log('Selected item:', selectedItem);
		vm.close = function close() {
			$modalInstance.close();
			// SOUNDS.click.play();
		};
		vm.submitFollowup = function submitFollowup(message,status) {

			var payload = selectedItem.metadata;
			payload.message = message;
			payload.parentId = selectedItem.followups.length > 0 ? selectedItem.followups[0].parentId : '0';
			payload.status = status;

			$http.post('/api/followups', payload)
				.success(function postAuthSuccess(data) {
					toaster.pop({
						type: 'success',
						title: 'Followup ',
						body: payload.status,
						bodyOutputType: 'trustedHtml'
					});
					SOUNDS.success.play();
				})
				.error(function postAuthFail(data, status) {
					console.log('here....');
					toaster.pop({
						type: 'error',
						title: 'Follow-up not saved',
						body: 'Since we do not have a back end configured yet, the data was not saved anywhere.',
						bodyOutputType: 'trustedHtml'
					});
					SOUNDS.error.play();
				});
		};
		SOUNDS.popup.play();
	});
