// display excel js
define([
    'angular',
    './Instant-Ctrl',
    './Report-Filter/Report-Filter-Ctrl'
],
    function (angular, instantCtrl, reportFilterCtrl) {

        // instantCtrl module
        angular.module('instant', [])
             .controller('instantCtrl', function ($http, $uibModal) {
                 return new instantCtrl($http,  $uibModal);
             })
          .controller('reportFilterCtrl', function ($uibModalInstance, param) {
              return new reportFilterCtrl($uibModalInstance, param);
          });
    });