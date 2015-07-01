angular.module('NodeWebBase')
    .service('themeService',['changeThemeMsg','themeChangedMsg',function (changeThemeMsg,themeChangedMsg) {
        var me = this;
        me.themes = [
            {
                name: 'Bootstrap',
                bootstrapCss: 'javascripts/vendor/bootstrap/dist/css',
                appCss:'/stylesheets/app/amino_base.css'
            },
            {
                name: 'Sandstone',
                bootstrapCss: 'stylesheets/themes/sandstone',
                appCss:'/stylesheets/app/amino_sandstone.css'
            },
            {
                name: 'Slate',
                bootstrapCss: 'stylesheets/themes/slate',
                appCss:'/stylesheets/app/amino_slate.css'
            },
            {
                name: 'Darkly',
                bootstrapCss: 'stylesheets/themes/darkly',
                appCss:'/stylesheets/app/amino_slate.css'
            },
            {
                name: 'Cyborg',
                appCss:'/stylesheets/app/amino_slate.css',
                bootstrapCss: 'stylesheets/themes/cyborg'
            }
        ];

        me.theme = me.themes[0];

        changeThemeMsg.listen(function(event,themeName){
            angular.forEach(me.themes, function(theme){
                if(theme.name === themeName)
                {
                    me.theme = theme;
                    themeChangedMsg.broadcast();
                }
            });
        });

    }]);
