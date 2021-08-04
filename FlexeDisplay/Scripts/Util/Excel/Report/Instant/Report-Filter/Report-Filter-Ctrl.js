// report filter ctrl
define([], function () {

    // report filter object
    var reportFilterObj = undefined;

    // modal date type
    var modalDateType = {
        INTERVAL: 1,
        SINGLE: 2
    };

    // define instant controller
    var reportFilterCtrl = function ($uibModalInstance, param) {
        this.uibModalInstance = $uibModalInstance;
        this.param = param;
        this.initFilter();
        reportFilterObj = this;
    };

    // init filter
    reportFilterCtrl.prototype.initFilter = function () {
        this.startDate = new Date();
        this.endDate = new Date();
        this.reportDate = new Date();
    };

    // ok
    reportFilterCtrl.prototype.generate = function () {

        // if modal date selection
        if (this.param.modalDateType === modalDateType.SINGLE) {
            this.startDate = this.reportDate;
            this.endDate = this.reportDate;
        }

        // modal close
        this.uibModalInstance.close({
            startDate: this.startDate,
            endDate: this.endDate
        });
    };

    // cancel
    reportFilterCtrl.prototype.cancel = function () {
        this.uibModalInstance.dismiss('cancel');
    };

    return reportFilterCtrl;
});