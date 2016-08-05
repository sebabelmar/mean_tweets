angular.module('TweeterCtrl', [])
	.controller('TweeterController', [
		'$scope', '$http', 'Tweeter',
		function($scope, $http, Tweeter) {
			
			$scope.data = [];

			Tweeter.aggregate()
				.then(function(data) {
					$scope.data = data.data || [];
				});

		}
	]);