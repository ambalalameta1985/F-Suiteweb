define([
    'jquery',
    'underscore'
],
    function ($, _) {

        // hold instance of display type
        var displayTypeObj;

        // create controller of display type 
        var displayTypeCtrl = function ($scope, $http, $q, $state, authService, tagService, displayService) {
            displayTypeObj = this;

            this.q = $q;
            this.http = $http;
            this.scope = $scope;
            this.state = $state;
            this.authService = authService;
            this.tagService = tagService;
            this.displayService = displayService;
            this.displayTypes = [];
            this.initDisplayType();
        };

        // get display type and their detail
        displayTypeCtrl.prototype.initDisplayType = function () {
            this.retrieveDisplays().then(function () {
                displayTypeObj.retrieveCustomDisplayTag().then(function (response) {

                    displayTypeObj.plantViewtags = displayTypeObj.displayService.prepareJsonTree(response, 'TAG_ID', 'PARENT_ID', 'CHILD');
                    displayTypeObj.comparisonViewtags = angular.copy(displayTypeObj.plantViewtags);
                });
            });

            this.scope.$on('onloadPlantView', function (event, args) {
                displayTypeObj.loadPlantView(args.tag, args.misView);
            });

            this.scope.$on('onloadTabularView', function (event, args) {
                displayTypeObj.changeTabularView(args.tabularView);
            });

            this.scope.$on('onloadComparisonView', function (event, args) {
                displayTypeObj.changeTagView(args.tagView);
            });
        };

        // get display type and their detail
        displayTypeCtrl.prototype.retrieveDisplays = function () {
            return this.q(function (resolve, reject) {
                var user = JSON.parse(sessionStorage.globals);
                displayTypeObj.http({
                    url: '/Display/DisplayType/GET',
                    dataType: 'json',
                    method: 'POST',
                    headers: {
                        'X-User-Id': user.currentUser.userid,
                        'Session-Token': sessionStorage.__SESSIONTOKEN__
                    }
                })
                    .success(function (response) {
                        displayTypeObj.displayTypes = response;

                        //add custom display of `PLANET VIEW` and `COMPARISON VIEW`
                        displayTypeObj.displayTypes.push(displayTypeObj.displayService.customDisplayType[0]);
                        displayTypeObj.displayTypes.push(displayTypeObj.displayService.customDisplayType[1]);
                        resolve(true);
                    })
                .error(function (xhr) {
                    console.log("METHOD DISPLAYTYPECTRL/GET :" + xhr.responseText);
                    reject(true);
                });
            });
        }

        // retrieve custom display tag for `Planet View` and `Comparison View`
        displayTypeCtrl.prototype.retrieveCustomDisplayTag = function () {
            return this.q(function (resolve, reject) {
                displayTypeObj.http({
                    url: '/tag/tag/TAGHIERARCHY',
                    dataType: 'json',
                    method: 'POST'
                })
                    .success(function (response) {
                        resolve(response);
                    })
                .error(function (xhr) {
                    console.log("METHOD tag/tagHIERARCHY :" + xhr.responseText);
                    reject(true);
                });
            });
        }

        // redirect to mis display
        displayTypeCtrl.prototype.retrieveTimestampedTag = function (event, tag) {
            if (tag.TAG_TYPE_ID == this.tagService.tagType.timestamped) return;
            this.http.post('Tag/Tag/TIMESPAMPEDTAG', {
                displayId: tag.TAG_ID
            }).
               success(function (response) {
                   displayTypeObj.loadTimestampedTag(tag, response);

                   setTimeout(function () {
                       displayTypeObj.toggle(event);
                       displayTypeObj.loadComparisonView();
                   });
               });
        }

        // load timestamped tag and checked for already exists tag
        displayTypeCtrl.prototype.loadTimestampedTag = function (parentTag, childTags) {
            childTags.forEach(function (tstag, tagIndex) {
                var isChecked = _.find(displayTypeObj.scope.customTags, function (tag, index) {
                    return tag.Tag_Id === tstag.TAG_ID;
                });
                tstag.checked = isChecked ? true : false;
            });
            parentTag.CHILD = childTags;
        }

        // redirect to mis display
        displayTypeCtrl.prototype.loadComparisonView = function () {
            if (this.displayService.currentDisplay.DisplayTypeId.Id != this.displayService.displayType.COMPARISONVIEW) {
                this.displayService.currentDisplay = this.displayService.customDisplayType[1];
                this.scope.customTagView = 'Summarised View';
                this.state.go('Flex-eDisplay.Tabular', {
                    isDetailView: false,
                    displayId: this.displayService.currentDisplay.DisplayId,
                    isLoadDefaultScroller: true
                });
            }
        }

        // set current display detail
        displayTypeCtrl.prototype.selectDisplay = function (display) {
            var sref = undefined;
            switch (parseInt(display.DisplayTypeId.Id)) {
                case this.displayService.displayType.TRENDS: sref = 'Flex-eDisplay.Trend'; this.scope.scrollers.length = 0; break;
                case this.displayService.displayType.GAUGES: sref = 'Flex-eDisplay.Gauges'; this.scope.scrollers.length = 0; break;
                case this.displayService.displayType.MIMICS: sref = 'Flex-eDisplay.Mimic'; this.scope.scrollers.length = 0; break;
                case this.displayService.displayType.TABULARS: sref = 'Flex-eDisplay.Tabular'; this.scope.scrollers.length = 0; this.scope.tabularView = 'Summarised View'; break;
                case this.displayService.displayType.SCROLLERS: sref = 'Flex-eDisplay.Scroller';
                    var isDisplayExists = _.find(this.scope.scrollers, function (item) {
                        return item.DisplayId === display.DisplayId
                    });
                    if (isDisplayExists) return;
                    this.scope.scrollers.push(display);
                    break;

                case this.displayService.displayType.MYDISPLAYS: sref = 'Flex-eDisplay.MyDisplay'; this.scope.scrollers.length = 0; break;
                case this.displayService.displayType.ALARMS: sref = 'Flex-eDisplay.Alarm'; this.scope.scrollers.length = 0; break;
                case this.displayService.displayType.PLANTVIEW: sref = 'Flex-eDisplay.Tabular'; this.scope.scrollers.length = 0; break;
            }
            this.displayService.currentDisplay = display;
            this.state.go(sref, {
                isDetailView: false,
                url: 'Display/DisplayType/TAG',
                display: display,
                displayId: display.DisplayId,
                isLoadDefaultScroller: false
            })
        }

        // redirect to mis display
        displayTypeCtrl.prototype.toggleComparisonView = function (event) {
            this.toggle(event);
            this.loadComparisonView();
        }

        // toggle tree in display
        displayTypeCtrl.prototype.toggle = function (event) {
            var target = event.target.parentNode;
            $('.icon', target).toggleClass('fa-caret-down fa-caret-right');
            $('.display-link-panel:first', target.parentNode).slideToggle();
        }

        // check display detail show or not
        displayTypeCtrl.prototype.isShowDisplay = function (display) {

            return display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.TRENDS ||
               display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.MIMICS ||
               display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.TABULARS ||
               display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.GAUGES ||
               display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.COMPARISONVIEW ||
               display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.PLANTVIEW ||
               display.DisplayTypeId.Id === displayTypeObj.displayService.displayType.SCROLLERS;
        }

        // redirect to mis display
        displayTypeCtrl.prototype.onTagCheckedChanged = function (event, tag) {            
            var tagIndex, isPush;
            if (event.currentTarget.checked) {
                this.scope.customTags.push(tag.TAG_DETAIL);
                this.loadComparisonView();
                isPush = true; tagIndex = this.scope.customTags.length - 1;
            }
            else {
                var index = this.scope.customTags.findIndex(function (value, index) {
                    return value.Tag_Id === tag.TAG_ID;
                });
                this.scope.customTags.splice(index, 1);
                isPush = false; tagIndex = index;
            }

            // perform event as per state exists
            switch (this.state.current.name) {
                case 'Flex-eDisplay.Trend':
                    this.scope.$emit('onDisplayCustomTagTrend', { isPush: isPush, tag: tag.TAG_DETAIL, index: tagIndex }); break;
                case 'Flex-eDisplay.Gauges':
                    this.scope.$emit('onDisplayCustomTagGauge', {});
            }
        }

        // show display
        displayTypeCtrl.prototype.display = function (display) {
           
            if (display.DisplayTypeId.Id === this.displayService.displayType.SCROLLERS && this.state.current.name !== 'Flex-eDisplay.Scroller') {
                this.displayService.currentDisplay = display;
                this.scope.scrollers.length = 0;
                _.filter(this.displayTypes, function (disp) {
                    if (
                        disp.DisplayTypeId.Id === displayTypeObj.displayService.displayType.SCROLLERS &&
                        displayTypeObj.scope.scrollers.length < 8
                    )
                        displayTypeObj.scope.scrollers.push(disp);
                });

                this.state.go('Flex-eDisplay.Scroller', {
                    display: JSON.stringify(displayTypeObj.scope.scrollers[0]),
                    isLoadDefaultScroller: true
                })
            }
            else if (display.DisplayTypeId.Id === this.displayService.displayType.PLANTVIEW) {
                this.scope.scrollers.length = 0;
                this.displayService.customDisplayType[0].DisplayName = "PLANT VIEW";
                this.state.go('Flex-eDisplay.Tabular', {
                    isDetailView: false,
                    url: 'Display/DisplayType/MIS',
                    display: this.displayService.customDisplayType[0],
                    displayId: display.DisplayTypeId.Id,
                    isLoadDefaultScroller: false
                });
            }
            else if (display.DisplayTypeId.Id === this.displayService.displayType.COMPARISONVIEW) {
                this.scope.scrollers.length = 0;
                this.displayService.currentDisplay = this.displayService.customDisplayType[1];
                this.scope.customTagView = 'Summarised View';
                this.state.go('Flex-eDisplay.Tabular', {
                    isDetailView: false,
                    displayId: this.displayService.currentDisplay.DisplayId,
                    isLoadDefaultScroller: true
                });
            }
        }

        // load plant view
        displayTypeCtrl.prototype.loadPlantView = function (tag, misView) {
            try {
                this.displayService.customDisplayType[0].DisplayTypeId.Id = this.displayService.displayType.PLANTVIEW;
                this.displayService.currentDisplay = this.displayService.customDisplayType[0];
                this.displayService.currentDisplay.DisplayName = tag.NAME;
                this.displayService.currentDisplay.DisplayId = tag.TAG_ID;
                this.scope.misDisplayView = misView;
                var sref = undefined;
                var isDetailView = false;
                switch (misView) {
                    case 'Detailed View': isDetailView = true;
                    case 'Summarised View': sref = 'Flex-eDisplay.Tabular'; break;
                    case 'Gauge': sref = 'Flex-eDisplay.Gauges'; break;
                    case 'Scroller': sref = 'Flex-eDisplay.Tag-Scroller'; break;
                    case 'Trend': sref = 'Flex-eDisplay.Trend'; break;
                }
                this.state.go(sref, {
                    isDetailView: isDetailView,
                    url: 'Display/DisplayType/MIS',
                    displayId: tag.TAG_ID,
                    isLoadDefaultScroller: false
                });
            } catch (e) {
                console.log('ERROR ! while redirect to mis display /' + e.message);
            }
        }

        // change Tabalue View
        displayTypeCtrl.prototype.changeTabularView = function (tabularView) {
            try {
                this.scope.tabularView = tabularView;
                this.state.go('Flex-eDisplay.Tabular', {
                    isDetailView: (tabularView === 'Detailed View'),
                    url: 'Display/DisplayType/TAG',
                    displayId: this.displayService.currentDisplay.DisplayId,
                    isLoadDefaultScroller: false
                });
            } catch (e) {
                console.log('ERROR ! while redirect to mis display /' + e.message);
            }
        }

        // change tag view for `PLANT` and `COMPARSION`  View
        displayTypeCtrl.prototype.changeTagView = function (tagView) {
            try {

                var sref = undefined;
                var isDetailView = false;
                switch (tagView) {
                    case 'Detailed View': isDetailView = true;
                    case 'Summarised View': sref = 'Flex-eDisplay.Tabular'; break;
                    case 'Gauge': sref = 'Flex-eDisplay.Gauges'; break;
                    case 'Scroller': sref = 'Flex-eDisplay.Tag-Scroller'; break;
                    case 'Trend': sref = 'Flex-eDisplay.Trend'; break;
                }

                this.scope.customTagView = tagView;
                this.state.go(sref, {
                    isDetailView: (tagView === 'Detailed View'),
                    isLoadDefaultScroller: false
                });
            } catch (e) {
                console.log('ERROR ! while redirect to mis display /' + e.message);
            }
        }

        return displayTypeCtrl;
    });