'use strict';

angular
	.module('app.service.study', [])
	.factory('studyService', function studyService($http) {
		return {
			get: function get(cb) {
				$http.get('/api/studies/S_MICU')
					.success(function(data) {
						cb(data);
					});
			}
		};
	});
