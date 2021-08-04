
// display ctrl
define([
    'jquery'
],
    function (jQ) {

        var displayObj = undefined;

        // display controller
        var displayCtrl = function ($scope, $rootScope, $location, authService, displayService) {

            displayObj = this;            
            this.scope = $scope;            
            this.scope.scrollers = [];
            this.scope.scrollerTags = [];
            this.scope.customTags = [];
            this.location = $location;
            this.authService = authService;
            this.displayService = displayService;
            this.user = $rootScope.globals.currentUser;
            this.retrieveElement();
            this.isFullScreen = false;

            this.scope.misDisplayView = 'Summarised View';
            this.scope.tabularView = 'Summarised View';
            this.scope.customTagView = 'Summarised View';

            this.initializeDisplay();
            this.location.path("/Flex-eDisplay/Index");
            this.authService.checkCredentials();
        };

        // init display method
        displayCtrl.prototype.initializeDisplay = function () {
            this.prepareEvent();
            this.displayService.currentDisplay = undefined;
            if (sessionStorage.customTags) {
                this.scope.customTags = JSON.parse(sessionStorage.customTags);
            }
        };

        // init display method
        displayCtrl.prototype.prepareEvent = function () {

            // prepare event for diplay
            this.scope.$on('onDisplayCustomTagGauge', function () {
                displayObj.scope.$broadcast('onGaugeControlChanged', {});
            });

            this.scope.$on('onDisplayCustomTagTrend', function (event, args) {
                displayObj.scope.$broadcast('onTrendTagLoaded', {
                    isPush: args.isPush,
                    tag: args.tag,
                    index: args.index,
                });
            });
        };

        // init display method
        displayCtrl.prototype.retrieveElement = function () {
            this.displayOption = jQ('.display-option');
            this.displayView = jQ('.display-view');
            this.displayDetail = jQ('.display-detail');
            this.fullscreen = jQ('#display-fullscreen');
            this.categoryContent = jQ('.category-content');
            this.normal = jQ('#display-normal');
            this.header = jQ('.header');
            this.footer = jQ('.footer');
        };

        // init display method
        displayCtrl.prototype.fullScreen = function (event) {

            event.currentTarget.classList.toggle('ng-hide');
            this.normal.toggleClass('ng-hide');
            this.header.toggleClass('ng-hide');
            this.footer.toggleClass('ng-hide');
            this.displayOption.addClass('ng-hide');
            this.displayView.removeClass('col-md-10 col-sm-10 col-xs-10');
            this.displayDetail.css('height', '96vh');
            this.isFullScreen = true;
        };

        // init display method
        displayCtrl.prototype.normalScreen = function (event) {

            event.currentTarget.classList.toggle('ng-hide');
            this.fullscreen.toggleClass('ng-hide');
            this.header.toggleClass('ng-hide');
            this.footer.toggleClass('ng-hide');
            this.displayOption.removeClass('ng-hide');
            this.displayView.addClass('col-md-10 col-sm-10  col-xs-10');
            this.displayDetail.css('height', '78vh');
            this.categoryContent.css('height', '76vh');
            this.isFullScreen = false;
        };

        // toggle display bar
        displayCtrl.prototype.toggleDisplayBar = function () {
            this.displayOption.toggleClass('ng-hide');
            this.displayView.toggleClass('col-md-10 col-sm-10');
            this.categoryContent.css('height', '94vh');
        };

        // change display view
        displayCtrl.prototype.changePlantView = function (misViewType) {
            this.scope.misDisplayView = misViewType;
            this.scope.$broadcast('onloadPlantView', {
                tag: {
                    NAME: this.displayService.currentDisplay.DisplayName,
                    TAG_ID: this.displayService.currentDisplay.DisplayId
                },
                misView: misViewType
            });
        };

        // change display view
        displayCtrl.prototype.changeTabularView = function (tabularView) {
            this.scope.tabularView = tabularView;
            this.scope.$broadcast('onloadTabularView', {
                tabularView: tabularView
            });
        };

        // change display view
        displayCtrl.prototype.changeComparisonView = function (tagView) {
            this.scope.customTagView = tagView;
            this.scope.$broadcast('onloadComparisonView', {
                tagView: tagView
            });
        };

        // logout
        displayCtrl.prototype.logout = function () {
            this.authService.clearCredentials();
        };

        // logout
        displayCtrl.prototype.home = function () {
            sessionStorage.customTags = JSON.stringify(this.scope.customTags);
            this.location.path('/Flex-eSuiteHome');
        };

        return displayCtrl;
    });