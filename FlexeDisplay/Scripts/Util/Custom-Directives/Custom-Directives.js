// directives js
define([
    'angular',
    './Focus/Focus',
    './Spinner/Spinner'
],
    function (angular, focus, spinner) {

        // focus
        angular.module('custom-directives', [])             
            .directive('uiFocus', focus)
            .directive('uiSpinner', spinner);
    });