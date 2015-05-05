'use strict';

angular
	.module('app.dialog.content', [])
	.controller('ContentModalController', ['$scope', '$modalInstance', function ContentModalController($scope, $modalInstance) {
		$scope.close = function close() {
			$modalInstance.close();
		};
	}]);
