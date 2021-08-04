// login controller test specification
define([
    'Util/User/Login/Login-Ctrl'
],
function (loginCtrl) {

    describe("login controller", function () {
        describe("login form", function () {
            it("check login in flex esuite", function () {
                expect(loginCtrl.login()).toEqual("Hello");
            })
        });
    });
});