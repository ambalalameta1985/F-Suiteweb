// define Authentication Service
define([],
    function () {

        // authentication service
        var authService = function ($http, $cookieStore, $rootScope, $state, base64) {

            return {

                // login
                login: function (user, callback) {

                    // store cookie for particular session
                    var __SESSIONTOKEN__ = this.uUID();
                    sessionStorage.setItem('__SESSIONTOKEN__', __SESSIONTOKEN__);

                    // call api for login
                    $http.post('User/User/Login', {
                        UserName: user.username,
                        Password: user.password,
                        IsRemember: user.rememberMe,
                        SessionToken: __SESSIONTOKEN__
                    })
                        .success(function (response) {
                            callback(response);
                        });
                },

                //set credential
                setCredentials: function (requestData, responseData) {

                    var authdata = base64.encode(responseData.UserName + ':' + responseData.Password);
                    $rootScope.globals = {
                        currentUser: {
                            userid: responseData.Id,
                            username: responseData.UserName,
                            authdata: responseData
                        }
                    };

                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                    sessionStorage.setItem("globals", JSON.stringify($rootScope.globals));

                    // if remember me selected
                    if (requestData.rememberMe) {

                        // Find tomorrow's date.
                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);

                        // Setting a cookies
                        $cookieStore.put('globals', JSON.stringify($rootScope.globals), { 'expires': expireDate });
                        localStorage.setItem("globals", JSON.stringify($rootScope.globals));
                    }
                },

                // clea credential
                clearCredentials: function () {
                    $rootScope.globals = {};
                    $cookieStore.remove('globals');
                    localStorage.removeItem("globals");
                    sessionStorage.removeItem("globals");
                    sessionStorage.removeItem("customTags");
                    $http.defaults.headers.common.Authorization = 'Basic ';
                    $state.go('Flex-eSuitelogin');
                },

                // check credential
                checkCredentials: function () {
                    if (!$rootScope.globals || !sessionStorage.globals) {
                        this.clearCredentials();                        
                    }                        
                },
            
                // generate unique identifier key
                uUID: function () {

                    var d = new Date().getTime();
                    if (window.performance && typeof window.performance.now === "function") {
                        d += performance.now(); //use high-precision timer if available
                    }
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = (d + Math.random() * 16) % 16 | 0;
                        d = Math.floor(d / 16);
                        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });
                    return uuid;
                }
            };
        };
        return authService;
    });