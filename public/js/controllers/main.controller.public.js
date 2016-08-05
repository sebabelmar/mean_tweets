angular.module('MainCtrl', [])
	.controller('MainController', ['$scope' , '$http', 'Tweeter',
		function($scope, $http, Tweeter) {

			Tweeter.list()
				.then(function(tweets) {
					$scope.tweets = tweets;
				});

		}]);