angular.module('logout', ['ngCookies'])
    .factory('logout', function () {
        return {

        };
    })
    .directive('logout', ['configurationService','setFullNameMsg', function (configurationService,setFullNameMsg) {
        return{
            restrict: 'E',
            templateUrl: '/views/partials/logout',
            controller: ['$scope',function($scope){
                setFullNameMsg.listen(function(){
                    $scope.fullname = configurationService.get('fullname');
                });
            }]
        };
    }]);