// instant ctrl
define([], function () {

    // instant object
    var instantObj = undefined;

    // modal date type
    var modalDateType = {
        INTERVAL: 1,
        SINGLE: 2
    };

    // define instant controller
    var instantCtrl = function ($http, $uibModal) {

        this.http = $http;
        this.uibModal = $uibModal;
        this.currentReport = undefined;

        this.loadReport();
        instantObj = this;
    };

    // load report
    instantCtrl.prototype.loadReport = function () {
        this.http.post('Excel/Report/REPORTMASTER')
        .success(function (response) {
            instantObj.instantReports = response;
        });
    };

    // load report
    instantCtrl.prototype.activeReport = function (report) {
        return this.currentReport === report;
    };

    // open modal
    instantCtrl.prototype.execute = function (report) {

        // set current report
        this.currentReport = report;
        var modalInstance = this.uibModal.open({
            animation: true,
            templateUrl: 'instantModal.html',
            controller: 'reportFilterCtrl',
            controllerAs: 'reportFilter',
            backdropClass: 'backdrop-white',
            resolve: {
                param: function () {
                    return {
                        report: instantObj.currentReport,
                        modalDateType: instantObj.modalDateSelection()
                    };
                }
            }
        });

        // result from modal instance
        modalInstance.result.then(function (intervalDate) {
            instantObj.generate(intervalDate);
        }, function () {

            // modal dismiss
            //console.log('Modal dismissed at: ' + new Date());
        });
    };

    // generate report
    instantCtrl.prototype.generate = function (intervalDate) {

        this.loader = true;
        document.documentElement.style.cursor = "progress";
        this.http.post('Excel/Report/GENERATEREPORT', {
            iReportId: this.currentReport.Report_Id,
            dStartDate: intervalDate.startDate,
            dEndDate: intervalDate.endDate,
        })
        .then(function (response) {

            // successs
            if (response.data != '')
               window.location.href = "/InstantReports/" + response.data;
        },
            function (error) {
                // error
                console.log(error);
            })
        .then(function () {

            // complete
            instantObj.loader = false;
            document.documentElement.style.cursor = "default";
        });
    }

    // modal date type selection
    instantCtrl.prototype.modalDateSelection = function () {
        var sCode = this.currentReport.Category_Code.split('-');
        switch (sCode[1]) {
            case "IT":
            case "DD":
            case "WW":
            case "MM":
                return modalDateType.SINGLE;
                break;
            default:
                switch (sCode[0]) {
                    case "IT":
                        return modalDateType.INTERVAL;
                        break;
                    default:
                        return modalDateType.SINGLE;
                        break;
                }
        }
    }

    return instantCtrl;
});