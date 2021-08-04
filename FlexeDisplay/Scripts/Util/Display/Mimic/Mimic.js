// display js
define([
    'angular',
    './Mimic-Ctrl'
],
    function (angular, mimicCtrl) {

        // mimic display module
        angular.module('mimic', [])
             .controller('mimicCtrl', function ($scope, $q, $http, $stateParams, tagService, authService) {
                 return new mimicCtrl($scope, $q, $http, $stateParams, tagService, authService);
             });
    });