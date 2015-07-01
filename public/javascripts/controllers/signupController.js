angular.module('NodeWebBase')
    .constant('signupUrl', '/login/signup')
    .controller('signupController', ['$scope', '$http', '$window', 'signupUrl',
        function ($scope, $http, $window, signupUrl) {
            $scope.data = {};

            $scope.cancelSignup=function(){
                window.location.href = '/';
            };

            $scope.createAccount = function () {
                $scope.data.themeName = "Sandstone";
                $http.post(signupUrl, $scope.data, {
                    withCredentials: true
                })
                    .success(function (res) {
                        $window.location.href = '/';
                    })
                    .error(function (error) {
                        $scope.authenticationError = error;
                    });
            }
        }]);
