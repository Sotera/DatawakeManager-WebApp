/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('recipientTabController',['$scope','$http','ngTableParams','errorService','configurationService','changeRecipientMsg','changeDomainMsg','changeTeamMsg','changeTrailMsg','$filter','$timeout','ngDialog',
        function ($scope, $http, ngTableParams, errorService, configurationService,changeRecipientMsg, changeDomainMsg, changeTeamMsg, changeTrailMsg, $filter, $timeout, ngDialog) {

        var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
            if( newVal ){ // Don't do anything if Undefined.
                $scope.updateRecipients();
                $scope.updateTrails();
                $scope.getTeams();
                $scope.getDomains();
                watchRemoval();
            }
        });

        changeRecipientMsg.listen(function(){$scope.updateRecipients()});
        changeTrailMsg.listen(function(){$scope.updateTrails()});
        changeDomainMsg.listen(function(){$scope.updateDomains()});
        changeTeamMsg.listen(function () {$scope.updateTeams()});

        $scope.trails = [];
        $scope.domains = [];
        $scope.teams = [];
        $scope.recipients = [];
        $scope.activeRecipient = null;

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            filter:{
                recipientName:''
            },
            sorting:{
                recipientId: 'asc'
            }
        }, {
            total: $scope.recipients.length, // length of data
            getData: function ($defer, params) {
                params.myShowFlag = false;
                var orderedRecipients = params.sorting() ?
                    $filter('orderBy')($scope.recipients,params.orderBy()):
                    $scope.recipients;

                filteredRecipients = params.filter() ?
                    $filter('filter')(orderedRecipients, params.filter()) :
                    orderedRecipients;

                $scope.recipients2 = filteredRecipients.slice((params.page()-1) * params.count(), params.page() * params.count());
                params.total(filteredRecipients.length);
                $defer.resolve($scope.recipients2);
            }
        });

        $scope.addRecipient = function () {
            if (!configurationService.isAppConfigured())
                return;

            $scope.data.recipientId = 0;

            $http.post("/recipients", $scope.data)
                .success(function (res) {
                    changeRecipientMsg.broadcast();
                    $scope.data.recipientName = '';
                    $scope.data.serviceType = '';
                    $scope.data.recipientUrl = '';
                    $scope.data.recipientIndex = '';
                    $scope.data.credentials = '';
                    $scope.data.recipientTeamId = null;
                    $scope.data.recipientTrailId = null;
                    $scope.data.recipientDomainId = null;
                })
                .error(errorService.showError);
        };

        $scope.editRecipient = function (recipient) {
            if (!configurationService.isAppConfigured())
                return;
            $http.post("/recipients", recipient)
                .success(function (res) {
                    changeRecipientMsg.broadcast();
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
        };

        $scope.getRecipients = function() {
            if (!configurationService.isAppConfigured())
                return;

            $http({
                method: "GET",
                url: "/recipients"
            }).success(function (response) {
                $timeout(function () {
                    $scope.recipients = response;
                    $scope.tableParams.reload();
                });

            }).error(errorService.showError);
        };

        $scope.openTransmissionViewer = function(recipient) {
            $scope.activeRecipient = recipient;
            ngDialog.open({
                className: '/stylesheets/app/ngDialog-theme-sotera',
                template: '/views/app/transmissionEditor',
                scope: $scope
            });
        };

        $scope.removeRecipient = function(recipient) {
            if (!configurationService.isAppConfigured())
                return;
            var confirmation = confirm("Recipient [" + recipient.recipientName + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
            if (confirmation == true) {
                $http({
                    method: "DELETE",
                    url: "/recipients/" + recipient.recipientId
                }).success(function (response) {
                    $timeout(function () {
                        changeRecipientMsg.broadcast();
                    });
                }).error(errorService.showError);
            }
        };

        $scope.showFilters = function(){
            $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
        };

        $scope.updateTrails = function (){
            $scope.getTrails();
        };

        $scope.updateDomains = function (){
            $scope.getDomains();
        };

        $scope.updateTeams = function (){
            $scope.getTeams();
        };

        $scope.updateRecipients = function (){
            $scope.getRecipients();
        };

    }]);
