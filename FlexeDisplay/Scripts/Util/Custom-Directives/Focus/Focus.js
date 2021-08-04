define([], 
    function () {

        // focus
        var focus = function () {

            // focus
            return {
                restrict: 'A',
                link: function (scope, element) {
                    element[0].focus();
                }
            };
        }

        return focus;
    });