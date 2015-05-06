'use strict';

angular
	.module('app.dialog.content', [])
	.controller('ContentModalController', function contentModalController($scope, $modalInstance) {
		$scope.close = function close() {
			$modalInstance.close();
		};
	});
