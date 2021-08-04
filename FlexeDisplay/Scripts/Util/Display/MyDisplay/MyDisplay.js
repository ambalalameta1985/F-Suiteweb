// mydisplay js
define([
    'angular',
    './MyDisplay-Ctrl',
    './Create/MyDisplay-Create'
],
    function (angular, myDisplayCtrl, myDisplayCreate) {

        // mydisplay module
        angular.module('mydisplay', [
            'mydisplay-create'
        ])
             .controller('myDisplayCtrl', function ($scope, $http, $stateParams, $location, tagService, authService) {
                 return new myDisplayCtrl($scope, $http, $stateParams, $location, tagService, authService);
             });
    });