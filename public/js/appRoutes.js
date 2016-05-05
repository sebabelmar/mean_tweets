angular.module('appRoutes', [])
	.config(['$routeProvider', '$locationProvider', 
		function($routeProvider, $locationProvider) {
	
			$routeProvider
		
				// home page
				.when('/', {
					templateUrl: 'views/home.html',
					controller: 'MainController'
				})
		
				.when('/tweeters', {
					templateUrl: 'views/tweet.html',
					controller: 'TweeterController'
				});
		
			$locationProvider.html5Mode(true);

}]);