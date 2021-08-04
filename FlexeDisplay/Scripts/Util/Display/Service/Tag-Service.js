// define tag appearance service
define(function () {

    // object for tag appearance service
    var tagAppearanceService = function () {

        // 50 dark colors  for trend
        this.colors = ['#F9A825', '#EEFF41', '#2962FF', '#F44336', '#9E9D24', '#E91E63', '#FF8F00', '#FF5722', '#0288D1', '#FF8F00',
                '#7B1FA2', '#C6FF00', '#673AB7', '#880E4F', '#558B2F', '#00695C', '#FF9800', '#FF3D00', '#00BCD4', '#D7CCC8',
                '#3F51B5', '#FB8C00', '#FFEB3B', '#9C27B0', '#BF360C', '#303F9F', '#388E3C', '#2196F3', '#CFD8DC', '#00BCD4',
                '#8BC34A', '#FFEA00', '#FF1744', '#01579B', '#009688', '#512DA8', '#AEEA00', '#4CAF50', '#8BC34A', '#303F9F',
                '#CDDC39', '#00838F', '#ECEFF1', '#E65100', '#CDDC39', '#FF5722', '#F57F17', '#0277BD', '#FF6F00', '#FFEA00'];

        // define tag NODe
        this.tagType = {
            node: 1,
            timestamped: 2,
            interval : 3
        };
    };

    // set tag value color
    tagAppearanceService.prototype.setTagValueColor = function (tagDetail) {

        // retrieve color code
        switch (tagDetail.Significance) {

            case 301:
                if (tagDetail.Value == "OFF")
                    return "#B71C1C";  // Green
                else
                    return "#00C853";  // Green

                break;
            case 302:  // Instantaneous and Counter
            case 303:

                if (tagDetail.Value == 'NA')
                    return "#00C853";  // Red
                else if (tagDetail.Value >= tagDetail.Hi_Hi_Value)
                    return "#B71C1C";  // Red
                else {

                    if (tagDetail.Value >= tagDetail.Hi_Value && tagDetail.Value < tagDetail.Hi_Hi_Value)
                        return "#FF3D00";       //Orange Color                            
                    else {

                        if (tagDetail.Value > tagDetail.Lo_Lo_Value && tagDetail.Value <= tagDetail.Lo_Value)
                            return "#9E9E9E";       //Gray                                
                        else {

                            if (tagDetail.Value <= tagDetail.Lo_Lo_Value)
                                return "#D4E157";
                            else
                                return "#00C853";  // Green
                        }
                    }
                }
                break;

            default:

                if (tagDetail.Value)
                    return "#00C853";  // Green
                else
                    return "#B71C1C";  // Red
                break;
        }
    }

    // set tag value color
    tagAppearanceService.prototype.setMimicTagValueColor = function (tagDetail, foreColor) {

        // retrieve color code
        switch (tagDetail.Significance) {

            case 301:
                if (tagDetail.Value == "OFF")
                    return "#B71C1C";  // Red
                break;
            case 302:  // Instantaneous and Counter
            case 303:

                if (tagDetail.Value == 'NA')
                    return "#00C853";  // Green
                else if (tagDetail.Value >= tagDetail.Hi_Hi_Value)
                    return "#B71C1C";  // Red                                                
                else {

                    if (tagDetail.Value >= tagDetail.Hi_Value && tagDetail.Value < tagDetail.Hi_Hi_Value)
                        return "#FF3D00";       //Orange Color                            
                    else {

                        if (tagDetail.Value > tagDetail.Lo_Lo_Value && tagDetail.Value <= tagDetail.Lo_Value)
                            return "#9E9E9E";       //Gray                                
                        else {

                            if (tagDetail.Value <= tagDetail.Lo_Lo_Value)
                                return "#D4E157";
                            else
                                return this.getHexCode(foreColor);//"#00C853";  // Green
                        }
                    }
                }
                break;

            default:

                if (tagDetail.Value)
                    return "#00C853";  // Green
                else
                    return "#B71C1C";  // Red
                break;
        }
    }

    // tag quality color
    tagAppearanceService.prototype.setQualityColor = function (tagQuality) {

        // if good then
        if (tagQuality == "Good")
            return "#00C853";  // Red                                                
        else
            return "#B71C1C";
    }

    // get tag hex color code
    tagAppearanceService.prototype.getHexCode = function (accessCode) {
        accessCode = parseInt(accessCode).toString(16);
        var hexCode = '';
        for (var count = accessCode.length - 1; count >= 0; count--) {
            hexCode += accessCode[count];
        }

        hexCode += "000000";
        hexCode = hexCode.substring(0, 6);
        return "#" + hexCode;
    }

    // return object
    return tagAppearanceService;

});