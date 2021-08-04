// authentication services
define([
    'angular',
    './Authentication-Service/Auth-Service',
    './Base64/Base64'
],
    function (angular, authService, base64) {

        // authentication services
        angular.module('custom-services', [])
             .factory('base64', base64)
             .factory('authService', authService);
    });