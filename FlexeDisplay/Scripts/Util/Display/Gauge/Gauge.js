// gauge js
define([
    'angular',
    './Gauge-Ctrl',
    './Gauge-Control/Gauge-Control'
],
    function (angular, gaugeCtrl, gaugeControl) {

        // tabular display module
        angular.module('gauge', [])
             .controller('gaugeCtrl', function ($scope, $http, $stateParams, $location, tagService, authService, displayService) {
                 return new gaugeCtrl($scope, $http, $stateParams, $location, tagService, authService, displayService);
             })
            .directive('gaugeControl', gaugeControl);
    });