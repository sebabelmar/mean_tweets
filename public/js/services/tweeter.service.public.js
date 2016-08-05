angular.module('TweeterService', [])
	.factory('Tweeter', ['$http', function($http) {

		return {
			list: function() {
				return $http.get('/tweets');
			},
			aggregate: function() {
				return $http.get('/tweets/aggregate')
			}
		}

	}]);