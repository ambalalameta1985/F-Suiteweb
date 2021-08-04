// display js
define([
    'angular',
    './Tabular-Ctrl'
],
    function (angular,tabularCtrl) {

        // tabular display module
        angular.module('tabular', [])
             .controller('tabularCtrl', function ($scope, $http, $stateParams, $location, tagService, authService, displayService) {
                 return new tabularCtrl($scope, $http, $stateParams, $location, tagService, authService, displayService);
             });
    });