angular.module('NodeWebBase')
    .service('errorService',['ngDialog', function (ngDialog) {
        var me = this;

        me.init = function () {

        };

        me.showErrorMessage = function (source, reason) {
            ngDialog.openConfirm({
                template: '/views/partials/genericError',
                controller: ['$scope', function ($scope) {
                    $scope.errorMessage = source + ":" + reason;
                    $scope.close = function () {
                        $scope.closeThisDialog(null);
                    }
                }]
            });
        };

        me.showError = function (jqxhr, testStatus, reason) {
            ngDialog.openConfirm({
                template: '/views/partials/genericError',
                controller: ['$scope', function ($scope) {
                    $scope.errorMessage = reason + ' ' + jqxhr.responseText;
                    $scope.close = function () {
                        $scope.closeThisDialog(null);
                    }
                }]
            });
        };

        me.init();
    }]);
