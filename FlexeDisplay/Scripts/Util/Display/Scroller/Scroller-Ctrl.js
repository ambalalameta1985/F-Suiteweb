// define tabular ctrl
define([
    'jquery',
    'underscore'
],
    function ($, _) {

        // scroller object
        var scrollerObj;

        // display scroller controller
        var scrollerCtrl = function ($scope, $http, $stateParams, tagService, authService) {
           
            this.scope = $scope;
            this.http = $http;
            this.stateParams = $stateParams;
            this.tagService = tagService;
            this.authService = authService;
            this.activeTagIndexs = [];
            this.retrieveDisplay();
            this.retrieveTagCollection();
            scrollerObj = this;
        };

        // init scroller controller
        scrollerCtrl.prototype.retrieveDisplay = function () {
            this.scrollers = this.scope.$parent.scrollers;
            this.tags = this.scope.$parent.scrollerTags;           
        }

        // init scroller controller
        scrollerCtrl.prototype.close = function (index) {
            clearInterval(this.intervalScroller);
            this.tags = this.tags.filter(function (item, idx) {
                return item.Display_Id != scrollerObj.scrollers[index].DisplayId;                    
            });          
            this.scope.$parent.scrollerTags = this.tags;
            this.scrollers.splice(index, 1);
            this.activeTagIndexs.splice(index, 1);
            this.initScroller();
        }

        // init scroller controller
        scrollerCtrl.prototype.initScroller = function () {
            this.intervalScroller = setInterval(function () {
                scrollerObj.retrieveParameterValue();
            }, 8000);

            // destroy interval
            this.scope.$on('$destroy', function () {
                clearInterval(scrollerObj.intervalScroller);
            });
        }

        // retrieve tag collection
        scrollerCtrl.prototype.retrieveTagCollection = function () {

            var isLoadDefaultScroller = this.stateParams.isLoadDefaultScroller;
            var displayKeys = '';
            if (isLoadDefaultScroller) {
                _.each(this.scrollers, function (value, index) {
                    displayKeys += value.DisplayId + ",";
                });
                displayKeys = displayKeys.replace(/,(?=[^,]*$)/, '');
            }
            else {
                displayKeys = this.scrollers[this.scrollers.length - 1].DisplayId;
            }

            this.http.post('Display/DisplayType/TAG', {
                displayId: displayKeys
            }).
            success(function (response) {               
                if (isLoadDefaultScroller)
                    scrollerObj.tags = response;
                else
                    scrollerObj.tags = scrollerObj.tags.concat(response);

                scrollerObj.scope.$parent.scrollerTags = scrollerObj.tags;
                scrollerObj.initScroller();                
            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // retrieve parameter value
        scrollerCtrl.prototype.retrieveParameterValue = function () {

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

            //    if (response != "" && !response[0].IsCurrentUser)
             //       scrollerObj.authService.clearCredentials();

                _.each(response, function (value, index) {

                    _.map(scrollerObj.tags, function (tag) {
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
                var activeTag = $('.scroller-detail .scroller-tag.active');
                $.each(activeTag, function (idx, val) {
                    var activeTag = $(val);
                    var parentTag = $(val.parentNode);
                    var tags = $('.scroller-tag', val.parentNode);
                    var tagLength = tags.length;
                    var currentActiveIndex = 0;

                    if (activeTag.index() != tagLength)
                        currentActiveIndex = activeTag.index();
                    
                    scrollerObj.activeTagIndexs[parseInt(activeTag.attr('data-parent-index'))] = currentActiveIndex;
                });
            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // set tag value color
        scrollerCtrl.prototype.setTagValueColor = function (tagDetail) {
            return this.tagService.setTagValueColor(tagDetail);
        }

        // set Quality color
        scrollerCtrl.prototype.setQualityColor = function (tagQuality) {
            return this.tagService.setQualityColor(tagQuality);
        }

        return scrollerCtrl;
    });