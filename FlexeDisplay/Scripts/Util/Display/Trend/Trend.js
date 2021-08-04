// display Trend js
define([
    'angular',
    './Trend-Ctrl'    
],
    function (angular,trendCtrl) {

        // trend display module
        angular.module('trend', [])
             .controller('trendCtrl', function ($scope,  $http, $stateParams, tagService, authService, displayService) {
                 return new trendCtrl($scope, $http, $stateParams, tagService, authService, displayService);
             });
    });