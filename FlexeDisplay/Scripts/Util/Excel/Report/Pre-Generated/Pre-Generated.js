// display pregenerated js
define([
    'angular',
    './Pre-Generated-Ctrl'
],
    function (angular, pregeneratedCtrl) {

        // pregeneratedCtrl module
        angular.module('pregenerated', [])
             .controller('pregeneratedCtrl', function ($http) {
                 return new pregeneratedCtrl($http);
             });
    });