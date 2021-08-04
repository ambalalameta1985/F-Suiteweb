define([
    'angular',
    './Display-Type-Ctrl'
],
    function (angular, displayTypeCtrl) {

        // funtion for display type directive
        var displayType = function () {

            // directive details for template
            return {
                restrict: 'E',
                templateUrl: '/Scripts/Util/Display/Display-Type/Display-Type.html',
                controller: 'displayTypeCtrl as displayType',
                scope: {                    
                    misDisplayView: '=',
                    tabularView: '=',
                    customTags: '=',
                    customTagView: '=',
                    scrollers: '='
                }
            };
        }

        // create module for display -type
        angular.module('display-type', [])
            .controller('displayTypeCtrl', function ($scope, $http, $q, $state, authService, tagService, displayService) {
                return new displayTypeCtrl($scope, $http, $q, $state, authService, tagService, displayService);
            })            
            .directive('display', displayType);
    });
