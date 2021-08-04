// define display service
define(function () {

    // create display service of javascript prototype object
    var displayService = function () {

        // create display type
        this.displayType = {
            TRENDS: 1,
            GAUGES: 2,
            MIMICS: 3,
            TABULARS: 4,
            SCROLLERS: 5,
            MYDISPLAYS: 6,
            ALARMS: 7,
            MYCUSTOMDISPLAYS: 8,
            PLANTVIEW: 9,
            COMPARISONVIEW: 10
        };

        // custom display type
        this.customDisplayType = [
            {
                DisplayId: -1,
                DisplayName: 'PLANT VIEW',
                DisplayTypeId: { Id: this.displayType.PLANTVIEW, DisplayType: 'PLANT VIEW' }
            }, {
                DisplayId: -2,
                DisplayName: 'COMPARISON VIEW',
                DisplayTypeId: { Id: this.displayType.COMPARISONVIEW, DisplayType: 'COMPARISON VIEW' }
            }];

        // hold current display
        this.currentDisplay = undefined;
    }

    //prepare tree for display tree
    displayService.prototype.prepareJsonTree = function (list, idAttr, parentAttr, childrenAttr) {
        if (!idAttr) idAttr = 'id';
        if (!parentAttr) parentAttr = 'parent';
        if (!childrenAttr) childrenAttr = 'children';
        var treeList = [];
        var lookup = {};
        list.forEach(function (obj) {
            lookup[obj[idAttr]] = obj;
            obj[childrenAttr] = [];
        });
        list.forEach(function (obj) {
            if (obj[parentAttr] != 0) {
                lookup[obj[parentAttr]][childrenAttr].push(obj);
            } else {
                treeList.push(obj);
            }
        });
        return treeList;
    }

    // return display service
    return displayService;
});
