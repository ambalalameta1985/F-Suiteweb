// define user route for angular js
define(function () {

    // define routing
    var routes = function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
        // define state
        $stateProvider.state('Flex-eSuitelogin', {
             url: '/Flex-eSuitelogin',
             name: 'Flex-eSuitelogin',
             controller: 'loginCtrl as login',
             templateUrl: '/Templates/User/Login.html'
        })
            .state('signup', {
            url: '/signup',
            name: 'signup',
            controller: 'signupCtrl as signup',
            templateUrl: '/Templates/User/Signup.html'
        });
    }

    return routes;
});