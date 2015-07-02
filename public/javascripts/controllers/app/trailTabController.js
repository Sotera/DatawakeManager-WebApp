/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('trailTabController',['$scope','$http','ngTableParams','errorService','configurationService','changeTrailMsg','changeDomainMsg','changeTeamMsg','$filter','$timeout','ngDialog',
        function ($scope, $http, ngTableParams, errorService, configurationService,changeTrailMsg, changeDomainMsg, changeTeamMsg, $filter, $timeout, ngDialog) {

        var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
            if( newVal ){ // Don't do anything if Undefined.
                $scope.updateTrails();
                $scope.getTeams();
                $scope.getDomains();
                watchRemoval();
            }
        });

        changeTrailMsg.listen(function(){$scope.updateTrails()});
        changeDomainMsg.listen(function(){$scope.updateDomains()});
        changeTeamMsg.listen(function () {$scope.updateTeams()});

        $scope.trails = [];
        $scope.domains = [];
        $scope.teams = [];
        $scope.activeTrail = null;

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


        $scope.addTrail = function () {
            if (!configurationService.isAppConfigured())
                return;
            $scope.data.id = 0;
            $scope.data.createdBy = "Administrator";
            $scope.data.created = new Date().getTime();
            $http.post("/trails", $scope.data)
                .success(function (res) {
                    changeTrailMsg.broadcast();
                    $scope.data.name = '';
                    $scope.data.description = '';
                    $scope.data.teamId = null;
                    $scope.data.domainId = null;
                })
                .error(errorService.showError);
        };

        $scope.editTrail = function (trail) {
            if (!configurationService.isAppConfigured())
                return;
            $http.post("/trails", trail)
                .success(function (res) {
                    changeTrailMsg.broadcast();
                })
                .error(errorService.showError);
        };

        $scope.getDomains = function() {
            if (!configurationService.isAppConfigured())
                return;

            $http({
                method: "GET",
                url: "/domains"
            }).success(function (response) {
                $timeout(function () {
                    $scope.domains = response;
                });
            }).error(errorService.showError);
        };

        $scope.getTeams = function () {
            if (!configurationService.isAppConfigured())
                return;

            $http({
                method: "GET",
                url: "/teams"
            }).success(function (response) {
                $scope.teams = response;
            }).error(errorService.showError);
        };

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

        $scope.openTrailEditor = function(trail) {
            $scope.activeTrail = trail;
            ngDialog.open({
                className: '/stylesheets/app/ngDialog-theme-sotera',
                template: '/views/app/trailEditor',
                scope: $scope
            });
        };

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

        $scope.updateDomains = function (){
            $scope.getDomains();
        };

        $scope.updateTeams = function (){
            $scope.getTeams();
        }

    }]);
