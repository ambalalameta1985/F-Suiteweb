// define route for angular js
define(function () {

    // define routing
    var routes = function ($stateProvider, $urlRouterProvider, $locationProvider) {      

        // url otherwise
        $urlRouterProvider.otherwise('/Flex-eSuitelogin');

        // define state
        $stateProvider.state('default', {
            url: '/',
            name: 'default',
            controller: 'loginCtrl as login',
            templateUrl: '/Templates/User/Login.html'
        })
            .state('Flex-eSuiteHome', {
                url: '/Flex-eSuiteHome',
                name: 'Flex-eSuiteHome',
                controller: 'mdiMainCtrl as mdiMain',
                templateUrl: '/Templates/Mdi-Main/Mdi-Main.html'
            })
             .state('Flex-eSuiteTag', {
                 url: '/Flex-eSuiteTag',
                 name: 'Flex-eSuiteTag',
                 controller: 'tagCtrl as tag',
                 templateUrl: '/Templates/Tag/Tag.html'
             })
            .state('Flex-eDisplay', {
                url: '/Flex-eDisplay',
                name: 'Flex-eDisplay',
                controller: 'displayCtrl as display',
                templateUrl: '/Templates/Display/Display.html'
            })
            .state('Flex-eReport', {
                url: '/Flex-eReport',
                name: 'Flex-eReport',
                controller: 'excelCtrl as excel',
                templateUrl: '/Templates/Excel/Excel.html'
            });


        //$locationProvider.html5Mode(true);
    }

    return routes;
});