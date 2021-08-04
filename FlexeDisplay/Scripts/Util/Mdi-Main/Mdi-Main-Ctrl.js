// mdi main ctrl
define([
    './Modules/Modules'
], function (modules) {

    // mdi main object
    var mdiMainObj = undefined;

    // define mdimain controller
    var mdiMainCtrl = function ($rootScope, authService) {

        this.authService = authService;
        this.user = $rootScope.globals.currentUser;
        this.initMdiMain();
        this.authService.checkCredentials();
        mdiMainObj = this;
    };

    // init excel
    mdiMainCtrl.prototype.initMdiMain = function () {        
        this.modules = modules;
        this.currentModule = this.modules[0];
    };

    // init excel
    mdiMainCtrl.prototype.activeModule = function (module) {
        return this.currentModule === module;
    };

    // init module
    mdiMainCtrl.prototype.setModule = function (module) {
        this.currentModule = module;
    };

    // logout
    mdiMainCtrl.prototype.logout = function () {
        this.authService.clearCredentials();
    };

    return mdiMainCtrl;
});