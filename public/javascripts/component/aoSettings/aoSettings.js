angular.module('aoSettings', ['ngCookies','ngDialog'])
    .constant('userUrl', 'users')
    .factory('aoSettings', function () {
        return {
        };
    })
    .directive('aoSettings',['userUrl','changeThemeMsg','configurationService','setFullNameMsg','errorService','themeService',
        function (userUrl,changeThemeMsg,configurationService,setFullNameMsg,errorService,themeService) {
            return{
                restrict: 'E',
                templateUrl: '/views/partials/settingsLink',
                controller: function($scope, ngDialog, $http, $cookies){

                    $scope.openSettings = function(res){
                        ngDialog.openConfirm({
                            template: '/views/partials/settings',
                            controller: ['$scope', function ($scope) {
                                $scope.url = userUrl + "/" + $cookies.userId ;
                                $scope.data = res;
                                $scope.themes = themeService.themes;
                                $scope.currentTheme = !$scope.data.themeName?$scope.themes[0].name:$scope.data.themeName;

                                $scope.cancel = function(){
                                    $scope.closeThisDialog(null);
                                    if($scope.data.themeName != $scope.currentTheme )
                                        changeThemeMsg.broadcast($scope.currentTheme);
                                };

                                $scope.changeTheme = function(){
                                    changeThemeMsg.broadcast($scope.data.themeName);
                                };

                                $scope.save = function(){
                                    $http.post($scope.url,{
                                        "fullname": $scope.data.fullname,
                                        "email": $scope.data.email,
                                        "themeName": $scope.data.themeName
                                    },{
                                        params: {
                                            access_token: $cookies.access_token
                                        }
                                    }).success(function (res) {
                                        //update our root config vars
                                        configurationService.set('fullname', $scope.data.fullname);
                                        setFullNameMsg.broadcast();
                                        $scope.closeThisDialog(null);
                                    }).error(errorService.showError);
                                };
                            }]
                        });
                    };

                    $scope.requestSettings = function(){
                        var url = userUrl + "/" + $cookies.userId ;

                        $http.get(url,{
                            params: {
                                access_token: $cookies.access_token
                            }
                        })
                            .success($scope.openSettings)
                            .error(errorService.showError);
                    };
                }
            };
        }]);
