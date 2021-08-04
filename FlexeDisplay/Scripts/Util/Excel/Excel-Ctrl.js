// excel ctrl
define([], function () {

        // excel object
        var excelObj = undefined;

        // define excel controller
        var excelCtrl = function ($state,$rootScope, authService) {
            this.authService = authService;           
            this.state = $state;            
            this.user = $rootScope.globals.currentUser;
            this.toggleFilterPopup = false;
            this.initExcel();
            this.state.go('Flex-eReport.Instant');
            this.authService.checkCredentials();
            excelObj = this;
        };

        // init excel
        excelCtrl.prototype.initExcel = function () {

            // reports
            this.reports = [
                { 'id': 1, 'name': 'Instant Report', 'sref': 'Flex-eReport.Instant' },
                { 'id': 2, 'name': 'Auto-Generate Report', 'sref': 'Flex-eReport.Auto-Generate' },
            ];

            this.currentReport = this.reports[0];          
        };

        // init excel
        excelCtrl.prototype.activeReport = function (report) {            
            return this.currentReport === report;
        };

        // init excel
        excelCtrl.prototype.setReport = function (report) {
            this.currentReport = report;
        };

        // clearFilter
        excelCtrl.prototype.clearFilter = function (report) {
            this.toggleFilterPopup = false;
            this.searchGenerated = "";
            this.startDateFilter = undefined;
            this.endDateFilter = undefined;
        };

        // logout
        excelCtrl.prototype.logout = function () {
            this.authService.clearCredentials();
        };
        
        return excelCtrl;
    });