/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('trailTabController',['$scope','$http','ngTableParams','errorService','configurationService','changeTrailMsg','$filter','$timeout',
        function ($scope, $http, ngTableParams, errorService, configurationService,changeTrailMsg, $filter, $timeout) {

        var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
            if( newVal ){ // Don't do anything if Undefined.
                $scope.updateTrails();
                watchRemoval();
            }
        });

        changeTrailMsg.listen(function(){$scope.updateTrails()});

        $scope.trails = [];

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            filter:{
                name:''
            },
            sorting:{
                id: 'asc'
            }
        }, {
            total: $scope.trails.length, // length of data
            getData: function ($defer, params) {
                var orderedTrails = params.sorting() ?
                    $filter('orderBy')($scope.trails,params.orderBy()):
                    $scope.trails;

                filteredTrails = params.filter() ?
                    $filter('filter')(orderedTrails, params.filter()) :
                    orderedTrails;

                $scope.trails2 = filteredTrails.slice((params.page()-1) * params.count(), params.page() * params.count());
                params.total(filteredTrails.length);
                $defer.resolve($scope.trails2);
            }
        });

        $scope.getTrails = function() {
            if (!configurationService.isAppConfigured())
                return;

            $http({
                method: "GET",
                url: "/trails"
            }).success(function (response) {
                $timeout(function () {
                    $scope.trails = response;
                    $scope.tableParams.reload();
                });

            }).error(errorService.showError);
        }

        $scope.removeTrail = function(trail) {
            if (!configurationService.isAppConfigured())
                return;
            var confirmation = confirm("Trail [" + trail.name + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
            if (confirmation == true) {
                $http({
                    method: "DELETE",
                    url: "/trails/" + trail.id
                }).success(function (response) {
                    $timeout(function () {
                        changeTrailMsg.broadcast();
                    });
                }).error(errorService.showError);
            }
        };

        $scope.showFilters = function(){
            $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
        }

        $scope.updateTrails = function (){
            $scope.getTrails();
        };


    }]);
