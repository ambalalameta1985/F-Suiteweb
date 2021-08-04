// display scroller js
define([
    'angular',
    './Custom-Tag-Scroller-Ctrl'
],
    function (angular, customScrollerCtrl) {

        // scroller display module
        angular.module('custom-tag-scroller', [])
             .controller('customScrollerCtrl', function ($scope, $http, $stateParams, tagService, authService, displayService) {
                 return new customScrollerCtrl($scope, $http, $stateParams, tagService, authService, displayService);
             });
    });