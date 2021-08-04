// display mdi main
define([
    'angular',
    './Mdi-Main-Ctrl'
],
    function (angular, mdiMainCtrl) {

        // mdi main module
        angular.module('mdi-main', [])
             .controller('mdiMainCtrl', function ($rootScope, authService) {
                 return new mdiMainCtrl($rootScope, authService);
             });
    });