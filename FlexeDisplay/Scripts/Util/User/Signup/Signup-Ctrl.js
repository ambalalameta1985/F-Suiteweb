// define signup ctrl
define([],
    function () {

        // signup object
        var signupObj;

        // sign up
        var eSignup = {
            SUCCESS: 1,
            FAILED: 2,
            LIMIT_EXCEED: 3,
            EXIST_USER: 4
        }

        // signup controller
        var signupCtrl = function ($http, $state) {

            this.user = {};
            this.http = $http;
            this.state = $state;
            this.alert = {};
            signupObj = this;
        };

        // sign up
        signupCtrl.prototype.signup = function () {

            this.dataLoading = true;

            // validate successfully
            if (this.validate()) {

                // call api for login
                this.http.post('User/User/create', {
                    username: this.user.username,
                    password: this.user.password                   
                })
                    .success(function (response) {
                        
                        // case 
                        switch(parseInt(response)){
                        
                            case eSignup.SUCCESS:
                                signupObj.alert.class = "success";
                                signupObj.alert.fa_icon = "fa-check-circle";
                                signupObj.alert.message = "Successfully created user";
                                signupObj.state.go('login');

                                break;
                            case eSignup.FAILED:
                                signupObj.alert.class = "danger";
                                signupObj.alert.fa_icon = "fa-exclamation-circle";
                                signupObj.alert.message = "Something gone wrong, try after sometime";

                                // reset form
                                document.forms[0].reset();
                                document.forms[0].username.focus();
                                break;
                            case eSignup.LIMIT_EXCEED:
                                signupObj.alert.class = "info";
                                signupObj.alert.fa_icon = "fa-info-circle";
                                signupObj.alert.message = "Already ten user exists, cannot create more users";

                                // reset form
                                document.forms[0].reset();
                                document.forms[0].username.focus();
                                break;
                            case eSignup.EXIST_USER:
                                signupObj.alert.class = "warning";
                                signupObj.alert.fa_icon = "fa-exclamation-circle";
                                signupObj.alert.message = "Username already exists";
                                document.forms[0].username.focus();
                                break;
                        }                       
                    });
            }

            this.dataLoading = false;
        }

        // validate user
        signupCtrl.prototype.validate = function () {

            // check password is same with confirm password
            if (this.user.password != this.user.confirmPassword) {
                this.alert.class = "info";
                this.alert.fa_icon = "fa-info-circle";
                this.alert.message = "Mismatch password";
                document.forms[0].password[0].focus();
                return false;
            }
            
            return true;
        }

        return signupCtrl;
    });