/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('domainTabController',['$scope', '$http','ngTableParams','Upload','errorService','configurationService','changeDomainMsg','changeTeamMsg','$filter','$timeout','ngDialog',
        function ($scope, $http, ngTableParams, Upload, errorService, configurationService, changeDomainMsg, changeTeamMsg, $filter, $timeout, ngDialog) {

        var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
            if( newVal ){ // Don't do anything if Undefined.
                $scope.updateDomains();
                $scope.getTeams();
                watchRemoval();
            }
        });


        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        changeDomainMsg.listen(function(){$scope.updateDomains()});
        changeTeamMsg.listen(function () {$scope.updateTeams()});

        $scope.activeDomain = null;
        $scope.domainCount = null;
        $scope.domains = [];
        $scope.files = [];
        $scope.teams = [];


        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 50,           // count per page
            filter:{
                name:''
            },
            sorting:{
                id: 'asc'
            }
        }, {
            total: $scope.domains.length, // length of data
            getData: function ($defer, params) {
                var orderedDomains = params.sorting() ?
                    $filter('orderBy')($scope.domains,params.orderBy()):
                    $scope.domains;

                filteredDomains = params.filter() ?
                    $filter('filter')(orderedDomains, params.filter()) :
                    orderedDomains;

                $scope.domains2 = filteredDomains.slice((params.page()-1) * params.count(), params.page() * params.count());
                params.total(filteredDomains.length);
                $defer.resolve($scope.domains2);
            }
        });

        $scope.addDomain = function () {
            if (!configurationService.isAppConfigured())
                return;
            $scope.data.id = 0;
            $http.post("/domains", $scope.data)
                .success(function (res) {
                    changeDomainMsg.broadcast();
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
                    $scope.tableParams.reload();
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

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: '/upload',
                        fields: {
                            'username': $scope.username
                        },
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function (data, status, headers, config) {
                        $scope.log = 'file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        $scope.$apply();
                        changeDomainMsg.broadcast();
                    }).error(errorService.showError);
                }
            }
        };

        $scope.openDomainEditor = function(domain) {
            $scope.activeDomain = domain;
            ngDialog.open({
                className: 'ngDialog-theme-plain',
                template: '/views/app/domainEditor',
                scope: $scope
            });
        };

        $scope.updateDomains = function (){
            $scope.getDomains();
        };

        $scope.updateTeams = function (){
            $scope.getTeams();
        }

    }]);
