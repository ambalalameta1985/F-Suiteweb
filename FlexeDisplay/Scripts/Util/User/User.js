// authentication services
define([
    'angular',
    './Login/Login',
    './Signup/Signup',
],
    function (angular) {

        // user module
        angular.module('user', [
            'login',
            'signup'
        ])
    });