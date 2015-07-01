angular.module('NodeWebBase', ['ngRoute', 'logout','aoSettings','ngCookies', 'ngDialog','ngFileUpload','ngTable','ngTableExport','anguFixedHeaderTable','angular-loading-bar'])
	.controller('layoutController', ['$scope','themeChangedMsg','changeThemeMsg','themeService',
		function ($scope,themeChangedMsg,changeThemeMsg,themeService) {
			$scope.themeService = themeService;
		}]);