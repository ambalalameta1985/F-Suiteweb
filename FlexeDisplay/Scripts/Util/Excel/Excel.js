// display excel js
define([
    'angular',
    './Excel-Ctrl',
    './Report/Instant/Instant',
    './Report/Pre-Generated/Pre-Generated',
],
    function (angular, excelCtrl) {

        // excel module
        angular.module('flex-e-report', [
            'instant',
            'pregenerated'
        ])
             .controller('excelCtrl', function ($state, $rootScope, authService) {
                 return new excelCtrl($state, $rootScope, authService);
             })
            .filter("dateRange", function () {

                function parseDate(input) {
                    var parts = input.split('-');
                    return new Date(parts[2], parts[1] - 1, parts[0]);
                }

                return function (items, from, to) {

                    if (from && to && items) {
                        //var df = parseDate(from);
                        //var dt = parseDate(to);

                        from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
                        to = new Date(to.getFullYear(), to.getMonth(), to.getDate());

                        var result = [];
                        for (var i = 0; i < items.length; i++) {
                            var reportDate = new Date(parseInt(items[i].ReportDate.substr(6)));
                            if (reportDate >= from && reportDate <= to) {
                                result.push(items[i]);
                            }
                        }
                        return result;
                    }
                    else
                        return items
                };


            });;
    });