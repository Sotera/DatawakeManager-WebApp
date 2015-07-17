/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('userEditController',['$scope', '$http','ngTableParams','errorService','configurationService','changeUserMsg','$filter','$timeout',
        function ($scope, $http, ngTableParams, errorService, configurationService, changeUserMsg, $filter, $timeout) {

    var watchRemoval = $scope.$watch(configurationService.isAppConfigured ,function(newVal,oldVal) {
        if( newVal ){ // Don't do anything if Undefined.
            $scope.updateUserTeams();
            watchRemoval();
        }
    });

    changeUserMsg.listen(function(){$scope.updateUserTeams()});

    $scope.userId = null;
    $scope.userName = '';
    $scope.userTeamId = null;

    $scope.userTeamCount = null;
    $scope.userTeams = [];


    $scope.tableParams = new ngTableParams({
        count: $scope.userTeams.length,           // turn off pages (since this says set pagecount to total item count
        filter:{
            name:''
        },
        sorting:{
            featureType: 'asc', featureValue: 'asc'
        }
    }, {
        counts:[], // turn off items per page
        total: $scope.userTeams.length, // length of data
        getData: function ($defer, params) {
            params.myShowFlag = false;

            var orderedUserTeams = params.sorting() ?
                $filter('orderBy')($scope.userTeams,params.orderBy()):
                $scope.userTeams;

            var filteredUserTeams = params.filter() ?
                $filter('filter')(orderedUserTeams, params.filter()) :
                orderedUserTeams;

            $scope.userTeams2 = filteredUserTeams.slice((params.page()-1) * params.count(), params.page() * params.count());
            params.total(filteredUserTeams.length);
            $defer.resolve($scope.userTeams2);
        }
    });



    $scope.addUserTeam = function () {
        if (!configurationService.isAppConfigured())
            return;

        $scope.data.userEntityId = 0;
        $scope.data.email = $scope.userName;

        $http.post("/datawakeusers", $scope.data)
            .success(function (res) {
                changeDomainMsg.broadcast();
                $scope.data.teamId = '';
                $scope.data.teamUserId= '';
            })
            .error(errorService.showError);
    };

    $scope.removeUserTeam = function(team) {
        if (!configurationService.isAppConfigured())
            return;
        var confirmation = confirm("User Team [" + team.name + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
        if (confirmation == true) {
            $http({
                method: "DELETE",
                url: "/datawakeusers/" + team.teamUserId
            }).success(function (response) {
                $timeout(function () {
                    changeUserMsg.broadcast();
                });
            }).error(errorService.showError);
        }
    };

    $scope.getUserTeams = function(user) {
        if (!configurationService.isAppConfigured())
            return;

        $scope.userId = user.id;

        $http({
            method: "GET",
            url: "/datawakeusers/user/" + $scope.domainId
        }).success(function (response) {
            $timeout(function () {
                //$scope.domainItems = response;
                $scope.tableParams.reload();
            });
        }).error(errorService.showError);
    };

    $scope.showFilters = function(){
        $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
    }

    $scope.updateUserTeam = function (){
        $scope.getUserTeams($scope.activeUser);
    };

    $scope.close = function () {
        $scope.closeThisDialog(null);
    };

}]);
