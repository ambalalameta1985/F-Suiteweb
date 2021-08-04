// define route for angular js
define(function () {

    // define routing
    var displayRoutes = function ($stateProvider, $urlRouterProvider, $locationProvider) {

        // define state
        $stateProvider
            .state('Flex-eDisplay.Index', {
                url: '/Index',
                name: 'display default',
                templateUrl: '/Templates/Display/Design/Index.html'
            })
            .state('Flex-eDisplay.Tabular', {
                url: '/Tabular',
                name: 'Tabular',
                controller: 'tabularCtrl as tabular',
                templateUrl: '/Templates/Display/Design/Tabular.html',
                params: {
                    isDetailView : "detail view",
                    url: 'tag url',
                    displayId: 'MIS Detail Object'
                }
            })
            .state('Flex-eDisplay.Mimic', {
                url: '/Mimic',
                name: 'Mimic',
                controller: 'mimicCtrl as mimic',
                templateUrl: '/Templates/Display/Design/Mimic.html',
                params: {
                    url: 'tag url',
                    display : 'display object',
                    displayId: 'MIS Detail Object'
                }
            })
            .state('Flex-eDisplay.Trend', {
                url: '/Trend',
                name: 'Trend',
                controller: 'trendCtrl as trend',
                templateUrl: '/Templates/Display/Design/Trend.html',
                params: {
                    url: 'tag url',
                    displayId: 'MIS Detail Object'
                }
            })
            .state('Flex-eDisplay.Scroller', {
                url: '/Scroller',
                name: 'Scroller',
                controller: 'scrollerCtrl as scroller',
                templateUrl: '/Templates/Display/Design/Scroller.html',               
                params: {
                    url: 'tag url',
                    displayId: 'MIS Detail Object',
                    isLoadDefaultScroller : false
                },
            })
            .state('Flex-eDisplay.Gauges', {
                url: '/Gauges',
                name: 'Gauges',
                controller: 'gaugeCtrl as gauge',
                templateUrl: '/Templates/Display/Design/Gauges.html',
                params: {
                    url: 'tag url',
                    displayId: 'MIS Detail Object'
                }
            })
            .state('Flex-eDisplay.Alarm', {
                url: '/Alarm',
                name: 'Alarm',
                templateUrl: '/Templates/Display/Design/Alarm.html',
                params: {
                    url: 'tag url',
                    displayId: 'MIS Detail Object'
                }
            }).state('Flex-eDisplay.Tag-Scroller', {
                url: '/Tag-Scroller',
                name: 'Tag-Scroller',
                controller: 'customScrollerCtrl as customScroller',
                templateUrl: '/Templates/Display/Custom-Tag/Custom-Tag-Scroller.html',
                params: {
                    url: 'tag url',
                    displayId: 'MIS Detail Object'
                }
            });
    }

    return displayRoutes;
});