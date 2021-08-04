define([
    'angular',
    'speedometer'
],
    function (angular, speedometer) {

        // funtion for display gauge control
        var gaugeControl = function () {

            // directive details for template
            return {
                restrict: 'A',
                scope: {
                    tag: '@'                 
                },
                link: function (scope, element) {

                    var gauge = element[0],
                        tag = JSON.parse(scope.tag),
                        maxValue = tag.Scale_Max,
                        divFact = Math.round(tag.Scale_Max / 10);


                    gauge.setAttribute('unit', tag.Unit);
                    if (maxValue === 1) {
                        maxValue = 100;
                        divFact = 10;
                    }

                    $(gauge).speedometer({
                        maxVal: maxValue, // Max value of the meter
                        divFact: divFact,// Math.round(20 * gaugeObj.tags[i].Scale_Max/360),  // Division value of the meter
                        dangerLevel: 120, // more than this leval, color will be red
                        initDeg: -45, // reading begins angle
                        maxDeg: 270, // total angle of the meter reading
                        edgeRadius: 125, // radius of the meter circle
                        speedNobeH: 4,   // speed nobe height
                        speedoNobeW: 73,  // speed nobe width
                        speedoNobeL: 13,  // speed nobe left position
                        indicatorRadius: 110, // radius of indicators position
                        indicatorNumbRadius: 78,  // radius of numbers position
                        speedPositionTxtWH: 90,  // speedo-meter current value cont
                        speedUnitTxtWH: 100,		// speed unit text
                        nobW: 20,  // indicator nob width
                        nobH: 1,   // indicator nob height
                        numbW: 30,  // indicator number width
                        numbH: 30,  // indicator number height
                        midNobW: 8,  // indicator mid nob width
                        midNobH: 1,   // indicator mid nob height
                        noOfSmallDiv: 2,   // no of small div between main div
                        eventListenerType: 'change'// no of small div between main div
                    });
                }
            };
        }

        return gaugeControl;
    });
