angular.module('NodeWebBase')
    .controller('tabsController', function ($scope, $http) {
        $scope.tabs = [{
            title: 'Users',
            icon: 'glyphicon-user',
            url: 'one.tpl.html'
        }, {
            title: 'Teams',
            icon: 'glyphicon-th-large',
            url: 'two.tpl.html'
        }, {
            title: 'Domains',
            icon: 'glyphicon-file',
            url: 'three.tpl.html'
        }, {
            title: 'Trails',
            icon: 'glyphicon-road',
            url: 'four.tpl.html'
        }, {
            title: 'Settings',
            icon: 'glyphicon-cog',
            url: 'five.tpl.html'
        }];


        $scope.currentTab = 'one.tpl.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };


    });
