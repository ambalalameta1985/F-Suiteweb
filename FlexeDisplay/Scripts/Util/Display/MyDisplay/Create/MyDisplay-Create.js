// mydisplay create js
define([
    'angular',
    './MyDisplay-Create-Ctrl'    
],
    function (angular, myDisplayCreateCtrl) {

        // mydisplay module
        angular.module('mydisplay-create', [])
             .controller('myDisplayCreateCtrl', function () {
                 return new myDisplayCreateCtrl();
             });
    });