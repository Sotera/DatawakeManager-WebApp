/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('transmissionEditController',['$scope', '$http','ngTableParams','errorService','configurationService','$filter','$timeout',
        function ($scope, $http, ngTableParams, errorService, configurationService,   $filter, $timeout) {

    var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
        if( newVal ){ // Don't do anything if Undefined.
            $scope.updateTransmissionItems();
            watchRemoval();
        }
    });

    //changeTransmissionMsg.listen(function(){$scope.updateTransmissionItems()});

    $scope.xmitId = null;
    $scope.recipientName = '';
    $scope.transmissionItems = [];


    $scope.tableParams = new ngTableParams({
        count: $scope.transmissionItems.length,           // turn off pages (since this says set pagecount to total item count
        filter:{
            name:''
        },
        sorting:{
            featureType: 'asc', featureValue: 'asc'
        }
    }, {
        counts:[], // turn transmissionItems items per page
        total: $scope.transmissionItems.length, // length of data
        getData: function ($defer, params) {
            params.myShowFlag = false;

            var orderedTransmissionItems = params.sorting() ?
                $filter('orderBy')($scope.transmissionItems,params.orderBy()):
                $scope.transmissionItems;

            var filteredTransmissionItems = params.filter() ?
                $filter('filter')(orderedTransmissionItems, params.filter()) :
                orderedTransmissionItems;

            $scope.transmissionItems2 = filteredTransmissionItems.slice((params.page()-1) * params.count(), params.page() * params.count());
            params.total(filteredTransmissionItems.length);
            $defer.resolve($scope.transmissionItems2);
        }
    });


    $scope.getTransmissionItems = function(transmission) {
        if (!configurationService.isAppConfigured())
            return;

        $scope.recipientId = transmission.recipientId;
        $scope.recipientName = transmission.recipientName;

        $http({
            method: "GET",
            url: "/transmissions/recipient/" + $scope.recipientId
        }).success(function (response) {
            $timeout(function () {
                $scope.transmissionItems = response;
                $scope.tableParams.reload();
            });
        }).error(errorService.showError);
    };

    $scope.showFilters = function(){
        $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
    };

    $scope.updateTransmissionItems = function (){
        $scope.getTransmissionItems($scope.activeRecipient);
    };

    $scope.close = function () {
        $scope.closeThisDialog(null);
    };

}]);
