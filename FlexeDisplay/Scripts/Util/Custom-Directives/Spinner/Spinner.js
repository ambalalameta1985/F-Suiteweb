define([],
    function () {

        // focus
        var spinner = function () {

            // spinner
            return {
                restrict: 'E',
                template : [
                    '<div class="spinner">',
                    '   <img src="Resources/loader.gif"/>',
                    '</div>'
                ].join(''),                
            };
        }

        return spinner;
    });