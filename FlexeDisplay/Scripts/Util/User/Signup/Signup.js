// signup js
define([
    'angular',
    './Signup-Ctrl'
],
    function (angular, signupCtrl) {

        // signup module
        angular.module('signup', [])
             .controller('signupCtrl', function ($http, $state) {
                 return new signupCtrl($http, $state);
             });
    });
