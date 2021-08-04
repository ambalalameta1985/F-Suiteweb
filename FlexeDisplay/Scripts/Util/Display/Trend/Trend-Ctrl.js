
// define trend ctrl
define([
    'underscore',
    'morris'
],
    function (_) {

        // trend object
        var trendObj;

        // minium plot tren data
        var MIN_PLOT_TREND_DATA = 180;

        // init trend color
        var INIT_TREND_COLOR_INDEX = 0

        // display trend controller
        var trendCtrl = function ($scope, $http, $stateParams, tagService, authService, displayService) {

            trendObj = this;
            this.http = $http;
            this.scope = $scope;
            this.stateParams = $stateParams;
            this.authService = authService;
            this.tagService = tagService;
            this.displayService = displayService;
            this.selectedTagIndex = -1;
            this.customPoint = [100, 75, 50, 25, 0];
            this.chartData = [];
            this.isShowCustomPoint = false;

            this.prepareInitialChartData();
            this.retrieveTagByDisplaySelection();
        };

        // init trend initial trend
        trendCtrl.prototype.initTrend = function () {
            var trendInterval = setInterval(function () {
                trendObj.retrieveParameterValue();
            }, 1000);

            // destroy interval
            this.scope.$on('$destroy', function () {
                clearInterval(trendInterval);
            });

            // if current display is comparison view then bind tag event to trend view
            if (this.displayService.currentDisplay.DisplayTypeId.Id == this.displayService.displayType.COMPARISONVIEW)
                this.onTagTrendLoaded();
        }

        // on tag trend loaded
        trendCtrl.prototype.onTagTrendLoaded = function () {

            // display custom trend tag
            this.scope.$on('onTrendTagLoaded', function (event, args) {
                if (args.isPush) {
                    var colorCode = undefined;

                    if (INIT_TREND_COLOR_INDEX >= trendObj.tagService.colors.length)
                        colorCode = '#' + Math.random().toString(16).substr(-6);
                    else
                        colorCode = trendObj.tagService.colors[INIT_TREND_COLOR_INDEX++];

                    if (trendObj.linechart == undefined) {
                        if (args.tag.Value === "NA") colorCode = "tranparent";

                        var xLineColor = [colorCode],
                            xLabelData = [args.tag.Tag_Name];

                        trendObj.prepareInitialChartData();
                        trendObj.initilizeTrend(trendObj.chartData, xLabelData, xLineColor);
                        trendObj.isShowCustomPoint = true;
                    }

                    trendObj.tags[args.index].TrendColorCode = colorCode;
                    trendObj.linechart.options.lineColors.push(colorCode);             // add new color code                    
                    trendObj.linechart.options.ykeys.push(args.tag.Tag_Name);
                }
                else {
                    trendObj.linechart.options.lineColors.splice(args.index, 1);
                    trendObj.linechart.options.ykeys.splice(args.index, 1);
                }
            });
        }

        // init trend controller
        trendCtrl.prototype.prepareInitialChartData = function () {
            this.chartData = [];
            for (var i = MIN_PLOT_TREND_DATA; i > 0; i--) {
                var date = new Date();
                var data = "{";
                date.setSeconds(date.getSeconds() - i);
                var h = this.addZero(date.getHours(), 2);
                var m = this.addZero(date.getMinutes(), 2);
                var s = this.addZero(date.getSeconds(), 2);
                data += "\"time\":\"" + (h + ":" + m + ":" + s) + "\",\"value\":0";
                data += "}";
                this.chartData.push(JSON.parse(data));
            }
        }

        // retrieve tag collection
        trendCtrl.prototype.retrieveTagByDisplaySelection = function () {
            switch (this.displayService.currentDisplay.DisplayTypeId.Id) {
                case this.displayService.displayType.TRENDS:
                case this.displayService.displayType.PLANTVIEW:
                    this.retrieveTagCollection();
                    break;
                case this.displayService.displayType.COMPARISONVIEW:
                    this.tags = this.scope.$parent.customTags;
                    this.setTrendChart(this.tags);
                    this.initTrend();
                    break;
            }
        }

        // retrieve tag collection
        trendCtrl.prototype.retrieveTagCollection = function () {

            this.http.post(this.stateParams.url, {
                displayId: this.stateParams.displayId
            }).
            success(function (response) {
                trendObj.tags = response;
                trendObj.setTrendChart(response);
                trendObj.initTrend();
            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // retrieve parameter value
        trendCtrl.prototype.retrieveParameterValue = function () {

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
              //      trendObj.authService.clearCredentials();

                _.each(response, function (value, index) {
                    _.map(trendObj.tags, function (tag) {
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

                            // Not NA VALUE Exists
                            if (tag.Value !== "NA") {
                                if (trendObj.selectedTagIndex === -1 || trendObj.selectedTagIndex === index)
                                    trendObj.linechart.options.lineColors[index] = trendObj.tags[index].TrendColorCode;
                            }
                            else
                                trendObj.linechart.options.lineColors[index] = "transparent";
                        }
                    });
                });

                // arrange data for chart
                trendObj.arrangeData(trendObj.tags);

                // get only sixty record only
                if (trendObj.chartData.length > MIN_PLOT_TREND_DATA)
                    trendObj.chartData = trendObj.chartData.slice(1, trendObj.chartData.length);

                // check its not empty
                if (response != "")
                    trendObj.linechart.setData(trendObj.chartData);

            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // add zero retrieve parameter value
        trendCtrl.prototype.addZero = function (x, n) {
            while (x.toString().length < n) {
                x = "0" + x;
            }
            return x;
        }

        // retrieve parameter value
        trendCtrl.prototype.setTrendChart = function (response) {
            var xLabelData = [],
                xLineColorCode = [],
                isTrendView = this.displayService.currentDisplay.DisplayTypeId.Id === this.displayService.displayType.TRENDS,
                colorCode = undefined;

            for (var counter = 0; counter < response.length; counter++) {
                xLabelData.push(response[counter].Tag_Name);

                if (!isTrendView) {
                    if (INIT_TREND_COLOR_INDEX >= this.tagService.colors.length) colorCode = '#' + Math.random().toString(16).substr(-6);
                    else colorCode = this.tagService.colors[INIT_TREND_COLOR_INDEX++];                    
                }
                else
                    colorCode = this.getHexCode(response[counter].TrendColorCode);

                this.tags[counter].TrendColorCode = colorCode;
                if (response[counter].Value === "NA")
                    xLineColorCode.push("transparent");
                else
                    xLineColorCode.push(colorCode);
            }

            if (xLabelData.length) {
                this.initilizeTrend(this.chartData, xLabelData, xLineColorCode);
                this.isShowCustomPoint = true;
            }
        }

        // initialize morris chart to display
        trendCtrl.prototype.initilizeTrend = function (chartData, xLabelData, xLineColorCode) {
            this.linechart = new Morris.Line({
                element: 'trend-line',
                data: chartData,
                xkey: "time",
                ykeys: xLabelData,
                ymax: 100,
                labels: xLabelData,
                continuousLine: false,
                parseTime: false,
                grid: true,
                axes: true,
                gridTextColor: "#9E9E9E",
                lineColors: xLineColorCode,
                lineWidth: "1px",
                hideHover: 'always',
                pointSize: "0px",
                xLabelAngle: 90,
                smooth: true,
                resize: false,
                yLabelFormat: function (y) {
                    if (y.toString() != "")
                        return y.toString() + ' %';
                    else
                        return y.toString();
                }
            });
        }

        // arrange data for parameter value
        trendCtrl.prototype.arrangeData = function (data) {
            var temp = "{";
            var date = new Date();
            var h = this.addZero(date.getHours(), 2);
            var m = this.addZero(date.getMinutes(), 2);
            var s = this.addZero(date.getSeconds(), 2);
            temp += "\"time\":\"" + (h + ":" + m + ":" + s) + "\"";


            $.each(data, function (idx, x) {
                if (x.Value === "NA")
                    temp += ",\"" + x.Tag_Name + "\":\"0\"";
                else
                    temp += ",\"" + x.Tag_Name + "\":\"" + (parseFloat(x.Value / x.Scale_Max * 100).toFixed(2)) + "\"";
            });
            temp += "}";
            this.chartData.push(JSON.parse(temp));
        }

        // get tag hex color code
        trendCtrl.prototype.highlightTag = function (tagIndex) {
            this.selectedTagIndex = tagIndex;

            var pointIndex = 0,
                pointLength = this.customPoint.length - 1,
                MAX_RANGE = this.tags[tagIndex].Scale_Max;

            while (pointIndex <= pointLength) {
                this.customPoint[pointLength - pointIndex] = parseFloat(pointIndex / pointLength * MAX_RANGE).toFixed(2);
                pointIndex++;
            }

            _.each(trendObj.linechart.options.lineColors, function (colorCode, index) {
                if (index == tagIndex)
                    trendObj.linechart.options.lineColors[index] = trendObj.tags[tagIndex].TrendColorCode;
                else
                    trendObj.linechart.options.lineColors[index] = "transparent";
            });
        }

        // get tag hex color code
        trendCtrl.prototype.clearHighlightTag = function () {
            this.selectedTagIndex = -1;
            this.customPoint = [100, 75, 50, 25, 0];
            _.each(trendObj.linechart.options.lineColors, function (colorCode, index) {
                trendObj.linechart.options.lineColors[index] = trendObj.tags[index].TrendColorCode;
            });
        }

        // set tag value color
        trendCtrl.prototype.setTagValueColor = function (tagDetail) {
            return this.tagService.setTagValueColor(tagDetail);
        }

        // set Quality color
        trendCtrl.prototype.setQualityColor = function (tagQuality) {
            return this.tagService.setQualityColor(tagQuality);
        }

        // get tag hex color code
        trendCtrl.prototype.getHexCode = function (accessCode) {
            return this.tagService.getHexCode(accessCode);
        }

        return trendCtrl;
    });