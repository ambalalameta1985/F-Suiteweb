// login js
define([
    'angular',    
    './Login-Ctrl'  
],
    function (angular, loginCtrl) {

        // login module
        angular.module('login', [])
             .controller('loginCtrl', function ($rootScope, $location, authService) {
                 return new loginCtrl($rootScope, $location, authService);
             });
    });
