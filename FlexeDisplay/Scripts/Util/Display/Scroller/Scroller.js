// display scroller js
define([
    'angular',
    './Scroller-Ctrl'
],
    function (angular, scrollerCtrl) {

        // scroller display module
        angular.module('scroller', [])
             .controller('scrollerCtrl', function ($scope, $http, $stateParams, tagService, authService) {
                 return new scrollerCtrl($scope, $http, $stateParams, tagService, authService);
             });
    });