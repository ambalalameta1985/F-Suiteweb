
// define mimic ctrl
define([
    'underscore'
],
    function (_) {

        // mimic object
        var mimicObj;

        // display mimic controller
        var mimicCtrl = function ($scope, $q, $http, $stateParams, tagService, authService) {

            mimicObj = this;
            this.scope = $scope;
            this.q = $q;
            this.http = $http;
            this.authService = authService;
            this.stateParams = $stateParams;
            this.tagService = tagService;
            this.retrieveTagCollection();
        };

        // init  mimic controller
        mimicCtrl.prototype.initMimic = function () {
             var mimicInterval = setInterval(function () {
                mimicObj.retrieveParameterValue();
             }, 2000);

            // destroy interval
             this.scope.$on('$destroy', function () {
                 clearInterval(mimicInterval);
             });
        }

        // retrieve tag collection
        mimicCtrl.prototype.retrieveTagCollection = function () {

            this.displayDetail = this.stateParams.display;
            this.http.post(this.stateParams.url, {
                displayId: this.stateParams.displayId
            }).
            success(function (response) {

                mimicObj.tags = response;
                mimicObj.retrieveMimicDetail();
                mimicObj.initMimic();
            }).
            error(function (xhr) {
                console.log(xhr);
            });
        }

        // get mimic detail 
        mimicCtrl.prototype.retrieveMimicDetail = function () {

            this.readCSVFile().then(function (response) {

                var lines = response.split('\n');

                // bool variable for read data
                var isImageData = false,
                    isTagData = false,
                    isFormData = false,
                    isAppearance = false;

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();

                    if (line === '') {
                        isTagData = isFormData = isAppearance = isImageData = false;
                        continue;
                    }

                    if (line === "[ImagePath]" || isImageData) {
                        if (!isImageData) {
                            isImageData = true;
                            continue;
                        }

                        // get image url
                        mimicObj.displayDetail.MimicDetail.ImageUrl = "../MimicsConfig/" + line;
                    }
                    else if (line === "[TagDetail]" || isTagData) {
                        if (!isTagData) {
                            isTagData = true;
                            continue;
                        }

                        var mimicTag = line.split(',');
                        _.find(mimicObj.tags, function (tag) {
                            if (tag.Tag_Id === parseInt(mimicTag[0])) {
                                tag.MimicTag.Left = parseInt(mimicTag[2]);
                                tag.MimicTag.Top = parseInt(mimicTag[3]);
                            }
                        });
                    }
                    else if (line === "[FormSize]" || isFormData) {
                        if (!isFormData) {
                            isFormData = true;
                            continue;
                        }

                        // fetch form detail
                        var formDetail = line.split(',');
                        mimicObj.displayDetail.MimicDetail.Width = parseFloat(formDetail[0]);
                        mimicObj.displayDetail.MimicDetail.Height = parseFloat(formDetail[1]);
                    }
                    else if (line === "[Appearance]" || isAppearance) {
                        if (!isAppearance) {
                            isAppearance = true;
                            continue;
                        }

                        // fetch form detail
                        var fontDetail = line.split(',');
                        mimicObj.displayDetail.MimicDetail.FontFamily = fontDetail[0];
                        mimicObj.displayDetail.MimicDetail.FontSize = parseInt(fontDetail[1]);
                        mimicObj.displayDetail.MimicDetail.IsBold = parseInt(fontDetail[2]) !== 0;
                        mimicObj.displayDetail.MimicDetail.IsItalic = parseInt(fontDetail[3]) !== 0;
                        mimicObj.displayDetail.MimicDetail.IsTransparent = parseInt(fontDetail[4]) !== 0;
                        mimicObj.displayDetail.MimicDetail.BackgroundColor = fontDetail[5];
                        mimicObj.displayDetail.MimicDetail.ForeColor = fontDetail[6];
                        mimicObj.displayDetail.MimicDetail.IsDisplayUnit = parseInt(fontDetail[7]) !== 0;
                    }
                }

            }, function (error) {
                console.log("ERROR ! THERE IS NO MIMIC CONFIGURATION FOR " + mimicObj.displayDetail.DisplayName.toUpperCase());
            });
        }

        // get mimic detail 
        mimicCtrl.prototype.readCSVFile = function () {
            return this.q(function (resolve, reject) {
                var url = '/MimicsConfig/' + mimicObj.displayDetail.DisplayName + '.csv';
                var reqObj = new XMLHttpRequest();
                reqObj.open("GET", url, true);
                reqObj.onreadystatechange = function () {
                    if (reqObj.readyState === 4) {
                        if (reqObj.status === 200 || reqObj.status == 0)
                            resolve(reqObj.responseText);
                        else
                            reject(null);
                    }
                };
                reqObj.send(null);
            });
        }

        // retrieve parameter value
        mimicCtrl.prototype.retrieveParameterValue = function () {

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

           //     if (response != "" && !response[0].IsCurrentUser)
           //        mimicObj.authService.clearCredentials();

                _.each(response, function (value, index) {

                    _.map(mimicObj.tags, function (tag) {
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
        mimicCtrl.prototype.setTagValueColor = function (tagDetail) {
            return this.tagService.setMimicTagValueColor(tagDetail, this.displayDetail.MimicDetail.ForeColor);
        }

        // set Quality color
        mimicCtrl.prototype.setQualityColor = function (tagQuality) {
            return this.tagService.setQualityColor(tagQuality);
        }

        // get tag hex color code
        mimicCtrl.prototype.getHexCode = function (accessCode) {
            return this.tagService.getHexCode(accessCode);
        }

        return mimicCtrl;
    });