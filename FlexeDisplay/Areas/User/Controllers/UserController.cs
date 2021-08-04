using FlexeDisplay.Areas.User.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FlexeDisplay.GlobalModule;
using FlexeDisplay.App_Code;

namespace FlexeDisplay.Areas.User.Controllers
{
    public class UserController : Controller
    {
        // user detail instance
        User_Detail user = new User_Detail();

        // index controller
        public ActionResult login(Login login)
        {
            // authenticate user
            user = user.authenticateUser(login);

            // login services
            if (user != null)
            {
                // if user exists
                if (user.UserName != null)
                {
                    //remove existing user
                    Global.lstUserlog.RemoveAll(delegate(User_Log log)
                    {
                        return log.UserId == user.Id;
                    });

                    Global.lstUserlog.Add(new User_Log()
                    {
                        UserId = user.Id,
                        IPAddress = Global.getIPAdress(),
                        SessionToken = login.SessionToken
                    });

                    // return user object
                    return Json(user, JsonRequestBehavior.AllowGet);
                }

                // return user object
                return Json("UNAUTHORIZE", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("INVALID", JsonRequestBehavior.AllowGet);;
            }
        }

        // create user
        public int create(string username, string password)
        {
            // create user
            return user.createUser(username, password);
        }
    }
}
