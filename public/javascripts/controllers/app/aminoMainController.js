angular.module('NodeWebBase')
    .controller('aminoMainController', ['$scope','$http','$cookies','ngDialog','configurationService',
        function ($scope, $http, $cookies, ngDialog,configurationService) {
            $scope.scopeName = "aminoMainController";
            $scope.sizes = [];
            $scope.setStyle = function(style)
            {
                $scope.$apply(function () {
                    $scope.style = style;
                    $scope.sizes.push(style.height);
                });


            };

            configurationService.init();

        }]);