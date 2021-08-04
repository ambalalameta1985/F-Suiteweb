// define gauge ctrl
define([
    'jquery',
    'underscore'   
],
    function ($, _) {

        // gauge object
        var gaugeObj;

        // display gauge controller
        var gaugeCtrl = function ($scope, $http, $stateParams, $location, tagService, authService, displayService) {

            gaugeObj = this;
            this.scope = $scope;
            this.http = $http;            
            this.location = $location;
            this.stateParams = $stateParams;
            this.tagService = tagService;
            this.authService = authService;
            this.displayService = displayService;
            this.retrieveTagByDisplaySelection();
        };

        // init tabular controller
        gaugeCtrl.prototype.initGuage = function () {
            var gaugeInterval = setInterval(function () {
                gaugeObj.retrieveParameterValue();
            }, 2000);


            // destroy interval
            this.scope.$on('$destroy', function () {
                clearInterval(gaugeInterval);
            });
        }

         // retrieve tag collection
        gaugeCtrl.prototype.retrieveTagByDisplaySelection = function () {

            switch (this.displayService.currentDisplay.DisplayTypeId.Id) {
                case this.displayService.displayType.GAUGES:
                case this.displayService.displayType.PLANTVIEW:
                    this.retrieveTagCollection();
                    break;
                case this.displayService.displayType.COMPARISONVIEW:
                    this.tags = this.scope.$parent.customTags;
                    this.initGuage();

                    setTimeout(function () {
                        gaugeObj.gauges = $(".gauge-control");
                    });

                    // on gauge control updated
                    this.scope.$on('onGaugeControlChanged', function (event, args) {
                        gaugeObj.updateGaugesControl();
                    });
                    break;
            }
        }

        // retrieve tag collection
        gaugeCtrl.prototype.retrieveTagCollection = function () {          
            this.http.post(this.stateParams.url, {
                displayId: this.stateParams.displayId
            }).
            success(function (response) {
                gaugeObj.tags = response;
                gaugeObj.initGuage();
               
                setTimeout(function () {                
                    gaugeObj.gauges = $(".gauge-control");
                });
            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // retrieve tag collection
        gaugeCtrl.prototype.updateGaugesControl = function () {
            setTimeout(function () {
                customTagGaugeObj.gauges = $(".gauge-control");
            });
        }
    
        // retrieve parameter value
        gaugeCtrl.prototype.retrieveParameterValue = function () {

            var tagKeys = '';
            _.each(this.tags, function (value, index) {
                tagKeys += value.Tag_Id + ",";
            });

            tagKeys = tagKeys.replace(/,(?=[^,]*$)/, '');

            var user = JSON.parse(sessionStorage.globals);
            this.http.post("/Display/DisplayType/VALUE", {
                tagKeys: tagKeys
            }, {
                headers: {
                    'X-User-Id': user.currentUser.userid,
                    'Session-Token': sessionStorage.__SESSIONTOKEN__
                }
            }).
             success(function (response) {
              //   if (response != "" && !response[0].IsCurrentUser)
              //       gaugeObj.authService.clearCredentials();

                 _.each(response, function (value, index) {
                     _.map(gaugeObj.tags, function (tag, tagIndex) {
                         if (tag.Tag_Id === value.Tag_Id) {

                             tag.Quality = value.Quality;
                             tag.Significance = value.Significance;
                             tag.Timestamp = value.Timestamp;

                             // check whether significance 301 boolean type
                             if (tag.Significance === 301) tag.Value = value.Value == "ON" ? 1 : 0;
                             else tag.Value = value.Value;

                             // minium and maximum value for tag timestamp
                             if (tag.MinValue == "NA" || tag.MaxValue == "NA") {
                                 tag.MinValue = tag.Value;
                                 tag.MinTimestamp = tag.Timestamp;

                                 tag.MaxValue = tag.Value;
                                 tag.MaxTimestamp = tag.Timestamp;
                             }
                             else {
                                 // check if existing value is less than current
                                 if (parseFloat(tag.Value) < parseFloat(tag.MinValue)) {
                                     tag.MinValue = tag.Value;
                                     tag.MinTimestamp = tag.Timestamp;
                                 }

                                 // check if existing value is greater than current
                                 if (parseFloat(tag.Value) > parseFloat(tag.MaxValue)) {
                                     tag.MaxValue = tag.Value;
                                     tag.MaxTimestamp = tag.Timestamp;
                                 }
                             }
                         }

                         $('.speedPosition', gaugeObj.gauges[tagIndex].parentNode).css('color', gaugeObj.tagService.setTagValueColor(tag));
                         gaugeObj.gauges[tagIndex].setAttribute('value', parseFloat(tag.Value).toFixed(2));
                         gaugeObj.gauges.change();
                     });
                 });
             }).
        error(function (xhr) {
            console.log(xhr);
        });
        }

        return gaugeCtrl;
    });