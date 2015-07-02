/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('trailEditController',['$scope', '$http','ngTableParams','errorService','configurationService','changeTrailMsg','$filter','$timeout',
        function ($scope, $http, ngTableParams, errorService, configurationService, changeTrailMsg, $filter, $timeout) {

    var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
        if( newVal ){ // Don't do anything if Undefined.
            $scope.updateTrailItems();
            watchRemoval();
        }
    });


    changeTrailMsg.listen(function(){$scope.updateTrailItems()});

    $scope.trailId = null;
    $scope.trailName = '';
    $scope.trailDescription = null;
    $scope.trailTeamId = null;
    $scope.trailDomainId = null;

    $scope.trailItemCount = null;
    $scope.trailItems = [];


    $scope.tableParams = new ngTableParams({
        count: $scope.trailItems.length,           // turn off pages (since this says set pagecount to total item count
        filter:{
            name:''
        },
        sorting:{
            featureType: 'asc', featureValue: 'asc'
        }
    }, {
        counts:[], // turn off items per page
        total: $scope.trailItems.length, // length of data
        getData: function ($defer, params) {
            params.myShowFlag = false;

            var orderedTrailItems = params.sorting() ?
                $filter('orderBy')($scope.trailItems,params.orderBy()):
                $scope.trailItems;

            var filteredTrailItems = params.filter() ?
                $filter('filter')(orderedTrailItems, params.filter()) :
                orderedTrailItems;

            $scope.trailItems2 = filteredTrailItems.slice((params.page()-1) * params.count(), params.page() * params.count());
            params.total(filteredTrailItems.length);
            $defer.resolve($scope.trailItems2);
        }
    });



    $scope.addTrailItem = function () {
        if (!configurationService.isAppConfigured())
            return;

        $scope.data.id = 0;
        $scope.data.domainId = $scope.domainId;
        $scope.data.teamId = $scope.teamId;

        $http.post("/datawakedata", $scope.data)
            .success(function (res) {
                changeTrailMsg.broadcast();
                $scope.data = '';
            })
            .error(errorService.showError);
    };

    $scope.removeItem = function(item) {
        if (!configurationService.isAppConfigured())
            return;
        var confirmation = confirm("Trail Item [" + item.featureValue + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
        if (confirmation == true) {
            $http({
                method: "DELETE",
                url: "/datawakedata/" + item.id
            }).success(function (response) {
                $timeout(function () {
                    changeTrailMsg.broadcast();
                });
            }).error(errorService.showError);
        }
    };

    $scope.getTrailItems = function(trail) {
        if (!configurationService.isAppConfigured())
            return;

        $scope.trailId = trail.id;
        $scope.trailName = trail.name;
        $scope.trailDescription = trail.description;
        $scope.trailTeamId = trail.teamId;
        $scope.trailDomainId = trail.domainId;

        $http({
            method: "GET",
            url: "/datawakedata/trail/" + $scope.trailId
        }).success(function (response) {
            $timeout(function () {
                $scope.trailItems = response;
                $scope.tableParams.reload();
            });
        }).error(errorService.showError);
    };

    $scope.showFilters = function(){
        $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
    }

    $scope.updateTrailItems = function (){
        $scope.getTrailItems($scope.activeTrail);
    };

    $scope.close = function () {
        $scope.closeThisDialog(null);
    };

}]);
