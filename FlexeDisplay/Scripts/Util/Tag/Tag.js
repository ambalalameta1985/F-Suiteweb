// display tag
define([
    'angular',
    './Tag-Ctrl'
],
    function (angular, tagCtrl) {

        // tag-hierarchy module
        angular.module('tag-hierarchy', [])
             .controller('tagCtrl', function ($rootScope, $scope, $http, authService, $location, $compile) {
                 return new tagCtrl($rootScope, $scope, $http, authService, $location, $compile);
             });
    });