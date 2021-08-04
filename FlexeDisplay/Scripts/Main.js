// basic setting for requirejs config
require.config({
    baseUrl: 'Scripts/',
    paths: {
        'angular': 'Lib/Angular/Angular',
        'ui-router': 'Lib/Angular/Angular-Ui-Router',
        'ngCookies': 'Lib/Angular/Angular-Cookies',
        'angular-filter': 'Lib/Angular/Angular-Filter',
        'ng-animate': 'Lib/Angular/Angular-Animate.min',
        'ui-bootstrap': 'Lib/Angular/Ui-Bootstrap-Tpls-1.3.3.min',
        'jquery': 'Lib/Jquery',
        'bootstrap': 'Lib/Bootstrap',
        'underscore': 'Lib/Underscore',
        'morris': 'Lib/Morris.min',
        'jasmine': 'Lib/Jasmine/Jasmine.min',
        'jasmine-html': 'Lib/Jasmine/Jasmine-Html.min',
        'jasmine-boot': 'Lib/Jasmine/Boot.min',
        'speedometer' : 'Lib/Speedometer'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'ui-router': {
            deps: ['angular'],
            exports: 'angular'
        },
        'ng-animate': {
            deps: ['angular'],
        },
        'ui-bootstrap': {
            deps: ['angular','ng-animate'],
        },
        'ngCookies': {
            deps: ['angular'],
        },
        'angular-filter': {
            deps: ['angular'],
            exports: 'angular'
        },
        bootstrap: {
            deps: ['jquery']
        },
        'speedometer' : {
            deps: ['jquery']
        },
        'morris': {
            deps: ['jquery'],
            exports: 'morris'
        },
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    },
    deps: ['Util/App']
});

// init application
require(['Util/App'], function (app) {

    app.init();
});


/*
// jasmine boot loader
require(['jquery', 'jasmine-html'], function ($, jasmine) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('Test-Cases/Spec/Login-Ctrl.spec');



    $(function () {
        require(specs, function (spec) {
            jasmineEnv.execute();
        });
    });

});

*/