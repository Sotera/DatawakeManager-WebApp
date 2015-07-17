
angular.module('NodeWebBase')
    .controller('settingTabController',['$scope', '$http','ngTableParams','errorService','configurationService','changeSettingMsg','$filter','$timeout',
        function ($scope,$http, ngTableParams, errorService, configurationService, changeSettingMsg,  $filter,$timeout) {

            var watchRemoval = $scope.$watch(configurationService.isAppConfigured, function (newVal, oldVal) {
                if (newVal) { // Don't do anything if Undefined.
                    $scope.getSettings();
                    watchRemoval();
                }
            });

            changeSettingMsg.listen(function () {
                $scope.updateSettings()
            });

            $scope.settings = [];

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,           // count per page
                filter: {
                    email: ''
                },
                sorting: {
                    setting: 'asc'
                }
            }, {
                total: $scope.settings.length, // length of data
                getData: function ($defer, params) {
                    var orderedSettings = params.sorting() ?
                        $filter('orderBy')($scope.settings, params.orderBy()) :
                        $scope.settings;

                    var filteredSettings = params.filter() ?
                       $filter('filter')(orderedSettings, params.filter()) :
                        orderedSettings;

                    $scope.settings2 = filteredSettings.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(filteredSettings.length);
                    $defer.resolve($scope.settings2);
                }
            });

            $scope.addSetting = function () {
                if (!configurationService.isAppConfigured())
                    return;

                $http.post("/settings", $scope.data)
                    .success(function (res) {
                        changeSettingMsg.broadcast();
                        $scope.data.setting = '';
                        $scope.data.value= '';
                    })
                    .error(errorService.showError);
            };

            $scope.editSetting = function (setting) {
                if (!configurationService.isAppConfigured())
                    return;
                $http.post("/settings", setting)
                    .success(function (res) {
                        changeSettingMsg.broadcast();
                    })
                    .error(errorService.showError);
            };

            $scope.getSettings = function () {
                if (!configurationService.isAppConfigured())
                    return;

                $http({
                    method: "GET",
                    url: "/settings"
                }).success(function (response) {
                    $timeout(function () {
                        $scope.settings = response;
                        $scope.tableParams.reload();
                    });
                }).error(errorService.showError);
            };

            $scope.removeSetting = function(setting) {
                if (!configurationService.isAppConfigured())
                    return;

                var confirmation = confirm("Setting [" + setting.setting + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
                if(confirmation == true){
                    $http({
                        method: "DELETE",
                        url: "/settings/" + setting.setting
                    }).success(function (response) {
                        $timeout(function () {
                            changeSettingMsg.broadcast();
                        });
                    }).error(errorService.showError);
                }
            };

            $scope.showFilters = function(){
                $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
            }

            $scope.updateSettings = function (){
                $scope.getSettings();
            };

    }]);
