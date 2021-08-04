// angular app file
define([
    'angular',
    'ui-router',
    'ngCookies',
    'angular-filter',
    'ui-bootstrap',

    './Routes/Routes',
    './Routes/User-Routes',
    './Routes/Display-Routes',
    './Routes/Excel-Routes',

    './Custom-Directives/Custom-Directives',
     './Custom-Services/Custom-Services',
    './Mdi-Main/Mdi-Main',
    './Tag/Tag',
    './Display/Display',
    './Excel/Excel',
    './User/User'

], function (angular,
                uiRouter,
                ngCookies,
                angularFilter,
                uiBootstrap,

                routes,
                userRoutes,
                displayRoutes,
                excelRoutes,

                customDirectives,
                customServices,
                mdiMain,
                tag,
                display,
                excel,
                user) {

    // defining module in dot net
    var app = angular.module('flex-e-suite', [
        'ui.router',
        'ngCookies',
        'angular.filter',
        'ui.bootstrap',
        'custom-directives',
        'custom-services',
        'mdi-main',
        'tag-hierarchy',
        'flex-e-display',
        'flex-e-report',
        'user'
    ]);

    app.config(function ($sceDelegateProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
    });

    //global service
    app.constant("URL",
    {
        baseAddress: "http://192.124.120.118/",
        api: "http://192.124.120.118/api"
    });

    //manual bootstrap
    app.init = function () {
        angular.bootstrap(document, ['flex-e-suite']);
    };

    // filter for data which come from json format to javascript
    app.filter("jsDate", function () {
        return function (x) {
            try {
                return new Date(parseInt(x.substr(6)));
            } catch (e) {

            }
        };
    });

    app.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        //$rootScope.globals = $cookieStore.get('globals') || {};
        if (localStorage.globals) {
            $rootScope.globals = JSON.parse(localStorage.globals);
            sessionStorage.setItem("globals", JSON.stringify($rootScope.globals));
        }
        else if (sessionStorage.globals)
            $rootScope.globals = JSON.parse(sessionStorage.globals);

        if ($rootScope.globals) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line           
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/Flex-eSuitelogin' && !$rootScope.globals) {
                $location.path('/Flex-eSuitelogin');
            }
        });
    }]);

    // config routes
    app.config(routes);
    app.config(userRoutes);
    app.config(displayRoutes);
    app.config(excelRoutes);

    return app;
});