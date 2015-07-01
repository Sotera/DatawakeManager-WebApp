/**
 * Created by
 */
angular.module('NodeWebBase')
    .controller('teamTabController',['$scope','$http','ngTableParams','errorService','configurationService','changeTeamMsg','$filter','$timeout',
        function ($scope, $http, ngTableParams, errorService, configurationService, changeTeamMsg, $filter, $timeout) {

    var watchRemoval = $scope.$watch(configurationService.isAppConfigured, function (newVal, oldVal) {
        if (newVal) { // Don't do anything if Undefined.
            $scope.updateTeams();
            watchRemoval();
        }
    });

    changeTeamMsg.listen(function () {
        $scope.updateTeams()
    });

    $scope.teams = [];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        filter: {
            name: ''
        },
        sorting: {
            id: 'asc'
        }
    }, {
        total: $scope.teams.length, // length of data
        getData: function ($defer, params) {
            var orderedTeams = params.sorting() ?
                $filter('orderBy')($scope.teams, params.orderBy()) :
                $scope.teams;

            var filteredTeams = params.filter() ?
                $filter('filter')(orderedTeams, params.filter()) :
                orderedTeams;

            $scope.teams2 = filteredTeams.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(filteredTeams.length);
            $defer.resolve($scope.teams2);
        }
    });

    $scope.addTeam = function () {
        if (!configurationService.isAppConfigured())
            return;
        $scope.data.id = 0;
        $http.post("/teams", $scope.data)
            .success(function (res) {
                $timeout(function () {
                    changeTeamMsg.broadcast();
                    $scope.data.name = '';
                    $scope.data.description= '';
                })
            }).error(errorService.showError);
    };

    $scope.editTeam = function (team) {
        if (!configurationService.isAppConfigured())
            return;
        $http.post("/teams", team)
            .success(function (res) {
                changeTeamMsg.broadcast();
            })
            .error(errorService.showError);
    };

    $scope.getTeams = function () {
        if (!configurationService.isAppConfigured())
            return;

        $http({
            method: "GET",
            url: "/teams"
        }).success(function (response) {
            $timeout(function () {
                $scope.teams = response;
                $scope.tableParams.reload();
            });
        }).error(errorService.showError);
    };

    $scope.removeTeam = function (team) {
        if (!configurationService.isAppConfigured())
            return;
        var confirmation = confirm("Team [" + team.name + "] selected for deletion, click 'Ok' to delete it or 'Cancel' to keep it.");
        if (confirmation == true) {
            $http({
                method: "DELETE",
                url: "/teams/" + team.id
            }).success(function (response) {
                $timeout(function () {
                    changeTeamMsg.broadcast();
                });
            }).error(errorService.showError);
        }
    };

    $scope.showFilters = function(){
        $scope.tableParams.settings().$scope.show_filter=!$scope.tableParams.settings().$scope.show_filter;
    }

    $scope.updateTeams = function (){
        $scope.getTeams();
    };

}]);
