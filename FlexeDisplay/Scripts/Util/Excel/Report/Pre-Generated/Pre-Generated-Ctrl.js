// pregenerated ctrl
define([], function () {

        // pregenerated object
        var pregeneratedObj = undefined;

        // define pregenerated controller
        var pregeneratedCtrl = function ($http) {

            this.http = $http;
            this.init();
            pregeneratedObj = this;
        };
    
        // load pregeneratedCtrl
        pregeneratedCtrl.prototype.init = function () {     
            this.http.post('Excel/Report/SCHEDULEDREPORTS')
            .success(function (response) {
                pregeneratedObj.reports = response;
            });
        };

        // setCurrentReport pregeneratedCtrl
        pregeneratedCtrl.prototype.setCurrentReport = function (report) {
            this.currentReport = report;
            window.location.href = report.Url;
        };
        
        // toggle display type
        pregeneratedCtrl.prototype.toggleReport = function (event) {

            // toggle
            var target = $(event.currentTarget);
            $('.icon', target).toggleClass('fa-caret-down fa-caret-right');
            $(target.next()).slideToggle();
        }

        return pregeneratedCtrl;
    });