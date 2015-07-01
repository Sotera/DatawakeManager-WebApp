
angular.module('NodeWebBase')
    .controller('userTabController',['$scope', '$http','ngTableParams','errorService','configurationService','changeUserMsg','changeTeamMsg','$filter','$timeout',
        function ($scope,$http, ngTableParams, errorService, configurationService, changeUserMsg, changeTeamMsg, $filter,$timeout) {

            var watchRemoval = $scope.$watch(configurationService.isAppConfigured, function (newVal, oldVal) {
                if (newVal) { // Don't do anything if Undefined.
                    $scope.getUsers();
                    $scope.getTeams();
                    watchRemoval();
                }
            });

            changeUserMsg.listen(function () {
                $scope.updateUsers()
            });
            changeTeamMsg.listen(function () {
                $scope.updateTeams()
            });

            $scope.users = [];
            $scope.teams = [];

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,           // count per page
                filter: {
                    email: ''
                },
                sorting: {
                    teamUserId: 'asc'
                }
            }, {
                total: $scope.users.length, // length of data
                getData: function ($defer, params) {
                    var orderedUsers = params.sorting() ?
                        $filter('orderBy')($scope.users, params.orderBy()) :
                        $scope.users;

                    var filteredUsers = params.filter() ?
                       $filter('filter')(orderedUsers, params.filter()) :
                        orderedUsers;

                    $scope.users2 = filteredUsers.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(filteredUsers.length);
                    $defer.resolve($scope.users2);
                }
            });

            $scope.addUser = function () {
                if (!configurationService.isAppConfigured())
                    return;
                $scope.data.teamUserId = 0;
                $http.post("/datawakeusers", $scope.data)
                    .success(function (res) {
                        changeUserMsg.broadcast();
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
                    $scope.teams = response;
                }).error(errorService.showError);
            };

            $scope.getUsers = function () {
                if (!configurationService.isAppConfigured())
                    return;

                $http({
                    method: "GET",
                    url: "/datawakeusers"
                }).success(function (response) {
                    $timeout(function () {
                        $scope.users = response;
                        $scope.tableParams.reload();
                    });
                }).error(errorService.showError);
            };

            $scope.removeUser = function(user) {
                if (!configurationService.isAppConfigured())
                    return;

                $http({
                    method: "DELETE",
                    url: "/datawakeusers/" + user.teamUserId
                }).success(function (response) {
                    $timeout(function () {
                        changeUserMsg.broadcast();
                    });
                }).error(errorService.showError);

            };



            $scope.editUser = function (user) {
                if (!configurationService.isAppConfigured())
                    return;
                //user.id = user.teamUserId;
                $http.post("/datawakeusers", user)
                    .success(function (res) {
                        changeUserMsg.broadcast();
                    })
                    .error(errorService.showError);
            };

            $scope.updateUsers = function (){
                $scope.getUsers();
            };

            $scope.updateTeams = function (){
                $scope.getTeams();
            };

    }]);
