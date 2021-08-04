// define login ctrl
define([],
    function () {

        // login object
        var loginObj;

        // display scroller controller
        var loginCtrl = function ($rootScope, $location, authService) {
          
            this.user = {};
            this.location = $location;
            this.authService = authService;                       
            this.rootScope = $rootScope;

            this.checkStorage();
            loginObj = this;
        };

        // login 
        loginCtrl.prototype.checkStorage = function () {

            if (this.rootScope.globals && this.rootScope.globals.currentUser) {
                sessionStorage.globals = JSON.stringify(this.rootScope.globals);
                this.location.path('/Flex-eSuiteHome');
            }
            else if (sessionStorage.globals) {
                this.rootScope.globals = JSON.parse(sessionStorage.globals);
                this.location.path('/Flex-eSuiteHome');
            }              
        }

        // login 
        loginCtrl.prototype.login = function () {

            this.dataLoading = true;
            this.authService.login(this.user, function (response) {

                // if response exist
                if (response === "INVALID") {
                    loginObj.error = "Invalid username or password";
                    loginObj.dataLoading = false;

                    document.forms[0].reset();
                    document.forms[0].username.focus();                    
                }
                else if (response === "UNAUTHORIZE") {
                    loginObj.error = "There is no rights granted for web display";
                    loginObj.dataLoading = false;

                    document.forms[0].reset();
                    document.forms[0].username.focus();
                }
                else {
                                 
                    loginObj.authService.setCredentials(loginObj.user, response);
                    loginObj.location.path('/Flex-eSuiteHome');
                }
            });
        }

        return loginCtrl;
    });