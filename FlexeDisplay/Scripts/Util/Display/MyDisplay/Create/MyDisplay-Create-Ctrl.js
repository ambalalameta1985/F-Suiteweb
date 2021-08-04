// define mydisplay create ctrl
define([
    'underscore'
],
    function (_) {

        // myDisplay create object
        var myDisplayCreateObj;

        // myDisplay controller
        var myDisplayCreateCtrl = function () {
            myDisplayCreateObj = this;
            console.log('mydisplay create controller loaded');
        };
      
        return myDisplayCreateCtrl;
    });