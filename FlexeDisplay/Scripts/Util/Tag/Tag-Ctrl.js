// tag hierarchy ctrl
define([
    'jquery'
],
    function ($) {

        // tag object
        var tagObj = undefined;

        // define tag controller
        var tagCtrl = function ($rootScope, $scope, $http, authService, $location, $compile) {

            this.authService = authService;
            this.compile = $compile;
            this.http = $http;
            this.scope = $scope;
            this.user = $rootScope.globals.currentUser;
            this.authService.checkCredentials();
            this.location = $location;
            this.inittag();
            tagObj = this;
        };

        // logout
        tagCtrl.prototype.inittag = function () {
            try {

                // get display detail            
                this.loader = true;
                this.http({
                    url: '/tag/tag/TAGHIERARCHY',
                    dataType: 'json',
                    method: 'POST'
                })
                    .success(function (response) {
                        //tagObj.tags = new Array(response);
                        tagObj.loader = false;
                        tagObj.loadtags(response);
                    })
                .error(function (xhr) {
                    console.log("METHOD tag/tagHIERARCHY :" + xhr.responseText);
                });

            } catch (e) {
                console.log('ERROR : WHILE RETRIVE tag HIERARCHY:' + e.message + " / DESCRIPTION:" + e.description);
            }
        };

        // load tag node
        tagCtrl.prototype.loadtags = function (tagLists) {
            try {
                var ulElement = document.createElement('ul');
                tagLists.forEach(function (item, index) {
                    if (item.PARENT_ID === 0)
                        ulElement.innerHTML += "<li class='root' node-id='" + item.TAG_ID + "' ><span node-type-id='" + item.TAG_TYPE_ID + "' data-ng-click='tag.onNodeClick($event," + item.TAG_TYPE_ID + ")' class='root-node'> <span class='node-hover-layer' style='background-color:" + (index % 2 == 0 ? ' rgba(169,169,169,0.2)' : 'transparent') + "' ></span><i class='fa fa-chevron-circle-right' aria-hidden='true'></i> <span class='node'> " + item.NAME + "</span></span></li>";
                    else {
                        var ulNestedElement = ulElement.querySelector('[parent-node-id="' + item.PARENT_ID + '"]');
                        if (ulNestedElement) {
                            ulNestedElement.innerHTML += "<li class='child' node-id='" + item.TAG_ID + "'>\
                                    <span data-ng-click='tag.onNodeClick($event)' node-type-id='" + item.TAG_TYPE_ID + "' class='node'>\
                                        <span class='node-hover-layer' style='background-color:" + (index % 2 == 0 ? 'transparent' : 'transparent') + "' ></span>\
                                        <span class='pull-left'><i class='fa fa-chevron-circle-right' aria-hidden='true'></i> " + item.NAME + "</span>\
                                      </span>\
                                </li>";
                        }
                        else {
                            var node = ulElement.querySelector('[node-id="' + item.PARENT_ID + '"]');
                            var tempUl = document.createElement('ul');
                            tempUl.setAttribute('parent-node-id', item.PARENT_ID);
                            tempUl.setAttribute('tags', '');
                            tempUl.innerHTML += "<li class='child' node-id='" + item.TAG_ID + "'>\
                                            <span data-ng-click='tag.onNodeClick($event)' node-type-id='" + item.TAG_TYPE_ID + "' class='node'>\
                                                <span class='node-hover-layer' style='background-color:" + (index % 2 == 0 ? 'transparent' : 'transparent') + "' ></span>\
                                                <span class='pull-left'><i class='fa fa-chevron-circle-right' aria-hidden='true'></i> " + item.NAME + "</span>\
                                            </span>\
                                            </li>";

                            if (node == undefined)
                                debugger;

                            node.appendChild(tempUl);
                        }
                    }
                });
                var compileElement = this.compile(ulElement)(this.scope);
                document.getElementsByClassName('tag-hierarchy-container')[0].appendChild(compileElement[0]);
            } catch (e) {
                console.error("WHILE LOAD tag HIERARCHY: " + e.message);
            }
            finally {
                this.loader = false;
            }
        };

        // node mouse hover
        tagCtrl.prototype.nodeMouseHover = function (event) {
            $('.node-status', event.currentTarget).css('display', 'block');
        };

        // node mouse leave
        tagCtrl.prototype.nodeMouseLeave = function (event) {
            $('.node-status', event.currentTarget).css('display', 'none');
        };

        // node mouse leave
        tagCtrl.prototype.convertDate = function (date) {
            try {
                return new Date(parseInt(date.substr(6))).toLocaleString();
            } catch (e) {

            }
        };

        // logout
        tagCtrl.prototype.logout = function () {
            this.authService.clearCredentials();
        };

        // node mouse leave
        tagCtrl.prototype.onNodeClick = function (event) {

            var target = $(event.currentTarget);
            var nodeTypeId = parseInt(event.currentTarget.getAttribute('node-type-id'));
            if (this.nodeInterval) clearInterval(this.nodeInterval);

            switch (nodeTypeId) {
                case 3:

                    var villageNode = $('[node-type-id=3]').next();
                    villageNode.slideUp();

                    this.tags = villageNode.attr('tags').replace(/,(?=[^,]*$)/, '');
                    var user = JSON.parse(sessionStorage.globals);
                    this.loader = true;
                    this.nodeInterval = setInterval(function () {
                        tagObj.http.post("/Display/DisplayType/VALUE", {
                            tagKeys: tagObj.tags
                        }, {
                            headers: {
                                'X-User-Id': user.currentUser.userid,
                                'Session-Token': sessionStorage.__SESSIONTOKEN__
                            }
                        }).
                       success(function (response) {

                           var isUpdateParaArray = new Array(response.length);
                           response.forEach(function (para, index) {

                               var ulNode = target.next();
                               var parameters = $('[parameter-id="' + para.Tag_Id + '"]', ulNode);
                               if (parameters.html() != para.Value) {
                                   parameters.html(para.Value);
                                   parameters.attr('parameter-time', para.Timestamp)
                                   $('[parameter-updated-time]', ulNode).html(tagObj.convertDate(para.Timestamp));
                               }
                               $.each(parameters, function (paraIndex, para) {
                                   var paraSeconds = new Date(parseInt(para.getAttribute('parameter-time').substr(6)));
                                   var currentDate = new Date();
                                   currentDate.setSeconds(currentDate.getSeconds() - 7);

                                   if (!isUpdateParaArray[paraIndex]) {
                                       if (paraSeconds < currentDate) {
                                           para.parentNode.getElementsByClassName('badge')[0].style.backgroundColor = "#C62828";
                                           var parenttagNode = $(para).parents('.child');

                                           $.each(parenttagNode, function (idx, node) {
                                               $('.badge', $(node)[0])[0].style.backgroundColor = "#C62828";
                                           });
                                           isUpdateParaArray[paraIndex] = true;
                                       }
                                       else
                                           para.parentNode.getElementsByClassName('badge')[0].style.backgroundColor = "#76FF03";
                                   }
                               })
                           });
                       }).
                       error(function (xhr) {
                           console.log(xhr.responseText);
                           tagObj.loader = false;
                       });
                    }, 2000);

                    $('i', target).toggleClass('fa fa-chevron-circle-down fa fa-chevron-circle-right');
                    $(target.next()).slideToggle(1000);
                    tagObj.loader = false;
                    break;
                case 2:
                case 1:
                    $('i', target).toggleClass('fa fa-chevron-circle-down fa fa-chevron-circle-right');
                    $(target.next()).slideToggle();
                    break;

                case 4:
                    this.location.path('/Flex-eSuiteHome');
                    break;
            }

            // destroy interval
            this.scope.$on('$destroy', function () {
                clearInterval(tagObj.nodeInterval);
            });
        };

        // return tag
        return tagCtrl;
    });