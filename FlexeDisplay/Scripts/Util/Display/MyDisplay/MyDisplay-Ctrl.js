// define mydisplay ctrl
define([
    'underscore'
],
    function (_) {

        // myDisplay object
        var myDisplayObj;

        // myDisplay controller
        var myDisplayCtrl = function ($scope, $http, $stateParams, $location, tagService, authService) {
            myDisplayObj = this;
            this.scope = $scope;
            this.http = $http;
            this.stateParams = $stateParams;
            this.authService = authService;
            this.location = $location;
            this.tagService = tagService;
            this.retrieveTagCollection();
        };

        // init myDisplay controller
        myDisplayCtrl.prototype.initMyDisplay = function () {

            var tabularInterval = setInterval(function () {
                tabularObj.retrieveParameterValue();
            }, 2000);


            // destroy interval
            this.scope.$on('$destroy', function () {
                clearInterval(tabularInterval);
            });
        }

        // retrieve tag collection
        myDisplayCtrl.prototype.retrieveTagCollection = function () {

            // get display object
            this.displayDetail = JSON.parse(this.stateParams.display);
            this.http.post('Display/DisplayType/TAG', {
                displayId: this.displayDetail.DisplayId
            }).
            success(function (response) {
                tabularObj.tags = response;
                tabularObj.initTabular();
            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // retrieve parameter value
        myDisplayCtrl.prototype.retrieveParameterValue = function () {

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
               //  if (response != "" && !response[0].IsCurrentUser)
               //      tabularObj.authService.clearCredentials();

                 _.each(response, function (value, index) {
                     _.map(tabularObj.tags, function (tag) {
                         if (tag.Tag_Id === value.Tag_Id) {

                             tag.Value = value.Value;
                             tag.Quality = value.Quality;
                             tag.Significance = value.Significance;
                             tag.Timestamp = value.Timestamp;

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
                     });
                 });
             }).
        error(function (xhr) {
            console.log(xhr);
        });
        }

        // set tag value color
        myDisplayCtrl.prototype.setTagValueColor = function (tagDetail) {
            return this.tagService.setTagValueColor(tagDetail);
        }

        // set Quality color
        myDisplayCtrl.prototype.setQualityColor = function (tagQuality) {
            return this.tagService.setQualityColor(tagQuality);
        }

        return myDisplayCtrl;
    });