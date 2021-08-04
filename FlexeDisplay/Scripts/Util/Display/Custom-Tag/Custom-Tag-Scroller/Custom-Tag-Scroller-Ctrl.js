// define tabular ctrl
define([
    'jquery',
    'underscore'
],
    function ($, _) {

        // scroller object
        var customScrollerObj;

        // display scroller controller
        var customScrollerCtrl = function ($scope, $http, $stateParams, tagService, authService, displayService) {

            this.scope = $scope;
            this.http = $http;
            this.activeTagIndex = 0;
            this.stateParams = $stateParams;
            this.tagService = tagService;
            this.authService = authService;
            this.displayService = displayService;
            this.retrieveTagByDisplaySelection();
            customScrollerObj = this;
        };

        // init scroller controller
        customScrollerCtrl.prototype.initScroller = function () {
            this.intervalScroller = setInterval(function () {
                customScrollerObj.retrieveParameterValue();
            }, 8000);

            // destroy interval
            this.scope.$on('$destroy', function () {
                clearInterval(customScrollerObj.intervalScroller);
            });
        }

        // retrieve tag collection as per display selection
        customScrollerCtrl.prototype.retrieveTagByDisplaySelection = function () {
            switch (this.displayService.currentDisplay.DisplayTypeId.Id) {
                case this.displayService.displayType.PLANTVIEW:
                    this.retrieveTagCollection();
                    break;
                case this.displayService.displayType.COMPARISONVIEW:
                    this.tags = this.scope.$parent.customTags;
                    this.initScroller();
                    break;
            }
        }

        // retrieve tag collection
        customScrollerCtrl.prototype.retrieveTagCollection = function () {
                this.http.post(this.stateParams.url, {
                    displayId: this.stateParams.displayId
                }).
             success(function (response) {
                 customScrollerObj.tags = response;
                 customScrollerObj.initScroller();
             }).
             error(function (xhr) {
                 console.log(xhr);
             });
        }

        // retrieve parameter value
        customScrollerCtrl.prototype.retrieveParameterValue = function () {

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
            //        customScrollerObj.authService.clearCredentials();

                _.each(response, function (value, index) {

                    _.map(customScrollerObj.tags, function (tag) {
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

                // @ flip slide
                var scrollerTag = $('.scroller-detail .scroller-tag');
                if (customScrollerObj.activeTagIndex >= (scrollerTag.length - 1))
                    customScrollerObj.activeTagIndex = 0;
                else
                    ++customScrollerObj.activeTagIndex;

            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // set tag value color
        customScrollerCtrl.prototype.setTagValueColor = function (tagDetail) {
            return this.tagService.setTagValueColor(tagDetail);
        }

        // set Quality color
        customScrollerCtrl.prototype.setQualityColor = function (tagQuality) {
            return this.tagService.setQualityColor(tagQuality);
        }

        return customScrollerCtrl;
    });