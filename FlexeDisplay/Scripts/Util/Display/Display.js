// display js
define([
    'angular',
    './Display-Ctrl',
    './Service/Display-Service',
    './Service/Tag-Service',
    './Display-Type/Display-Type',
    './Tabular/Tabular',
    './Mimic/Mimic',
    './Trend/Trend',
    './Scroller/Scroller',
    './Gauge/Gauge',
    './MyDisplay/MyDisplay',    
    './Custom-Tag/Custom-Tag'    
],
    function (angular, displayCtrl, displayService, tagService) {

        angular.module('flex-e-display', [
                'display-type',                     // load display type module
                'tabular',                          // load tabular module
                'mimic',                            // load mimic module
                'trend',                            // load trend module
                'scroller',                         // load scroller module
                'gauge',                            // load gauge module
                'mydisplay',                        // my display module,               
                'custom-tag'                        // custom-tag                    
        ])
             .controller('displayCtrl', function ($scope,$rootScope, $location, authService, displayService) {
                 return new displayCtrl($scope, $rootScope, $location, authService, displayService);
             })
             .service('displayService', displayService)
             .service('tagService', tagService);
    });