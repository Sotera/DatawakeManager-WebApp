angular.module('NodeWebBase')
    .constant('userUrl', '/users/')
    .service('configurationService', ['$http','$cookies','userUrl','changeThemeMsg','setFullNameMsg','errorService',
        function ($http, $cookies,userUrl,changeThemeMsg,setFullNameMsg,errorService) {
        var me = this;
        me.config = {};

        me.init = function(){
            var url = userUrl + $cookies.userId ;

            $http.get(url,{
                params: {
                    access_token: $cookies.access_token
                }
            })
                .success(me.initWithSettings)
                .error(errorService.showError);
        };

        me.set = function(key,value){
          me.config[key] = value;
        };

        me.get = function(key){
            return me.config[key];
        };

        me.initWithSettings = function(res){

            me.set('username', res.username);
            me.set('fullname', res.fullname);
            me.set('themeName', res.themeName);

            setFullNameMsg.broadcast();
            changeThemeMsg.broadcast(res.themeName);
        };

        me.isAppConfigured = function(){
            return me.get('fullname');
        };

        me.init();
    }]);
