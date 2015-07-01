angular.module('NodeWebBase')
    .service('changeTeamMsg', ['$rootScope',function ($rootScope) {

        this.broadcast = function broadcast() {
            var args = ['changeTeam'];
            Array.prototype.push.apply(args,arguments);
            $rootScope.$broadcast.apply($rootScope, args);
        };

        this.listen = function(callback) {$rootScope.$on('changeTeam',callback)}
    }]);