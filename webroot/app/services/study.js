'use strict';

angular
	.module('app.service.study', [])
	.factory('studyService', function studyService($http) {
		return {
			get: function get(studyId, cb) {
				$http.get('/api/studies/' + studyId)
					.success(function(data) {
						cb(data);
					});
			}
		};
	});
