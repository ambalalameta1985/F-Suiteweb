// define route for excel 
define(function () {

    // define routing
    var routes = function ($stateProvider, $urlRouterProvider, $locationProvider) {
      
        // define state
        $stateProvider
            .state('Flex-eReport.Instant', {
                url: '/Instant',
                name: 'Instant',
                controller: 'instantCtrl as instant',
                templateUrl: '/Templates/Excel/Report/Instant.html'
            })
            .state('Flex-eReport.Auto-Generate', {
                url: '/Auto-Generate',
                name: 'Auto-Generate',
                controller: 'pregeneratedCtrl as pregenerated',
                templateUrl: '/Templates/Excel/Report/Pre-Generated.html'
            });
    }

    return routes;
});