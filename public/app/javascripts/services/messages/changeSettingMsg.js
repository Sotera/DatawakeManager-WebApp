angular.module('NodeWebBase')
    .service('changeSettingMsg', ['$rootScope',function ($rootScope) {

        this.broadcast = function broadcast() {
            var args = ['changeSetting'];
            Array.prototype.push.apply(args,arguments);
            $rootScope.$broadcast.apply($rootScope, args);
        };

        this.listen = function(callback) {$rootScope.$on('changeSetting',callback)}
    }]);