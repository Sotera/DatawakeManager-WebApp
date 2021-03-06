angular.module('NodeWebBase')
    .service('changeRecipientMsg', ['$rootScope',function ($rootScope) {

        this.broadcast = function broadcast() {
            var args = ['changeRecipient'];
            Array.prototype.push.apply(args,arguments);
            $rootScope.$broadcast.apply($rootScope, args);
        };

        this.listen = function(callback) {$rootScope.$on('changeRecipient',callback)}
    }]);