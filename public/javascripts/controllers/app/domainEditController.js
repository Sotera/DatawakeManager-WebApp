/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('domainEditController',['$scope', '$http','ngTableParams','errorService','configurationService','changeDomainMsg','$filter','$timeout',
        function ($scope, $http, ngTableParams, errorService, configurationService, changeDomainMsg, $filter, $timeout) {

    var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
        if( newVal ){ // Don't do anything if Undefined.
            $scope.updateDomainItems();
            watchRemoval();
        }
    });

    $scope.helper = {
        csv: null //will be replaced by the export directive
    };

    $scope.exportCsv = function($event, fileName) {
        $scope.helper.csv.generate($event, "report.csv");
        location.href=$scope.helper.csv.link();
    };

    changeDomainMsg.listen(function(){$scope.updateDomainItems()});

    $scope.domainId = null;
    $scope.domainName = '';
    $scope.domainDescription = null;
    $scope.domainTeamId = null;

    $scope.domainItemCount = null;
    $scope.domainItems = [];


    $scope.tableParams = new ngTableParams({
        count: $scope.domainItems.length,           // turn off pages (since this says set pagecount to total item count
        filter:{
            name:''
        },
        sorting:{
            featureType: 'asc', featureValue: 'asc'
        }
    }, {
        counts:[], // turn off items per page
        total: $scope.domainItems.length, // length of data
        getData: function ($defer, params) {
            params.myShowFlag = false;

            var orderedDomainItems = params.sorting() ?
                $filter('orderBy')($scope.domainItems,params.orderBy()):
                $scope.domainItems;

            filteredDomainItems = params.filter() ?
                $filter('filter')(orderedDomainItems, params.filter()) :
                orderedDomainItems;

            $scope.domainItems2 = filteredDomainItems.slice((params.page()-1) * params.count(), params.page() * params.count());
            params.total(filteredDomainItems.length);
            $defer.resolve($scope.domainItems2);
        }
    });



    $scope.addDomainItem = function () {
        if (!configurationService.isAppConfigured())
            return;

        $scope.data.domainEntityId = 0;
        $scope.data.domainId = $scope.domainId;

        $http.post("/domainItems", $scope.data)
            .success(function (res) {
                changeDomainMsg.broadcast();
                $scope.data.featureType = '';
                $scope.data.featureValue= '';
            })
            .error(errorService.showError);
    };

    $scope.removeItem = function(item) {
        if (!configurationService.isAppConfigured())
            return;
        var confirmation = confirm("Domain Item [" + item.featureValue + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
        if (confirmation == true) {
            $http({
                method: "DELETE",
                url: "/domainItems/" + item.domainEntityId
            }).success(function (response) {
                $timeout(function () {
                    changeDomainMsg.broadcast();
                });
            }).error(errorService.showError);
        }
    };

    $scope.getDomainItems = function(domain) {
        if (!configurationService.isAppConfigured())
            return;

        $scope.domainId = domain.id;
        $scope.domainName = domain.name;
        $scope.domainDescription = domain.description;
        $scope.domainTeamId = domain.teamId;

        $http({
            method: "GET",
            url: "/domainItems/domain/" + $scope.domainId
        }).success(function (response) {
            $timeout(function () {
                $scope.domainItems = response;
                $scope.tableParams.reload();
            });
        }).error(errorService.showError);
    };

    $scope.showFilters = function(){
        $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
    }

    $scope.updateDomainItems = function (){
        $scope.getDomainItems($scope.activeDomain);
    };

    $scope.close = function () {
        $scope.closeThisDialog(null);
    };

}]);
