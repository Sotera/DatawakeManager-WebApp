angular.module('NodeWebBase')
    .service('changeUserMsg', ['$rootScope',function ($rootScope) {

        this.broadcast = function broadcast() {
            var args = ['changeUser'];
            Array.prototype.push.apply(args,arguments);
            $rootScope.$broadcast.apply($rootScope, args);
        };

        this.listen = function(callback) {$rootScope.$on('changeUser',callback)}
    }]);