angular.module('NodeWebBase')
		.config(function ($routeProvider) {
			$routeProvider
			.otherwise({templateUrl: '/views/app/aminoMain'})
		})
		.controller('indexController', function ($scope) {

		});
