angular.module('NodeWebBase')
    .service('changeTransmissionMsg.js', ['$rootScope',function ($rootScope) {

        this.broadcast = function broadcast() {
            var args = ['changeTransmission'];
            Array.prototype.push.apply(args,arguments);
            $rootScope.$broadcast.apply($rootScope, args);
        };

        this.listen = function(callback) {$rootScope.$on('changeTransmission',callback)}
    }]);