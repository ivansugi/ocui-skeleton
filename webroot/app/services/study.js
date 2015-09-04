'use strict';

angular
	.module('app.service.study', [])
	.factory('studyService', function studyService($http, $cacheFactory) {
		return {
			get: function get(studyId, cb) {
				// $http.get('/api/studies/' + studyId, {cache: true})
				$http.get('/api/studies/' + studyId)
					.success(function getStudySuccess(data) {
						setTimeout(function removeCache() {
							console.log('remove:', studyId);
							$cacheFactory.get('$http').remove('/api/studies/' + studyId);
						}, 1000 * 60 * 10); // 10 minutes
						cb(data);
					});
			}
		};
	});
