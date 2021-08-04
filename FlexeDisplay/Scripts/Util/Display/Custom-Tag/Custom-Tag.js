// custom tag display js
define([
    'angular',    
    './Custom-Tag-Scroller/Custom-Tag-Scroller'    
],
    function (angular) {

        // Custom-Tag-tabular display module
        angular.module('custom-tag', [
            'custom-tag-scroller'
        ]);
    });